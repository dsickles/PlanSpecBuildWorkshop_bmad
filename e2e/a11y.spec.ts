import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Accessibility scan (Roadmap 2.0, item 10). Fails on serious and critical
// WCAG 2.1 A/AA violations, in both themes, on each kind of page.

const PAGES = [
    { name: "home grid", path: "/" },
    { name: "filtered grid", path: "/?project=plan-spec-build-workshop" },
    { name: "document modal", path: "/?project=plan-spec-build-workshop&document=plan-spec-build-workshop:docs:prd", dialog: true },
    { name: "changelog", path: "/?changelog=true", dialog: true },
    { name: "about", path: "/?about=true", dialog: true },
    { name: "project page", path: "/plan-spec-build-workshop" },
    { name: "blueprint page", path: "/plan-spec-build-workshop/prd" },
];

async function scan(page: Page) {
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    return results.violations
        .filter((v) => v.impact === "serious" || v.impact === "critical")
        .map((v) => ({ id: v.id, impact: v.impact, help: v.help, targets: v.nodes.slice(0, 5).map((n) => n.target.join(" ")) }));
}

for (const theme of ["light", "dark"] as const) {
    test.describe(`${theme} theme`, () => {
        test.use({ colorScheme: theme });

        for (const { name, path, dialog } of PAGES) {
            test(`${name} has no serious accessibility violations`, async ({ page }) => {
                await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
                await page.goto(path);
                if (dialog) await expect(page.getByRole("dialog")).toBeVisible();
                else await page.waitForLoadState("networkidle");
                expect(await scan(page)).toEqual([]);
            });
        }
    });
}
