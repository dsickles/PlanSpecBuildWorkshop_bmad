// Server-only module — uses Node.js `fs`. Never import from a client component.

import fs from "fs";
import path from "path";
import { ArtifactType } from "./schema";

// =============================================================================
// Content File System Utilities
// Server-only ("use server"): uses Node.js `fs` — never import from a client component.
// See: Story 1.2 — Implement Markdown File System Parser Utilities
// =============================================================================

/** Absolute path to the content root directory. */
const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

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
 * Represents a discovered `index.md` file and its structural metadata.
 * Metadata is derived purely from the directory structure — no file reading required.
 */
export interface ContentFilePath {
    /** Absolute path to the index.md file. */
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
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);
    } catch {
        return [];
    }
}

/**
 * Discovers all `index.md` files under the structured content directory tree.
 *
 * Expected structure:
 *   src/content/<project-slug>/<agents|docs|prototypes>/index.md
 *
 * Only files matching this exact pattern are returned. Directories that don't
 * match the known artifact type folders are silently skipped.
 *
 * @returns Array of ContentFilePath objects, one per discovered index.md.
 */
export function getContentFilePaths(): ContentFilePath[] {
    const slugs = getProjectSlugs();
    const results: ContentFilePath[] = [];

    for (const projectSlug of slugs) {
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

            const indexPath = path.join(projectDir, artifactDir.name, "index.md");

            try {
                fs.accessSync(indexPath, fs.constants.R_OK);
                results.push({
                    filePath: indexPath,
                    projectSlug,
                    artifactType,
                });
            } catch {
                // index.md doesn't exist or isn't readable — skip silently
            }
        }
    }

    return results;
}
