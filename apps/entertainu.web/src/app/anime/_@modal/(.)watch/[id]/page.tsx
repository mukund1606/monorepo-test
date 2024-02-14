"use client";
import Player from "@/components/videoPlayer/player";
import { api } from "@/trpc/react";
import { type IAnimeEpisode, type ISource } from "@mukund1606/entertainu.ts";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WatchPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { episode?: string };
}) {
  const [episodeId, setEpisodeId] = useState<string | undefined>(undefined);
  const fetchEpisodesRoute = api.anime.fetchEpisodes.useMutation();
  const [animeEpisodes, setAnimeEpisodes] = useState<Array<IAnimeEpisode>>();
  useEffect(() => {
    fetchEpisodesRoute
      .mutateAsync({
        id: params.id,
      })
      .then((data) => {
        setAnimeEpisodes(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [params.id]);
  if (animeEpisodes && searchParams.episode && !episodeId) {
    const episode = animeEpisodes.find(
      (episode) => episode.number === parseInt(searchParams.episode!),
    );
    if (episode) {
      setEpisodeId(episode.id);
    }
  } else if (animeEpisodes && !episodeId) {
    const episode = animeEpisodes.find((episode) => episode.number === 1);
    if (episode) {
      setEpisodeId(episode.id);
    }
  }
  const fetchEpisodeDataRoute = api.anime.fetchEpisodeData.useMutation();
  const [animeEpisode, setAnimeEpisode] = useState<ISource | undefined>(
    undefined,
  );
  useEffect(() => {
    if (episodeId) {
      fetchEpisodeDataRoute
        .mutateAsync({
          id: episodeId,
        })
        .then((data) => {
          setAnimeEpisode(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [episodeId]);

  const { isOpen, onOpenChange } = useDisclosure({
    isOpen: true,
    defaultOpen: true,
  });
  const router = useRouter();
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          onOpenChange();
          router.back();
        }}
        placement="top"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            ID: {params.id}
          </ModalHeader>
          <ModalBody className="pb-4">
            <div>
              {episodeId && animeEpisode && (
                <Player
                  src={
                    animeEpisode?.sources.find(
                      (source) => source.quality === "default",
                    )?.url
                  }
                  downloadUrl={animeEpisode?.download}
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {animeEpisodes?.map((episode) => (
                <Button
                  key={episode.id}
                  onClick={() => setEpisodeId(episode.id)}
                >
                  <p className="text-md">{"Episode " + episode.number}</p>
                </Button>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
