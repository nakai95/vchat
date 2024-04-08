"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const useMedia = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);

  const [isMute, setIsMute] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const setupMedia = useCallback(async () => {
    if (localVideoRef.current !== null && remoteVideoRef.current !== null) {
      localStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = localStream.current;
      localVideoRef.current.addEventListener("loadedmetadata", () => {
        localVideoRef.current?.play();
      });
      remoteVideoRef.current.addEventListener("loadedmetadata", () => {
        remoteVideoRef.current?.play();
      });
    }
  }, [localVideoRef, remoteVideoRef]);

  const addTracks = useCallback(
    (callback: (track: MediaStreamTrack, localStream: MediaStream) => void) => {
      const stream = localStream.current;
      if (!stream) return;
      stream.getTracks().forEach((track) => callback(track, stream));
    },
    [localStream]
  );

  const stopUserMedia = useCallback(() => {
    if (localStream.current === null) return;
    localStream.current.getTracks().forEach((track) => track.stop());
  }, [localStream]);

  const setRemoteSrcObject = useCallback(
    (stream: MediaStream) => {
      if (remoteVideoRef.current === null) return;
      remoteStream.current = stream;
      remoteVideoRef.current.srcObject = remoteStream.current;
    },
    [remoteVideoRef]
  );

  const removeRemoteSrcObject = useCallback(() => {
    if (remoteVideoRef.current === null) return;
    remoteVideoRef.current.srcObject = null;
  }, [remoteVideoRef]);

  const handleSwitchMic = useCallback(() => {
    setIsMute((prev) => !prev);
  }, [setIsMute]);

  useEffect(() => {
    if (localStream.current === null) return;
    localStream.current.getAudioTracks()[0].enabled = !isMute;
  }, [isMute]);

  const handleSwitchVideo = useCallback(() => {
    setIsVideoOff((prev) => !prev);
  }, [setIsVideoOff]);

  useEffect(() => {
    if (localStream.current === null) return;
    localStream.current.getVideoTracks()[0].enabled = !isVideoOff;
  }, [isVideoOff]);

  return {
    localVideoRef,
    remoteVideoRef,
    isMute,
    isVideoOff,
    setupMedia,
    addTracks,
    stopUserMedia,
    setRemoteSrcObject,
    removeRemoteSrcObject,
    handleSwitchMic,
    handleSwitchVideo,
  };
};
