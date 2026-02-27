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

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const DocumentSlugSchema = z.string().regex(/^[a-z0-9-_:]+$/);

interface MarkdownDocumentModalProps {
    allContent: (ParsedArticle | ErrorFrontmatter)[];
}

export function MarkdownDocumentModal({ allContent }: MarkdownDocumentModalProps) {
    const { activeDocument, setDocument } = useFilterState();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const lastFocusedElement = useRef<HTMLElement | null>(null);

    // Find the active document in allContent
    const activeDoc = useMemo(() => {
        if (!activeDocument) return null;

        const validation = DocumentSlugSchema.safeParse(activeDocument);
        if (!validation.success) return null;

        // If the slug contains a colon, it's project-specific (project:slug)
        if (activeDocument.includes(':')) {
            const [proj, slug] = activeDocument.split(':');
            return allContent.find(
                (item): item is ParsedArticle =>
                    !isError(item) &&
                    item.projectSlug === proj &&
                    item._filePath.endsWith(`${slug}.md`)
            );
        }

        // Fallback to filename-only matching for legacy links
        return allContent.find(
            (item): item is ParsedArticle =>
                !isError(item) && item._filePath.endsWith(`${activeDocument}.md`)
        );
    }, [activeDocument, allContent]);

    // AC 4: Reset scroll position when document changes
    useEffect(() => {
        if (activeDocument) {
            // Capture focus when opening - use the element that was active just before state change
            // This is effectively the trigger button
            if (document.activeElement instanceof HTMLElement) {
                lastFocusedElement.current = document.activeElement;
            }

            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
        } else {
            // Restore focus when closing
            if (lastFocusedElement.current) {
                const el = lastFocusedElement.current;
                // Use a slightly more robust restoration cycle
                setTimeout(() => {
                    if (document.contains(el)) {
                        el.focus({ preventScroll: true });
                    }
                }, 0);
                lastFocusedElement.current = null;
            }
        }
    }, [activeDocument]);

    const isOpen = !!activeDocument;

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setDocument(null);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="max-w-7xl h-[90vh] bg-zinc-950 border-zinc-800 text-zinc-100 p-0 shadow-2xl overflow-hidden"
            >
                <div
                    ref={scrollContainerRef}
                    className="h-full overflow-y-auto custom-scrollbar"
                >
                    {activeDoc ? (
                        <div data-testid="document-modal" aria-label={`Document: ${activeDoc.title}`}>
                            <div className="sticky top-0 z-10 bg-zinc-950 border-b border-zinc-800/50">
                                <div className="bg-zinc-950/80 backdrop-blur-md px-8 py-6">
                                    <DialogHeader>
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
                                                {activeDoc.title}
                                            </DialogTitle>
                                            <StatusPill status={activeDoc.status} />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {activeDoc.description && (
                                                <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
                                                    {activeDoc.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap gap-2">
                                                {activeDoc.domain?.map((d) => (
                                                    <FnTag key={d} label={d} />
                                                ))}
                                                {activeDoc.tech_stack?.map((t) => (
                                                    <TechTag key={t} label={t} />
                                                ))}
                                            </div>
                                        </div>
                                    </DialogHeader>
                                </div>
                            </div>

                            <div className="px-8 py-8 md:px-12 md:py-12">
                                <div className="max-w-[70ch] mx-auto">
                                    <article
                                        className="prose prose-zinc dark:prose-invert max-w-none 
                                            prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                                            prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-6
                                            prose-strong:text-white prose-strong:font-semibold
                                            prose-code:text-blue-400 prose-code:bg-blue-400/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                                            prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-lg
                                            prose-li:text-zinc-300 prose-li:mb-2
                                            prose-hr:border-zinc-800"
                                        dangerouslySetInnerHTML={{ __html: activeDoc.html }}
                                    />
                                </div>

                                <div className="mt-12 flex justify-center pb-8">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleOpenChange(false)}
                                        className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                    >
                                        Close Document
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center p-8 bg-zinc-950">
                            <div
                                data-testid="document-error-fallback"
                                aria-label="document not found"
                                className="max-w-md w-full rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700 p-12 bg-zinc-900/30 text-center"
                            >
                                <div className="flex justify-center mb-6">
                                    <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800">
                                        <AlertCircle className="w-8 h-8 text-zinc-500" />
                                    </div>
                                </div>
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold text-white mb-3 text-center">
                                        Document Not Found
                                    </DialogTitle>
                                    <p className="text-zinc-400 mb-8 leading-relaxed text-center">
                                        The requested document could not be located or has been moved from its original sector.
                                    </p>
                                </DialogHeader>
                                <Button
                                    variant="outline"
                                    onClick={() => handleOpenChange(false)}
                                    className="bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800"
                                >
                                    Return to Command Center
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
