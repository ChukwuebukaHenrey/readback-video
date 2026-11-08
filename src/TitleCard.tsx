import React from "react";
import { AbsoluteFill, Audio, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./Captions";
import { COLORS } from "./config";
import { FONT_FAMILY } from "./fonts";
import type { SceneData } from "./types";
import { useEnter } from "./ui";

// Revealed group by group, in time with the narration ("AI understands. Code verifies. ...").
const GROUPS = [
  { text: "AI understands", at: 0.2 },
  { text: "→ code verifies", at: 1.4 },
  { text: "→ you approve", at: 2.6 },
  { text: "→ Solana settles.", at: 3.8 },
];

const Mark: React.FC = () => (
  <svg width="92" height="92" viewBox="0 0 92 92" aria-hidden>
    <rect width="92" height="92" rx="24" fill={COLORS.ink} />
    {[22, 40, 58].map((y) => (
      <polygon
        key={y}
        points={`26,${y + 12} 34,${y} 70,${y} 62,${y + 12}`}
        fill={COLORS.orange}
      />
    ))}
  </svg>
);

const Group: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const { fps } = useVideoConfig();
  const o = useEnter(Math.round(at * fps), 12);
  return (
    <span
      style={{
        opacity: o,
        display: "inline-block",
        transform: `translateY(${(1 - o) * 14}px)`,
        marginRight: 18,
      }}
    >
      {text}
    </span>
  );
};

export const TitleCard: React.FC<{ data: SceneData }> = ({ data }) => {
  const { fps } = useVideoConfig();
  const logo = useEnter(Math.round(5.2 * fps), 14);
  const footer = useEnter(Math.round(7.2 * fps), 14);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.cream,
        fontFamily: FONT_FAMILY,
        color: COLORS.ink,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <div style={{ marginTop: -120 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 650,
            maxWidth: 1500,
            lineHeight: 1.3,
          }}
        >
          {GROUPS.map((g) => (
            <Group key={g.text} {...g} />
          ))}
        </div>
        <div
          style={{
            marginTop: 70,
            opacity: logo,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
          }}
        >
          <Mark />
          <span
            style={{
              fontSize: 96,
              fontWeight: 750,
              color: COLORS.orange,
              letterSpacing: -2,
            }}
          >
            Readback
          </span>
        </div>
        <div style={{ marginTop: 34, opacity: footer }}>
          <div
            style={{
              fontSize: 40,
              fontWeight: 600,
              color: COLORS.strongOrange,
            }}
          >
            readback-two.vercel.app
          </div>
          <div style={{ fontSize: 30, marginTop: 12, color: "#6b5a52" }}>
            Devnet prototype · Not audited
          </div>
        </div>
      </div>
      <Captions captions={data.captions} />
      <Audio src={staticFile(data.audio)} />
    </AbsoluteFill>
  );
};
