"use client";

// Client-side compound card component — safe to import from Server Components.

import React from "react";
import { Rocket, Layers, Github, FileText, Globe } from "lucide-react";
import { ArtifactType } from "@/lib/schema";
import { getDocIdFromPath } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Status Pill — "Tinted Neutrality" exact rgba values per UX Specification
// ---------------------------------------------------------------------------

type StatusValue = "Live" | "WIP" | "Concept" | "Archived";

const STATUS_STYLES: Record<
    StatusValue,
    { background: string; color: string; border: string }
> = {
    Live: {
        background: "var(--color-status-live-bg)",
        color: "var(--color-status-live-text)",
        border: "var(--color-status-live-border)",
    },

    WIP: {
        background: "var(--color-status-wip-bg)",
        color: "var(--color-status-wip-text)",
        border: "var(--color-status-wip-border)",
    },

    Concept: {
        background: "var(--color-status-concept-bg)",
        color: "var(--color-status-concept-text)",
        border: "var(--color-status-concept-border)",
    },

    Archived: {
        background: "var(--color-status-archived-bg)",
        color: "var(--color-status-archived-text)",
        border: "var(--color-status-archived-border)",
    },
};

function StatusPill({ status }: { status: string }) {
    const styles = STATUS_STYLES[status as StatusValue] ?? STATUS_STYLES.Concept;
    return (
        <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
            style={{
                background: styles.background,
                color: styles.color,
                border: `1px solid ${styles.border}`,
            }}
        >
            {status}
        </span>
    );
}

// ---------------------------------------------------------------------------
// Tag components — "Tinted Neutrality" Functional vs Tech variants
// ---------------------------------------------------------------------------

function FnTag({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center rounded px-2 py-0.5 text-xs bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {label}
        </span>
    );
}

function TechTag({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center rounded px-2 py-0.5 text-xs border border-zinc-200 text-zinc-500 bg-transparent dark:border-zinc-800 dark:text-zinc-400">
            {label}
        </span>
    );
}

// ---------------------------------------------------------------------------
// ProjectCard.Root
// Hover: background shifts zinc-900 → zinc-800/80. No drop-shadows.
// ---------------------------------------------------------------------------

interface ProjectCardRootProps {
    children: React.ReactNode;
    isDashed?: boolean;
    className?: string;
    "data-testid"?: string;
    "aria-label"?: string;
}

function ProjectCardRoot({
    children,
    isDashed = false,
    className = "",
    "data-testid": testId,
    "aria-label": ariaLabel,
}: ProjectCardRootProps) {
    return (
        <div
            data-testid={testId}
            aria-label={ariaLabel}
            className={[
                "rounded-lg border p-4",
                "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
                "transition-colors duration-200",
                "hover:bg-zinc-50 hover:border-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:border-zinc-700",
                isDashed ? "border-dashed" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </div>
    );
}

// ---------------------------------------------------------------------------
// ProjectCard.Header
// Renders title (h3), optional date, and Status Pill inline.
// ---------------------------------------------------------------------------

interface ProjectCardHeaderProps {
    title: string;
    /** Optional status for the pill */
    status?: string;
    date?: string;
    /** Slot for right-aligned action buttons (icons) */
    actions?: React.ReactNode;
}

function ProjectCardHeader({
    title,
    status,
    actions,
}: ProjectCardHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="text-lg font-semibold leading-tight line-clamp-2 text-zinc-900 dark:text-white">
                        {title}
                    </h3>
                    {status && <StatusPill status={status} />}
                </div>
            </div>
            {actions && (
                <div className="flex items-center gap-1 shrink-0">{actions}</div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// ProjectCard.Metadata
// Domain tags (fn) and Tech Stack tags (tc)
// ---------------------------------------------------------------------------

interface ProjectCardMetadataProps {
    domain?: string[];
    tech_stack?: string[];
}

function ProjectCardMetadata({
    domain = [],
    tech_stack = [],
}: ProjectCardMetadataProps) {
    if (domain.length === 0 && tech_stack.length === 0) return null;

    return (
        <div className="mt-3 space-y-1.5">
            {domain.length > 0 && (
                <div className="flex flex-wrap gap-1.5 overflow-hidden">
                    {domain.map((tag) => (
                        <FnTag key={tag} label={tag} />
                    ))}
                </div>
            )}
            {tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 overflow-hidden">
                    {tech_stack.map((tag) => (
                        <TechTag key={tag} label={tag} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// ProjectCard.Body
// Description text — line-clamp-3 prevents grid layout blow-out
// ---------------------------------------------------------------------------

interface ProjectCardBodyProps {
    description?: string;
    children?: React.ReactNode;
}

function ProjectCardBody({ description, children }: ProjectCardBodyProps) {
    if (!description && !children) return null;

    return (
        <div className="mt-2">
            {description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">{description}</p>
            )}
            {children}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Secondary icon button helper — shared style for Layers, GitHub, FileText
// ---------------------------------------------------------------------------

function IconButton({
    icon: Icon,
    label,
    onClick,
    href,
    id,
}: {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    href?: string;
    id?: string;
}) {
    const cls =
        "flex items-center justify-center rounded-md p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-zinc-400";

    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={cls}
            >
                <Icon size={14} />
            </a>
        );
    }

    return (
        <button id={id} onClick={onClick} aria-label={label} className={cls}>
            <Icon size={14} />
        </button>
    );
}

// ---------------------------------------------------------------------------
// Specialized card variants built from the compound sub-components above
// ---------------------------------------------------------------------------

/** Props accepted by the top-level ProjectCard function */
export interface ProjectCardProps {
    title: string;
    status: string;
    description?: string;
    taxonomy?: { domain?: string[]; tech_stack?: string[] };
    artifactType: ArtifactType;
    /** Optional context for semantic ARIA labels: 'agent', 'doc', 'prototype' */
    context?: "agent" | "doc" | "prototype";
    /** Callback for Layers icon — triggers Focus Mode filter */
    onLayersClick?: () => void;
    /** Callback for doc card file icon — opens Document Modal */
    onDocOpen?: () => void;
    /** Consolidated links from frontmatter */
    links?: { label: string; url: string }[];
}

export function ProjectCard({
    title,
    status,
    description,
    taxonomy,
    artifactType,
    context,
    onLayersClick,
    onDocOpen,
    links,
}: ProjectCardProps) {
    const cardContext = context || (artifactType as "agent" | "doc" | "prototype");
    const testId = `${cardContext}-card`;
    const ariaLabel = `${title} ${cardContext} card`;

    // Concept or Archived prototypes hide the live launch CTA and GitHub link
    const isInactive = status === "Concept" || status === "Archived";

    // ---- Agent card — header icons for external links ----
    if (artifactType === "agent") {
        const actions = (links && links.length > 0) || onLayersClick || onDocOpen ? (
            <>
                {onLayersClick && (
                    <IconButton icon={Layers} label="Focus on this project" onClick={onLayersClick} />
                )}
                {onDocOpen && (
                    <IconButton icon={FileText} label="View project overview" onClick={onDocOpen} />
                )}
                {links?.map((link, idx) => {
                    const label = link.label.toLowerCase();
                    const isGithub = label.includes("github");
                    const icon = isGithub ? Github : Globe;
                    const actionLabel = isGithub ? `View ${link.label} repository` : `Visit ${link.label} website`;
                    return (
                        <IconButton
                            key={`${link.url}-${idx}`}
                            icon={icon}
                            label={actionLabel}
                            href={link.url}
                        />
                    );
                })}
            </>
        ) : undefined;

        return (
            <ProjectCardRoot data-testid={testId} aria-label={ariaLabel}>
                <ProjectCardHeader title={title} status={status} actions={actions} />
                <ProjectCardBody description={description} />
                <ProjectCardMetadata domain={taxonomy?.domain} tech_stack={taxonomy?.tech_stack} />
            </ProjectCardRoot>
        );
    }

    // ---- Prototype card — Rocket CTA (blue) as primary action ----
    if (artifactType === "prototype") {
        const githubLink = links?.find(l => l.label.toLowerCase().includes("github"));
        const externalLink = links?.find(l => !l.label.toLowerCase().includes("github"));

        const actions = (
            <>
                {onLayersClick && (
                    <IconButton icon={Layers} label="Focus on this project" onClick={onLayersClick} />
                )}
                {onDocOpen && (
                    <IconButton icon={FileText} label="View project overview" onClick={onDocOpen} />
                )}
                {!isInactive && githubLink && (
                    <IconButton icon={Github} label="View source on GitHub" href={githubLink.url} />
                )}
                {!isInactive && externalLink && (
                    <a
                        href={externalLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Launch prototype"
                        className="flex items-center justify-center rounded-md p-1.5 bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                        <Rocket size={14} />
                    </a>
                )}
            </>
        );

        return (
            <ProjectCardRoot isDashed={isInactive} data-testid={testId} aria-label={ariaLabel}>
                <ProjectCardHeader title={title} status={status} actions={actions} />
                <ProjectCardBody description={description} />
                <ProjectCardMetadata domain={taxonomy?.domain} tech_stack={taxonomy?.tech_stack} />
            </ProjectCardRoot>
        );
    }

    // Doc card — file icon opens Document Modal (Epic 3)
    // Inline the fragment to avoid passing a truthy empty fragment when both callbacks are absent
    return (
        <ProjectCardRoot data-testid={testId} aria-label={ariaLabel}>
            <ProjectCardHeader
                title={title}
                status={status}
                actions={
                    (onLayersClick || onDocOpen) ? (
                        <>
                            {onLayersClick && (
                                <IconButton icon={Layers} label="Focus on this project" onClick={onLayersClick} />
                            )}
                            {onDocOpen && (
                                <IconButton
                                    id={`doc-trigger-${cardContext}-${getDocIdFromPath(cardContext, title)}`}
                                    icon={FileText}
                                    label="View document"
                                    onClick={onDocOpen}
                                />
                            )}
                        </>
                    ) : undefined
                }
            />
            <ProjectCardBody description={description} />
            <ProjectCardMetadata domain={taxonomy?.domain} tech_stack={taxonomy?.tech_stack} />
        </ProjectCardRoot>
    );
}

// Expose compound sub-components for advanced composition
ProjectCard.Root = ProjectCardRoot;
ProjectCard.Header = ProjectCardHeader;
ProjectCard.Metadata = ProjectCardMetadata;
ProjectCard.Body = ProjectCardBody;
ProjectCard.StatusPill = StatusPill;
ProjectCard.FnTag = FnTag;
ProjectCard.TechTag = TechTag;

// Named exports for use in Server Components (can't access .StatusPill across boundary)
export { StatusPill, FnTag, TechTag };

// ---------------------------------------------------------------------------
// Fallback Card — utilized for empty states and missing/errored content
// ---------------------------------------------------------------------------

export function FallbackCard({
    title = "Content unavailable",
    description,
    className,
    context,
    children
}: {
    title?: string;
    description?: string;
    className?: string;
    context?: "agent" | "doc" | "prototype";
    children?: React.ReactNode;
}) {
    const testId = context ? `${context}-fallback` : "content-fallback";
    const ariaLabel = context ? `${context} content unavailable` : "content unavailable";

    return (
        <ProjectCardRoot
            isDashed={true}
            className={className}
            data-testid={testId}
            aria-label={ariaLabel}
        >
            <ProjectCardHeader title={title} />
            <ProjectCardBody description={description}>
                {children}
            </ProjectCardBody>
        </ProjectCardRoot>
    );
}
