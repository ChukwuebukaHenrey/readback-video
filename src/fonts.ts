import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FONT_FAMILY = "Onest";

// Onest variable font (weights 100-900), bundled locally from @fontsource-variable/onest.
export const fontLoaded = loadFont({
  family: FONT_FAMILY,
  url: staticFile("fonts/onest-latin-wght.woff2"),
  weight: "100 900",
});
