import {
  Menu,
  Tooltip,
  useCaptionOptions,
  usePlaybackRateOptions,
  useVideoQualityOptions,
  type IconComponent,
  type MenuPlacement,
  type TooltipPlacement,
} from "@vidstack/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClosedCaptionsIcon,
  PlaybackSpeedCircleIcon,
  RadioButtonIcon,
  RadioButtonSelectedIcon,
  SettingsIcon,
  SettingsMenuIcon,
} from "@vidstack/react/icons";

import { buttonClass, tooltipClass } from "./playerButtons";

export interface SettingsProps {
  placement: MenuPlacement;
  tooltipPlacement: TooltipPlacement;
}

export const menuClass =
  "animate-out fade-out slide-out-to-bottom-2 data-[open]:animate-in data-[open]:fade-in data-[open]:slide-in-from-bottom-4 flex h-[var(--menu-height)] max-h-[400px] min-w-[260px] flex-col overflow-y-auto overscroll-y-contain rounded-md border border-white/10 bg-black/95 p-2.5 font-sans text-[15px] font-medium outline-none backdrop-blur-sm transition-[height] duration-300 will-change-[height] data-[resizing]:overflow-hidden";

export const submenuClass =
  "hidden w-full flex-col items-start justify-center outline-none data-[keyboard]:mt-[3px] data-[open]:inline-block";

export function Settings({ placement, tooltipPlacement }: SettingsProps) {
  return (
    <Menu.Root className="parent">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className={buttonClass}>
            <SettingsIcon className="h-8 w-8 transform transition-transform duration-200 ease-out group-data-[open]:rotate-90" />
          </Menu.Button>
        </Tooltip.Trigger>
        <Tooltip.Content className={tooltipClass} placement={tooltipPlacement}>
          Settings
        </Tooltip.Content>
      </Tooltip.Root>
      <Menu.Content
        className={`${menuClass} max-h-[calc(100%-85px)]`}
        placement={placement}
      >
        <SpeedSubmenu />
        <CaptionSubmenu />
        <QualitySubmenu />
      </Menu.Content>
    </Menu.Root>
  );
}

function CaptionSubmenu() {
  const options = useCaptionOptions(),
    hint = options.selectedTrack?.label ?? "Off";
  return (
    <Menu.Root>
      <SubmenuButton
        label="Captions"
        hint={hint}
        disabled={options.disabled}
        icon={ClosedCaptionsIcon}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup
          className="flex w-full flex-col"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function QualitySubmenu() {
  const options = useVideoQualityOptions();
  const hint = options.selectedValue;
  const hint2 = options.selectedQuality;
  return (
    <>
      <Menu.Root>
        <SubmenuButton
          label="Quality"
          hint={
            hint === "auto"
              ? `Auto(${hint2 && hint2.height + "p"})`
              : `${hint.split("_")[0]}p`
          }
          disabled={options.disabled}
          icon={SettingsMenuIcon}
        />
        <Menu.Content className={submenuClass}>
          <Menu.RadioGroup
            className="flex w-full flex-col"
            value={options.selectedValue}
          >
            {options.map(({ label, value, select, bitrateText }) => (
              <Radio value={value} onSelect={select} key={value}>
                <div className="flex w-full justify-between">
                  <span>{label}</span>
                  <span className="text-white/50">{bitrateText}</span>
                </div>
              </Radio>
            ))}
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Root>
    </>
  );
}

function SpeedSubmenu() {
  const options = usePlaybackRateOptions();
  const hint = options.selectedValue;
  return (
    <>
      <Menu.Root>
        <SubmenuButton
          label="Speed"
          hint={hint ? (hint === "1" ? "Normal" : hint + "x") : ""}
          disabled={options.disabled}
          icon={PlaybackSpeedCircleIcon}
        />
        <Menu.Content className={submenuClass}>
          <Menu.RadioGroup
            className="flex w-full flex-col"
            value={options.selectedValue}
          >
            {options.map(({ label, value, select }) => (
              <Radio value={value} onSelect={select} key={value}>
                <div className="flex w-full justify-between">
                  <span>{label}</span>
                </div>
              </Radio>
            ))}
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu.Root>
    </>
  );
}

function Radio({ children, ...props }: Menu.RadioProps) {
  return (
    <Menu.Radio
      className="group relative flex w-full cursor-pointer select-none items-center justify-start rounded-sm p-2.5 outline-none ring-media-focus data-[hocus]:bg-white/10 data-[focus]:ring-[3px]"
      {...props}
    >
      <RadioButtonIcon className="h-4 w-4 text-white group-data-[checked]:hidden" />
      <RadioButtonSelectedIcon className="hidden h-4 w-4 text-media-brand group-data-[checked]:block" />
      <span className="ml-2 w-full">{children}</span>
    </Menu.Radio>
  );
}

export interface SubmenuButtonProps {
  label: string;
  hint: string;
  disabled?: boolean;
  icon: IconComponent;
}

function SubmenuButton({
  label,
  hint,
  icon: Icon,
  disabled,
}: SubmenuButtonProps) {
  return (
    <Menu.Button
      className="parent left-0 z-10 flex w-full cursor-pointer select-none items-center justify-start rounded-sm bg-black/60 p-2.5 outline-none ring-inset ring-media-focus backdrop-blur-lg aria-disabled:hidden data-[open]:sticky data-[open]:-top-2.5 data-[hocus]:bg-white/10 data-[focus]:ring-[3px]"
      disabled={disabled}
    >
      <ChevronLeftIcon className="-ml-0.5 mr-1.5 hidden h-[18px] w-[18px] parent-data-[open]:block" />
      <div className="contents parent-data-[open]:hidden">
        <Icon className="h-5 w-5" />
      </div>
      <span className="ml-1.5 parent-data-[open]:ml-0">{label}</span>
      <span className="ml-auto text-sm text-white/50">{hint}</span>
      <ChevronRightIcon className="ml-0.5 h-[18px] w-[18px] text-sm text-white/50 parent-data-[open]:hidden" />
    </Menu.Button>
  );
}
