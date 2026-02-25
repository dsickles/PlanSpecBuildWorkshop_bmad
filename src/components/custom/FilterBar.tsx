"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilterState } from "@/hooks/useFilterState";
import { RED_GHOST_BUTTON_STYLES } from "@/lib/constants";

interface FilterBarProps {
    projects: string[];
    domains: string[];
    techStacks: string[];
}

export function FilterBar({ projects, domains, techStacks }: FilterBarProps) {
    const {
        activeProject,
        activeDomains,
        activeTech,
        setProject,
        toggleDomain,
        toggleTech,
        clearAllFilters,
    } = useFilterState();

    return (
        <div className="flex flex-col gap-3 mb-10 overflow-x-auto pb-2">
            {/* Projects Row */}
            <div className="flex items-center gap-3">
                <span className="w-16 flex-shrink-0 text-[10px] uppercase text-zinc-600 font-semibold tracking-wider">
                    Projects
                </span>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setProject(null)}
                        aria-pressed={!activeProject}
                        className={cn(
                            "px-4 py-1.5 text-sm rounded-full transition-colors border filter-pill",
                            !activeProject
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-300"
                        )}
                    >
                        All
                    </button>
                    {projects.map((project) => (
                        <button
                            key={project}
                            onClick={() => setProject(project)}
                            aria-pressed={activeProject === project}
                            className={cn(
                                "px-4 py-1.5 text-sm rounded-full transition-colors border filter-pill",
                                activeProject === project
                                    ? "bg-blue-600 border-blue-600 text-white"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-300"
                            )}
                        >
                            {project}
                        </button>
                    ))}

                    {/* Clear Filter Button */}
                    {(activeProject || activeDomains.length > 0 || activeTech.length > 0) && (
                        <button
                            onClick={clearAllFilters}
                            className={cn(
                                "ml-2 px-3 py-1.5 text-sm rounded-full transition-colors border flex items-center gap-1",
                                RED_GHOST_BUTTON_STYLES
                            )}
                            title="Clear Filter"
                            aria-label="Clear all filters"
                        >
                            <X className="w-3.5 h-3.5" />
                            <span>Clear Filter</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Domain Row */}
            <div className="flex items-start md:items-center gap-3">
                <span className="w-16 flex-shrink-0 text-[10px] items-center pt-2 md:pt-0 uppercase text-zinc-600 font-semibold tracking-wider">
                    Domain
                </span>
                <div className="flex flex-wrap items-center gap-2">
                    {domains.map((domain) => {
                        const isActive = activeDomains.includes(domain);
                        return (
                            <button
                                key={domain}
                                onClick={() => toggleDomain(domain)}
                                aria-pressed={isActive}
                                className={cn(
                                    "px-3 py-1 text-sm rounded-md transition-colors border chip-toggle",
                                    isActive
                                        ? "bg-zinc-800 border-zinc-700 text-white"
                                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-300"
                                )}
                            >
                                {domain}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tech Stack Row */}
            <div className="flex items-start md:items-center gap-3">
                <span className="w-16 flex-shrink-0 text-[10px] pt-2 md:pt-0 uppercase text-zinc-600 font-semibold tracking-wider">
                    Tech
                </span>
                <div className="flex flex-wrap items-center gap-2">
                    {techStacks.map((tech) => {
                        const isActive = activeTech.includes(tech);
                        return (
                            <button
                                key={tech}
                                onClick={() => toggleTech(tech)}
                                aria-pressed={isActive}
                                className={cn(
                                    "px-3 py-1 text-sm rounded-md transition-colors border chip-toggle",
                                    isActive
                                        ? "bg-zinc-800 border-zinc-700 text-white"
                                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-300"
                                )}
                            >
                                {tech}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

