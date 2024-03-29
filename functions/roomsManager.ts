import { db } from "@/src/lib/firebase/firebase";
import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  onSnapshot,
  DocumentReference,
  Query,
  QuerySnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import { CollectionReference, DocumentData } from "firebase/firestore";

/**
 * firestoreでroomsを管理するクラス
 */
export class RoomsManeger {
  roomsRef: CollectionReference<DocumentData, DocumentData>;
  roomId: string;

  constructor() {
    this.roomsRef = collection(db, "rooms");
    this.roomId = "";
  }

  /**
   * roomを作成する
   * @param data
   * @returns
   */
  async createRoom(data: DocumentData) {
    const docRef = await addDoc(this.roomsRef, data);
    this.roomId = docRef.id;
    return this.roomId;
  }

  /**
   * queryをonSnapshotする
   * @param query
   * @param callback
   */
  onQuerySnapshot(
    query: Query<DocumentData, DocumentData>,
    callback: (snapshot: QuerySnapshot<DocumentData, DocumentData>) => void
  ) {
    onSnapshot(query, callback);
  }

  /**
   * documentをonSnapshotする
   * @param ref
   * @param callback
   */
  onDocumentSnapshot(
    ref: DocumentReference<DocumentData, DocumentData>,
    callback: (snapshot: DocumentSnapshot) => void
  ) {
    onSnapshot(ref, callback);
  }

  /**
   * roomIdからroomを取得する
   * @param id
   * @returns
   */
  async getRoom(id: string) {
    const docRef = doc(db, "rooms", id);
    const roomSnap = await getDoc(docRef);
    const room = roomSnap.data();
    if (!room) {
      throw new Error("Room not found");
    }
    return room;
  }

  /**
   * roomを更新する
   * @param data
   * @returns
   */
  async updateRoom(roomId: string, data: DocumentData) {
    const docRef = doc(db, "rooms", roomId);
    await updateDoc(docRef, data);
  }

  /**
   * roomにcollectionを追加する
   * @param roomId
   * @param collectionName
   * @returns
   */
  addCollection(roomId: string, collectionName: string) {
    const docRef = doc(db, "rooms", roomId);
    const collectionRef = collection(docRef, collectionName);
    console.log("check collectionRef", collectionRef);
    return collectionRef;
  }

  /**
   * collectionを取得する
   * @param roomId
   * @param collectionName
   * @returns
   */
  getCollection(roomId: string, collectionName: string) {
    const docRef = doc(db, "rooms", roomId);
    const collectionRef = collection(docRef, collectionName);
    return collectionRef;
  }

  /**
   * collectionにdocumentを追加する
   * @param collectionRef
   * @param data
   * @returns
   */
  async addDoc(
    collectionRef: CollectionReference<DocumentData>,
    data: DocumentData
  ) {
    await addDoc(collectionRef, data);
  }

  /**
   * documentを取得する
   * @param collectionRef
   * @param id
   */
  async getDocRef(
    collectionRef: CollectionReference<DocumentData>,
    id: string
  ) {
    return doc(collectionRef, id);
  }
}
