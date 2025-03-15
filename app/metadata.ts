import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berke Kanber | Full Stack Developer",
  description:
    "I'm Berke Kanber, a Full Stack Developer specializing in Next.js, React, TypeScript, and modern web technologies. View my portfolio showcasing innovative web projects and development expertise.",
  icons: {
    icon: "/chefberke.png",
  },
  keywords: [
    "Berke Kanber",
    "Full Stack Developer",
    "Software Engineer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Expert",
    "Frontend Developer",
    "Web Development",
    "UI/UX Developer",
    "JavaScript Developer",
    "Portfolio",
    "Modern Web Development",
    "Tailwind CSS",
    "Node.js",
    "MongoDB",
    "Supabase",
  ],
  authors: [{ name: "Berke Kanber" }],
  creator: "Berke Kanber",
  publisher: "Berke Kanber",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://berkekanber.com",
    siteName: "Berke Kanber",
    title: "Berke Kanber | Software Developer",
    description: "I'm Berke Kanber, a software developer specializing in Next.js, React, and modern web technologies. Explore my projects, skills, and experience.",
    images: [
      {
        url: "/chefberke.png",
        width: 1200,
        height: 630,
        alt: "Berke Kanber Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Berke Kanber | Software Developer",
    description: "I'm Berke Kanber, a software developer specializing in Next.js, React, and modern web technologies. Explore my projects, skills, and experience.",
    images: ["/chefberke.png"],
    creator: "@berkekanber",
  },
};