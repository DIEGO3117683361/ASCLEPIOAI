export enum InteractionStatus {
  IDLE = 'IDLE',
  INITIALIZING = 'INITIALIZING',
  AWAKENING = 'AWAKENING',
  LISTENING = 'LISTENING',
  THINKING = 'THINKING',
  SPEAKING = 'SPEAKING',
  SLEEPING = 'SLEEPING',
  ERROR = 'ERROR',
  AWAITING_CONTINUATION = 'AWAITING_CONTINUATION',
}

export enum BoardContentType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  GUITAR_FRETBOARD = 'GUITAR_FRETBOARD',
  YOUTUBE_VIDEO = 'YOUTUBE_VIDEO',
  WEB_ARTICLE = 'WEB_ARTICLE',
  CODE = 'CODE',
  FLASHCARDS = 'FLASHCARDS',
  QUIZ = 'QUIZ',
  PRESENTATION = 'PRESENTATION',
  WEB_PAGE = 'WEB_PAGE',
}

export interface BoardContent {
  type: BoardContentType;
  data: any; // Can be string for text/image, or object for others
}

export interface SpeechSegment {
  text: string;
  highlightId?: string | null;
}

export type Theme = 'light' | 'dark';

export interface UserInfo {
  name: string;
  occupation: string;
  preferences: string;
}

export interface Voice {
  name:string;
  lang: string;
  voiceURI: string;
}

export interface BackgroundSetting {
  type: 'default' | 'color' | 'image';
  value: string; // URL for image, hex code for color
  blur?: number; // Optional blur level in pixels
}

export interface FaceCustomization {
  accessory: 'none' | 'glasses' | 'headphones' | 'hat';
  color: string;
  strokeWidth: number;
}

export interface Settings {
  theme: Theme;
  userInfo: UserInfo;
  voice: Voice | null;
  showSubtitles: boolean;
  background: BackgroundSetting;
  face: FaceCustomization;
}

export interface InteractionTurn {
  userInput: string;
  asclepioSpeech: SpeechSegment[];
  boardContent: BoardContent | null;
}

export interface ConversationSession {
  id: string;
  title: string;
  startTime: number; // Using number for Date.now()
  turns: InteractionTurn[];
}