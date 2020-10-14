import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Resolver, Mutation, InputType, Field, Arg, Ctx } from "type-graphql";

import argon2 from "argon2";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}


@Resolver()
export class UserResolver {
    //graphql query
    @Mutation(() => User)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ) {
        const hashedPass = await argon2.hash(options.password)
        const user = em.create(User, {username: options.username, password: options.password})
        await em.persistAndFlush(user);
        return user;
    }

}



