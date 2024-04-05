import { on } from "events";

// Default configuration - Change these if you have a different STUN or TURN server.
const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

/**
 * peerConnectionを行うクラス
 */
export class WebRTC {
  peerConnection: RTCPeerConnection;
  constructor() {
    this.peerConnection = new RTCPeerConnection(configuration);
  }

  /**
   * 新しい接続を開始するためのofferを作成する
   * @returns
   */
  async createOffer() {
    const offer = await this.peerConnection.createOffer();
    return offer;
  }

  /**
   * offerに対するanswerを作成する
   * @returns
   */
  async createAnswer() {
    const answer = await this.peerConnection.createAnswer();
    return answer;
  }

  async setLocalDescription(description: RTCSessionDescriptionInit) {
    await this.peerConnection.setLocalDescription(description);
  }

  async setRemoteDescription(description: RTCSessionDescriptionInit) {
    console.log("setRemoteDescription", description);
    await this.peerConnection.setRemoteDescription(description);
  }

  async addIceCandidate(candidate: RTCIceCandidateInit) {
    await this.peerConnection.addIceCandidate(candidate);
  }

  async onIceCandidate(callback: (candidate: RTCIceCandidateInit) => void) {
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        callback(event.candidate.toJSON());
      }
    };
  }

  async onTrack(callback: (event: RTCTrackEvent) => void) {
    this.peerConnection.ontrack = callback;
  }

  async checkConnectionState({
    onConnected,
    onDisconnected,
  }: {
    onConnected: () => void;
    onDisconnected: () => void;
  }) {
    this.peerConnection.addEventListener("connectionstatechange", () => {
      console.log(
        "Connection state change:",
        this.peerConnection.connectionState
      );
      // connectedの場合イベントを発火する
      if (this.peerConnection.connectionState === "connected") {
        onConnected();
      }

      // disconnectedの場合は切断する
      if (this.peerConnection.connectionState === "disconnected") {
        onDisconnected();
      }
    });
  }

  async disconnect() {
    // Remove all event listeners
    this.peerConnection.ontrack = null;
    this.peerConnection.onicecandidate = null;
    this.peerConnection.oniceconnectionstatechange = null;
    this.peerConnection.onsignalingstatechange = null;

    // Close the connection
    this.peerConnection.close();
  }
}
