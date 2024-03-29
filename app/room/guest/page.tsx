"use client";
import { Media } from "@/functions/media";
import { RoomsManeger } from "@/functions/roomsManager";
import { WebRTC } from "@/functions/webRTC";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

async function join(
  roomId: string,
  localVideo: HTMLVideoElement,
  remoteVideo: HTMLVideoElement
) {
  const rtc = new WebRTC();
  rtc.checkConnectionState();
  const roomsManeger = new RoomsManeger();
  const media = new Media(localVideo, remoteVideo);
  await media.setupLocalStream();
  media.forEachTrack((track) => {
    rtc.peerConnection.addTrack(track, media.localStream);
  });

  // ice candidateを送信する
  const guestCollection = roomsManeger.addCollection(roomId, "guest");
  rtc.onIceCandidate(async (candidate) => {
    console.log("onIceCandidate", candidate);
    await roomsManeger.addDoc(guestCollection, candidate);
  });

  rtc.onTrack((event) => {
    const [remoteStream] = event.streams;
    console.log("onTrack", remoteStream);
    media.setRemoteSrcObject(remoteStream);
  });

  // roomからofferを取得してanswerを作成する
  const room = await roomsManeger.getRoom(roomId);
  await rtc.setRemoteDescription(room.offer);
  const answer = await rtc.createAnswer();
  const roomWithAnswer = {
    answer: {
      type: answer.type,
      sdp: answer.sdp,
    },
  };
  await roomsManeger.updateRoom(roomId, roomWithAnswer);
  await rtc.setLocalDescription(answer);

  // ice candidateを受信して追加する
  const hostCollection = roomsManeger.getCollection(roomId, "host");
  roomsManeger.onQuerySnapshot(hostCollection, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("getIceCandidate", change.doc.data());
        const candidate = new RTCIceCandidate(change.doc.data());
        rtc.addIceCandidate(candidate);
      }
    });
  });
}

export default function GuestRoomPage() {
  const searchParams = useSearchParams();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const roomId = useMemo(() => searchParams.get("id"), [searchParams]);

  useEffect(() => {
    (async () => {
      if (
        localVideoRef.current !== null &&
        remoteVideoRef.current !== null &&
        roomId
      ) {
        await join(roomId, localVideoRef.current, remoteVideoRef.current);
      }
    })();
  }, [localVideoRef, remoteVideoRef, roomId]);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <video
          id="localVideo"
          className="w-full bg-slate-600"
          muted
          autoPlay
          playsInline
          ref={localVideoRef}
        />
        <video
          id="remoteVideo"
          className="w-full bg-slate-600"
          autoPlay
          playsInline
          ref={remoteVideoRef}
        />
      </div>
    </>
  );
}