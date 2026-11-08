import { parseSrt } from "@remotion/captions";
import {
  getAudioDurationInSeconds,
  getVideoMetadata,
} from "@remotion/media-utils";
import React from "react";
import { CalculateMetadataFunction, Composition, staticFile } from "remotion";
import {
  FPS,
  HEIGHT,
  SCENE_PADDING_FRAMES,
  SCENES,
  TITLE_SCENE,
  TRANSITION_FRAMES,
  WIDTH,
} from "./config";
import { fontLoaded } from "./fonts";
import { ReadbackDemo } from "./ReadbackDemo";
import type { Announcement, ReadbackDemoProps, SceneData } from "./types";

const loadScene = async (
  narration: string,
  clip: string | null,
): Promise<SceneData> => {
  const audio = `audio/${narration}.mp3`;
  const [seconds, srt, clipSeconds] = await Promise.all([
    getAudioDurationInSeconds(staticFile(audio)),
    fetch(staticFile(`captions/${narration}.srt`)).then((r) => r.text()),
    clip
      ? getVideoMetadata(staticFile(clip)).then((m) => m.durationInSeconds)
      : 0,
  ]);
  return {
    audio,
    durationInFrames: Math.ceil(seconds * FPS) + SCENE_PADDING_FRAMES,
    captions: parseSrt({ input: srt }).captions,
    clipFrames: Math.floor(clipSeconds * FPS),
  };
};

const calculateMetadata: CalculateMetadataFunction<ReadbackDemoProps> = async ({
  props,
}) => {
  await fontLoaded;
  const scenes = await Promise.all([
    ...SCENES.map((s) =>
      loadScene(s.narration(props.sendVariant), props.useClips ? s.clip : null),
    ),
    loadScene(TITLE_SCENE.narration, null),
  ]);
  const announcements: Announcement[] = await fetch(
    staticFile("announcements.json"),
  ).then((r) => r.json());

  const total =
    scenes.reduce((sum, s) => sum + s.durationInFrames, 0) -
    TRANSITION_FRAMES * (scenes.length - 1);

  return {
    durationInFrames: total,
    props: { ...props, scenes, announcements },
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ReadbackDemo"
      component={ReadbackDemo}
      durationInFrames={FPS * 120}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={
        { sendVariant: "b", useClips: false } satisfies ReadbackDemoProps
      }
      calculateMetadata={calculateMetadata}
    />
  );
};
