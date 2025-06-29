import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

function About() {
  return (
    <div className="flex flex-col items-start justify-center w-full pt-8">
      <div>
        <h1 className="text-neutral-500 text-sm">ABOUT</h1>
      </div>
      <div className="pt-2">
        <p className="text-neutral-600 font-medium">
          A passionate Software Developer based in İzmir, Turkiye, building
          scalable, efficient, and user-focused applications using technologies
          like React, Next.js, Node.js and React Native Enjoys exploring new
          tools to create seamless user experiences and solving real-world
          problems with clean, maintainable code.
        </p>
      </div>
      <Button className="mt-4 flex items-center gap-2 bg-neutral-200 text-neutral-700 hover:cursor-pointer hover:bg-neutral-300 transition-all duration-300">
        <Link
          href={"/cv.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2"
        >
          <span className="font-semibold">Open CV</span>
          <ArrowUpRight />
        </Link>
      </Button>
    </div>
  );
}

export default About;
