"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

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

  const [status, setStatus] = useState<RTCIceConnectionState>();

  const isPending = useMemo(() => status === undefined, [status]);

  const isLoading = useMemo(() => status === "checking", [status]);

  const isSuccess = useMemo(() => status === "connected", [status]);

  const isDisconnected = useMemo(() => status === "disconnected", [status]);

  const closePeerConnection = useCallback(() => {
    peerConnection?.close();
  }, [peerConnection]);

  useEffect(() => {
    if (peerConnection) {
      peerConnection.oniceconnectionstatechange = () => {
        setStatus(peerConnection.iceConnectionState);
        if (peerConnection.iceConnectionState === "disconnected") {
          closePeerConnection();
        }
      };
    }
  }, [peerConnection, closePeerConnection]);

  useEffect(() => {
    setPeerConnection(new RTCPeerConnection(configuration));
    return () => {
      closePeerConnection();
      setPeerConnection(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    peerConnection,
    isPending,
    isLoading,
    isSuccess,
    isDisconnected,
    closePeerConnection,
  };
};
