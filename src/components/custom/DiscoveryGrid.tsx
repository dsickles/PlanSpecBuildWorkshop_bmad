"use client";

import { useMemo } from "react";
import { DashboardGrid } from "@/components/layout/dashboard-grid";
import { ProjectCard, FallbackCard } from "@/components/content/project-card";
import { BlueprintGroup, BlueprintErrorRow } from "@/components/content/blueprint-group";
import { ParsedArticle } from "@/lib/content-parser";
import { isError, ErrorFrontmatter } from "@/lib/schema";
import { useFilterState } from "@/hooks/useFilterState";

interface DiscoveryGridProps {
    allContent: (ParsedArticle | ErrorFrontmatter)[];
    errors: ErrorFrontmatter[];
}

export function DiscoveryGrid({ allContent, errors: serverErrors }: DiscoveryGridProps) {
    const { activeProject, activeDomains, activeTech } = useFilterState();

    const { agents, docsByProject, prototypes, errors } = useMemo(() => {
        const filtered = allContent.filter((item): item is ParsedArticle => {
            if (isError(item)) return false;
            const article = item as ParsedArticle;

            // Project Filter (Exclusive)
            if (activeProject && article.projectSlug !== activeProject) {
                return false;
            }

            // Domain/Tech Filter (OR logic across both)
            const hasActiveFilters = activeDomains.length > 0 || activeTech.length > 0;
            if (hasActiveFilters) {
                const matchesDomain = article.domain.some((d: string) => activeDomains.includes(d));
                const matchesTech = article.tech_stack.some((t: string) => activeTech.includes(t));

                if (!matchesDomain && !matchesTech) {
                    return false;
                }
            }

            return true;
        });

        const agents: ParsedArticle[] = [];
        const prototypes: ParsedArticle[] = [];
        const docsByProject = new Map<string, ParsedArticle[]>();

        filtered.forEach(item => {
            const article = item as ParsedArticle;
            if (article.artifactType === "agent") {
                agents.push(article);
            } else if (article.artifactType === "prototype") {
                prototypes.push(article);
            } else if (article.artifactType === "doc") {
                const group = docsByProject.get(article.projectSlug) ?? [];
                group.push(article);
                docsByProject.set(article.projectSlug, group);
            }
        });

        // Combine server errors with any pass-through errors
        const allErrors = [...serverErrors];

        return { agents, docsByProject, prototypes, errors: allErrors };
    }, [allContent, serverErrors, activeProject, activeDomains, activeTech]);

    return (
        <DashboardGrid
            studioColumn={
                <>
                    {agents.length === 0 && !errors.some(e => e._filePath.includes("/agents/")) && (
                        <FallbackCard
                            title="No agents found"
                            description="No agents match the current filters."
                            className="mb-4"
                        />
                    )}
                    {agents.map((agent) => (
                        <div key={agent.projectSlug + agent.title} className="mb-4">
                            <ProjectCard
                                artifactType="agent"
                                title={agent.title}
                                status={agent.status}
                                description={agent.description}
                                domain={agent.domain}
                                tech_stack={agent.tech_stack}
                            />
                        </div>
                    ))}
                    {errors
                        .filter((e) => e._filePath.includes('/agents/') || e._filePath.includes('\\agents\\'))
                        .map((e) => (
                            <div key={e._filePath} className="mb-4">
                                <FallbackCard title="Content unavailable" />
                            </div>
                        ))}
                </>
            }
            blueprintsColumn={
                <>
                    {docsByProject.size === 0 && !errors.some(e => e._filePath.includes("/docs/")) && (
                        <FallbackCard
                            title="No blueprints found"
                            description="No blueprints match the current filters."
                            className="mb-4"
                        />
                    )}
                    {Array.from(docsByProject.entries()).map(([slug, groupDocs]) => (
                        <BlueprintGroup
                            key={slug}
                            projectSlug={slug}
                            docs={groupDocs}
                            isFocused={activeProject === slug}
                        />
                    ))}
                    {errors
                        .filter((e) => e._filePath.includes('/docs/') || e._filePath.includes('\\docs\\'))
                        .map((e) => (
                            <BlueprintErrorRow key={e._filePath} filePath={e._filePath} />
                        ))}
                </>
            }
            labColumn={
                <>
                    {prototypes.length === 0 && !errors.some(e => e._filePath.includes("/prototypes/")) && (
                        <FallbackCard
                            title="No prototypes found"
                            description="No prototypes match the current filters."
                            className="mb-4"
                        />
                    )}
                    {prototypes.map((proto) => (
                        <div key={proto.projectSlug + proto.title} className="mb-4">
                            <ProjectCard
                                artifactType="prototype"
                                title={proto.title}
                                status={proto.status}
                                description={proto.description}
                                domain={proto.domain}
                                tech_stack={proto.tech_stack}
                                externalUrl={proto.external_url}
                                githubUrl={proto.github_url}
                            />
                        </div>
                    ))}
                    {errors
                        .filter((e) => e._filePath.includes('/prototypes/') || e._filePath.includes('\\prototypes\\'))
                        .map((e) => (
                            <div key={e._filePath} className="mb-4">
                                <FallbackCard title="Content unavailable" />
                            </div>
                        ))}
                </>
            }
        />
    );
}
