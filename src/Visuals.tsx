import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Loop,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, type Visual } from "./config";

const CROSSFADE = 12;

/** One still image with a slow drift (no zoom). */
const Still: React.FC<{ visual: Visual; length: number; index: number }> = ({
  visual,
  length,
  index,
}) => {
  const frame = useCurrentFrame();
  const src = staticFile(visual.src);
  const dir = index % 2 === 0 ? 1 : -1;
  // Slight constant oversize so the drift never shows an edge.
  const drift = interpolate(frame, [0, length], [-18 * dir, 18 * dir]);

  if (visual.fit === "cover") {
    return (
      <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
        <Img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(1.04) translateY(${drift}px)`,
          }}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "blur(40px) brightness(0.55)",
          transform: "scale(1.15)",
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Img
          src={src}
          style={{
            maxWidth: "90%",
            maxHeight: "86%",
            objectFit: "contain",
            borderRadius: 24,
            boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
            transform: `translateY(${drift * 0.5}px)`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Splits the scene evenly between its images, cross-fading between them. */
export const Visuals: React.FC<{ visuals: Visual[]; dim?: number }> = ({
  visuals,
  dim = 0,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const seg = durationInFrames / visuals.length;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: dim > 0 ? "blur(10px)" : undefined }}>
        {visuals.map((v, i) => {
          const start = i * seg;
          const end = (i + 1) * seg;
          const opacity =
            i === 0
              ? 1
              : interpolate(
                  frame,
                  [start - CROSSFADE / 2, start + CROSSFADE / 2],
                  [0, 1],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                );
          if (frame < start - CROSSFADE || frame > end + CROSSFADE) return null;
          return (
            <AbsoluteFill key={v.src} style={{ opacity }}>
              <Still visual={v} length={durationInFrames} index={i} />
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>
      {dim > 0 ? (
        <AbsoluteFill style={{ backgroundColor: `rgba(28,20,17,${dim})` }} />
      ) : null}
    </AbsoluteFill>
  );
};

/** A screen recording, muted, cover-fit, looped if shorter than the scene. */
export const Clip: React.FC<{
  src: string;
  clipFrames: number;
  dim?: number;
}> = ({ src, clipFrames, dim = 0 }) => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      <Loop
        durationInFrames={Math.max(1, Math.min(clipFrames, durationInFrames))}
      >
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Loop>
      {dim > 0 ? (
        <AbsoluteFill style={{ backgroundColor: `rgba(28,20,17,${dim})` }} />
      ) : null}
    </AbsoluteFill>
  );
};
