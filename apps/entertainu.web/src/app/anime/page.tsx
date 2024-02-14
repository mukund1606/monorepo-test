"use client";
import TrendingAnime from "@/components/TrendingAnime";
import { api } from "@/trpc/react";
import { type IAnimeResult } from "@mukund1606/entertainu.ts";
import { MediaStatus } from "@mukund1606/entertainu.ts/dist/models";
import { Button, ButtonGroup, Input } from "@nextui-org/react";
import { TRPCClientError } from "@trpc/client";
import {
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock,
  PlayCircle,
  ScrollText,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AnimePage() {
  const [query, setQuery] = useState("");

  const { mutate: searchAnimeRoute, data } = api.anime.search.useMutation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length < 3) return;
      searchAnimeRoute(
        { query },
        {
          onError: (error) => {
            if (error instanceof TRPCClientError) {
              alert(error.message);
            }
          },
        },
      );
    }, 500);
    return () => clearTimeout(timeout);
  }, [query, searchAnimeRoute]);

  return (
    <div className="flex flex-col gap-2 p-4">
      <TrendingAnime />
      <div className="flex flex-col gap-2">
        <Input
          label="Search Anime"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.results.map((anime) => (
            <div className="min-w-full" key={anime.id}>
              <AnimeCard data={anime} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimeCard({ data }: { data: IAnimeResult }) {
  return (
    <div className="relative z-0 h-[22rem] min-w-full border-none md:h-[300px] lg:h-[450px] xl:h-[550px]">
      <Image
        key={data.cover}
        src={data.cover ?? data.image ?? ""}
        alt={
          typeof data.title === "string" ? data.title : data.title.english ?? ""
        }
        width={1920}
        height={1080}
        className="h-full min-w-full rounded-md object-cover"
      />
      <div className="absolute bottom-0 left-0 top-0 flex min-w-full bg-opacity-50 bg-gradient-to-r from-black via-black/70 to-black/20 p-8">
        <div className="mt-auto flex flex-col gap-3">
          <h1 className="w-[min(800px,_100%)] text-2xl font-bold md:text-3xl">
            {typeof data.title === "string"
              ? data.title
              : data.title.english ?? data.title.romaji}
          </h1>
          <div className="flex flex-wrap gap-2 text-primary-foreground/70 lg:gap-4">
            {data.type && (
              <div className="flex gap-1">
                <PlayCircle className="w-4" />
                <p>{data.type}</p>
              </div>
            )}
            {data.status && (
              <div className="flex gap-1">
                {data.status === MediaStatus.ONGOING ? (
                  <CircleDot className="w-4" />
                ) : (
                  <CheckCircle2 className="w-4" />
                )}
                <p>{data.status}</p>
              </div>
            )}
            {data.duration && (
              <div className="flex gap-1">
                <Clock className="w-4" />
                <p>{data.duration} mins</p>
              </div>
            )}
            {data.rating && (
              <div className="flex gap-1">
                <Star className="w-4" />
                <p>{data.rating / 10}</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-primary-foreground/70 lg:gap-4">
            {(data.genres as string[]).map((genre) => (
              <p key={genre}>{genre}</p>
            ))}
          </div>
          <div className="hidden w-3/5 gap-2 text-primary-foreground/70 lg:flex">
            {
              // Filter tags and Reduce length of string to 100
              (data.description as string)
                ?.replace(/<[^>]*>?/gm, "")
                .slice(0, 100) + "..."
            }
          </div>
          <div>
            <ButtonGroup>
              <Button
                radius="sm"
                color="secondary"
                as={Link}
                href={`/anime/watch/${data.id}`}
              >
                <p>Watch</p>
                <ChevronRight className="w-4" />
              </Button>
              <Button
                radius="sm"
                variant="bordered"
                as={Link}
                href={`/anime/details/${data.id}`}
              >
                <p>Details</p>
                <ScrollText className="w-4" />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
