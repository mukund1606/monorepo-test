import captionStyles from "./captions.module.css";
import styles from "./videoLayout.module.css";

import {
  Captions,
  Controls,
  Gesture,
  useCaptionOptions,
  useMediaState,
} from "@vidstack/react";
import { PauseIcon, PlayIcon } from "@vidstack/react/icons";

import { cn } from "@/utils";
import { isMobile } from "react-device-detect";
import type { SkipProps } from "../player";
import * as Buttons from "../playerButtons";
import * as Menus from "../playerMenus";
import * as Sliders from "../playerSliders";
import { TimeGroup } from "../playerTimeGroup";
import { Title } from "../playerTitle";

export interface VideoLayoutProps {
  thumbnails?: string;
  skips?: SkipProps[];
  downloadUrl?: string;
}

export function VideoLayout({
  thumbnails,
  skips,
  downloadUrl,
}: VideoLayoutProps) {
  const captions = useCaptionOptions();
  const isFullscreen = useMediaState("fullscreen");
  return (
    <>
      <Gestures />
      <Captions
        className={`${captionStyles.captions} absolute inset-0 bottom-2 z-10 select-none break-words opacity-0 transition-[opacity,bottom] duration-300 media-captions:opacity-100 media-controls:bottom-[85px] media-preview:opacity-0`}
      />
      <Controls.Root
        className={`${styles.controls} absolute inset-0 z-10 flex h-full w-full flex-col bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity media-controls:opacity-100`}
      >
        <div className="flex-1" />
        <Controls.Group className="flex w-full items-center px-2">
          <Sliders.Time thumbnails={thumbnails} skips={skips} />
        </Controls.Group>
        <Controls.Group className="-mt-0.5 flex w-full items-center px-2 pb-2">
          <Buttons.SeekBackward tooltipPlacement="top start" />
          <Buttons.Play tooltipPlacement="top start" />
          {!isMobile || (isMobile && isFullscreen) ? (
            <Buttons.SeekForward tooltipPlacement="top start" />
          ) : (
            <></>
          )}
          <Buttons.Mute tooltipPlacement="top" />
          <Sliders.Volume />
          <TimeGroup className={cn("hidden sm:flex", isFullscreen && "flex")} />
          <Title className={cn("hidden md:flex", isFullscreen && "flex")} />
          <div className="flex-1" />
          {captions.length > 1 ? (
            <Buttons.Caption
              tooltipPlacement="top"
              className={cn("hidden sm:flex", isFullscreen && "flex")}
            />
          ) : (
            <></>
          )}
          {downloadUrl ? (
            <Buttons.DownloadButton
              downloadUrl={downloadUrl}
              tooltipPlacement="top"
            />
          ) : (
            <></>
          )}
          <Buttons.PIP
            tooltipPlacement="top"
            className={cn("hidden sm:flex", isFullscreen && "flex")}
          />
          <Menus.Settings placement="top end" tooltipPlacement="top" />
          <Buttons.Fullscreen tooltipPlacement="top end" />
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

function Gestures() {
  const isPaused = useMediaState("paused");
  const canPlay = useMediaState("canPlay");
  const isControlsVisible = useMediaState("controlsVisible");
  return (
    <>
      <Gesture
        className="absolute inset-0 z-10 m-auto h-fit w-fit"
        event="pointerup"
        action="play"
      >
        {isPaused && canPlay ? (
          <>
            <PlayIcon
              className={cn(
                "h-12 w-12 rounded-full border-2 border-black bg-white p-1 text-black opacity-70 drop-shadow-lg duration-300",
                !isControlsVisible && "opacity-40",
              )}
            />
          </>
        ) : (
          <></>
        )}
      </Gesture>
      {isMobile && (
        <Gesture
          className="absolute inset-0 z-10 m-auto h-fit w-fit"
          event="pointerup"
          action="pause"
        >
          {!isPaused && canPlay && isControlsVisible ? (
            <>
              <PauseIcon className="h-12 w-12 rounded-full border-2 border-black bg-white p-1 text-black opacity-70 drop-shadow-lg" />
            </>
          ) : (
            <></>
          )}
        </Gesture>
      )}
      <Gesture
        className="absolute inset-0 z-0 block h-full w-full"
        event="dblpointerup"
        action="toggle:fullscreen"
      />
      <Gesture
        className="absolute left-0 top-0 z-10 block h-full w-1/3"
        event="dblpointerup"
        action="seek:-10"
      />
      <Gesture
        className="absolute right-0 top-0 z-10 block h-full w-1/3"
        event="dblpointerup"
        action="seek:10"
      />
      <Gesture
        className="absolute z-10 block h-full w-full"
        event="pointerdown"
        action="toggle:controls"
      />
    </>
  );
}
