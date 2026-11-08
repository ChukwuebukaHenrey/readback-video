// Scene configuration for the Readback demo video.
// Each scene's length comes from its narration audio (see calculateMetadata in Root.tsx).

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const SCENE_PADDING_FRAMES = 12;
export const TRANSITION_FRAMES = 10;

export const COLORS = {
  orange: "#ec5a17", // large text only
  strongOrange: "#c2410c",
  ink: "#1c1411",
  cream: "#fff7f2",
  captionBox: "rgba(28,20,17,0.82)",
  alert: "#b42318",
};

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export type SendVariant = "a" | "b";

export type Visual = {
  /** Path under /public. */
  src: string;
  /** "cover" fills the frame; "contain" shows the whole image over a blurred copy. */
  fit: "cover" | "contain";
};

export type Overlay = "counter" | "sendFlow" | "refusals" | "lookalike" | null;

export type SceneConfig = {
  id: number;
  title: string;
  narration: (variant: SendVariant) => string; // id like "n04b"
  /**
   * Screen recording under /public/clips. When `useClips` is on, it replaces the
   * visuals below. Until real recordings exist, the design mockups are used.
   */
  clip: string;
  visuals: Visual[];
  overlay: Overlay;
  /** Show the "Demo account" banner (honesty rule 2). */
  demoBanner?: (variant: SendVariant) => boolean;
};

export const SCENES: SceneConfig[] = [
  {
    id: 1,
    title: "The problem",
    narration: () => "n01",
    clip: "clips/s01.mp4",
    visuals: [
      { src: "visuals/hero.png", fit: "contain" },
      { src: "visuals/benefits.png", fit: "cover" },
    ],
    overlay: "counter",
  },
  {
    id: 2,
    title: "Meet Readback",
    narration: () => "n02",
    clip: "clips/s02.mp4",
    visuals: [
      { src: "visuals/features.png", fit: "cover" },
      { src: "visuals/how-it-works.png", fit: "cover" },
    ],
    overlay: null,
  },
  {
    id: 3,
    title: "Getting in",
    narration: () => "n03",
    clip: "clips/s03.mp4",
    visuals: [
      { src: "visuals/mission.png", fit: "cover" },
      { src: "visuals/dark-landing.png", fit: "contain" },
    ],
    overlay: null,
  },
  {
    id: 4,
    title: "Send, read back, confirm",
    narration: (v) => (v === "a" ? "n04a" : "n04b"),
    clip: "clips/s04.mp4",
    visuals: [{ src: "visuals/more-features.png", fit: "cover" }],
    overlay: "sendFlow",
    demoBanner: (v) => v === "b",
  },
  {
    id: 5,
    title: "It refuses unsafe requests",
    narration: () => "n05",
    clip: "clips/s05.mp4",
    visuals: [{ src: "visuals/principles.png", fit: "cover" }],
    overlay: "refusals",
  },
  {
    id: 6,
    title: "Scam protection",
    narration: () => "n06",
    clip: "clips/s06.mp4",
    visuals: [{ src: "visuals/stay-in-control.png", fit: "contain" }],
    overlay: "lookalike",
  },
  {
    id: 7,
    title: "Built for access",
    narration: () => "n07",
    clip: "clips/s07.mp4",
    visuals: [
      { src: "visuals/interaction.png", fit: "cover" },
      { src: "visuals/your-way-in.png", fit: "contain" },
    ],
    overlay: null,
  },
];

/** Scene 8: closing title card (no clip). */
export const TITLE_SCENE = { id: 8, title: "Readback", narration: "n08" };
