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
} from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";

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

//Post CRUD operation, creates a post specific to URL

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return Post.find();
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
