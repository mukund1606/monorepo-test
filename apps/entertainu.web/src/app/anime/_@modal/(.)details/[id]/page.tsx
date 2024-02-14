"use client";
"use client";
import { api } from "@/trpc/react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function App({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { isOpen, onOpenChange } = useDisclosure({
    isOpen: true,
    defaultOpen: true,
  });
  const router = useRouter();
  const { data: anime } = api.anime.fetchAnimeInfo.useQuery({
    id: params.id,
  });
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
            <p>
              {typeof anime?.title === "string"
                ? anime?.title
                : anime?.title.english}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {anime?.episodes?.map((episode) => (
                <Card
                  key={episode.id}
                  as={Link}
                  href={`/anime/watch/${params.id}?episode=${episode.number}`}
                >
                  <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                      <p className="text-md">{episode.title}</p>
                    </div>
                  </CardHeader>
                  {episode.description && (
                    <>
                      <Divider />
                      <CardBody>
                        <p>{episode.description}</p>
                      </CardBody>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
