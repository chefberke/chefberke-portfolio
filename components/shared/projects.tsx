import React from "react";
import { ArrowUpRight, Github } from "lucide-react";
import Link from "next/link";
import { HoverLinkPreview } from "../ui/hover-link-preview";

function Projects() {
  const projects = [
    // {
    //   title: "git.cow",
    //   description:
    //     "A developer tool for analyzing GitHub activity and project metrics. Visualizes repositories, commits, and contributions through intuitive graphs, helping users track their open-source engagement effectively.",
    //   technologies: [
    //     "Next.js",
    //     "TypeScript",
    //     "Motion",
    //     "Tailwind CSS",
    //     "Supabase",
    //   ],
    //   githubUrl: "",
    //   liveUrl: "https://git-cow.vercel.app",
    //   previewImage: "/git-cow.svg",
    // },
    {
      title: "Gitcord",
      description:
        "A web application that allows developers to monitor and analyze all their GitHub repositories through real-time insights and unified analytics. It provides a centralized dashboard for tracking contributions, commits, stars, and repository performance—helping developers code smarter and make data-driven decisions.",
      technologies: [
        "Next.js",
        "Next.js API Routes",
        "TypeScript",
        "Motion",
        "Tailwind CSS",
        "MongoDB",
      ],
      githubUrl: "https://github.com/lumi-work/gitcord",
      liveUrl: "https://gitcord.pro",
      previewImage: "/gitcord.png",
    },
    {
      title: "Lumi",
      description:
        "An intuitive task management tool featuring drag-and-drop functionality and real-time updates. Adapts to different workflows with a dynamic UI, making team collaboration and work organization effortless.",
      technologies: [
        "Next.js",
        "Next.js API Routes",
        "TypeScript",
        "Socket IO",
        "Tailwind CSS",
        "MongoDB",
      ],
      githubUrl: "https://github.com/lumi-work/lumi-board",
      liveUrl: "https://lumi-board.vercel.app",
      previewImage: "/lumi-kanban.png",
    },
    {
      title: "Spotiwrap",
      description:
        "An open-source alternative to Spotify Wrapped that analyzes users' top tracks, artists, and genres. Provides interactive and visually appealing insights into listening habits with optimized performance and seamless API integration.",
      technologies: ["Next.js", "Typescript", "Tailwind CSS", "Supabase"],
      githubUrl: "https://github.com/lumi-work/spotiwrap",
      liveUrl: "https://spoti-wrap.vercel.app",
      previewImage: "/spotiwrap.svg",
    },
    {
      title: "Üniversite Değerlendir",
      description:
        "A platform for anonymous rating and reviewing of universities in Turkey. Users can share their experiences through comments and ratings, helping prospective students make informed decisions. Features modern UI/UX and real-time updates.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
      githubUrl: "https://github.com/chefberke/universite-degerlendir",
      liveUrl: "https://universite-degerlendir.vercel.app",
      previewImage: "/unidegerlendir.svg",
    },
  ];

  return (
    <div className="flex flex-col items-start justify-center w-full pt-8">
      <div>
        <h1 className="text-neutral-500 text-sm">PROJECTS</h1>
      </div>
      <div className="pt-3.5 w-full">
        <div className="space-y-6">
          {projects.map((project, index) => (
            <div key={index} className="group">
              <div className="flex flex-col space-y-3">
                <div className="flex items-start justify-between">
                  {project.liveUrl ? (
                    <HoverLinkPreview
                      href={project.liveUrl}
                      previewImage={project.previewImage}
                      imageAlt={`${project.title} preview`}
                    >
                      <h3 className="text-lg font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors duration-200">
                        {project.title}
                      </h3>
                    </HoverLinkPreview>
                  ) : (
                    <h3 className="text-lg font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors duration-200">
                      {project.title}
                    </h3>
                  )}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors duration-200"
                    >
                      <Github size={16} className="text-neutral-600" />
                    </Link>
                    {project.liveUrl && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-neutral-100 transition-colors duration-200"
                      >
                        <ArrowUpRight size={16} className="text-neutral-600" />
                      </Link>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded border border-neutral-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {index < projects.length - 1 && (
                <div className="mt-6 pt-6 border-b border-neutral-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Projects;
