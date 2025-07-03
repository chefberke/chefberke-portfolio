import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://berkekanber.com"),
  title: {
    default:
      "Berke Kanber - Software Developer | React, Next.js, Node.js Developer",
    template: "%s | Berke Kanber",
  },
  description:
    "Berke Kanber - İzmir merkezli tutkulu bir Software Developer. React, Next.js, Node.js ve React Native teknolojileriyle ölçeklenebilir ve kullanıcı odaklı uygulamalar geliştiriyorum.",
  keywords: [
    "Berke Kanber",
    "Software Developer",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "React Native Developer",
    "İzmir Developer",
    "Turkey Developer",
    "Frontend Developer",
    "Backend Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "Web Developer",
    "Mobile Developer",
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
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/chefberke.png", sizes: "32x32", type: "image/png" },
      { url: "/chefberke.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/chefberke.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/chefberke.png",
    },
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    alternateLocale: "en_US",
    url: "https://berkekanber.com",
    siteName: "Berke Kanber Portfolio",
    title:
      "Berke Kanber - Software Developer | React, Next.js, Node.js Developer",
    description:
      "İzmir merkezli Software Developer. React, Next.js, Node.js ve React Native ile modern web ve mobil uygulamalar geliştiriyorum.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Berke Kanber - Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Berke Kanber - Software Developer",
    description:
      "İzmir merkezli Software Developer. React, Next.js, Node.js ve React Native ile modern uygulamalar geliştiriyorum.",
    creator: "@berkekanber",
    images: ["/api/og"],
  },
  alternates: {
    canonical: "https://berkekanber.com",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Berke Kanber",
    jobTitle: "Software Developer",
    description:
      "İzmir merkezli Software Developer. React, Next.js, Node.js ve React Native ile modern web ve mobil uygulamalar geliştiriyorum.",
    url: "https://berkekanber.com",
    image: "https://berkekanber.com/chefberke.png",
    sameAs: [
      "https://github.com/chefberke",
      "https://linkedin.com/in/berkekanber",
      "https://twitter.com/berkekanber",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "İzmir",
      addressCountry: "TR",
    },
    knowsAbout: [
      "React",
      "Next.js",
      "Node.js",
      "React Native",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "MongoDB",
      "Supabase",
    ],
  };

 return (
  <html lang="tr">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="canonical" href="https://berkekanber.com" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </head>
    <body className={`${poppins.variable} antialiased`}>
      {children}

      {/* 🔍 Microsoft Clarity Tracking Script */}
      <Script
        id="clarity-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "s98l1nhz1k");
          `,
        }}
      />
    </body>
  </html>
);
}
