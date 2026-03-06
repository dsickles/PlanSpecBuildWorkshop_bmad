"use client";

import { useState } from "react";
import { ChevronDown, FileText, Layers } from "lucide-react";
import { StatusPill, FnTag, TechTag } from "@/components/content/project-card";
import { ParsedArticle } from "@/lib/schema";

interface BlueprintGroupProps {
    projectSlug: string;
    projectTitle?: string;
    docs: ParsedArticle[];
    /** The project's root index.md content (Story 8.3) */
    overviewDoc?: ParsedArticle;
    /** Called when a document icon is clicked */
    onDocOpen?: (doc: ParsedArticle) => void;
    /** If true, all rows are force-expanded (Focus Mode) */
    isFocused?: boolean;
    /** Called when the Layers icon is clicked to establish Focus Mode */
    onLayersClick?: () => void;
}

export function BlueprintGroup({
    projectSlug,
    projectTitle,
    docs,
    overviewDoc,
    onDocOpen,
    isFocused = false,
    onLayersClick
}: BlueprintGroupProps) {
    const [expandedDocs, setExpandedDocs] = useState<Set<string>>(() => {
        return isFocused ? new Set(docs.map(d => d.title)) : new Set();
    });

    // Sync state to prop change: When isFocused becomes true, auto-expand all.
    // React allows setting state during render if gated by a condition (idiomatic for prop sync).
    const [prevIsFocused, setPrevIsFocused] = useState(isFocused);
    if (isFocused !== prevIsFocused) {
        setPrevIsFocused(isFocused);
        if (isFocused) {
            setExpandedDocs(new Set(docs.map(d => d.title)));
        }
    }

    const allExpanded = expandedDocs.size === docs.length && docs.length > 0;

    const toggleAll = () => {
        if (allExpanded) {
            setExpandedDocs(new Set());
        } else {
            setExpandedDocs(new Set(docs.map(d => d.title)));
        }
    };

    const toggleDoc = (key: string) => {
        setExpandedDocs((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const displayName = projectTitle || projectSlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden mb-4">
            {/* Group header — docs are always visible, header controls Expand All / Collapse All */}
            <div
                className="w-full flex flex-col px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/60"
                data-testid="blueprint-group-header"
            >
                {/* Row 1: Title and Main Action Icons */}
                <div className="flex items-start justify-between w-full">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-tight mt-0.5">
                        {displayName}
                    </h3>
                    <div className="flex items-center gap-1">
                        {overviewDoc && (
                            <button
                                onClick={() => onDocOpen?.(overviewDoc)}
                                aria-label={`Open ${displayName} overview`}
                                className="flex items-center justify-center rounded-md p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400"
                            >
                                <FileText size={14} />
                            </button>
                        )}
                        {onLayersClick && (
                            <button
                                onClick={onLayersClick}
                                aria-label="Focus on this project"
                                className="flex items-center justify-center rounded-md p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400"
                            >
                                <Layers size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Row 2: Metadata (Count) and Secondary Actions (Expand All) */}
                <div className="flex items-center justify-between w-full mt-1.5">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight">
                        {docs.length} Document{docs.length !== 1 ? "s" : ""}
                    </span>
                    {docs.length > 0 && (
                        <button
                            onClick={toggleAll}
                            data-testid="expand-collapse-all-button"
                            aria-label={allExpanded ? "Collapse all items" : "Expand all items"}
                            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:underline leading-tight"
                        >
                            <span aria-hidden="true">[</span>
                            {allExpanded ? "Collapse All" : "Expand All"}
                            <span aria-hidden="true">]</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Document rows */}
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {docs.map((doc) => {
                    const key = doc.title;
                    const isOpen = expandedDocs.has(key);

                    return (
                        <li key={key} className="group border-b border-transparent last:border-b-0">
                            {/* Row header — click to expand this doc's details */}
                            <div className="flex items-center justify-between px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-150">
                                <button
                                    onClick={() => toggleDoc(key)}
                                    className="flex-1 flex items-center gap-1.5 min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-400 rounded-sm py-1"
                                    aria-expanded={isOpen}
                                >
                                    <span className="text-lg font-semibold leading-tight text-zinc-900 dark:text-white truncate">
                                        {doc.title}
                                    </span>
                                    <StatusPill status={doc.status} />
                                </button>

                                <div className="flex items-center gap-3 shrink-0 ml-4">
                                    <div className="flex items-center gap-1">
                                        {/* Action Icon - styled like Prototype GitHub icon */}
                                        <button
                                            id={`doc-trigger-${doc.id}`}
                                            onClick={() => onDocOpen?.(doc)}
                                            aria-label={`Open ${doc.title}`}
                                            className="flex items-center justify-center rounded-md p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400"
                                        >
                                            <FileText size={14} />
                                        </button>

                                        {/* Chevron moved to right side */}
                                        <button
                                            onClick={() => toggleDoc(key)}
                                            className="flex items-center justify-center rounded-md p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400"
                                            aria-label={isOpen ? "Collapse details" : "Expand details"}
                                        >
                                            <ChevronDown
                                                size={14}
                                                className={[
                                                    "transition-transform duration-200",
                                                    isOpen ? "rotate-180" : "",
                                                ].join(" ")}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded detail panel */}
                            {isOpen && (
                                <div className="px-4 pb-4 pt-1 bg-zinc-50/50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800/60">
                                    {doc.description && (
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 leading-relaxed">
                                            {doc.description}
                                        </p>
                                    )}
                                    {doc.taxonomy?.domain && doc.taxonomy.domain.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-1.5">
                                            {doc.taxonomy.domain.map((tag: string) => (
                                                <FnTag key={tag} label={tag} />
                                            ))}
                                        </div>
                                    )}
                                    {doc.taxonomy?.tech_stack && doc.taxonomy.tech_stack.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {doc.taxonomy.tech_stack.map((tag: string) => (
                                                <TechTag key={tag} label={tag} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

// Error row for malformed Blueprint docs
export function BlueprintErrorRow({ filePath }: { filePath: string }) {
    const name = filePath.split("/").slice(-2, -1)[0] ?? "Unknown";
    return (
        <div
            data-testid="doc-fallback"
            aria-label="doc content unavailable"
            className="rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700 px-4 py-3 mb-4"
        >
            <div className="flex items-center gap-1.5">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{name}</span>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Content unavailable</p>
        </div>
    );
}
