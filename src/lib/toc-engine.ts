/**
 * Utility for extracting a Table of Contents from Markdown headers.
 */

export interface TocEntry {
    level: number;
    text: string;
    slug: string;
}

/**
 * Generates a URL-safe slug from a string.
 * Mimics common markdown slugification patterns.
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and dashes)
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/--+/g, "-"); // Replace multiple dashes with single dash
}

/**
 * Extracts H2 and H3 headers from a Markdown string.
 */
export function extractToc(markdown: string): TocEntry[] {
    const toc: TocEntry[] = [];

    // Remove code blocks
    const cleanedMarkdown = markdown.replace(/```[\s\S]*?```/g, "");

    const headerRegex = /^(#{2,3})\s+(.+)$/gm;
    let match;
    const seenSlugs = new Set<string>();

    while ((match = headerRegex.exec(cleanedMarkdown)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();

        // AC: Robust slug generation with better unique handling
        const baseSlug = generateSlug(text.replace(/[*_`]/g, ""));
        let slug = baseSlug;
        let suffix = 1;

        while (seenSlugs.has(slug)) {
            slug = `${baseSlug}-${suffix}`;
            suffix++;
        }
        seenSlugs.add(slug);

        toc.push({ level, text, slug });
    }

    return toc;
}

/**
 * Injects ID attributes into HTML headers based on the provided Table of Contents.
 */
export function injectHeadingIds(html: string, toc: TocEntry[]): string {
    let result = html;
    let lastIndex = 0;

    toc.forEach((entry) => {
        const headerTag = `h${entry.level}`;

        // Create a fuzzy regex that matches the header text even if interrupted by tags.
        // We strip Markdown symbols and escape regex characters.
        const plainText = entry.text.replace(/[*_`\[\]()#]/g, " ").trim();
        const words = plainText.split(/\s+/).filter(w => w.length > 0);

        // Escape each word
        const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

        // Construct regex: allow any non-heading-boundary content between words
        // This handles cases like <h2><strong>Bold</strong> Header</h2>
        const fuzzyContent = escapedWords.join(".*?");
        const regex = new RegExp(`(<${headerTag}[^>]*>)(.*?${fuzzyContent}.*?)(</${headerTag}>)`, "i");

        const searchArea = result.substring(lastIndex);
        const match = searchArea.match(regex);

        if (match) {
            const matchIndex = match.index!;
            const fullTag = match[1];
            const content = match[2];
            const endTag = match[3];

            if (!fullTag.includes('id="')) {
                const newTag = fullTag.replace(new RegExp(`^<${headerTag}`, "i"), `<${headerTag} id="${entry.slug}"`);
                const replacement = `${newTag}${content}${endTag}`;

                const before = result.substring(0, lastIndex + matchIndex);
                const after = result.substring(lastIndex + matchIndex + match[0].length);
                result = before + replacement + after;

                lastIndex = before.length + replacement.length;
            } else {
                lastIndex = lastIndex + matchIndex + match[0].length;
            }
        }
    });

    return result;
}
