"use client";
import { textTracks } from "@/components/videoPlayer/exampleTracks";
import Player from "@/components/videoPlayer/player";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center p-2">
      <div className="w-full xl:w-1/2">
        <Player
          // ref={player}
          skips={[
            {
              duration: 70,
              initialTime: 45,
              skipNumber: 1,
            },
            {
              duration: 70,
              initialTime: 1000,
              skipNumber: 2,
            },
          ]}
          // posterTitle="Example Video"
          // posterUrl="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
          title="Example Video"
          downloadUrl="https://www047.vipanicdn.net/streamhls/31014405f62933f3613ce2ec15abf3c4/ep.1.1688664671.m3u8"
          src="https://www047.vipanicdn.net/streamhls/31014405f62933f3613ce2ec15abf3c4/ep.1.1688664671.m3u8"
          textTracks={textTracks}
          // thumbnails="https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/storyboard.vtt"
        />
      </div>
    </main>
  );
}
