/**
 * Mediaクラス
 * メディアの設定を行う
 */
export class Media {
  localVideo: HTMLVideoElement;
  remoteVideo: HTMLVideoElement;
  localStream: MediaStream;

  constructor(localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) {
    this.localVideo = localVideo;
    this.remoteVideo = remoteVideo;
    // 仮で初期化
    this.localStream = new MediaStream();
  }

  /**
   * localStreamを設定する
   */
  async setupLocalStream() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    this.localVideo.srcObject = this.localStream;
    this.localVideo.addEventListener("loadedmetadata", () => {
      this.localVideo.play();
    });
    this.remoteVideo.addEventListener("loadedmetadata", () => {
      this.remoteVideo.play();
    });
  }

  /**
   * トラックごとにcallbackを実行する
   * @param callback
   */
  forEachTrack(callback: (track: MediaStreamTrack) => void) {
    this.localStream.getTracks().forEach(callback);
  }

  /**
   * remoteVideoにstreamを設定する
   */
  setRemoteSrcObject(stream: MediaStream) {
    this.remoteVideo.srcObject = stream;
  }
}
