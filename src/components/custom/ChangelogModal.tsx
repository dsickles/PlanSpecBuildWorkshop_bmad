"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useFilterState } from "@/hooks/useFilterState";
import { ApproachTrail, ChangeKindLabel } from "@/components/content/status-pieces";
import { ProjectStatus, WeekNote, formatDay, planProgress } from "@/lib/status-schema";

interface ChangelogModalProps {
    /** Published status per project, already filtered by publish level. */
    statuses: ProjectStatus[];
}

/**
 * Global changelog view (`?changelog=true`). Follows the AboutModal pattern:
 * a URL-synced modal over the grid that never clears filter state. When a
 * project filter is active, only that project's notes are shown.
 */
export function ChangelogModal({ statuses }: ChangelogModalProps) {
    const { activeChangelog, activeProject, setChangelog, setProject } = useFilterState();

    const visible = React.useMemo(
        () => (activeProject ? statuses.filter((s) => s.slug === activeProject) : statuses),
        [statuses, activeProject]
    );

    const weeks = React.useMemo(() => {
        const byWeek = new Map<string, WeekNote[]>();
        for (const status of visible) {
            for (const note of status.weeks) {
                const group = byWeek.get(note.week) ?? [];
                group.push(note);
                byWeek.set(note.week, group);
            }
        }
        return Array.from(byWeek.entries())
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([week, notes]) => ({
                week,
                notes: notes.sort((a, b) => a.projectTitle.localeCompare(b.projectTitle)),
            }));
    }, [visible]);

    const withPlans = visible.filter((s) => s.plan);
    const focusedTitle = activeProject ? visible[0]?.title ?? activeProject : null;

    return (
        <Dialog open={activeChangelog} onOpenChange={setChangelog}>
            <DialogContent
                showCloseButton={false}
                className="max-w-5xl h-[90vh] bg-background border-border text-foreground p-0 shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="shrink-0 bg-background border-b border-border/50 z-20 relative">
                    <div className="bg-background px-8 py-5 flex items-start justify-between gap-4">
                        <DialogHeader className="space-y-1 text-left">
                            <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
                                Changelog
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                What moved each week, how it was done, and what got cut.
                            </DialogDescription>
                            {focusedTitle && (
                                <p className="text-xs text-muted-foreground pt-1">
                                    Showing {focusedTitle} only.{" "}
                                    <button
                                        onClick={() => setProject(null)}
                                        className="underline underline-offset-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                                    >
                                        Show all projects
                                    </button>
                                </p>
                            )}
                        </DialogHeader>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setChangelog(false)}
                            className="text-muted-foreground hover:text-foreground hover:bg-accent px-3 flex items-center gap-2 group shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Back
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar" data-testid="changelog-scroll">
                    <div className="mx-auto px-8 md:px-12 py-8 max-w-3xl">
                        {weeks.length === 0 && withPlans.length === 0 ? (
                            <div
                                data-testid="changelog-empty"
                                aria-label="changelog empty"
                                className="rounded-lg border border-dashed border-border p-10 text-center"
                            >
                                <p className="text-foreground font-medium mb-2">No published updates yet</p>
                                <p className="text-sm text-muted-foreground">
                                    Projects appear here once they publish a plan or week notes.
                                </p>
                            </div>
                        ) : (
                            <>
                                {withPlans.length > 0 && (
                                    <section className="mb-12" aria-labelledby="changelog-progress">
                                        <h2 id="changelog-progress" className="text-xs font-bold text-muted-foreground tracking-[0.2em] mb-5">
                                            Progress
                                        </h2>
                                        <ul className="space-y-4">
                                            {withPlans.map((status) => {
                                                const { done, total } = planProgress(status.plan);
                                                return (
                                                    <li key={status.slug}>
                                                        <div className="flex items-baseline justify-between gap-4 mb-1.5">
                                                            <span className="text-sm font-semibold text-foreground">{status.title}</span>
                                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                                {done} of {total} milestones done
                                                            </span>
                                                        </div>
                                                        <div
                                                            role="progressbar"
                                                            aria-label={`${status.title} milestones done`}
                                                            aria-valuemin={0}
                                                            aria-valuemax={total}
                                                            aria-valuenow={done}
                                                            className="h-1.5 w-full rounded-full bg-muted overflow-hidden"
                                                        >
                                                            <div
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    width: `${total ? (done / total) * 100 : 0}%`,
                                                                    background: "var(--color-status-live-border)",
                                                                }}
                                                            />
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </section>
                                )}

                                {weeks.map(({ week, notes }) => (
                                    <section key={week} className="mb-12" aria-labelledby={`week-${week}`}>
                                        <h2
                                            id={`week-${week}`}
                                            className="text-xs font-bold text-muted-foreground tracking-[0.2em] mb-5 pb-2 border-b border-border/50"
                                        >
                                            Week of {formatDay(week)}
                                        </h2>
                                        <div className="space-y-10">
                                            {notes.map((note) => (
                                                <WeekNoteEntry key={`${note.projectSlug}-${note.week}`} note={note} />
                                            ))}
                                        </div>
                                    </section>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function WeekNoteEntry({ note }: { note: WeekNote }) {
    return (
        <article data-testid="week-note">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-1">
                {note.projectTitle}
            </div>
            <h3 className="text-lg font-semibold text-foreground leading-snug">{note.title}</h3>
            {note.author && <p className="text-xs text-muted-foreground mt-0.5">Written by {note.author}</p>}

            {note.html && (
                <div
                    className="prose prose-sm prose-zinc dark:prose-invert max-w-none mt-4
                        prose-p:text-foreground/80 dark:prose-p:text-muted-foreground prose-p:leading-relaxed
                        prose-strong:text-foreground"
                    dangerouslySetInnerHTML={{ __html: note.html }}
                />
            )}

            {note.changes.length > 0 && (
                <ul className="mt-5 space-y-3 border-l border-border pl-4" aria-label={`${note.projectTitle} changes`}>
                    {[...note.changes]
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((change, i) => (
                            <li key={`${change.date}-${i}`} data-testid="changelog-entry">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs text-muted-foreground tabular-nums">{formatDay(change.date)}</span>
                                    <ChangeKindLabel kind={change.kind} />
                                </div>
                                <p className="text-sm text-foreground mt-1 leading-snug">{change.title}</p>
                                <div className="mt-1">
                                    <ApproachTrail approach={change.approach} />
                                </div>
                            </li>
                        ))}
                </ul>
            )}
        </article>
    );
}
