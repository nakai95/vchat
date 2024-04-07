"use client";

import { GUEST_PATH, HOST_PATH, ROOMS_PATH } from "@/src/constant";
import { db } from "@/src/lib/firebase/client";
import { Room } from "@/src/types";
import {
  DocumentData,
  DocumentSnapshot,
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";

/**
 * roomsを管理するカスタムフック
 * @param id roomのid 招待された場合は指定する
 * @returns
 */
export const useRooms = (id?: string) => {
  const [roomId, setRoomId] = useState<string>(id || "");

  const getRoom = async (id: string): Promise<DocumentData> => {
    const docRef = doc(db, ROOMS_PATH, id);
    const roomSnap = await getDoc(docRef);
    const room = roomSnap.data();
    if (!room) {
      throw new Error("Room not found");
    }
    return room;
  };

  const updateRoom = async (id: string, room: Room) => {
    const docRef = doc(db, ROOMS_PATH, id);
    await updateDoc(docRef, room);
  };

  const onSnapshotRoom = async (
    id: string,
    callback: (snapshot: DocumentSnapshot) => void
  ) => {
    const docRef = doc(db, ROOMS_PATH, id);
    onSnapshot(docRef, callback);
  };

  const onSnapshotHost = async (
    id: string,
    callback: (snapshot: QuerySnapshot<DocumentData>) => void
  ) => {
    const docRef = doc(db, ROOMS_PATH, id);
    const collectionRef = collection(docRef, HOST_PATH);
    onSnapshot(collectionRef, callback);
  };

  const onSnapshotGuest = async (
    id: string,
    callback: (snapshot: QuerySnapshot<DocumentData>) => void
  ) => {
    const docRef = doc(db, ROOMS_PATH, id);
    const collectionRef = collection(docRef, GUEST_PATH);
    onSnapshot(collectionRef, callback);
  };

  return {
    roomId,
    setRoomId,
    getRoom,
    updateRoom,
    onSnapshotRoom,
    onSnapshotHost,
    onSnapshotGuest,
  };
};
