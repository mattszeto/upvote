import { ObjectType, Field } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

// M to N relationship
// user <-> posts
// user -> join table <- posts
// user -> up <- posts

@ObjectType()
@Entity()
export class Yup extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.yups)
  user: User;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Post, (post) => post.yups, {
    onDelete: "CASCADE", // cascade delete
  })
  post: Post;
}
