import { isAuth } from "../middleware/isAuth";
import { MyContext } from "src/types";
import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Field,
  ObjectType,
  InputType,
  Ctx,
  UseMiddleware,
  Int,
  FieldResolver,
  Root,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { Yup } from "../entities/Yup";
import { tmpdir } from "os";

@ObjectType()
class PostResponse {
  @Field(() => Post, { nullable: true })
  post?: Post;
}

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];

  @Field()
  hasMore: boolean;
}

//Post CRUD operation, creates a post specific to URL

@Resolver(Post)
export class PostResolver {
  @FieldResolver(() => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("postId", () => Int) postId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    const isYup = value !== -1;
    const realValue = isYup ? 1 : -1;
    const { userId } = req.session!;
    const yup = await Yup.findOne({ where: { postId, userId } });

    if (yup && yup.value !== realValue) {
      // user voted on post already and is changing vote
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
        update yup
        set value = $1
        where "postId" = $2 and "userId" = $3
        `,
          [realValue, postId, userId]
        );
        await tm.query(
          `
        update post
        set points = points + $1
        where id = $2
        `,
          [2 * realValue, postId]
        );
      });
    } else if (!yup) {
      // has never voted before
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
          insert into yup ("userId", "postId", value)
          values ($1,$2,$3)
          `,
          [userId, postId, realValue]
        );
        await tm.query(
          `
          update post
          set points = points + $1
          where id = $2
        `,
          [realValue, postId]
        );
      });
    }
    return true;
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    @Ctx() {req}: MyContext
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;

    const replacements: any[] = [realLimitPlusOne, req.session!.userId];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const posts = await getConnection().query(
      `
    select p.*, 
    json_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email,
      'createdAt', u."createdAt",
      'updatedAt', u."updatedAt"
      ) creator,
    ${req.session!.userId ? '(select value from yup where "userId" = $2 and "postId" = p.id) "voteStatus"' : 'null as "voteStatus"'} 
    from post p 
    inner join public.user u on u.id = p."creatorId" 
    ${cursor ? `where p."createdAt" < $3` : ""}
    order by p."createdAt" DESC
    limit $1
    `,
      replacements
    );

    // const qb = getConnection()
    //   .getRepository(Post)
    //   .createQueryBuilder("p")
    //   .innerJoinAndSelect("p.creator", "u", 'u.id = p."creatorId"')
    //   .orderBy('p."createdAt"', "DESC")
    //   .take(realLimitPlusOne);

    // if (cursor) {
    //   qb.where('p."createdAt" < :cursor', {
    //     cursor: new Date(parseInt(cursor)),
    //   });
    // }

    // const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  // find post using id as parameter
  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  //mutation updates data
  //create posts using title as an argument
  @Mutation(() => PostResponse)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<PostResponse> {
    // two sql queries, one to insert, one to select
    let post;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Post)
        .values({
          ...input,
          creatorId: req.session!.userId,
        })
        .returning("*")
        .execute();
      post = result.raw[0];
      return {
        post,
      };
    } catch (err) {
      console.log(err);
    }
    return {
      post,
    };
  }
  // update posts fetch with post id and update title
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    // if no post then return null
    if (!post) {
      return null;
    }
    // update w new title if given a title
    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }
    return post;
  }

  // delete a post with post id
  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
