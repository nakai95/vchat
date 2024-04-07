"use server";
import { ROOMS_PATH } from "@/src/constant";
import { adminDB as db } from "@/src/lib/firebase/server";
import { Room } from "@/src/types";

/**
 * roomを作成する
 * @param room
 * @returns roomId
 */
export async function createRoom(room: Room) {
  const docRef = await db.collection(ROOMS_PATH).add(room);
  console.log("createRoom", docRef.id);
  return docRef.id;
}
