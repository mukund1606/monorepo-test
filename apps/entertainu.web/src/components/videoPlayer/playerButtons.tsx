import { cn } from "@/utils";
import {
  CaptionButton,
  FullscreenButton,
  MuteButton,
  PIPButton,
  PlayButton,
  SeekButton,
  Tooltip,
  isTrackCaptionKind,
  useMediaState,
  type TooltipPlacement,
} from "@vidstack/react";
import {
  ClosedCaptionsIcon,
  ClosedCaptionsOnIcon,
  DownloadIcon,
  FastBackwardIcon,
  FastForwardIcon,
  FullscreenExitIcon,
  FullscreenIcon,
  MuteIcon,
  PauseIcon,
  PictureInPictureExitIcon,
  PictureInPictureIcon,
  PlayIcon,
  VolumeHighIcon,
  VolumeLowIcon,
} from "@vidstack/react/icons";
import Link from "next/link";

export interface MediaButtonProps {
  tooltipPlacement: TooltipPlacement;
  className?: string;
}

export const buttonClass =
  "group ring-media-focus relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-inset hover:bg-white/20 data-[focus]:ring-4";

export const tooltipClass =
  "animate-out fade-out slide-out-to-bottom-2 data-[visible]:animate-in data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4 z-10 rounded-sm bg-black/90 px-2 py-0.5 text-sm font-medium text-white parent-data-[open]:hidden";

export function Play({ tooltipPlacement }: MediaButtonProps) {
  const isPaused = useMediaState("paused");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PlayButton className={buttonClass}>
          {isPaused ? (
            <PlayIcon className="h-8 w-8" />
          ) : (
            <PauseIcon className="h-8 w-8" />
          )}
        </PlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isPaused ? "Play" : "Pause"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function SeekForward({ tooltipPlacement, className }: MediaButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <SeekButton className={cn(buttonClass, className)} seconds={10}>
          <FastForwardIcon className="h-7 w-7" />
        </SeekButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        Seek Forward 10s
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function DownloadButton({
  downloadUrl,
}: MediaButtonProps & { downloadUrl: string }) {
  return (
    <Link className={buttonClass} href={downloadUrl} target="_blank">
      <DownloadIcon className="h-7 w-7" />
    </Link>
  );
}

export function SeekBackward({
  tooltipPlacement,
  className,
}: MediaButtonProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <SeekButton className={cn(buttonClass, className)} seconds={-10}>
          <FastBackwardIcon className="h-7 w-7" />
        </SeekButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        Seek Forward 10s
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Mute({ tooltipPlacement }: MediaButtonProps) {
  const volume = useMediaState("volume"),
    isMuted = useMediaState("muted");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <MuteButton className={buttonClass}>
          {isMuted || volume == 0 ? (
            <MuteIcon className="h-8 w-8" />
          ) : volume < 0.5 ? (
            <VolumeLowIcon className="h-8 w-8" />
          ) : (
            <VolumeHighIcon className="h-8 w-8" />
          )}
        </MuteButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isMuted ? "Unmute" : "Mute"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Caption({ tooltipPlacement, className }: MediaButtonProps) {
  const track = useMediaState("textTrack"),
    isOn = track && isTrackCaptionKind(track);
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <CaptionButton className={cn(buttonClass, className)}>
          {isOn ? (
            <ClosedCaptionsOnIcon className="h-8 w-8" />
          ) : (
            <ClosedCaptionsIcon className="h-8 w-8" />
          )}
        </CaptionButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isOn ? "Closed-Captions Off" : "Closed-Captions On"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function PIP({ tooltipPlacement, className }: MediaButtonProps) {
  const isActive = useMediaState("pictureInPicture");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PIPButton className={cn(buttonClass, className)}>
          {isActive ? (
            <PictureInPictureExitIcon className="h-8 w-8" />
          ) : (
            <PictureInPictureIcon className="h-8 w-8" />
          )}
        </PIPButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isActive ? "Exit PIP" : "Enter PIP"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function Fullscreen({ tooltipPlacement }: MediaButtonProps) {
  const isActive = useMediaState("fullscreen");
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <FullscreenButton className={buttonClass}>
          {isActive ? (
            <FullscreenExitIcon className="h-8 w-8" />
          ) : (
            <FullscreenIcon className="h-8 w-8" />
          )}
        </FullscreenButton>
      </Tooltip.Trigger>
      <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
        {isActive ? "Exit Fullscreen" : "Enter Fullscreen"}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
