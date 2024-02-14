import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { META } from "@mukund1606/entertainu.ts";

import {
  fetchAnimeInfoSchema,
  fetchEpisodesDataSchema,
  searchAnimeSchema,
  trendingAnimeSchema,
} from "@/types/anime/schemas";

export const animeRouter = createTRPCRouter({
  search: publicProcedure
    .input(searchAnimeSchema)
    .mutation(async ({ input }) => {
      // const provider = new ANIME.Zoro();
      const anilist = new META.Anilist();
      const data = await anilist.search(input.query, input.page, input.perPage);
      return data;
    }),
  trending: publicProcedure
    .input(trendingAnimeSchema)
    .query(async ({ input }) => {
      // const provider = new ANIME.Zoro();
      const anilist = new META.Anilist();
      const data = await anilist.fetchTrendingAnime(input.page, input.perPage);
      return data;
    }),
  fetchAnimeInfo: publicProcedure
    .input(fetchAnimeInfoSchema)
    .query(async ({ input }) => {
      // const provider = new ANIME.Zoro();
      const anilist = new META.Anilist();
      const data = await anilist.fetchAnimeInfo(
        input.id,
        input.dub,
        input.fetchFiller,
      );
      return data;
    }),
  fetchEpisodes: publicProcedure
    .input(fetchAnimeInfoSchema)
    .mutation(async ({ input }) => {
      // const provider = new ANIME.Zoro();
      const anilist = new META.Anilist();
      const data = await anilist.fetchEpisodesListById(
        input.id,
        input.dub,
        input.fetchFiller,
      );
      return data;
    }),
  fetchEpisodeData: publicProcedure
    .input(fetchEpisodesDataSchema)
    .mutation(async ({ input }) => {
      // const provider = new ANIME.Zoro();
      const anilist = new META.Anilist();
      const data = await anilist.fetchEpisodeSources(input.id, "vidcloud");
      return data;
    }),
});
