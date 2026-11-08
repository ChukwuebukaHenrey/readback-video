import type { Caption } from "@remotion/captions";
import type { SendVariant } from "./config";

export type Announcement = {
  scene: number;
  fromSec: number;
  toSec: number;
  text: string;
};

export type SceneData = {
  durationInFrames: number;
  audio: string;
  /** Length of the screen recording, when `useClips` is on. */
  clipFrames: number;
  captions: Caption[];
};

export type ReadbackDemoProps = {
  sendVariant: SendVariant;
  /** Use screen recordings from /public/clips instead of the design mockups. */
  useClips: boolean;
  // Filled in by calculateMetadata:
  scenes?: SceneData[];
  announcements?: Announcement[];
};
