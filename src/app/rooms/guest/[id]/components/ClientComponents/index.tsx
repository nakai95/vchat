"use client";
import { useWebRTC, useMedia, useRooms } from "@/src/app/hooks";
import { useCallback, useEffect } from "react";
import { Menu } from "./components";
import { Guest } from "@/src/types";
import { MicIcon, MicOffIcon } from "@/src/components/icons";
import HangUpModal from "@/src/components/HangUpModal";
import { Spinner } from "@nextui-org/spinner";

export function ClientComponents(props: {
  roomId: string;
  addRoomGuest: (roomId: string, data: Guest) => void;
}) {
  const { roomId, addRoomGuest } = props;
  const { getRoom, updateRoom, onSnapshotHost } = useRooms();
  const { peerConnection, closePeerConnection, isLoading, isDisconnected } =
    useWebRTC();
  const {
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
  } = useMedia();

  const handleHangUp = useCallback(() => {
    closePeerConnection();
    removeRemoteSrcObject();
    stopUserMedia();
  }, [closePeerConnection, removeRemoteSrcObject, stopUserMedia]);

  const handleBeforeUnloadEvent = useCallback(
    (_: BeforeUnloadEvent): void => {
      closePeerConnection();
      removeRemoteSrcObject();
      stopUserMedia();
    },
    [closePeerConnection, removeRemoteSrcObject, stopUserMedia]
  );

  useEffect(() => {
    (async () => {
      if (
        !peerConnection ||
        (localVideoRef.current === null && remoteVideoRef.current === null)
      )
        return;
      await setupMedia();
      peerConnection.ontrack = (event) => {
        const [remoteStream] = event.streams;
        setRemoteSrcObject(remoteStream);
      };
      addTracks((track, localStream) => {
        peerConnection.addTrack(track, localStream);
      });
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          addRoomGuest(roomId, event.candidate.toJSON());
        }
      };
      const room = await getRoom(roomId);
      peerConnection.setRemoteDescription(room.offer);
      const answer = await peerConnection.createAnswer();
      await updateRoom(roomId, {
        answer: { type: answer.type, sdp: answer.sdp },
      });
      peerConnection.setLocalDescription(answer);
      onSnapshotHost(roomId, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            peerConnection.addIceCandidate(candidate);
          }
        });
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerConnection, localVideoRef, remoteVideoRef]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnloadEvent);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnloadEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-5/6 flex justify-center bg-primary-50">
        <video
          id="remoteVideo"
          className="object-cover"
          autoPlay
          playsInline
          ref={remoteVideoRef}
        />
        <div className="absolute top-0 right-0 ">
          <div className="relative border-1 border-default-600 bg-black">
            <video
              id="localVideo"
              className="h-36 w-auto"
              muted
              autoPlay
              playsInline
              ref={localVideoRef}
            />
            <div className="absolute bottom-1 right-1 rounded-md bg-gray-700 bg-opacity-25">
              {isMute ? <MicOffIcon className="text-red-500" /> : <MicIcon />}
            </div>
          </div>
        </div>
        {isLoading && (
          <Spinner className="absolute m-auto top-0 bottom-0 right-0 left-0 " />
        )}
      </div>
      <div className="w-full h-1/6 py-6">
        <Menu
          isMute={isMute}
          isVideoOff={isVideoOff}
          onHangUp={handleHangUp}
          onClickMic={handleSwitchMic}
          onClickVideo={handleSwitchVideo}
        />
      </div>
      {isDisconnected && <HangUpModal onClose={handleHangUp} />}
    </div>
  );
}
