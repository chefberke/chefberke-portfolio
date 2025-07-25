import Image from "next/image";
import React from "react";
import { HoverLinkPreview } from "../ui/hover-link-preview";

function Education() {
  return (
    <div className="flex flex-col items-start justify-center w-full pt-8">
      <div>
        <h1 className="text-neutral-500 text-sm">EDUCATION</h1>
      </div>
      <div className="pt-3.5">
        <div className="flex items-start justify-start gap-2">
          <div className="flex items-center justify-center w-10 h-10">
            <Image
              src="/ieu-logo.png"
              alt="experience-1"
              width={30}
              height={30}
            />
          </div>
          <div>
            <div className="font-medium text-neutral-700">
              Computer Programming
            </div>
            <div className="text-sm text-gray-500">
              <div>
                <HoverLinkPreview
                  href="https://ieu.edu.tr"
                  previewImage="/ieu-logo.png"
                  imageAlt="Izmir University of Economics"
                >
                  Izmir University of Economics
                </HoverLinkPreview>{" "}
                | Sep 2023 - Jun 2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Education;
