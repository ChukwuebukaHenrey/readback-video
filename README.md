# Readback demo video

A Remotion project for the ~1:53 Readback demo video (1920×1080, 30 fps), built from the
prompt in [`DEMO_VIDEO.md`](DEMO_VIDEO.md) §7. Narration is edge-tts (`en-NG-EzinneNeural`),
captions are burned in, and a whole-video `.srt` is exported separately.

## Commands

```console
npm i --loglevel=error         # install
npm run dev                    # Remotion Studio preview
npm run render                 # → out/readback-demo.mp4 (h264, crf 18)
npm run render:srt             # → out/readback-demo.srt
npm run narration              # regenerate public/audio + public/captions from narration/*.txt
```

Props (set in Studio or with `--props`):

- `sendVariant`: `"b"` (demo account, default) or `"a"` (real Devnet transfer; only if you recorded one).
  For `"a"`, use `node scripts/render-srt.mjs a` for the matching `.srt`.
- `useClips`: `false` (default) shows the design mockups from `Images/` plus drawn illustrations.
  Set `true` once real screen recordings exist at `public/clips/s01.mp4 … s07.mp4`.

## Layout

```
narration/           n01…n08 narration text (exactly what goes to edge-tts)
public/audio/        edge-tts narration mp3s
public/captions/     edge-tts per-scene SRTs
public/visuals/      mockups copied from Images/
public/fonts/        Onest variable font (latin)
public/announcements.json   "Announcement" overlay text per scene
src/config.ts        scenes, colours, timings
src/Root.tsx         composition + calculateMetadata (durations from audio)
src/ReadbackDemo.tsx scenes in a TransitionSeries with 10-frame fades
src/Scene.tsx        visuals + narration + captions + lower-third + overlays
src/Overlays.tsx     drawn illustrations (8-of-10 counter, send flow, refusals, lookalike)
src/TitleCard.tsx    scene 8
scripts/             narration + whole-video SRT
```

## Before submitting

- Mockup and illustration shots carry a small "Design mockup" / "Illustration" tag. Replace them
  with real screen recordings (`useClips: true`) when you have them.
- `public/announcements.json` text is written to match the narration. Check it against the app's
  real screen-reader announcements and edit it to match.
- See the checklist at the end of `DEMO_VIDEO.md`.
