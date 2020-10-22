import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";

import express from "express";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import cors from "cors";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { PSQL_PASSWORD } from "./config";
import path from "path";

// main function for adding MikroORM to connect to postgreSQL (can see sql under the hood)
const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "upvote",
    username: "postgres",
    password: PSQL_PASSWORD,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User],
  });

  await conn.runMigrations();

  //await Post.delete({}); //delete all posts
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // protecting csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "serhew4t3w4dfgssdfha",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });

  // create graphql endpoint in express
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main();
