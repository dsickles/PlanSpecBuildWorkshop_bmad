import { findPage, toolParams } from "@/lib/page-data";
import { TOOLS_SEGMENT } from "@/lib/routes";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const dynamicParams = false;

export function generateStaticParams() {
    return toolParams();
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Agent Studio tool";

export default async function Image({ params }: { params: Promise<{ tool: string }> }) {
    const { tool } = await params;
    const page = await findPage(`/${TOOLS_SEGMENT}/${tool}`);
    return renderOgImage({
        eyebrow: "Agent Studio",
        title: page?.article.title ?? tool,
        description: page?.article.description,
    });
}
