"use client";

import { useState } from "react";
import { ChevronDown, History } from "lucide-react";
import { MilestonePill } from "@/components/content/status-pieces";
import { Milestone, ProjectStatus, formatDay, planProgress } from "@/lib/status-schema";

interface PlanPanelProps {
    status: ProjectStatus;
    /** Opens the changelog focused on this project. */
    onChangelogOpen?: () => void;
}

function milestoneDates({ started, finished }: Milestone): string | null {
    if (started && finished) return `${formatDay(started)} to ${formatDay(finished)}`;
    if (finished) return `Finished ${formatDay(finished)}`;
    if (started) return `Started ${formatDay(started)}`;
    return null;
}

/**
 * The project's generated plan, shown at the top of its Blueprints group.
 * Collapsed, it is one row with progress; expanded, it lists every milestone.
 */
export function PlanPanel({ status, onChangelogOpen }: PlanPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { plan, weeks } = status;
    const { done, total } = planProgress(plan);
    const latest = weeks[0];

    return (
        <div data-testid="plan-panel" className="border-b border-zinc-100 dark:border-zinc-800/60">
            <div className="flex items-center justify-between px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-150">
                <button
                    onClick={() => setIsOpen((open) => !open)}
                    aria-expanded={isOpen}
                    disabled={!plan}
                    className="flex-1 flex items-baseline gap-2 min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-400 rounded-sm py-1 disabled:cursor-default"
                >
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">Plan</span>
                    {plan && (
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                            {done} of {total} milestones done
                        </span>
                    )}
                </button>
                <div className="flex items-center gap-1 shrink-0 ml-4">
                    {onChangelogOpen && weeks.length > 0 && (
                        <button
                            onClick={onChangelogOpen}
                            aria-label={`Open ${status.title} changelog`}
                            className="flex items-center justify-center rounded-md p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400"
                        >
                            <History size={14} />
                        </button>
                    )}
                    {plan && (
                        <button
                            onClick={() => setIsOpen((open) => !open)}
                            aria-label={isOpen ? "Collapse plan" : "Expand plan"}
                            className="flex items-center justify-center rounded-md p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400"
                        >
                            <ChevronDown
                                size={14}
                                className={["transition-transform duration-200", isOpen ? "rotate-180" : ""].join(" ")}
                            />
                        </button>
                    )}
                </div>
            </div>

            {plan && (
                <div className="px-4 pb-2" aria-hidden="true">
                    <div className="h-1 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                            className="h-full rounded-full"
                            style={{
                                width: `${total ? (done / total) * 100 : 0}%`,
                                background: "var(--color-status-live-border)",
                            }}
                        />
                    </div>
                </div>
            )}

            {isOpen && plan && (
                <ol
                    data-testid="plan-milestones"
                    className="px-4 pb-3 pt-1 space-y-2.5 bg-zinc-50/50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800/60"
                >
                    {plan.milestones.map((milestone) => {
                        const dates = milestoneDates(milestone);
                        return (
                            <li key={milestone.name} className="pt-2">
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-sm text-zinc-900 dark:text-zinc-100 leading-snug">
                                        {milestone.name}
                                    </span>
                                    <MilestonePill state={milestone.state} />
                                </div>
                                {dates && (
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{dates}</p>
                                )}
                                {milestone.summary && (
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                                        {milestone.summary}
                                    </p>
                                )}
                            </li>
                        );
                    })}
                    <li className="pt-1 text-[0.7rem] text-zinc-400 dark:text-zinc-500">
                        Plan updated {formatDay(plan.updated)}
                    </li>
                </ol>
            )}

            {latest && onChangelogOpen && (
                <button
                    onClick={onChangelogOpen}
                    className="w-full text-left px-4 pb-3 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-visible:outline-none focus-visible:underline"
                >
                    Latest week note: <span className="text-zinc-700 dark:text-zinc-300">{latest.title}</span>
                </button>
            )}
        </div>
    );
}
