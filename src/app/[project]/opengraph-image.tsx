import { findPage, projectParams } from "@/lib/page-data";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const dynamicParams = false;

export function generateStaticParams() {
    return projectParams();
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Project overview";

export default async function Image({ params }: { params: Promise<{ project: string }> }) {
    const { project } = await params;
    const page = await findPage(`/${project}`);
    return renderOgImage({
        eyebrow: "Project",
        title: page?.article.title ?? project,
        description: page?.article.description,
    });
}
