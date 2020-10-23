import { Request, Response } from "express";
import { Redis } from "ioredis";
import { createUserLoader } from "./utils/createUserLoader";
import { createYupLoader } from "./utils/createYupLoader";

export type MyContext = {
  req: Request;
  redis: Redis;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  yupLoader: ReturnType<typeof createYupLoader>;
};
