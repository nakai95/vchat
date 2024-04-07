"use server";
import { ROOMS_PATH } from "@/src/constant";
import { adminDB as db } from "@/src/lib/firebase/server";
/**
 * roomを削除する
 * サブコレクションがある場合は再帰的に削除する
 * @param roomId
 */
export async function deleteRoom(roomId: string) {
  console.log("deleteRoom", roomId);
  const docRef = db.collection(ROOMS_PATH).doc(roomId);
  await db.recursiveDelete(docRef);
}
