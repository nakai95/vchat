"use client";
import {
  CallEndIcon,
  MicIcon,
  MicOffIcon,
  VideocamIcon,
  VideocamOffIcon,
} from "@/src/components/icons";
import { siteConfig } from "@/src/config/site";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

export function Menu(props: {
  isMute: boolean;
  isVideoOff: boolean;
  onHandUp: () => void;
  onClickMic: () => void;
  onClickVideo: () => void;
}) {
  const { isMute, isVideoOff, onHandUp, onClickMic, onClickVideo } = props;

  return (
    <div className="flex justify-center gap-4">
      <Button isIconOnly radius="full" color="default" onClick={onClickMic}>
        {isMute ? <MicOffIcon /> : <MicIcon />}
      </Button>
      <Button isIconOnly radius="full" color="default" onClick={onClickVideo}>
        {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
      </Button>
      <Button
        as={Link}
        href={siteConfig.pages.home}
        isIconOnly
        radius="full"
        color="danger"
        onClick={onHandUp}
      >
        <CallEndIcon />
      </Button>
    </div>
  );
}
