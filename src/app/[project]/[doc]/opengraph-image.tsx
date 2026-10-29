import { findPage, blueprintParams } from "@/lib/page-data";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const dynamicParams = false;

export function generateStaticParams() {
    return blueprintParams();
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Blueprint";

export default async function Image({ params }: { params: Promise<{ project: string; doc: string }> }) {
    const { project, doc } = await params;
    const page = await findPage(`/${project}/${doc}`);
    return renderOgImage({
        eyebrow: page?.article.projectTitle ?? project,
        title: page?.article.title ?? doc,
        description: page?.article.description,
    });
}
