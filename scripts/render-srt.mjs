// Builds one .srt for the whole video by joining the per-scene SRTs with offsets.
// Offsets match the composition: each scene = narration + 12 frames, minus a
// 10-frame cross-fade between scenes.
// Usage: node scripts/render-srt.mjs [a|b] [out/readback-demo.srt]
import { parseMedia } from "@remotion/media-parser";
import { nodeReader } from "@remotion/media-parser/node";
import { parseSrt, serializeSrt } from "@remotion/captions";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const FPS = 30;
const PADDING = 12;
const TRANSITION = 10;

const variant = process.argv[2] ?? "b";
const out = resolve(process.argv[3] ?? "out/readback-demo.srt");
const ids = [
  "n01",
  "n02",
  "n03",
  variant === "a" ? "n04a" : "n04b",
  "n05",
  "n06",
  "n07",
  "n08",
];

let offsetFrames = 0;
const lines = [];
for (const id of ids) {
  const { slowDurationInSeconds } = await parseMedia({
    src: resolve(`public/audio/${id}.mp3`),
    reader: nodeReader,
    fields: { slowDurationInSeconds: true },
    acknowledgeRemotionLicense: true,
  });
  const { captions } = parseSrt({
    input: readFileSync(`public/captions/${id}.srt`, "utf8"),
  });
  const offsetMs = (offsetFrames / FPS) * 1000;
  for (const c of captions) {
    lines.push([
      { ...c, startMs: c.startMs + offsetMs, endMs: c.endMs + offsetMs },
    ]);
  }
  offsetFrames += Math.ceil(slowDurationInSeconds * FPS) + PADDING - TRANSITION;
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, serializeSrt({ lines }));
console.log(`Wrote ${lines.length} captions to ${out}`);
