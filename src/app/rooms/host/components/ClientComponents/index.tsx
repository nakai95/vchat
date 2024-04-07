"use client";
import { useWebRTC, useMedia, useRooms } from "@/src/app/hooks";
import { useEffect } from "react";
import { Menu } from "./components";
import { Host, Room } from "@/src/types";
import { Snippet } from "@nextui-org/snippet";
import { siteConfig } from "@/src/config/site";
import { MicIcon, MicOffIcon } from "@/src/components/icons";

export function ClientComponents(props: {
  createRoom: (room: Room) => Promise<string>;
  deleteRoom: (roomId: string) => void;
  addRoomHost: (roomId: string, data: Host) => void;
}) {
  const { createRoom, deleteRoom, addRoomHost } = props;
  const { roomId, setRoomId, onSnapshotRoom, onSnapshotGuest } = useRooms();
  const { peerConnection } = useWebRTC();
  const {
    localVideoRef,
    remoteVideoRef,
    isMute,
    isVideoOff,
    setupMedia,
    addTracks,
    setRemoteSrcObject,
    handleSwitchMic,
    handleSwitchVideo,
  } = useMedia();

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
      const offer = await peerConnection.createOffer();
      if (offer) {
        const roomId = await createRoom({
          offer: { type: offer.type, sdp: offer.sdp },
        });
        setRoomId(roomId);
        peerConnection.setLocalDescription(offer);
        onSnapshotRoom(roomId, (snapshot) => {
          const room = snapshot.data();
          if (!peerConnection.currentRemoteDescription && room?.answer) {
            peerConnection.setRemoteDescription(room.answer);
          }
        });
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            addRoomHost(roomId, event.candidate.toJSON());
          }
        };
        onSnapshotGuest(roomId, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const candidate = new RTCIceCandidate(change.doc.data());
              peerConnection.addIceCandidate(candidate);
            }
          });
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerConnection, localVideoRef, remoteVideoRef]);

  useEffect(() => {
    return () => {
      if (roomId) {
        deleteRoom(roomId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-5/6 flex justify-center bg-primary-50">
        <video
          id="remoteVideo"
          className="object-cover relative"
          autoPlay
          playsInline
          ref={remoteVideoRef}
        />
        <div className="absolute w-full bottom-0 left-0 ">
          {roomId.length > 0 && (
            <div className="flex items-center justify-between gap-4 p-2">
              <Snippet
                hideSymbol
                variant="solid"
                color="primary"
                tooltipProps={{
                  content: "Copy Invite Link",
                }}
                classNames={{ base: "w-60", pre: "truncate" }}
              >
                {`${window.location.origin}${siteConfig.pages.guest}/${roomId}`}
              </Snippet>
              {/* {remoteVideoRef.current?.srcObject && (
                <div className="p-2 rounded-md bg-gray-700 bg-opacity-25">
                  {isRemoteMute ? (
                    <MicOffIcon className="text-red-500" />
                  ) : (
                    <MicIcon />
                  )}
                </div>
              )} */}
            </div>
          )}
        </div>
      </div>
      <div className="absolute top-0 right-0">
        <div className="relative">
          <video
            id="localVideo"
            className="h-36 w-auto border-1 border-default-600"
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
      <div className="w-full h-1/6 py-6">
        <Menu
          isMute={isMute}
          isVideoOff={isVideoOff}
          onHangUp={() => deleteRoom(roomId)}
          onClickMic={handleSwitchMic}
          onClickVideo={handleSwitchVideo}
        />
      </div>
    </div>
  );
}
