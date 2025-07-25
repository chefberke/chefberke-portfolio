import React from "react";

function Stack() {
  const technologies = [
    "Next.js",
    "React",
    "React Native",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "PostgreSQL",
    "MongoDB",
  ];

  return (
    <div className="flex flex-col items-start justify-center w-full pt-8">
      <div className="w-full">
        <h1 className="text-neutral-500 text-sm mb-6">SKILLS / STACK</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="px-2 py-1 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-100 hover:border-neutral-200 transition-all duration-200 ease-in-out"
            >
              <span className="text-neutral-600 text-sm font-medium">
                {tech}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Stack;
