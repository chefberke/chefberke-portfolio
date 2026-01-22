import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://berkekanber.com"),
  title: {
    default: "Berke Kanber | Software Developer",
    template: "%s | Berke Kanber",
  },
  description:
    "Berke Kanber is a full stack and frontend developer building fast, accessible web apps and design systems with Next.js, React, and TypeScript.",
  applicationName: "Berke Kanber",
  authors: [{ name: "Berke Kanber", url: "https://berkekanber.com" }],
  creator: "Berke Kanber",
  publisher: "Berke Kanber",
  keywords: [
    "Berke Kanber",
    "Software Developer",
    "Full Stack Developer",
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
    title: "Berke Kanber | Software Developer",
    description:
      "Berke Kanber is a full stack and frontend developer building fast, accessible web apps and design systems with Next.js, React, and TypeScript.",
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
    title: "Berke Kanber | Software Developer",
    description:
      "Berke Kanber is a full stack and frontend developer building fast, accessible web apps and design systems with Next.js, React, and TypeScript.",
    creator: "@berkekanber",
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
  icons: {
    icon: "/images/xrew.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
