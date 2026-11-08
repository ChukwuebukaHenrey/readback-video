// Regenerates narration audio + per-scene SRTs from narration/*.txt with edge-tts.
// Usage: node scripts/narration.mjs [voice]   (default en-NG-EzinneNeural, rate -5%)
// Needs `pip install -r video/requirements.txt`. Uses HTTPS_PROXY if set.
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import { basename } from "node:path";

const voice = process.argv[2] ?? "en-NG-EzinneNeural";
mkdirSync("public/audio", { recursive: true });
mkdirSync("public/captions", { recursive: true });

for (const file of readdirSync("narration").filter((f) => f.endsWith(".txt"))) {
  const id = basename(file, ".txt");
  const args = [
    "--voice",
    voice,
    "--rate=-5%",
    "--file",
    `narration/${file}`,
    "--write-media",
    `public/audio/${id}.mp3`,
    "--write-subtitles",
    `public/captions/${id}.srt`,
  ];
  if (process.env.HTTPS_PROXY) args.push("--proxy", process.env.HTTPS_PROXY);
  execFileSync("edge-tts", args, { stdio: "inherit" });
  console.log(`✓ ${id}`);
}
