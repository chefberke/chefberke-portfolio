import Image from "next/image";
import React from "react";

function AboutUpper() {
  return (
    <div className="flex flex-col items-start justify-center w-full">
      <div>
        <Image
          src="/chefberke.png"
          alt="Berke Kanber"
          width={100}
          height={100}
        />
      </div>
      <div className="pt-2">
        <h1 className="text-3xl font-bold text-neutral-700">
          Hey, I&apos;m Berke.
        </h1>
        <p className="font-medium text-gray-500 pt-0.5">A Software Developer</p>
      </div>
    </div>
  );
}

export default AboutUpper;
