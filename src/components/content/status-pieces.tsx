"use client";

// Small building blocks for generated status content: milestone pills,
// change-kind labels and the approach trail (issue → tool → PR → result).

import { ExternalLink, GitPullRequest } from "lucide-react";
import { STATUS_STYLES } from "@/components/content/project-card";
import { Approach, ChangeKind, MilestoneState } from "@/lib/status-schema";

// Milestone states reuse the status pill palette so the page keeps one color language.
const MILESTONE_TONE: Record<MilestoneState, keyof typeof STATUS_STYLES> = {
    done: "Live",
    active: "WIP",
    planned: "Concept",
    paused: "Archived",
};

const MILESTONE_LABEL: Record<MilestoneState, string> = {
    done: "Done",
    active: "In progress",
    planned: "Planned",
    paused: "Paused",
};

export function MilestonePill({ state }: { state: MilestoneState }) {
    const styles = STATUS_STYLES[MILESTONE_TONE[state]];
    return (
        <span
            data-testid="milestone-pill"
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap"
            style={{
                background: styles.background,
                color: styles.color,
                border: `1px solid ${styles.border}`,
            }}
        >
            {MILESTONE_LABEL[state]}
        </span>
    );
}

const KIND_LABEL: Record<ChangeKind, string> = {
    shipped: "Shipped",
    changed: "Changed",
    fixed: "Fixed",
    reverted: "Reverted",
    cut: "Cut",
    started: "Started",
    decided: "Decided",
};

export function ChangeKindLabel({ kind }: { kind: ChangeKind }) {
    return (
        <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider bg-muted text-muted-foreground">
            {KIND_LABEL[kind]}
        </span>
    );
}

/** "https://github.com/o/r/pull/7" → "PR #7"; anything else → "Pull request". */
export function prLabel(url: string): string {
    const match = /\/pull\/(\d+)/.exec(url);
    return match ? `PR #${match[1]}` : "Pull request";
}

const trailLinkClass =
    "inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

/** The visible "how": issue, tool, PR and a result someone can open. */
export function ApproachTrail({ approach }: { approach: Approach }) {
    const { issue, tool, pr, result } = approach;
    if (!issue && !tool && !pr && !result) return null;

    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1" data-testid="approach-trail">
            {issue && <span className="text-xs text-muted-foreground font-mono">{issue}</span>}
            {tool && <span className="text-xs text-muted-foreground">via {tool}</span>}
            {pr && (
                <a href={pr} target="_blank" rel="noopener noreferrer" className={trailLinkClass}>
                    <GitPullRequest className="w-3 h-3" aria-hidden="true" />
                    {prLabel(pr)}
                </a>
            )}
            {result && (
                <a href={result} target="_blank" rel="noopener noreferrer" className={trailLinkClass}>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    Open result
                </a>
            )}
        </div>
    );
}
