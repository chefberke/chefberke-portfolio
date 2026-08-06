import type { Metadata } from "next";
import localFont from "next/font/local";
import { rootStyle } from "@/lib/tokens";
import { SITE_URL } from "@/lib/site";
import "@/styles/globals.css";

/**
 * Ioskeley Mono sets the entire page. It is an Iosevka build drawn to sit
 * close to Berkeley Mono -- narrow, even, with square punctuation and a
 * single-storey g -- and it is what makes a page of labels and dates line up
 * into columns without a table being drawn around them.
 *
 * The files are vendored under app/fonts rather than pulled from a CDN, so the
 * page has no third-party request in its critical path. The license they ship
 * under (SIL OFL 1.1) sits beside them in that folder.
 */
const ioskeleyMono = localFont({
  // Regular only. Nothing on this page is bold -- it separates things by color
  // and position instead of by weight -- and next/font preloads every face it
  // is given, so a second file would be half a megabyte fetched to be unused.
  src: "./fonts/IoskeleyMono-Regular.woff2",
  weight: "400",
  variable: "--font-ioskeley",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

/**
 * Geist Pixel Square, loaded for exactly one string: the name in the header.
 *
 * The file is vendored rather than taken from the `geist` package, because that
 * package's pixel entry point instantiates all five pixel faces -- Square,
 * Grid, Circle, Line, Triangle -- and the browser fetches every one of them.
 * Five downloads to set two words is not a trade worth making.
 */
const geistPixelSquare = localFont({
  src: "./fonts/GeistPixel-Square.woff2",
  variable: "--font-pixel-square",
  weight: "500",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  // The metrics of a pixel face are nothing like the fallback's, and Next's
  // computed size-adjust makes the swap worse rather than better.
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Berke Kanber | Full Stack Developer",
    template: "%s | Berke Kanber",
  },
  description:
    "Berke Kanber is a full stack developer building fast, accessible web apps and design systems with Next.js, React, and TypeScript.",
  applicationName: "Berke Kanber",
  authors: [{ name: "Berke Kanber", url: SITE_URL }],
  creator: "Berke Kanber",
  publisher: "Berke Kanber",
  keywords: [
    "Berke Kanber",
    "Full Stack Developer",
    "Full Stack Web Developer",
    "Frontend Developer",
    "Design System Engineer",
    "Web Developer",
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "Berke Kanber",
    title: "Berke Kanber | Full Stack Developer",
    description:
      "Berke Kanber is a full stack developer building fast, accessible web apps and design systems with Next.js, React, and TypeScript.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Berke Kanber",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Berke Kanber | Full Stack Developer",
    description:
      "Berke Kanber is a full stack developer building fast, accessible web apps and design systems with Next.js, React, and TypeScript.",
    // The handle as it is on X -- and as the footer links to it. A card
    // attributed to an account that does not exist is dropped, not guessed at.
    creator: "@chef_berke",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Publishes the lib/tokens.ts palette as CSS variables. */}
        <style dangerouslySetInnerHTML={{ __html: rootStyle }} />
        {/*
         * The home-screen icon, as a tag rather than as app/apple-icon.png or a
         * `metadata.icons` entry, for two reasons.
         *
         * A static file under app/ is not prerendered: Next serves it from a
         * Node function that reads it off disk, and the Cloudflare build
         * refuses every function that is not Edge. Under public/ it is copied
         * as a plain asset and no function is made. (icon.tsx keeps its own
         * route because an ImageResponse is rendered at build time.)
         *
         * And `metadata.icons` replaces the file convention rather than adding
         * to it -- declaring the apple icon there drops the favicon link that
         * icon.tsx generates, hash and all.
         */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${ioskeleyMono.variable} ${geistPixelSquare.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
