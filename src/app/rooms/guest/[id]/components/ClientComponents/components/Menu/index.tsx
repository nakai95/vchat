"use client";
import {
  CallEndIcon,
  MicIcon,
  MicOffIcon,
  VideocamIcon,
  VideocamOffIcon,
} from "@/src/components/icons";
import { Button } from "@nextui-org/button";
import { useCallback, useState } from "react";

export function Menu(props: {
  isMute: boolean;
  isVideoOff: boolean;
  onHangUp: () => void;
  onClickMic: () => void;
  onClickVideo: () => void;
}) {
  const { isMute, isVideoOff, onHangUp, onClickMic, onClickVideo } = props;

  return (
    <div className="flex justify-center gap-4">
      <Button isIconOnly radius="full" color="default" onClick={onClickMic}>
        {isMute ? <MicOffIcon /> : <MicIcon />}
      </Button>
      <Button isIconOnly radius="full" color="default" onClick={onClickVideo}>
        {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
      </Button>
      <Button isIconOnly radius="full" color="danger" onClick={onHangUp}>
        <CallEndIcon />
      </Button>
    </div>
  );
}
