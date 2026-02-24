import { DashboardGrid } from "@/components/layout/dashboard-grid";
import { ProjectCard, FallbackCard } from "@/components/content/project-card";
import { BlueprintGroup, BlueprintErrorRow } from "@/components/content/blueprint-group";
import { getSortedParsedContent, ParsedArticle } from "@/lib/content-parser";
import { isError } from "@/lib/schema";

export default async function Home() {
  const allContent = await getSortedParsedContent();

  // Partition by artifactType — routing is ONLY by artifactType, never by URL/string parsing.
  const agents: ParsedArticle[] = [];
  const docs: ParsedArticle[] = [];
  const prototypes: ParsedArticle[] = [];
  const errors: { _filePath: string; _message: string }[] = [];

  for (const item of allContent) {
    if (isError(item)) {
      errors.push({ _filePath: item._filePath, _message: item._message });
    } else if (item.artifactType === "agent") {
      agents.push(item);
    } else if (item.artifactType === "doc") {
      docs.push(item);
    } else if (item.artifactType === "prototype") {
      prototypes.push(item);
    }
  }

  if (errors.length > 0) {
    console.error("Zod Validation Errors:", errors);
  }

  // Group docs by projectSlug for the Blueprint compound layout
  const docsByProject = new Map<string, ParsedArticle[]>();
  for (const doc of docs) {
    const group = docsByProject.get(doc.projectSlug) ?? [];
    group.push(doc);
    docsByProject.set(doc.projectSlug, group);
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-screen-2xl">
      <DashboardGrid
        studioColumn={
          <>
            {agents.length === 0 && !errors.some(e => e._filePath.includes("/agents/")) && (
              <FallbackCard
                title="No agents found"
                description="Add an index.md file to /agents with valid frontmatter to see it here."
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
            {/* Error fallback cards for failed agent parses */}
            {errors
              .filter((e) => e._filePath.includes("/agents/"))
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
                description="Add an index.md file to /docs with valid frontmatter to see it here."
                className="mb-4"
              />
            )}
            {Array.from(docsByProject.entries()).map(([slug, groupDocs]) => (
              <BlueprintGroup key={slug} projectSlug={slug} docs={groupDocs} />
            ))}
            {/* Error fallback rows for failed doc parses */}
            {errors
              .filter((e) => e._filePath.includes("/docs/"))
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
                description="Add an index.md file to /prototypes with valid frontmatter to see it here."
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
            {/* Error fallback cards for failed prototype parses */}
            {errors
              .filter((e) => e._filePath.includes("/prototypes/"))
              .map((e) => (
                <div key={e._filePath} className="mb-4">
                  <FallbackCard title="Content unavailable" />
                </div>
              ))}
          </>
        }
      />
    </div>
  );
}
