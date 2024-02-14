"use client";
import { api } from "@/trpc/react";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import Link from "next/link";

export default function DetailsPage({ params }: { params: { id: string } }) {
  const { data: anime, isFetched: isAnimeFetched } =
    api.anime.fetchAnimeInfo.useQuery({
      id: params.id,
    });
  if (!isAnimeFetched) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-2">
      <h1>Details Page</h1>
      <p>ID: {params.id}</p>
      <p>
        {typeof anime?.title === "string" ? anime?.title : anime?.title.english}
      </p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
    </div>
  );
}
