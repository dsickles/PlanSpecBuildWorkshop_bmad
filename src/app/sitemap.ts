import type { MetadataRoute } from "next";
import { loadPages } from "@/lib/page-data";
import { siteUrl } from "@/lib/routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { pages } = await loadPages();
    return [
        { url: `${siteUrl()}/`, changeFrequency: "weekly", priority: 1 },
        ...pages.map(({ article, path }) => ({
            url: `${siteUrl()}${path}`,
            lastModified: article.date,
            changeFrequency: "monthly" as const,
            priority: article.artifactType === "agent" ? 0.5 : 0.7,
        })),
    ];
}
