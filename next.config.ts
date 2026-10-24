import type { NextConfig } from "next";

// A static site: `next build` writes plain HTML to out/, which GitHub Pages serves at the root of
// danibapsilva.github.io. trailingSlash makes /work/escrow a folder with an index.html, which Pages expects.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
