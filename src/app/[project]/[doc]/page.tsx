import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/layout/article-page";
import { articleMetadata, blueprintNeighbors, blueprintParams, findPage } from "@/lib/page-data";
import { workshopHref } from "@/lib/routes";

export const dynamicParams = false;

export function generateStaticParams() {
    return blueprintParams();
}

type Props = { params: Promise<{ project: string; doc: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { project, doc } = await params;
    const page = await findPage(`/${project}/${doc}`);
    if (!page) return {};
    return articleMetadata(page.article, `/${project}/${doc}`, page.article.projectTitle ?? project);
}

export default async function BlueprintPage({ params }: Props) {
    const { project, doc } = await params;
    const page = await findPage(`/${project}/${doc}`);
    if (!page) notFound();
    const { content, article } = page;
    const { prev, next } = blueprintNeighbors(content, article);

    return (
        <ArticlePage
            article={article}
            eyebrow={article.projectTitle ?? project}
            eyebrowHref={`/${project}`}
            workshopHref={workshopHref(article)}
            prev={prev}
            next={next}
        />
    );
}
