import React from "react";
import {
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiMongodb,
  SiSupabase,
  SiExpress,
} from "react-icons/si";

function Skills() {
  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        { name: "TypeScript", icon: SiTypescript, level: 85 },
        { name: "React", icon: SiReact, level: 80 },
        { name: "React-Native", icon: SiReact, level: 60 },
        { name: "Next.js", icon: SiNextdotjs, level: 85 },
        { name: "Tailwind CSS", icon: SiTailwindcss, level: 95 },
      ],
    },
    {
      title: "Backend & Database",
      skills: [
        { name: "Node.js", icon: SiNodedotjs, level: 65 },
        { name: "Express.js", icon: SiExpress, level: 60 },
        { name: "MongoDB", icon: SiMongodb, level: 60 },
        { name: "Supabase", icon: SiSupabase, level: 90 },
      ],
    },
  ];

  return (
    <div className="w-full">
      <div>
        <h2 className="text-xl font-medium">Skills</h2>
      </div>
      <div className="pt-7 space-y-8">
        {skillCategories.map((category) => (
          <div key={category.title}>
            <h3 className="text-lg font-medium text-neutral-200 mb-4">
              {category.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="bg-neutral-900/10 rounded-lg p-4 hover:bg-neutral-900/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <skill.icon className="text-2xl text-neutral-200" />
                    <span className="font-medium text-neutral-200">
                      {skill.name}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-200 rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skills;
