import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage, LinkSection } from "@/components/layout/article-page";
import { MilestonePill } from "@/components/content/status-pieces";
import { blueprintNeighbors, findPage, articleMetadata, projectParams } from "@/lib/page-data";
import { articlePath, workshopHref } from "@/lib/routes";
import { isError, ParsedArticle } from "@/lib/schema";
import { getProjectStatuses } from "@/lib/status-parser";
import { formatDay, planProgress } from "@/lib/status-schema";

export const dynamicParams = false;

export function generateStaticParams() {
    return projectParams();
}

type Props = { params: Promise<{ project: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { project } = await params;
    const page = await findPage(`/${project}`);
    if (!page) return {};
    return articleMetadata(page.article, `/${project}`, page.article.title);
}

export default async function ProjectPage({ params }: Props) {
    const { project } = await params;
    const page = await findPage(`/${project}`);
    if (!page) notFound();
    const { content, article } = page;

    const projectItems = content.filter(
        (item): item is ParsedArticle => !isError(item) && item.projectSlug === project && item.id !== article.id
    );
    const blueprints = projectItems
        .filter((item) => item.artifactType === "doc")
        .flatMap((item) => {
            const href = articlePath(item, content);
            return href ? [{ title: item.title, href, note: item.status as string }] : [];
        });
    const builds = projectItems
        .filter((item) => item.artifactType === "prototype")
        .flatMap((item) => item.links.map((link) => ({ title: `${item.title}: ${link.label}`, href: link.url, external: true })));

    const status = (await getProjectStatuses()).find((s) => s.slug === project);
    const { next } = blueprintNeighbors(content, article);

    return (
        <ArticlePage
            article={article}
            eyebrow="All projects"
            eyebrowHref="/"
            workshopHref={`/?project=${encodeURIComponent(project)}`}
            next={next}
        >
            {status?.plan && (
                <section className="mt-16" aria-label="Plan">
                    <div className="flex items-baseline justify-between mb-4">
                        <h2 className="text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase">Plan</h2>
                        <span className="text-xs text-muted-foreground">
                            {planProgress(status.plan).done} of {planProgress(status.plan).total} milestones done · updated {formatDay(status.plan.updated)}
                        </span>
                    </div>
                    <ul className="divide-y divide-border/50 border-y border-border/50">
                        {status.plan.milestones.map((milestone) => (
                            <li key={milestone.name} className="py-3">
                                <div className="flex items-start justify-between gap-4">
                                    <span className="font-medium text-foreground/90">{milestone.name}</span>
                                    <MilestonePill state={milestone.state} />
                                </div>
                                {milestone.summary && <p className="text-sm text-muted-foreground mt-1">{milestone.summary}</p>}
                            </li>
                        ))}
                    </ul>
                    {status.weeks.length > 0 && (
                        <p className="mt-4 text-sm">
                            <a
                                href={`/?project=${encodeURIComponent(project)}&changelog=true`}
                                className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
                            >
                                Read the week notes and changelog
                            </a>
                        </p>
                    )}
                </section>
            )}
            <LinkSection title="Blueprints" links={blueprints} />
            <LinkSection title="Build Lab" links={builds} />
            <p className="sr-only">
                <a href={workshopHref(article)}>Open the overview in the workshop</a>
            </p>
        </ArticlePage>
    );
}
