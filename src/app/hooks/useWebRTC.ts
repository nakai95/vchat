"use client";

import { useEffect, useState } from "react";

// Default configuration - Change these if you have a different STUN or TURN server.
const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export const useWebRTC = () => {
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    setPeerConnection(new RTCPeerConnection(configuration));
    return () => {
      peerConnection?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { peerConnection };
};
