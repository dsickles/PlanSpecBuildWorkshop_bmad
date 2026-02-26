// Server-only module — uses Node.js `fs`. Never import from a client component.

import fs from "fs";
import path from "path";
import { ArtifactType, SHARED_DIR } from "./schema";

// =============================================================================
// Content File System Utilities
// Server-only ("use server"): uses Node.js `fs` — never import from a client component.
// See: Story 1.2 — Implement Markdown File System Parser Utilities
// =============================================================================

/** Absolute path to the content root directory. */
export const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

/**
 * Maps directory names to their canonical ArtifactType.
 * Only directories matching these keys will be scanned for index.md files.
 */
const DIR_TO_ARTIFACT_TYPE: Record<string, ArtifactType> = {
    agents: "agent",
    docs: "doc",
    prototypes: "prototype",
};

/**
 * Represents a discovered `.md` file and its structural metadata.
 * Metadata is derived purely from the directory structure — no file reading required.
 */
export interface ContentFilePath {
    /** Absolute path to the .md file. */
    filePath: string;
    /** Top-level folder name under /content (e.g. "plan-spec-build-workshop"). */
    projectSlug: string;
    /** Canonical artifact type derived from the grandparent folder name. */
    artifactType: ArtifactType;
}

/**
 * Returns the slugs of all projects found under `src/content/`.
 * Each top-level directory is treated as one project.
 *
 * @returns Array of project slug strings (directory names).
 */
export function getProjectSlugs(): string[] {
    try {
        return fs
            .readdirSync(CONTENT_ROOT, { withFileTypes: true })
            .filter((entry) => entry.isDirectory() && entry.name !== SHARED_DIR)
            .map((entry) => entry.name);
    } catch {
        return [];
    }
}

/**
 * Discovers all `.md` files under the structured content directory tree.
 *
 * Expected structure:
 *   src/content/<project-slug>/<agents|docs|prototypes>/<any-name>.md
 *
 * Any `.md` file inside a recognised artifact-type directory is included.
 * Non-markdown files (e.g. `.gitkeep`) and hidden files are silently skipped.
 *
 * @returns Array of ContentFilePath objects, one per discovered .md file.
 */
export function getContentFilePaths(): ContentFilePath[] {
    const slugs = getProjectSlugs();
    // Add SHARED_DIR to the list of paths to scan, even though it's not a "project"
    const allPathsToScan = [...slugs, SHARED_DIR];
    const results: ContentFilePath[] = [];

    for (const projectSlug of allPathsToScan) {
        const projectDir = path.join(CONTENT_ROOT, projectSlug);

        // Read artifact type subdirectories (agents, docs, prototypes)
        let artifactDirs: fs.Dirent[];
        try {
            artifactDirs = fs
                .readdirSync(projectDir, { withFileTypes: true })
                .filter((entry) => entry.isDirectory());
        } catch {
            // Skip unreadable project directories
            continue;
        }

        for (const artifactDir of artifactDirs) {
            const artifactType = DIR_TO_ARTIFACT_TYPE[artifactDir.name];

            // Silently skip directories that don't match the known artifact types
            if (!artifactType) continue;

            const artifactDirPath = path.join(projectDir, artifactDir.name);

            // Discover ALL .md files in the artifact directory
            let files: fs.Dirent[];
            try {
                files = fs
                    .readdirSync(artifactDirPath, { withFileTypes: true })
                    .filter(
                        (entry) =>
                            entry.isFile() &&
                            entry.name.endsWith(".md") &&
                            !entry.name.startsWith(".")
                    );
            } catch {
                continue;
            }

            for (const file of files) {
                results.push({
                    filePath: path.join(artifactDirPath, file.name),
                    projectSlug,
                    artifactType,
                });
            }
        }
    }

    return results;
}
