"use client";

import { useLocalStorage } from "@mantine/hooks";
import { useQueryState } from "next-usequerystate";
import { useEffect, useRef, useState } from "react";

import { Button, Switch } from "@nextui-org/react";

import Player from "@/components/videoPlayer/player";

import { type MediaPlayerInstance } from "@vidstack/react";

import { api } from "@/trpc/react";

export default function WatchPage({ params }: { params: { id: string } }) {
  const [episodeId, setEpisodeId] = useState<string | undefined>();

  const [episodeNumber, setEpisodeNumber] = useQueryState("episode", {
    defaultValue: "1",
  });

  const [isAutoSwitchEpisode, setIsAutoSwitchEpisode] = useLocalStorage({
    key: "auto-play",
    defaultValue: false,
  });
  const [episodeProgress, setEpisodeProgress] = useLocalStorage({
    key: `anime-${params.id}-episode-${episodeNumber}-progress`,
    defaultValue: 0,
  });

  const player = useRef<MediaPlayerInstance>(null);

  const { mutate: fetchAnimeEpisodesRoute, data: animeEpisodes } =
    api.anime.fetchEpisodes.useMutation();
  const { mutate: fetchEpisodeDataRoute, data: episodeData } =
    api.anime.fetchEpisodeData.useMutation();

  const handleEpisodeEnd = () => {
    if (!animeEpisodes) return;
    const currentIndex = animeEpisodes.findIndex(
      (episode) => episode.id === episodeId,
    );

    if (currentIndex < animeEpisodes.length - 1) {
      const nextEpisode = animeEpisodes.find(
        (episode) => episode.number === parseInt(episodeNumber) + 1,
      );
      if (!nextEpisode) return;
      void setEpisodeNumber(nextEpisode.number.toString());
      setEpisodeId(nextEpisode.id);
      fetchEpisodeDataRoute({ id: nextEpisode.id });
    }
  };

  useEffect(() => {
    fetchAnimeEpisodesRoute(
      { id: params.id },
      {
        onSuccess(data) {
          if (data[0]) fetchEpisodeDataRoute({ id: data[0]?.id });
        },
      },
    );
  }, [fetchAnimeEpisodesRoute, , fetchEpisodeDataRoute, params.id]);

  return (
    <div className="p-2">
      <div>
        <Player
          ref={player}
          onEnded={() => {
            setEpisodeProgress(0);
            if (isAutoSwitchEpisode) {
              handleEpisodeEnd();
            }
          }}
          onTimeUpdate={(t) => {
            if (t.played.length === 0) {
              if (player.current?.duration === undefined) return;
              player.current.currentTime = episodeProgress;
            } else {
              setEpisodeProgress(t.currentTime);
            }
          }}
          src={
            episodeData?.sources.find((source) => source.quality === "default")
              ?.url
          }
          downloadUrl={episodeData?.download}
        />
      </div>
      <div>
        <Switch
          color="secondary"
          isSelected={isAutoSwitchEpisode}
          onValueChange={setIsAutoSwitchEpisode}
          aria-label="Auto Switch Episode"
        >
          {"Auto Switch Episode: " + (isAutoSwitchEpisode ? "On" : "Off")}
        </Switch>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {animeEpisodes?.map((episode) => (
          <Button
            key={episode.id}
            onClick={() => {
              if (episode.id === episodeId) return;
              setEpisodeId(episode.id);
              void setEpisodeNumber(episode.number.toString());
              fetchEpisodeDataRoute({ id: episode.id });
            }}
          >
            <p className="text-md">{"Episode " + episode.number}</p>
          </Button>
        ))}
      </div>
    </div>
  );
}
