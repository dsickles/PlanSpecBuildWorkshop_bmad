import { getSortedParsedContent } from "@/lib/content-parser";
import { loadSortConfig, sortByList } from "@/lib/sort-utils";
import { isError, ErrorFrontmatter, ParsedArticle } from "@/lib/schema";
import { FilterBar } from "@/components/custom/FilterBar";
import { DiscoveryGrid } from "@/components/custom/DiscoveryGrid";
import { AboutModal } from "@/components/custom/AboutModal";
import { Suspense } from "react";

export default async function Home() {
  const allContent = await getSortedParsedContent();
  const sortConfig = await loadSortConfig();

  const errors: ErrorFrontmatter[] = [];
  const validArticles: ParsedArticle[] = [];

  for (const item of allContent) {
    if (isError(item)) {
      errors.push({ _error: true, _filePath: item._filePath, _message: item._message });
    } else {
      validArticles.push(item);
    }
  }

  if (errors.length > 0) {
    console.error("Zod Validation Errors:", errors);
  }

  // Extract unique filter options for the FilterBar (Server-side derived from all valid content)
  const projectMap = new Map<string, string>();
  validArticles.forEach(item => {
    if (item.projectSlug !== "_shared" && !projectMap.has(item.projectSlug)) {
      projectMap.set(item.projectSlug, item.projectTitle || item.projectSlug);
    }
  });

  const projects = Array.from(projectMap.keys())
    .sort((a, b) => sortByList(a, b, sortConfig.projects))
    .map(slug => ({
      slug,
      title: projectMap.get(slug) || slug
    }));

  const domains = Array.from(new Set(validArticles.flatMap(item => item.domain))).sort();
  const techStacks = Array.from(new Set(validArticles.flatMap(item => item.tech_stack))).sort();

  return (
    <div className="container mx-auto px-4 md:px-8 py-page-pt md:py-page-pt-md max-w-screen-2xl">
      <Suspense fallback={null}>
        <FilterBar projects={projects} domains={domains} techStacks={techStacks} />
      </Suspense>
      <Suspense fallback={null}>
        <DiscoveryGrid allContent={allContent} errors={errors} />
      </Suspense>
      <Suspense fallback={null}>
        <AboutModal allContent={allContent} />
      </Suspense>
    </div>
  );
}
