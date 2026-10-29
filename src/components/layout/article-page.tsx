import Link from "next/link";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import { StatusPill, FnTag, TechTag } from "@/components/content/project-card";
import { SourceMissingNotice } from "@/components/content/source-missing-notice";
import { ARTICLE_PROSE_CLASSES } from "@/lib/prose";
import { ParsedArticle } from "@/lib/schema";

export interface PageLink {
    title: string;
    href: string;
}

interface ArticlePageProps {
    article: ParsedArticle;
    /** Small label above the title: the project name, or "Agent Studio". */
    eyebrow: string;
    /** Where the eyebrow links to. */
    eyebrowHref: string;
    /** Opens the same article inside the workshop grid. */
    workshopHref: string;
    prev?: PageLink | null;
    next?: PageLink | null;
    /** Extra sections after the body (plan, blueprint list, build links). */
    children?: React.ReactNode;
}

const navLinkClass =
    "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

/**
 * A standalone, shareable page for one article. Same typography as the
 * document modal, without the grid behind it.
 */
export function ArticlePage({ article, eyebrow, eyebrowHref, workshopHref, prev, next, children }: ArticlePageProps) {
    const domain = article.taxonomy?.domain ?? [];
    const tech = article.taxonomy?.tech_stack ?? [];

    return (
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-screen-2xl">
            <div className="max-w-[70ch] mx-auto">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <Link href={eyebrowHref} className={navLinkClass}>
                        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                        {eyebrow}
                    </Link>
                    <Link href={workshopHref} className={navLinkClass}>
                        <LayoutGrid className="w-4 h-4" aria-hidden="true" />
                        Open in the workshop
                    </Link>
                </div>

                <header className="mb-10 pb-8 border-b border-border/50">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-2">{eyebrow}</div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{article.title}</h1>
                        <StatusPill status={article.status} />
                    </div>
                    {article.description && (
                        <p className="text-base text-muted-foreground mt-3 leading-relaxed">{article.description}</p>
                    )}
                    {(domain.length > 0 || tech.length > 0) && (
                        <div className="space-y-1.5 mt-4">
                            {domain.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {domain.map((d) => <FnTag key={d} label={d} />)}
                                </div>
                            )}
                            {tech.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {tech.map((t) => <TechTag key={t} label={t} />)}
                                </div>
                            )}
                        </div>
                    )}
                </header>

                {article.sourceMissing && <SourceMissingNotice sourcePath={article.sourceMissing} />}
                <article className={ARTICLE_PROSE_CLASSES} dangerouslySetInnerHTML={{ __html: article.html }} />

                {children}

                {(prev || next) && (
                    <nav aria-label="Blueprint pages" className="mt-16 pt-8 border-t border-border/50 grid grid-cols-2 gap-4">
                        <div>
                            {prev && (
                                <Link href={prev.href} className={`${navLinkClass} flex-col items-start`}>
                                    <span className="text-xs uppercase tracking-widest">Previous</span>
                                    <span className="text-foreground font-medium">{prev.title}</span>
                                </Link>
                            )}
                        </div>
                        <div className="text-right">
                            {next && (
                                <Link href={next.href} className={`${navLinkClass} flex-col items-end`}>
                                    <span className="text-xs uppercase tracking-widest inline-flex items-center gap-1">
                                        Next <ArrowRight className="w-3 h-3" aria-hidden="true" />
                                    </span>
                                    <span className="text-foreground font-medium">{next.title}</span>
                                </Link>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </div>
    );
}

/** A titled list of links, used for a project's blueprints and builds. */
export function LinkSection({ title, links }: { title: string; links: (PageLink & { note?: string; external?: boolean })[] }) {
    if (links.length === 0) return null;
    return (
        <section className="mt-16" aria-label={title}>
            <h2 className="text-xs font-bold text-muted-foreground tracking-[0.2em] mb-4 uppercase">{title}</h2>
            <ul className="divide-y divide-border/50 border-y border-border/50">
                {links.map((link) => (
                    <li key={link.href}>
                        {link.external ? (
                            <a href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-baseline justify-between gap-4 py-3 hover:text-foreground text-foreground/90">
                                <span className="font-medium">{link.title}</span>
                                {link.note && <span className="text-xs text-muted-foreground">{link.note}</span>}
                            </a>
                        ) : (
                            <Link href={link.href} className="flex items-baseline justify-between gap-4 py-3 hover:text-foreground text-foreground/90">
                                <span className="font-medium">{link.title}</span>
                                {link.note && <span className="text-xs text-muted-foreground">{link.note}</span>}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}
