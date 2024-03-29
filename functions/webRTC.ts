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
    this.peerConnection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        callback(event.candidate.toJSON());
      }
    });
  }

  async onTrack(callback: (event: RTCTrackEvent) => void) {
    this.peerConnection.addEventListener("track", callback);
  }

  async checkConnectionState() {
    this.peerConnection.addEventListener("connectionstatechange", () => {
      console.log(
        "Connection state change:",
        this.peerConnection.connectionState
      );
    });
  }

  async close() {
    this.peerConnection.close();
  }
}
