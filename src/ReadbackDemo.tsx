import { fade } from "@remotion/transitions/fade";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, SCENES, TRANSITION_FRAMES } from "./config";
import { Scene } from "./Scene";
import { TitleCard } from "./TitleCard";
import type { ReadbackDemoProps } from "./types";

export const ReadbackDemo: React.FC<ReadbackDemoProps> = ({
  sendVariant,
  useClips,
  scenes,
  announcements = [],
}) => {
  if (!scenes) return null; // filled in by calculateMetadata
  const title = scenes[scenes.length - 1];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      <TransitionSeries>
        {SCENES.map((config, i) => (
          <React.Fragment key={config.id}>
            <TransitionSeries.Sequence
              durationInFrames={scenes[i].durationInFrames}
            >
              <Scene
                config={config}
                data={scenes[i]}
                sendVariant={sendVariant}
                useClips={useClips}
                announcements={announcements}
              />
            </TransitionSeries.Sequence>
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
            />
          </React.Fragment>
        ))}
        <TransitionSeries.Sequence durationInFrames={title.durationInFrames}>
          <TitleCard data={title} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
