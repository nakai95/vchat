import { addRoomGuest } from "@/src/app/actions";
import { ClientComponents } from "./components";

export default function GuestRoomPage({ params }: { params: { id: string } }) {
  return (
    <>
      <ClientComponents roomId={params.id} addRoomGuest={addRoomGuest} />
    </>
  );
}
