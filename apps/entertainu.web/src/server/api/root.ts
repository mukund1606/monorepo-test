import { createTRPCRouter } from "@/server/api/trpc";

import { animeRouter } from "@/server/api/routers/anime";
import { postRouter } from "@/server/api/routers/post";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  anime: animeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
