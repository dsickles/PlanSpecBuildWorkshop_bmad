"use client";

import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { StatusPill, FnTag, TechTag } from "@/components/content/project-card";
import { ParsedArticle } from "@/lib/content-parser";

interface BlueprintGroupProps {
    projectSlug: string;
    docs: ParsedArticle[];
    /** Called when the FileText icon is clicked — Epic 3 will wire up modal */
    onDocOpen?: (doc: ParsedArticle) => void;
}

export function BlueprintGroup({ projectSlug, docs, onDocOpen }: BlueprintGroupProps) {
    const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set());

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

    const displayName = projectSlug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    return (
        <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden mb-4">
            {/* Group header — docs are always visible, header controls Expand All / Collapse All */}
            <div className="w-full flex items-start justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/60">
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-none">
                        {displayName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 leading-none">
                            {docs.length} Document{docs.length !== 1 ? "s" : ""}
                        </span>
                        {docs.length > 0 && (
                            <>
                                <span className="text-xs text-zinc-300 dark:text-zinc-600 leading-none">•</span>
                                <button
                                    onClick={toggleAll}
                                    className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:underline leading-none"
                                >
                                    [{allExpanded ? "Collapse All" : "Expand All"}]
                                </button>
                            </>
                        )}
                    </div>
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
                                    className="flex-1 flex items-center gap-3 min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-400 rounded-sm py-1"
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
                                            onClick={() => onDocOpen?.(doc)}
                                            aria-label={`Open ${doc.title}`}
                                            className="flex items-center justify-center rounded-md p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400"
                                        >
                                            <FileText size={14} />
                                        </button>

                                        {/* Chevron moved to right side */}
                                        <button
                                            onClick={() => toggleDoc(key)}
                                            className="flex items-center justify-center rounded-md p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400"
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
                                    {doc.domain.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-1.5">
                                            {doc.domain.map((tag) => (
                                                <FnTag key={tag} label={tag} />
                                            ))}
                                        </div>
                                    )}
                                    {doc.tech_stack.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {doc.tech_stack.map((tag) => (
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
        <div className="rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700 px-4 py-3 mb-4">
            <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{name}</span>
                <StatusPill status="Concept" />
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Content unavailable</p>
        </div>
    );
}
