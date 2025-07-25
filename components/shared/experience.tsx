import Image from "next/image";
import React from "react";
import { HoverLinkPreview } from "../ui/hover-link-preview";

interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  companyUrl: string;
  period: string;
  description: string;
  logo: string;
  logoAlt: string;
}

const experiences: ExperienceItem[] = [
  {
    id: 1,
    title: "Software Engineer Intern",
    company: "Mavera Technology Software",
    companyUrl: "http://www.maveratechnology.com",
    period: "Jul 2025 - Present",
    description:
      "Developing web and mobile applications using React, Next.js, and Node.js. Contributing to AI-powered projects.",
    logo: "/mavera.jpeg",
    logoAlt: "Mavera Technology Software",
  },
  {
    id: 2,
    title: "Software Developer",
    company: "Lumi Works",
    companyUrl: "https://github.com/lumi-work",
    period: "Sep 2024 - Jul 2025",
    description:
      "Led development of web and mobile applications, focusing on improving functionality and user experience.",
    logo: "/lumi-works.svg",
    logoAlt: "Lumi Works",
  },
];

function Experience() {
  return (
    <div className="flex flex-col items-start justify-center w-full pt-8">
      <div>
        <h1 className="text-neutral-500 text-sm">EXPERIENCE</h1>
      </div>
      <div className="pt-3.5 space-y-6">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="flex items-start justify-start gap-4"
          >
            <div className="flex items-center justify-center w-12 h-12">
              <Image
                src={experience.logo}
                alt={experience.logoAlt}
                width={25}
                height={25}
              />
            </div>
            <div>
              <div className="font-medium text-neutral-700">
                {experience.title}
              </div>
              <div className="text-sm text-gray-500">
                <div>
                  <HoverLinkPreview
                    href={experience.companyUrl}
                    previewImage={experience.logo}
                    imageAlt={experience.logoAlt}
                  >
                    {experience.company}
                  </HoverLinkPreview>{" "}
                  | {experience.period}
                </div>
              </div>
              <div className="text-sm text-gray-700 pt-1">
                <p>{experience.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Experience;
