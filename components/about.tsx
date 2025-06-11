import React from "react";
import CvButton from "@/components/cv-button";
import Image from "next/image";
import Avatar from "../public/chefberke2.png";

function About() {
  return (
    <div>
      <div>
        <h2 className="text-xl font-medium">About</h2>
      </div>
      <div className="pt-7">
        <div className="flex items-center gap-4">
          <div>
            <Image
              src={Avatar}
              width={55}
              height={55}
              alt="chefberke-avatar"
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <h2 className="font-medium text-neutral-50">Berke Kanber</h2>
            <p className="font-light text-neutral-300">Software Developer</p>
          </div>
        </div>
        <p className="font-light text-gray-200 pt-7">
          Hi, I&apos;m Berke Kanber, a passionate Software Developer based in İzmir, Turkiye. I build scalable, efficient, and user-focused applications using technologies like React, Next.js, Node.js, and Express.

I enjoy exploring new tools to create seamless user experiences and solving real-world problems with clean, maintainable code.

        </p>
      </div>
      <div className="pt-5">
        <CvButton />
      </div>
      {/* <div className="pt-7">
        <GithubCal />
      </div> */}
    </div>
  );
}

export default About;
