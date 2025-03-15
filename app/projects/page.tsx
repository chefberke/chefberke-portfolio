import React from "react";
import { FaGithub } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";

function Projects() {
  const projects = [
    {
      title: "Üniversite Değerlendir",
      alt: "university rate app",
      imageLink: "/unidegerlendir.svg",
      description: `
        A platform for anonymous rating and reviewing of universities in Turkey. Users can share their experiences through comments and ratings, helping prospective students make informed decisions. Features modern UI/UX and real-time updates.
      `,
      github: "https://github.com/chefberke/universite-degerlendir",
      liveDemo: "https://universite-degerlendir.vercel.app",
    },
    {
      title: "Spotiwrap",
      alt: "spotify tracks app",
      imageLink: "/spotiwrap.svg",
      description: `
        An open-source alternative to Spotify Wrapped that analyzes users' top tracks, artists, and genres. Provides interactive and visually appealing insights into listening habits with optimized performance and seamless API integration.
      `,
      github: "https://github.com/lumi-work/spotiwrap",
      liveDemo: "https://spoti-wrap.vercel.app/",
    },
    {
      title: "git.cow",
      alt: "github profile analytics",
      imageLink: "/git-cow.svg",
      description: `
        A developer tool for analyzing GitHub activity and project metrics. Visualizes repositories, commits, and contributions through intuitive graphs, helping users track their open-source engagement effectively.
      `,
      github: "https://github.com/lumi-work/git.cow",
      liveDemo: "https://git-cow.vercel.app",
    },
    {
      title: "Lumi UI",
      alt: "ui component library",
      imageLink: "/lumi-ui.png",
      description: `
        A modern and customizable UI component library for React and Next.js projects. Offers reusable components built with performance and accessibility in mind, designed for easy integration with minimal setup.
      `,
      github: "https://github.com/lumi-work/lumi.ui",
      liveDemo: "https://github.com/lumi-work/lumi.ui",
    },
    {
      title: "Lumi Kanban",
      alt: "kanban board",
      imageLink: "/lumi-kanban.svg",
      description: `
        An intuitive task management tool featuring drag-and-drop functionality and real-time updates. Adapts to different workflows with a dynamic UI, making team collaboration and work organization effortless.
      `,
      github: "https://github.com/lumi-work/lumi-kanban",
      liveDemo: "https://github.com/lumi-work/lumi-kanban",
    },
  ];

  return (
    <div className="w-full">
      <div>
        <h2 className="text-xl font-medium">Projects</h2>
      </div>
      <div className="pt-7 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {projects.map((project, index) => (
          <div
            key={index}
            className="w-full bg-neutral-900/10 rounded-lg p-6 hover:bg-neutral-900/30 transition-all flex flex-col h-full"
          >
            <div className="relative w-full h-48 mb-4 flex-shrink-0">
              <img
                src={project.imageLink}
                alt={project.alt}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-4 flex-shrink-0">
              <h3 className="font-medium text-lg text-white truncate max-w-[250px]">
                {project.title}
              </h3>
              <span className="text-xs text-neutral-400 bg-neutral-800/50 px-2 py-0.5 rounded-full truncate max-w-[200px]">
                {project.alt}
              </span>
            </div>
            <div className="mb-6 flex-grow">
              {project.description.split("\n").map((line, index) => (
                <span
                  key={index}
                  className="font-light text-gray-400 text-sm block leading-relaxed"
                >
                  {line.trim()}
                </span>
              ))}
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <a
                href={project.github}
                target="_blank"
                className="bg-neutral-800 text-[0.9rem] text-neutral-200 rounded-md py-0.5 px-2 flex items-center gap-2 hover:bg-neutral-700 transition-all"
              >
                <FaGithub />
                Source
              </a>
              {project.liveDemo && project.liveDemo !== project.github && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  className="bg-neutral-800 text-[0.9rem] text-neutral-200 rounded-md py-0.5 px-2 flex items-center gap-2 hover:bg-neutral-700 transition-all"
                >
                  <TbWorld />
                  Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
