import "reflect-metadata";
import "dotenv-safe/config";
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
import path from "path";
import { Yup } from "./entities/Yup";
import { createUserLoader } from "./utils/createUserLoader";
import { createYupLoader } from "./utils/createYupLoader";

// main function for adding MikroORM to connect to postgreSQL (can see sql under the hood)
const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: !__prod__, // true for dev, off for prod
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Yup],
  });
  await conn.runMigrations();

  //await Post.delete({}); //delete all posts
  //await User.delete({});
  //await Yup.delete({});

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.set("trust proxy", 1); // need to tell express we have a proxy so that cookies and sessions work

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );

  console.log("prod:", __prod__);

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        sameSite: "lax", // protecting csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".yupvote.net" : undefined,
        // domain: __prod__ ? '.codeponder.com' : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      yupLoader: createYupLoader(),
    }),
  });

  // create graphql endpoint in express
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log(`server started on localhost:${process.env.PORT}`);
  });
};

main();
