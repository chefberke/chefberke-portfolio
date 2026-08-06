import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Next 16 refuses any `quality` that is not on this list, and the list
     * defaults to 75 alone. 75 is the right default for a photograph that fills
     * a screen; it is the wrong one for a 48px portrait, where the whole face
     * is carried by a few hundred pixels and the encoder has almost nothing to
     * work with. At 75 the only photo on this page came out under 1.5KB and
     * looked it.
     *
     * 90 is still a lossy encode -- it is not "off" -- but it leaves the eyes
     * and the edge of the face intact, and it costs a few kilobytes on a page
     * that loads exactly one image.
     */
    qualities: [75, 90],
  },
};

export default nextConfig;
