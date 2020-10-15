import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core"
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from 'express';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { MyContext } from "./types";


// main function for adding MikroORM to connect to postgreSQL (can see sql under the hood)
const main = async () => {

    const orm = await MikroORM.init(microConfig); // connect to database
    await orm.getMigrator().up(); //run migrations
    // run SQL
    // const post = orm.em.create(Post, {title: 'my first post'});
    // await orm.em.persistAndFlush(post);
    // const posts = await orm.em.find(Post, {});
    // console.log(posts);

    const app = express();

    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'lax', // protecting csrf
                secure: __prod__ // cookie only works in https
            },
            saveUninitialized: false,
            secret: "serhew4t3w4dfgssdfha",
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
    });

    // create graphql endpoint in express
    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log('server started on localhost:4000');
    });
}

main();