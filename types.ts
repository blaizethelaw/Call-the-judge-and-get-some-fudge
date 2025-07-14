
export type Page = 'menu' | 'soundboard' | 'fudgeFury' | 'dmSlide';

export interface SoundClip {
  start: number;
  end: number;
}

export interface SoundboardItem extends SoundClip {
  id: number;
  text: string;
  color: string;
  speaker: 'The Fudge Judge' | 'Papa Pardon';
}

export interface FudgeItem {
  id: number;
  x: number;
  y: number;
  type: 'fudge' | 'obstacle';
  speed: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AudioControls {
  playClip: (clip: SoundClip) => void;
  isAudioReady: boolean;
  isAudioPlaying: boolean;
}

export interface PageProps {
  setCurrentPage: (page: Page) => void;
  audioControls: AudioControls;
}
