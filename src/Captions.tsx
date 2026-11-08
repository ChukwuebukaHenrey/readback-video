import type { Caption } from "@remotion/captions";
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "./config";
import { FONT_FAMILY } from "./fonts";

/** Renders one SRT cue at a time: bottom-centred, max 2 lines, no karaoke. */
export const Captions: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  // Cues from edge-tts overlap by ~50ms; take the latest one that has started.
  const active = [...captions]
    .reverse()
    .find((c) => ms >= c.startMs && ms < c.endMs);
  if (!active) return null;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 56,
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          padding: "14px 30px",
          borderRadius: 18,
          background: COLORS.captionBox,
          color: "white",
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          fontSize: 44,
          lineHeight: 1.25,
          textAlign: "center",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {active.text.trim()}
      </div>
    </AbsoluteFill>
  );
};
