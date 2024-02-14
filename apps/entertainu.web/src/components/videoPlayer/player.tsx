"use client";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "@vidstack/react/player/styles/base.css";

import {
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaPlayerInstance,
  type MediaPlayerProps,
} from "@vidstack/react";

import { VideoLayout } from "./videoPlayerLayout/videoLayout";

export interface TextTrackProps {
  src?: string;
  label?: string;
  kind: TextTrackKind;
  language?: string;
  default?: boolean;
}

export interface SkipProps {
  skipNumber: number;
  duration: number;
  initialTime: number;
}

interface PlayerProps extends Omit<MediaPlayerProps, "children" | "ref"> {
  skips?: SkipProps[];
  posterUrl?: string;
  posterTitle?: string;
  title?: string;
  src?: string;
  thumbnails?: string;
  textTracks?: readonly TextTrackProps[];
  downloadUrl?: string;
  ref?: React.Ref<MediaPlayerInstance>;
}

const Player = forwardRef<MediaPlayerInstance, PlayerProps>(
  (
    {
      skips,
      posterUrl,
      posterTitle,
      title,
      src,
      thumbnails,
      textTracks,
      downloadUrl,
      ...props
    }: PlayerProps,
    ref,
  ) => {
    const myRef = useRef<MediaPlayerInstance>(null);
    const player = (ref as React.RefObject<MediaPlayerInstance>) ?? myRef;

    const [skipNumber, setSkipNumber] = useState<number | undefined>(0);

    const sortedSkips = useMemo(
      () =>
        skips ? [...skips].sort((a, b) => a.initialTime - b.initialTime) : [],
      [skips],
    );

    const seekToTime = useCallback(
      (time: number) => {
        if (player?.current) {
          player.current.currentTime = time;
        }
      },
      [player],
    );

    useEffect(() => {
      return player?.current?.subscribe(({ currentTime }) => {
        let left = 0,
          right = sortedSkips.length - 1;
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          const skip = sortedSkips[mid];
          if (
            skip &&
            skip.initialTime <= currentTime &&
            currentTime < skip.initialTime + skip.duration
          ) {
            if (skip.skipNumber !== skipNumber) {
              setSkipNumber(skip.skipNumber);
            }
            return;
          } else if (skip && currentTime < skip.initialTime) {
            right = mid - 1;
          } else {
            left = mid + 1;
          }
        }
        if (skipNumber !== undefined) {
          setSkipNumber(undefined);
        }
      });
    }, [skipNumber, player, sortedSkips]);

    const renderSkipButton = useCallback(
      (skip: SkipProps) => (
        <button
          key={skip.skipNumber}
          onClick={() => seekToTime(skip.initialTime + skip.duration)}
          className="absolute bottom-20 right-4 z-50 rounded-md border-2 border-white/40 bg-black/10 p-1 px-4 font-bold text-white/60 duration-300 hover:border-white/90 hover:bg-black hover:text-white/90"
        >
          Skip
        </button>
      ),
      [seekToTime],
    );

    return (
      <MediaPlayer
        className="aspect-video w-full overflow-hidden rounded-md font-sans text-white ring-media-focus data-[focus]:ring-4"
        title={title ?? ""}
        src={src ?? ""}
        crossOrigin="anonymous"
        autoPlay
        playsInline
        ref={ref ?? player}
        {...props}
      >
        {skips
          ?.filter((skip) => skip.skipNumber === skipNumber)
          .map((skip) => renderSkipButton(skip))}
        {posterUrl ? (
          <Poster
            className="absolute inset-0 block h-full w-full rounded-md object-cover opacity-0 transition-opacity data-[visible]:opacity-100"
            src={posterUrl}
            alt={posterTitle ?? ""}
          />
        ) : (
          <></>
        )}
        <MediaProvider>
          {textTracks?.map((track) => <Track {...track} key={track.src} />)}
        </MediaProvider>
        <VideoLayout
          skips={skips}
          thumbnails={thumbnails}
          downloadUrl={downloadUrl}
        />
      </MediaPlayer>
    );
  },
);

Player.displayName = "Player";
export default Player;
