"use client";

import { useState } from "react";
import Image from "next/image";
import { RefreshCw } from "lucide-react";
import DeveloperTitle from "@/components/shared/DeveloperTitle";

type ProfileHeaderProps = {
  name: string;
  titles: string[];
};

const LOGOS = ["chefberke", "xrew"] as const;

export default function ProfileHeader({ name, titles }: ProfileHeaderProps) {
  const [logoIndex, setLogoIndex] = useState(0);
  const currentLogo = LOGOS[logoIndex];
  const altText =
    logoIndex === 0
      ? `${name} profile photo`
      : `${name} alternate profile photo`;

  const toggleLogo = () => {
    setLogoIndex((prev) => (prev + 1) % LOGOS.length);
  };

  return (
    <header className="flex gap-4">
      <div className="relative overflow-hidden rounded-lg">
        <Image
          key={currentLogo}
          src={`/images/${currentLogo}.jpg`}
          alt={altText}
          width={80}
          height={80}
          className="rounded-lg fade-in"
          priority
          onContextMenu={(event) => event.preventDefault()}
        />
      </div>
      <div className="flex flex-col justify-between h-[80px]">
        <button
          onClick={toggleLogo}
          className="cursor-pointer text-neutral-400 hover:text-neutral-100 transition-all duration-300"
          title="Change logo"
          type="button"
        >
          <RefreshCw size={12} className="text-current" />
        </button>
        <div className="flex flex-col items-start">
          <h1 className="text-[17px] font-semibold tracking-tight text-neutral-100">
            {name}
          </h1>
          <div className="text-[13px] text-neutral-400 leading-tight">
            <DeveloperTitle titles={titles} />
          </div>
        </div>
      </div>
    </header>
  );
}
