"use server";
import { GUEST_PATH, ROOMS_PATH } from "@/src/constant";
import { adminDB as db } from "@/src/lib/firebase/server";
import { Guest } from "@/src/types";

/**
 * roomのguestを追加する
 * @param roomId
 */
export async function addRoomGuest(roomId: string, data: Guest) {
  console.log("addRoomGuest", roomId);
  const docRef = db.collection(ROOMS_PATH).doc(roomId);
  docRef.collection(GUEST_PATH).add(data);
}
