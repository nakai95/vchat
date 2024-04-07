"use server";
import { HOST_PATH, ROOMS_PATH } from "@/src/constant";
import { adminDB as db } from "@/src/lib/firebase/server";
import { Host } from "@/src/types";

/**
 * roomのhostを追加する
 * @param roomId
 */
export async function addRoomHost(roomId: string, data: Host) {
  console.log("addRoomHost", roomId);
  const docRef = db.collection(ROOMS_PATH).doc(roomId);
  docRef.collection(HOST_PATH).add(data);
}
