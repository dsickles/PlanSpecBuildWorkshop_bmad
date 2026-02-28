import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a project-relative path (e.g. "my-project/docs/index.md") 
 * into a colon-delimited ID (e.g. "my-project:docs:index").
 */
export function pathToId(relativePath: string): string {
  return relativePath.replace(/\\/g, '/').replace(/\.md$/, '').replace(/\//g, ':');
}

/**
 * Generates a consistent, URL-safe ID for a document based on its file path.
 * This utility is universal (client/server safe).
 */
export function getDocIdFromPath(projectSlug: string, filePath: string): string {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const segments = normalizedPath.split('/');
  const slugIdx = segments.indexOf(projectSlug);

  if (slugIdx !== -1) {
    // Take from the slug segment onwards to ensure project context is included correctly
    const relativePart = segments.slice(slugIdx).join('/');
    return pathToId(relativePart);
  }

  // Fallback if structure varies: use slug + filename stem
  const fileName = segments[segments.length - 1] || "";
  const stem = fileName.replace(/\.md$/, "");
  return `${projectSlug}:${stem}`;
}
