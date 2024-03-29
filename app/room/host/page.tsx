"use client";
import { siteConfig } from "@/config/site";
import { Media } from "@/functions/media";
import { RoomsManeger } from "@/functions/roomsManager";
import { WebRTC } from "@/functions/webRTC";
import { Snippet } from "@nextui-org/snippet";
import { useEffect, useMemo, useRef, useState } from "react";

async function start(
  localVideo: HTMLVideoElement,
  remoteVideo: HTMLVideoElement,
  callback: (roomId: string) => void
) {
  const rtc = new WebRTC();
  rtc.checkConnectionState();
  const roomsManeger = new RoomsManeger();
  const media = new Media(localVideo, remoteVideo);
  await media.setupLocalStream();
  rtc.onTrack((event) => {
    const [remoteStream] = event.streams;
    console.log("onTrack", remoteStream);
    media.setRemoteSrcObject(remoteStream);
  });
  media.forEachTrack((track) => {
    rtc.peerConnection.addTrack(track, media.localStream);
  });

  // 新しい接続を開始するためのofferを作成する
  const offer = await rtc.createOffer();
  const roomWithOffer = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
  };
  const roomId = await roomsManeger.createRoom(roomWithOffer);
  callback(roomId);
  await rtc.setLocalDescription(offer);
  // roomにanswerがあれば、remoteDescriptionを設定する
  const roomRef = await roomsManeger.getDocRef(roomsManeger.roomsRef, roomId);
  roomsManeger.onDocumentSnapshot(roomRef, async (snapshot) => {
    const room = snapshot.data();
    if (!rtc.peerConnection.currentRemoteDescription && room?.answer) {
      console.log("getAnswer", room.answer);
      await rtc.setRemoteDescription(room.answer);
    }
  });
  // icecandidateを送信する
  const hostCollection = roomsManeger.addCollection(roomId, "host");
  rtc.onIceCandidate(async (candidate) => {
    console.log("onIceCandidate", candidate);
    await roomsManeger.addDoc(hostCollection, candidate);
  });

  // ice candidateを受信して追加する
  const guestCollection = roomsManeger.getCollection(roomId, "guest");
  roomsManeger.onQuerySnapshot(guestCollection, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("getIceCandidate", change.doc.data());
        const candidate = new RTCIceCandidate(change.doc.data());
        rtc.addIceCandidate(candidate);
      }
    });
  });
}

export default function HostRoomPage() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [roomId, setRoomId] = useState<string>("");

  const requestUrl = useMemo(() => {
    return roomId.length > 0
      ? `${window.location.origin}${siteConfig.pages.guest}?id=${roomId}`
      : "";
  }, [roomId]);

  useEffect(() => {
    (async () => {
      if (localVideoRef.current !== null && remoteVideoRef.current !== null) {
        start(localVideoRef.current, remoteVideoRef.current, setRoomId);
      }
    })();
  }, [localVideoRef, remoteVideoRef]);

  return (
    <>
      <div className="flex flex-wrap gap-4">
        <video
          id="localVideo"
          className="sm:w-full md:w-fit bg-slate-600"
          muted
          autoPlay
          playsInline
          ref={localVideoRef}
        />
        <video
          id="remoteVideo"
          className="sm:w-full md:w-fit bg-slate-600"
          autoPlay
          playsInline
          ref={remoteVideoRef}
        />
      </div>

      {requestUrl.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-2">Copy invite link.</h2>
          <Snippet
            hideSymbol
            variant="flat"
            color="primary"
            classNames={{ base: "max-w-full", pre: "truncate" }}
          >
            {requestUrl}
          </Snippet>
        </div>
      )}
    </>
  );
}
