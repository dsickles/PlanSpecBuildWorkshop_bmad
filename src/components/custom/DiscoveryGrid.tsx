"use client";

import { useMemo } from "react";
import { DashboardGrid } from "@/components/layout/dashboard-grid";
import { ProjectCard, FallbackCard } from "@/components/content/project-card";
import { BlueprintGroup, BlueprintErrorRow } from "@/components/content/blueprint-group";
import { ParsedArticle, isError, ErrorFrontmatter } from "@/lib/schema";
import { useFilterState } from "@/hooks/useFilterState";
import { MarkdownDocumentModal } from "@/components/custom/MarkdownDocumentModal";

interface DiscoveryGridProps {
    allContent: (ParsedArticle | ErrorFrontmatter)[];
    errors: ErrorFrontmatter[];
}

export function DiscoveryGrid({ allContent, errors: serverErrors }: DiscoveryGridProps) {
    const { activeProject, activeDomains, activeTech, setProject, setDocument } = useFilterState();

    const handleDocOpen = useMemo(() => (doc: ParsedArticle) => {
        setDocument(doc.id);
    }, [setDocument]);

    const memoizedData = useMemo<{
        agents: ParsedArticle[];
        docsByProject: Map<string, ParsedArticle[]>;
        prototypes: ParsedArticle[];
        overviewByProject: Map<string, ParsedArticle>;
        blueprintOverviewByProject: Map<string, ParsedArticle>;
        studioErrors: ErrorFrontmatter[];
        docErrors: ErrorFrontmatter[];
        labErrors: ErrorFrontmatter[];
    }>(() => {
        const filtered = allContent.filter((item): item is ParsedArticle => {
            if (isError(item)) return false;
            const article = item as ParsedArticle;

            // Project Filter: Non-agents use projectSlug; Agents use projects array
            if (activeProject) {
                if (article.artifactType === "agent") {
                    if (!article.projects?.includes(activeProject)) {
                        return false;
                    }
                } else if (article.projectSlug !== activeProject) {
                    return false;
                }
            }

            // Domain/Tech Filter (OR logic across both)
            const hasActiveFilters = activeDomains.length > 0 || activeTech.length > 0;
            if (hasActiveFilters) {
                const matchesDomain = article.domain?.some((d: string) => activeDomains.includes(d)) ?? false;
                const matchesTech = article.tech_stack?.some((t: string) => activeTech.includes(t)) ?? false;

                if (!matchesDomain && !matchesTech) {
                    return false;
                }
            }

            return true;
        });

        const agents: ParsedArticle[] = [];
        const prototypes: ParsedArticle[] = [];
        const docsByProject = new Map<string, ParsedArticle[]>();
        const overviewByProject = new Map<string, ParsedArticle>();
        const blueprintOverviewByProject = new Map<string, ParsedArticle>();

        filtered.forEach(item => {
            const article = item as ParsedArticle;
            const normalizedPath = article._filePath.replace(/\\/g, '/');
            const pathSegments = normalizedPath.split('/');
            const fileName = pathSegments[pathSegments.length - 1];
            const parentDir = pathSegments[pathSegments.length - 2];
            const grandParentDir = pathSegments[pathSegments.length - 3];

            // Root index: project/index.md
            const isRootIndex = article.artifactType === "doc" &&
                fileName === "index.md" &&
                parentDir === article.projectSlug;

            // Blueprint index: project/docs/index.md
            const isBlueprintIndex = article.artifactType === "doc" &&
                fileName === "index.md" &&
                parentDir === "docs" &&
                grandParentDir === article.projectSlug;

            if (isRootIndex) {
                overviewByProject.set(article.projectSlug, article);
            } else if (isBlueprintIndex) {
                blueprintOverviewByProject.set(article.projectSlug, article);
            } else if (article.artifactType === "agent") {
                agents.push(article);
            } else if (article.artifactType === "prototype") {
                prototypes.push(article);
            } else if (article.artifactType === "doc") {
                const group = docsByProject.get(article.projectSlug) ?? [];
                group.push(article);
                docsByProject.set(article.projectSlug, group);
            }
        });

        // Memoize error filtering for performance (NFR2)
        const allErrors = [...serverErrors];
        const studioErrors = allErrors.filter((e) => e._filePath.toLowerCase().includes('agents'));
        const docErrors = allErrors.filter((e) => e._filePath.toLowerCase().includes('docs'));
        const labErrors = allErrors.filter((e) => e._filePath.toLowerCase().includes('prototypes'));

        return { agents, docsByProject, prototypes, overviewByProject, blueprintOverviewByProject, studioErrors, docErrors, labErrors };
    }, [allContent, serverErrors, activeProject, activeDomains, activeTech]);

    const { agents, docsByProject, prototypes, overviewByProject, blueprintOverviewByProject, studioErrors, docErrors, labErrors } = memoizedData;

    return (
        <>
            <DashboardGrid
                studioColumn={
                    <>
                        {agents.length === 0 && studioErrors.length === 0 && (
                            <FallbackCard
                                context="agent"
                                title="No agents found"
                                description="No agents match the current filters."
                                className="mb-4"
                            />
                        )}
                        {agents.map((agent) => {
                            const targetProject = (activeProject && agent.projects?.includes(activeProject))
                                ? activeProject
                                : (agent.projects?.[0] || "");
                            const hasOverview = !!(targetProject && overviewByProject.has(targetProject));

                            return (
                                <div key={agent._filePath} className="mb-4">
                                    <ProjectCard
                                        context="agent"
                                        artifactType="agent"
                                        title={agent.title}
                                        status={agent.status}
                                        description={agent.description}
                                        domain={agent.domain}
                                        tech_stack={agent.tech_stack}
                                        externalLinks={agent.external_links}
                                    />
                                </div>
                            );
                        })}
                        {studioErrors.map((e) => (
                            <div key={e._filePath} className="mb-4">
                                <FallbackCard context="agent" title="Content unavailable" />
                            </div>
                        ))}
                    </>
                }
                blueprintsColumn={
                    <>
                        {docsByProject.size === 0 && docErrors.length === 0 && (
                            <FallbackCard
                                context="doc"
                                title="No blueprints found"
                                description="No blueprints match the current filters."
                                className="mb-4"
                            />
                        )}
                        {Array.from(docsByProject.entries()).map(([slug, groupDocs]) => (
                            <BlueprintGroup
                                key={slug}
                                projectSlug={slug}
                                projectTitle={groupDocs[0]?.projectTitle}
                                docs={groupDocs}
                                overviewDoc={blueprintOverviewByProject.get(slug) || overviewByProject.get(slug)}
                                isFocused={activeProject === slug}
                                onLayersClick={() => setProject(slug)}
                                onDocOpen={handleDocOpen}
                            />
                        ))}
                        {docErrors.map((e) => (
                            <BlueprintErrorRow key={e._filePath} filePath={e._filePath} />
                        ))}
                    </>
                }
                labColumn={
                    <>
                        {prototypes.length === 0 && labErrors.length === 0 && (
                            <FallbackCard
                                context="prototype"
                                title="No prototypes found"
                                description="No prototypes match the current filters."
                                className="mb-4"
                            />
                        )}
                        {prototypes.map((proto) => (
                            <div key={proto._filePath} className="mb-4">
                                <ProjectCard
                                    context="prototype"
                                    artifactType="prototype"
                                    title={proto.title}
                                    status={proto.status}
                                    description={proto.description}
                                    domain={proto.domain}
                                    tech_stack={proto.tech_stack}
                                    externalUrl={proto.external_url}
                                    githubUrl={proto.github_url}
                                    onLayersClick={() => setProject(proto.projectSlug)}
                                />
                            </div>
                        ))}
                        {labErrors.map((e) => (
                            <div key={e._filePath} className="mb-4">
                                <FallbackCard context="prototype" title="Content unavailable" />
                            </div>
                        ))}
                    </>
                }
            />
            <MarkdownDocumentModal allContent={allContent} />
        </>
    );
}
