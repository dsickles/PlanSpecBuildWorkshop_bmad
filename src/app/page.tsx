import { getSortedParsedContent } from "@/lib/content-parser";
import { loadSortConfig, sortByList } from "@/lib/sort-utils";
import { isError, ErrorFrontmatter, ParsedArticle } from "@/lib/schema";
import { FilterBar } from "@/components/custom/FilterBar";
import { DiscoveryGrid } from "@/components/custom/DiscoveryGrid";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resolvedParams = await searchParams;
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
  const projects = Array.from(new Set(validArticles.map(item => item.projectSlug)))
    .filter(slug => slug !== "_shared")
    .sort((a, b) => sortByList(a, b, sortConfig.projects));
  const domains = Array.from(new Set(validArticles.flatMap(item => item.domain))).sort();
  const techStacks = Array.from(new Set(validArticles.flatMap(item => item.tech_stack))).sort();

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-screen-2xl">
      <Suspense fallback={null}>
        <FilterBar projects={projects} domains={domains} techStacks={techStacks} />
      </Suspense>
      <DiscoveryGrid allContent={allContent} errors={errors} />
    </div>
  );
}
