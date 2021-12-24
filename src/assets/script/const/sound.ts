import OkSound from '@/assets/sound/ok.mp3';
import CancelSound from '@/assets/sound/cancel.mp3';
import WarnSound from '@/assets/sound/warn.mp3';

/**
 * 効果音クラス
 */
class Sound {
  /**
   * コンストラクター
   * @param src ファイルURL
   */
  public constructor(src: string,
    private sound: HTMLAudioElement = new Audio()) {
    this.sound.src = src;
    this.sound.load();
  }
  /**
   * 再生実行
   */
  public play(): void {
    this.sound.currentTime = 0;
    this.sound.play();
  }
  /**
   * ボリューム設定
   * @param volume ボリューム
   */
  public set volume(volume: number) {
    this.sound.volume = volume;
  }
  /**
   * ボリューム取得
   * @returns ボリューム
   */
  public get volume(): number {
    return this.sound.volume;
  }
}

export const ok = new Sound(OkSound);
export const cancel = new Sound(CancelSound);
export const warn = new Sound(WarnSound);
