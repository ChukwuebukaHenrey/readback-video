import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Captions } from "./Captions";
import type { SceneConfig, SendVariant } from "./config";
import { Counter, Lookalike, Refusals, SendFlow } from "./Overlays";
import type { Announcement, SceneData } from "./types";
import { AnnouncementCard, DemoBanner, LowerThird, SourceTag } from "./ui";
import { Clip, Visuals } from "./Visuals";

const OVERLAYS = {
  counter: Counter,
  sendFlow: SendFlow,
  refusals: Refusals,
  lookalike: Lookalike,
};

/** Clip (or mockups) + narration + captions + lower-third + optional overlays. */
export const Scene: React.FC<{
  config: SceneConfig;
  data: SceneData;
  sendVariant: SendVariant;
  useClips: boolean;
  announcements: Announcement[];
}> = ({ config, data, sendVariant, useClips, announcements }) => {
  const Overlay = config.overlay ? OVERLAYS[config.overlay] : null;
  // Full-frame illustrations need the background pushed back.
  const dim = config.overlay && config.overlay !== "counter" ? 0.5 : 0;
  const mine = announcements.filter((a) => a.scene === config.id);

  return (
    <AbsoluteFill>
      {useClips ? (
        <Clip src={config.clip} clipFrames={data.clipFrames} />
      ) : (
        <Visuals visuals={config.visuals} dim={dim} />
      )}
      {!useClips && Overlay ? <Overlay /> : null}
      {!useClips ? (
        <SourceTag
          text={
            Overlay && config.overlay !== "counter"
              ? "Illustration"
              : "Design mockup"
          }
        />
      ) : null}
      {config.demoBanner?.(sendVariant) ? <DemoBanner /> : null}
      <LowerThird index={config.id} title={config.title} />
      <AnnouncementCard items={mine} />
      <Captions captions={data.captions} />
      <Audio src={staticFile(data.audio)} />
    </AbsoluteFill>
  );
};
