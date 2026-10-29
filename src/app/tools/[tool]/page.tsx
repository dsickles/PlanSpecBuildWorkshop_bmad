import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage, LinkSection } from "@/components/layout/article-page";
import { articleMetadata, findPage, toolParams } from "@/lib/page-data";
import { TOOLS_SEGMENT, workshopHref } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
    return toolParams();
}

type Props = { params: Promise<{ tool: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { tool } = await params;
    const page = await findPage(`/${TOOLS_SEGMENT}/${tool}`);
    if (!page) return {};
    return articleMetadata(page.article, `/${TOOLS_SEGMENT}/${tool}`, "Agent Studio");
}

export default async function ToolPage({ params }: Props) {
    const { tool } = await params;
    const page = await findPage(`/${TOOLS_SEGMENT}/${tool}`);
    if (!page) notFound();
    const { article } = page;

    const usedOn = (article.associatedProjects ?? []).map((project) => ({ title: project.title, href: `/${project.slug}` }));
    const links = article.links.map((link) => ({ title: link.label, href: link.url, external: true }));

    return (
        <ArticlePage article={article} eyebrow="Agent Studio" eyebrowHref="/" workshopHref={workshopHref(article)}>
            <LinkSection title="Used on" links={usedOn} />
            <LinkSection title="Links" links={links} />
        </ArticlePage>
    );
}
