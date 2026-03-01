"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilterState } from "@/hooks/useFilterState";
import { MUTED_GHOST_BUTTON_STYLES } from "@/lib/constants";

interface ProjectOption {
    slug: string;
    title: string;
}

interface FilterBarProps {
    projects: ProjectOption[];
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
        <div className="relative pt-v-rhythm mt-filter-collision md:mt-filter-collision-md flex flex-col gap-3 mb-v-rhythm overflow-x-auto pb-2">
            {/* Top Row: Clear Filter (Flex Centered & Aligned with Content via Design Tokens) */}
            {(activeProject || activeDomains.length > 0 || activeTech.length > 0) && (
                <div className="absolute top-0 left-filter-offset h-v-rhythm flex items-center z-10 animate-in fade-in slide-in-from-top-1 duration-200">
                    <button
                        onClick={clearAllFilters}
                        className={cn(
                            "px-3 py-1 text-[10px] uppercase font-bold tracking-tight rounded-md border flex items-center gap-1.5 shadow-sm",
                            MUTED_GHOST_BUTTON_STYLES
                        )}
                        title="Clear all filters and return to browse mode"
                        aria-label="Clear all filters"
                        aria-controls="discovery-grid"
                    >
                        <X className="w-3 h-3" />
                        <span>Clear Filter</span>
                    </button>
                </div>
            )}

            {/* Projects Row */}
            <div className="flex items-center gap-3">
                <span className="w-16 flex-shrink-0 text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                    Projects
                </span>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setProject(null)}
                        aria-pressed={!activeProject}
                        className={cn(
                            "px-4 py-1.5 text-sm rounded-full transition-all border filter-pill",
                            !activeProject
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "bg-muted/50 border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        All
                    </button>
                    {projects.map((project) => (
                        <button
                            key={project.slug}
                            onClick={() => setProject(project.slug)}
                            aria-pressed={activeProject === project.slug}
                            className={cn(
                                "px-4 py-1.5 text-sm rounded-full transition-all border filter-pill",
                                activeProject === project.slug
                                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                    : "bg-muted/50 border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            {project.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Domain Row */}
            <div className="flex items-start md:items-center gap-3">
                <span className="w-16 flex-shrink-0 text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
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
                                    "px-3 py-1 text-sm rounded-md transition-all border chip-toggle",
                                    isActive
                                        ? "bg-secondary border-muted text-secondary-foreground"
                                        : "bg-muted/50 border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                <span className="w-16 flex-shrink-0 text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
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
                                    "px-3 py-1 text-sm rounded-md transition-all border chip-toggle",
                                    isActive
                                        ? "bg-secondary border-muted text-secondary-foreground"
                                        : "bg-muted/50 border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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

