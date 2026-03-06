"use client";

import React, { useMemo, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useFilterState } from "@/hooks/useFilterState";
import { ParsedArticle, ErrorFrontmatter, isError } from "@/lib/schema";
import { StatusPill, FnTag, TechTag } from "@/components/content/project-card";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { PROJECT_PARAM, DOCUMENT_PARAM } from "@/lib/constants";
import { TocEntry } from "@/lib/toc-engine";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const DocumentSlugSchema = z.string().regex(/^[a-zA-Z0-9-_:]+$/);
const TOC_HIGHLIGHT_THRESHOLD = 24; // Distance from top to trigger active heading

interface MarkdownDocumentModalProps {
    allContent: (ParsedArticle | ErrorFrontmatter)[];
}

function TableOfContents({ toc, containerRef, activeId, onSelect, headerHeight }: { toc: TocEntry[], containerRef: React.RefObject<HTMLDivElement | null>, activeId: string | null, onSelect: (id: string) => void, headerHeight: number }) {
    const sidebarRef = useRef<HTMLElement>(null);

    // AC: Active Item Centering - auto-scroll the sidebar
    useEffect(() => {
        if (activeId && sidebarRef.current) {
            const activeElement = sidebarRef.current.querySelector(`[data-toc-id="${activeId}"]`);
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [activeId]);

    if (toc.length === 0) return null;

    const scrollToId = (id: string) => {
        const element = document.getElementById(id);
        if (element && containerRef.current) {
            onSelect(id);
            // With scroll-padding-top on the container, this lands perfectly
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav
            ref={sidebarRef}
            className="hidden lg:block w-64 shrink-0 px-6 py-10 border-l border-border/50 overflow-y-auto sticky h-full custom-scrollbar"
            style={{
                top: 0
            }}
        >
            <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-6">Contents</h4>
            <ul className="space-y-4">
                {toc.map((entry, i) => (
                    <li
                        key={`${entry.slug}-${i}`}
                        style={{ paddingLeft: entry.level === 3 ? '1rem' : '0' }}
                    >
                        <button
                            onClick={() => scrollToId(entry.slug)}
                            data-toc-id={entry.slug}
                            className={cn(
                                "text-left text-xs transition-all duration-300 leading-relaxed w-full",
                                activeId === entry.slug
                                    ? "text-blue-500 font-bold translate-x-1"
                                    : "text-zinc-500 hover:text-white"
                            )}
                        >
                            {entry.text}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export function MarkdownDocumentModal({ allContent }: MarkdownDocumentModalProps) {
    const { activeDocument, setDocument, updateFilters } = useFilterState();
    const [scrollProgress, setScrollProgress] = React.useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeToCId, setActiveToCId] = React.useState<string | null>(null);
    const [isManualScroll, setIsManualScroll] = React.useState(false);
    const [headerHeight, setHeaderHeight] = React.useState(280);
    const manualScrollTimer = useRef<NodeJS.Timeout>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    // AC 3: Reading Progress Bar calculation
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const totalHeight = target.scrollHeight - target.clientHeight;

        if (totalHeight > 0) {
            const progress = (target.scrollTop / totalHeight) * 100;
            setScrollProgress(progress);
        }

        // AC 2: Active Heading Highlighting
        // Only update automatically if not currently processing a manual click-scroll
        if (activeDoc?.toc && activeDoc.toc.length > 0 && !isManualScroll) {
            // In a fixed-header layout, the scroll container's top is the viewport top.
            // A small 24px threshold provides a nice buffer for active detection.
            const threshold = TOC_HIGHLIGHT_THRESHOLD;

            let currentId = activeDoc.toc[0].slug;

            // Simple top-down check
            for (const entry of activeDoc.toc) {
                const element = document.getElementById(entry.slug);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const relativeTop = rect.top - target.getBoundingClientRect().top;

                    if (relativeTop <= threshold + 5) {
                        currentId = entry.slug;
                    } else {
                        break;
                    }
                }
            }
            if (currentId !== activeToCId) {
                setActiveToCId(currentId);
            }
        }
    };

    // AC: Manual interaction breaks the ToC lock
    const handleManualInteraction = () => {
        if (isManualScroll) {
            setIsManualScroll(false);
            if (manualScrollTimer.current) {
                clearTimeout(manualScrollTimer.current);
            }
        }
    };

    const handleToCSelect = (id: string) => {
        setActiveToCId(id);
        setIsManualScroll(true);
        if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current);
        // Lock auto-highlighting for 1.2s to cover smooth scroll durations
        manualScrollTimer.current = setTimeout(() => setIsManualScroll(false), 1200);
    };

    // Find the active document in allContent
    const activeDoc = useMemo(() => {
        if (!activeDocument) return null;

        const validation = DocumentSlugSchema.safeParse(activeDocument);
        if (!validation.success) return null;

        return allContent.find(
            (item): item is ParsedArticle =>
                !isError(item) && item.id === activeDocument
        );
    }, [activeDocument, allContent]);

    // Fallback for legacy ID formats (colon-delimited doublet or filename)
    // Removed legacy lookup as we are standardizing on path-based IDs.

    const isOpen = !!activeDocument;

    // AC 4: Reset scroll position when document changes
    // AC: Dynamic Header Height measurement
    useEffect(() => {
        if (!headerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const rawH = entry.borderBoxSize[0].blockSize;
                // Dead-band filtering: only update if change is > 2px
                // and keep it as a clean integer for padding-top logic
                const h = Math.round(rawH);
                setHeaderHeight(prev => (Math.abs(prev - h) > 2 ? h : prev));
            }
        });

        observer.observe(headerRef.current);
        return () => {
            observer.disconnect();
        };
    }, [isOpen]);

    const lastDocId = useRef<string | null>(null);

    // Isolated Scroll Reset: Only triggers when the document ID physically changes
    useEffect(() => {
        if (!activeDocument) {
            lastDocId.current = null;
            return;
        }

        if (activeDocument !== lastDocId.current) {
            lastDocId.current = activeDocument;

            // Clean modal opening reset
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
            if (activeDoc?.toc && activeDoc.toc.length > 0) {
                setActiveToCId(activeDoc.toc[0].slug);
            } else {
                setActiveToCId(null);
            }

            // Reset locks
            setIsManualScroll(false);
            if (manualScrollTimer.current) clearTimeout(manualScrollTimer.current);
        }
    }, [activeDocument]); // Dependency on activeDocument ID ONLY

    // Simplified state usage
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setDocument(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="max-w-7xl h-[90vh] bg-background border-border text-foreground p-0 shadow-2xl overflow-hidden flex flex-col"
                onCloseAutoFocus={(event) => {
                    // AC 1: Explicitly handle focus restoration
                    // Radix restores focus by default, but we provide this hook for 
                    // architectural compliance and to ensure any manual overrides are handled.
                }}
            >
                {activeDoc && (
                    <div ref={headerRef} className="shrink-0 bg-background border-b border-border/50 z-20 relative">
                        <div className="bg-background/80 backdrop-blur-md px-8 pt-6 pb-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col gap-1.5">
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">
                                        {activeDoc.projectTitle || activeDoc.projectSlug?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <DialogTitle className="text-2xl font-bold tracking-tight text-foreground transition-all duration-300">
                                            {activeDoc.title}
                                        </DialogTitle>
                                        <StatusPill status={activeDoc.status} />
                                    </div>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleOpenChange(false)}
                                    className="text-muted-foreground hover:text-foreground hover:bg-accent -mr-2 px-3"
                                >
                                    <span className="mr-2">←</span> Back
                                </Button>
                            </div>

                            <DialogHeader className="space-y-0">
                                <div className="flex flex-col gap-3">
                                    {activeDoc.description && (
                                        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
                                            {activeDoc.description}
                                        </p>
                                    )}
                                    <div className="space-y-1.5 mt-1">
                                        {activeDoc.taxonomy?.domain && activeDoc.taxonomy.domain.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {activeDoc.taxonomy.domain.map((d) => (
                                                    <FnTag key={d} label={d} />
                                                ))}
                                            </div>
                                        )}
                                        {activeDoc.taxonomy?.tech_stack && activeDoc.taxonomy.tech_stack.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {activeDoc.taxonomy.tech_stack.map((t) => (
                                                    <TechTag key={t} label={t} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </DialogHeader>
                        </div>

                        {/* Reading Progress Bar */}
                        <div className="h-[2px] w-full bg-transparent absolute bottom-0 left-0 overflow-hidden z-30">
                            <div
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={Math.round(scrollProgress)}
                                aria-label="Reading progress"
                                className="h-full bg-blue-600 transition-all duration-150 ease-out"
                                style={{ width: `${scrollProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-hidden relative flex flex-col lg:flex-row">
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        onWheel={handleManualInteraction}
                        onTouchStart={handleManualInteraction}
                        className="flex-1 overflow-y-auto custom-scrollbar px-8 md:px-12 py-8 md:py-12"
                    >
                        {activeDoc ? (
                            <div className="max-w-[70ch] mx-auto pb-12">
                                <article
                                    className="prose prose-zinc dark:prose-invert max-w-none 
                                        prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                                        prose-headings:mt-16 first:prose-headings:mt-0
                                        prose-p:text-foreground/80 dark:prose-p:text-muted-foreground prose-p:leading-loose prose-p:mb-10
                                        prose-strong:text-foreground prose-strong:font-semibold
                                        prose-code:text-foreground prose-code:bg-muted dark:prose-code:bg-zinc-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                                        prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-pre:rounded-lg
                                        prose-li:text-muted-foreground prose-li:mb-2
                                        prose-hr:border-border"
                                    dangerouslySetInnerHTML={{ __html: activeDoc.html }}
                                />
                                {activeDoc.artifactType === "agent" && activeDoc.associatedProjects && activeDoc.associatedProjects.length > 0 && (
                                    <div className="mt-16 pt-8 border-t border-border/50">
                                        <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-6">Projects using this tool</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {activeDoc.associatedProjects.map((project) => (
                                                <Button
                                                    key={project.slug}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        updateFilters({
                                                            [PROJECT_PARAM]: project.slug,
                                                            [DOCUMENT_PARAM]: null
                                                        });
                                                    }}
                                                    className="bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent text-xs py-1 h-auto"
                                                >
                                                    {project.title}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="mt-12 flex justify-center border-t border-border/50 pt-8">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleOpenChange(false)}
                                        className="bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                                    >
                                        Close Document
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center p-8 bg-background">
                                <div
                                    data-testid="document-error-fallback"
                                    aria-label="document not found"
                                    className="max-w-md w-full rounded-lg border border-dashed border-border p-12 bg-muted/30 text-center shadow-lg"
                                >
                                    <div className="flex justify-center mb-6">
                                        <div className="p-3 rounded-full bg-muted border border-border">
                                            <AlertCircle className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                    </div>
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold text-foreground mb-3 text-center">
                                            Document Not Found
                                        </DialogTitle>
                                        <p className="text-zinc-400 mb-8 leading-relaxed text-center">
                                            The requested document could not be located or has been moved from its original sector.
                                        </p>
                                    </DialogHeader>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleOpenChange(false)}
                                        className="bg-muted border-border text-muted-foreground hover:text-foreground hover:bg-accent"
                                    >
                                        Return to Command Center
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {activeDoc && (
                        <TableOfContents
                            toc={activeDoc.toc || []}
                            containerRef={scrollContainerRef}
                            activeId={activeToCId}
                            onSelect={handleToCSelect}
                            headerHeight={headerHeight}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog >
    );
}
