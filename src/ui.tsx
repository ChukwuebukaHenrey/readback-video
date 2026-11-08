// Small shared UI pieces: lower-third, announcement card, demo banner, labels.
import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, EASE_OUT } from "./config";
import { FONT_FAMILY } from "./fonts";
import type { Announcement } from "./types";

const ease = Easing.bezier(...EASE_OUT);

/** 0→1 ease-out fade/slide over `durationFrames`, starting at `start`. */
export const useEnter = (start: number, durationFrames = 12) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + durationFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};

/** Fades in at `from`, out at `to` (frames). */
export const useWindow = (from: number, to: number, fade = 10) => {
  const frame = useCurrentFrame();
  if (to - from < 2) return 0;
  if (to - from < fade * 2) fade = Math.max(1, Math.floor((to - from) / 2));
  return interpolate(frame, [from, from + fade, to - fade, to], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};

export const LowerThird: React.FC<{ index: number; title: string }> = ({
  index,
  title,
}) => {
  const { fps } = useVideoConfig();
  const o = useWindow(6, Math.round(fps * 4.2), 12);
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        top: 64,
        opacity: o,
        transform: `translateX(${(1 - o) * -24}px)`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 24px 12px 14px",
        borderRadius: 999,
        background: COLORS.cream,
        boxShadow: "0 10px 30px rgba(28,20,17,0.25)",
        fontFamily: FONT_FAMILY,
        color: COLORS.ink,
      }}
    >
      <span
        style={{
          width: 44,
          height: 44,
          borderRadius: 999,
          background: COLORS.strongOrange,
          color: "white",
          display: "grid",
          placeItems: "center",
          fontWeight: 700,
          fontSize: 22,
        }}
      >
        {index}
      </span>
      <span style={{ fontWeight: 650, fontSize: 32 }}>{title}</span>
    </div>
  );
};

export const AnnouncementCard: React.FC<{ items: Announcement[] }> = ({
  items,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const a = items.find((x) => t >= x.fromSec - 0.4 && t < x.toSec + 0.4);
  const fromF = a ? Math.round(a.fromSec * fps) : 0;
  const toF = a ? Math.round(a.toSec * fps) : 0;
  const o = useWindow(fromF, toF, 8);
  if (!a) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 72,
        top: 64,
        width: 560,
        opacity: o,
        transform: `translateY(${(1 - o) * -12}px)`,
        padding: "18px 24px 22px",
        borderRadius: 20,
        background: "rgba(255,247,242,0.97)",
        border: `2px solid ${COLORS.strongOrange}`,
        boxShadow: "0 16px 40px rgba(28,20,17,0.3)",
        fontFamily: FONT_FAMILY,
        color: COLORS.ink,
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: COLORS.strongOrange,
          marginBottom: 8,
        }}
      >
        Announcement
      </div>
      <div style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.3 }}>
        {a.text}
      </div>
    </div>
  );
};

export const DemoBanner: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      padding: "12px 0",
      background: COLORS.ink,
      color: COLORS.cream,
      textAlign: "center",
      fontFamily: FONT_FAMILY,
      fontWeight: 600,
      fontSize: 26,
    }}
  >
    Demo account. Fictional data. Nothing is sent to Solana.
  </div>
);

/** Small corner tag so mockups and illustrations are never mistaken for the live app. */
export const SourceTag: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      right: 28,
      bottom: 24,
      padding: "6px 14px",
      borderRadius: 999,
      background: "rgba(28,20,17,0.6)",
      color: "rgba(255,247,242,0.9)",
      fontFamily: FONT_FAMILY,
      fontSize: 18,
      fontWeight: 500,
    }}
  >
    {text}
  </div>
);

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      background: "white",
      borderRadius: 28,
      boxShadow: "0 30px 80px rgba(28,20,17,0.35)",
      fontFamily: FONT_FAMILY,
      color: COLORS.ink,
      ...style,
    }}
  >
    {children}
  </div>
);
