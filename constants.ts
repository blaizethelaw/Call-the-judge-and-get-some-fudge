import { SoundboardItem, SoundClip } from './types';

export const SOUNDBOARD_ITEMS: SoundboardItem[] = [
  { id: 1, text: "Call the judge and get some fudge.", start: 1.88, end: 3.943, color: "bg-purple-500", speaker: 'The Fudge Judge' },
  { id: 2, text: "Call the judge... fudge?", start: 4.063, end: 5.565, color: "bg-blue-500", speaker: 'Papa Pardon' },
  { id: 3, text: "Are you okay?", start: 6.106, end: 6.647, color: "bg-blue-500", speaker: 'Papa Pardon' },
  { id: 4, text: "Nope.", start: 7.067, end: 8.189, color: "bg-purple-500", speaker: 'The Fudge Judge' },
  { id: 5, text: "Are you a doctor?", start: 8.429, end: 9.511, color: "bg-purple-500", speaker: 'The Fudge Judge' },
  { id: 6, text: "Your DM?", start: 14.077, end: 15.299, color: "bg-blue-500", speaker: 'Papa Pardon' },
  { id: 7, text: "You trying to slide in the DMs?", start: 18.003, end: 20.727, color: "bg-blue-500", speaker: 'Papa Pardon' },
  { id: 8, text: "PARDON?!", start: 15.98, end: 17.983, color: "bg-purple-500", speaker: 'The Fudge Judge' },
];

export const GAME_SOUNDS: { [key: string]: SoundClip } = {
  START: { start: 1.88, end: 2.681 }, // "Call the judge"
  GAME_OVER: { start: 15.98, end: 17.983 }, // "PARDON?!"
  FUDGE_SUCCESS: { start: 3.783, end: 3.943 }, // "fudge."
  FUDGE_FAIL: { start: 8.209, end: 8.409 }, // "No?"
};

export const CHAT_SOUNDS: { [key: string]: SoundClip } = {
  MESSAGE_SENT: { start: 14.318, end: 15.299 }, // "DM?"
  MESSAGE_RECEIVED: { start: 10.432, end: 10.753 }, // "Maybe."
};
