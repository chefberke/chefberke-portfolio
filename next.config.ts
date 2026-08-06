import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * The build is a folder of finished files, written to `out/`.
   *
   * Nothing on this site is answered at request time. Every page is
   * prerendered, and so is every card, the icon, `robots.txt` and
   * `sitemap.xml`. An adapter that wraps that output in a server is wrapping
   * nothing -- and the one that used to, `@cloudflare/next-on-pages`, is
   * deprecated and no longer reads what Next 16 emits: it dropped the three
   * cards, the icon, the robots file and the sitemap out of the build without
   * naming one of them, and then refused the build outright over the
   * `/blog/[slug]/opengraph-image` route it could not classify. Exporting says
   * the thing the site already is, and hands Pages a directory to serve.
   *
   * It is also a tripwire. A route that reads the filesystem or the network on
   * request now fails `next build` by name, where before it built cleanly and
   * broke at the deploy -- or worse, silently.
   */
  output: "export",

  images: {
    /*
     * There is no image optimizer at the other end of this build. Pages serves
     * files, so `next/image` hands over the file in `public/` as it stands,
     * measures it, and reserves its box -- which is the half of that component
     * this site was using anyway. The deploy has been serving the source bytes
     * for `/_next/image` for as long as it has been on Cloudflare; this only
     * stops asking for something that was never coming back.
     *
     * The one consequence to watch: a source image is now served at its full
     * weight to every box it is drawn in, so an image belongs in `public/` at
     * roughly the size it is read at.
     */
    unoptimized: true,
  },
};

export default nextConfig;
