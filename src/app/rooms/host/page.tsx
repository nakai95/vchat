import { addRoomHost, createRoom, deleteRoom } from "@/src/app/actions";
import { ClientComponents } from "./components";

export default function HostRoomPage() {
  return (
    <>
      <ClientComponents
        createRoom={createRoom}
        deleteRoom={deleteRoom}
        addRoomHost={addRoomHost}
      />
    </>
  );
}
