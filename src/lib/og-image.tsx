import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * The link-preview card for a shareable page: dark, plain, and readable at
 * thumbnail size. Uses next/og's bundled font, so builds need no network.
 */
export function renderOgImage({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
    const clipped = description && description.length > 180 ? `${description.slice(0, 177)}…` : description;
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    background: "#09090b",
                    color: "#fafafa",
                    padding: "72px 80px",
                }}
            >
                <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#a1a1aa" }}>
                    {eyebrow}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
                    {clipped && <div style={{ display: "flex", fontSize: 30, lineHeight: 1.4, color: "#a1a1aa" }}>{clipped}</div>}
                </div>
                <div style={{ display: "flex", fontSize: 26, color: "#71717a" }}>Plan Spec Build Workshop</div>
            </div>
        ),
        OG_SIZE
    );
}
