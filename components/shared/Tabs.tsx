"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import RoughUnderline from "@/components/shared/RoughUnderline";

export interface ExperienceItem {
  company: string;
  roles: ExperienceRole[];
}

export interface ProjectItem {
  title: string;
  description: string;
  badges: string[];
  github?: string;
  view?: string;
}

export interface ExperienceRole {
  title: string;
  description: string;
  date: string;
}

type TabsProps = {
  experiences: ExperienceItem[];
  projects: ProjectItem[];
};

const TAB_ITEMS = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
] as const;

type TabId = (typeof TAB_ITEMS)[number]["id"];

export default function Tabs({ experiences, projects }: TabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("experience");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-4" role="tablist" aria-label="Profile sections">
        {TAB_ITEMS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-button-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tab-${tab.id}`}
              className={`transition-all duration-300 cursor-pointer ${
                isActive
                  ? "text-neutral-100 text-[13px] font-medium"
                  : "text-neutral-500 text-[12px]"
              }`}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <div
          id="tab-experience"
          role="tabpanel"
          aria-labelledby="tab-button-experience"
          className={`flex flex-col gap-5 transition-all duration-300 ease-out ${
            activeTab === "experience"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none absolute inset-0"
          }`}
        >
          {experiences.map((item, index) => (
            <div key={`${item.company}-${index}`} className="flex flex-col gap-2">
              <div className="flex flex-col gap-3">
                {item.roles.map((role, roleIndex) => (
                  <div
                    key={`${item.company}-${role.title}-${roleIndex}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="text-neutral-100 text-[14px] font-medium sm:min-w-0 sm:flex-1">
                        {role.title} at{" "}
                        <span className="text-neutral-100">
                          <RoughUnderline>{item.company}</RoughUnderline>
                        </span>
                      </h3>
                      <span className="text-neutral-500 text-[11px] font-mono sm:shrink-0 sm:whitespace-nowrap">
                        {role.date}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-[13px] leading-5">{role.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          id="tab-projects"
          role="tabpanel"
          aria-labelledby="tab-button-projects"
          className={`flex flex-col gap-5 transition-all duration-300 ease-out ${
            activeTab === "projects"
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none absolute inset-0"
          }`}
        >
          {projects.map((item, index) => {
            const githubLink = item.github?.trim();
            const viewLink = item.view?.trim();

            return (
              <div key={`${item.title}-${index}`} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-neutral-100 text-[14px] font-medium">{item.title}</h3>
                  <div className="flex gap-2">
                    {githubLink && (
                      <Link
                        href={githubLink}
                        className="text-neutral-500 text-[11px] font-medium transition-all duration-300 hover:text-neutral-100 cursor-pointer inline-flex items-center gap-1"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`Open ${item.title} on GitHub`}
                      >
                        GitHub
                        <ArrowUpRight size={12} className="text-current" />
                      </Link>
                    )}
                    {viewLink && (
                      <Link
                        href={viewLink}
                        className="text-neutral-500 text-[11px] font-medium transition-all duration-300 hover:text-neutral-100 cursor-pointer inline-flex items-center gap-1"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`View ${item.title}`}
                      >
                        View
                        <ArrowUpRight size={12} className="text-current" />
                      </Link>
                    )}
                  </div>
                </div>
                <p className="text-neutral-300 text-[13px] leading-5">{item.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {item.badges.map((badge, badgeIndex) => (
                    <span 
                      key={badgeIndex} 
                      className="text-neutral-500 text-[11px] font-mono"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
