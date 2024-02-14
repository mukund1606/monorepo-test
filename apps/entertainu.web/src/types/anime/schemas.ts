import * as z from "zod";

export const searchAnimeSchema = z.object({
  query: z.string(),
  page: z.number().min(1).optional().default(1),
  perPage: z.number().min(1).max(50).optional().default(10),
});

export const trendingAnimeSchema = z.object({
  page: z.number().min(1).optional().default(1),
  perPage: z.number().min(1).max(50).optional().default(10),
});

export const fetchAnimeInfoSchema = z.object({
  id: z.string().min(1),
  dub: z.boolean().optional().default(false),
  fetchFiller: z.boolean().optional().default(false),
});

export const fetchEpisodesDataSchema = z.object({
  id: z.string().min(1),
});
