"use client";

import { api } from "@/trpc/react";
import { type IAnimeResult } from "@mukund1606/entertainu.ts";
import { MediaStatus } from "@mukund1606/entertainu.ts/dist/models";
import { Button, ButtonGroup, Skeleton } from "@nextui-org/react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock,
  PlayCircle,
  ScrollText,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TrendingAnime() {
  const { data, isLoading } = api.anime.trending.useQuery({ perPage: 20 });
  return (
    <div className="overflow-hidden">
      <CarouselComponent
        data={data?.results
          ?.filter(
            (anime) =>
              anime.status === MediaStatus.ONGOING ||
              anime.status === MediaStatus.COMPLETED,
          )
          .slice(0, 10)}
        isLoading={isLoading}
      />
      {/* {trendingAnime.results
        ?.filter(
          (anime) =>
            anime.status === MediaStatus.ONGOING ||
            anime.status === MediaStatus.COMPLETED,
        )
        .slice(0, 10)
        .map((anime) => {
          return <AnimeCard data={anime} key={anime.id} />;
        })} */}
    </div>
  );
}

function AnimeCard({
  data,
  index,
  i,
}: {
  data: IAnimeResult;
  index: number;
  i: number;
}) {
  return (
    <div className="relative z-0 h-[22rem] min-w-full border-none bg-background/60 dark:bg-default-100/50 md:h-[300px] lg:h-[450px] xl:h-[550px]">
      <motion.img
        key={data.cover}
        src={data.cover}
        animate={{ opacity: i === index ? 0.7 : 0.2 }}
        className="h-full min-w-full object-cover"
      />
      <div className="absolute bottom-0 left-0 top-0 flex min-w-full bg-opacity-50 bg-gradient-to-r from-black via-black/70 to-black/20 p-8">
        <div className="mt-auto flex flex-col gap-3">
          <p className="text-primary-foreground/50">#{i + 1} Spotlight</p>
          <h1 className="w-[min(800px,_100%)] text-2xl font-bold md:text-3xl lg:text-5xl">
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
                .slice(0, 250) + "..."
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

// const collapsedAspectRatio = 3 / 4;
// const fullAspectRatio = 3 / 2;
// const margin = 12;
// const gap = 2;

function CarouselComponent({
  data,
  isLoading,
}: {
  data: IAnimeResult[] | undefined;
  isLoading: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [isForward, setIsForward] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isForward) {
        setIndex((index) => index + 1);
        if (data && index + 1 === data?.length - 1) {
          setIsForward(false);
        }
      } else {
        setIndex((index) => index - 1);
        if (index - 1 === 0) {
          setIsForward(true);
        }
      }
    }, 7000);
    return () => clearInterval(interval);
  }, [index, data, isForward]);

  return (
    <motion.div
      className="flex w-full flex-col items-center justify-center gap-8 bg-background bg-opacity-30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <MotionConfig transition={{ duration: 1.5, ease: [0.32, 0.72, 0, 1] }}>
        <div className="relative overflow-hidden">
          <Skeleton
            className="h-[22rem] rounded-lg md:h-[300px] lg:h-[450px] xl:h-[550px]"
            isLoaded={!isLoading}
          >
            <motion.div
              animate={{ x: `-${index * 100}%` }}
              className="flex w-full"
            >
              {data?.map((anime, i) => (
                <div className="min-w-full" key={anime.id}>
                  <AnimeCard data={anime} index={index} i={i} />
                </div>
              ))}
            </motion.div>
          </Skeleton>

          <AnimatePresence initial={false}>
            {index > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0, pointerEvents: "none" }}
                whileHover={{ opacity: 1 }}
                className="absolute right-1 top-14 -mt-4 flex h-8 w-8 items-center justify-center rounded-md bg-foreground sm:right-2 sm:top-[3.75rem]"
                onClick={() => {
                  setIndex(index - 1);
                  if (index - 1 === 0) {
                    setIsForward(true);
                  }
                }}
              >
                <ChevronLeft className="h-6 w-6 text-background" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {data && index + 1 < data.length && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0, pointerEvents: "none" }}
                whileHover={{ opacity: 1 }}
                className="absolute right-1 top-5 -mt-4 flex h-8 w-8 items-center justify-center rounded-md bg-foreground backdrop-blur-sm sm:right-2 sm:top-6"
                onClick={() => {
                  setIndex(index + 1);
                  if (index + 1 === data.length - 1) {
                    setIsForward(false);
                  }
                }}
              >
                <ChevronRight className="h-6 w-6 text-background" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        {/* <div className="flex h-full w-full flex-col justify-center">
          <div className="mt-2 flex h-24 justify-center overflow-hidden">
            <motion.div
              initial={false}
              animate={{
                x: `-${
                  index * 100 * (collapsedAspectRatio / fullAspectRatio) +
                  margin +
                  index * gap
                }%`,
              }}
              style={{
                aspectRatio: fullAspectRatio,
                gap: `${gap}%`,
              }}
              className="flex"
            >
              {images.map((image, i) => (
                <motion.button
                  onClick={() => {
                    setIndex(i);
                    if (i === 0) {
                      setIsForward(true);
                    } else if (i === images.length - 1) {
                      setIsForward(false);
                    }
                  }}
                  initial={false}
                  whileHover={{ opacity: 1 }}
                  animate={i === index ? "active" : "inactive"}
                  variants={{
                    active: {
                      aspectRatio: fullAspectRatio,
                      marginLeft: `${margin}%`,
                      marginRight: `${margin}%`,
                      opacity: 1,
                    },
                    inactive: {
                      aspectRatio: collapsedAspectRatio,
                      marginLeft: 0,
                      marginRight: 0,
                      opacity: 0.5,
                    },
                  }}
                  className="shrink-0 rounded-full"
                  key={image}
                >
                  <Image src={image} className="h-full object-cover" />
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div> */}
      </MotionConfig>
    </motion.div>
  );
}
