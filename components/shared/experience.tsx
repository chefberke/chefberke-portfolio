import Image from "next/image";
import React from "react";
import { HoverLinkPreview } from "../ui/hover-link-preview";

function Experience() {
  return (
    <div className="flex flex-col items-start justify-center w-full pt-8">
      <div>
        <h1 className="text-neutral-500 text-sm">EXPERIENCE</h1>
      </div>
      <div className="pt-3.5">
        <div className="flex items-start justify-start gap-4">
          <div className="flex items-center justify-center w-10 h-10">
            <Image
              src="/lumi-works.svg"
              alt="experience-1"
              width={30}
              height={30}
            />
          </div>
          <div>
            <div className="text-lg font-medium text-neutral-700">
              Software Developer
            </div>
            <div className="text-sm text-gray-500">
              <div>
                <HoverLinkPreview
                  href="https://github.com/lumi-work"
                  previewImage="/lumi-works.svg"
                  imageAlt="Lumi Works"
                >
                  Lumi Works
                </HoverLinkPreview>{" "}
                | 2024 - Present
              </div>
            </div>
            <div className="text-sm text-gray-700 pt-1">
              <p>
                I led the development of web and mobile applications at Lumi
                Works, focusing on improving functionality and user experience
                through clean, thoughtful design and implementation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experience;
