import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import DeviceDetector from "device-detector-js";

const detector = new DeviceDetector();

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  test: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, 1),
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      columns: {
        jsonTest: true,
        enumTest: true,
      },
    });
    if (!data) return;
    const test = data?.jsonTest;
    const test2 = data?.enumTest;
    return { test, test2 };
  }),
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  testRoute: publicProcedure.query(({ ctx }) => {
    // ctx.headers.forEach((v, k) => console.log(k, v));
    const userAgent = ctx.headers.get("user-agent");
    const res = detector.parse(userAgent ?? "");
    return {
      data: res,
    };
  }),
});
