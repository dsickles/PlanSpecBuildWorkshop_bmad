import { expect, test } from "@playwright/test";

// Smoke tests for the paths a visitor actually takes. They run against a
// production build and the real content, so they catch what unit tests miss:
// routing, static generation, hydration and URL-synced modals.

test("home grid shows all three columns", async ({ page }) => {
    await page.goto("/");
    const grid = page.getByTestId("discovery-grid");
    await expect(grid).toBeVisible();
    for (const column of ["Agent Studio", "Blueprints", "Build Lab"]) {
        await expect(grid.getByText(column, { exact: true })).toBeVisible();
    }
});

test("project filter updates the URL and the pill state", async ({ page }) => {
    await page.goto("/");
    const pill = page.getByTestId("filter-pill-plan-spec-build-workshop");
    await pill.click();
    await expect(page).toHaveURL(/[?&]project=plan-spec-build-workshop/);
    await expect(pill).toHaveAttribute("aria-pressed", "true");

    await page.getByTestId("filter-pill-all").click();
    await expect(page).not.toHaveURL(/project=/);
});

test("a blueprint opens in the modal and Prev/Next moves between docs", async ({ page }) => {
    await page.goto("/?project=plan-spec-build-workshop");
    await page.getByRole("button", { name: "Open PRD", exact: true }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/[?&]document=/);
    const firstUrl = page.url();

    await dialog.getByRole("button", { name: "Next" }).click();
    await expect(page).not.toHaveURL(firstUrl);
    await dialog.getByRole("button", { name: "Prev" }).click();
    await expect(page).toHaveURL(firstUrl);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/project=plan-spec-build-workshop/);
});

test("an unknown document shows the not-found state", async ({ page }) => {
    await page.goto("/?document=does-not-exist");
    await expect(page.getByTestId("document-error-fallback")).toBeVisible();
    await page.getByRole("button", { name: "Back to the workshop" }).click();
    await expect(page).not.toHaveURL(/document=/);
});

test("the changelog opens from the header and lists week notes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Changelog", exact: true }).click();
    await expect(page).toHaveURL(/[?&]changelog=true/);
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: "Changelog" })).toBeVisible();
    await expect(dialog.getByTestId("week-note").first()).toBeVisible();
});

test("the plan panel expands to show milestones", async ({ page }) => {
    await page.goto("/?project=plan-spec-build-workshop");
    const panel = page.getByTestId("plan-panel").first();
    await panel.getByRole("button", { name: "Expand plan" }).click();
    await expect(panel.getByTestId("plan-milestones")).toBeVisible();
});

test("a project has a shareable page with its plan and blueprints", async ({ page }) => {
    await page.goto("/plan-spec-build-workshop");
    await expect(page.getByRole("main").getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByRole("region", { name: "Plan" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Blueprints" })).toBeVisible();
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
});

test("a blueprint page links to its neighbours and back to the workshop", async ({ page }) => {
    await page.goto("/plan-spec-build-workshop/prd");
    await expect(page.getByRole("main").getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Blueprint pages" })).toBeVisible();

    await page.getByRole("link", { name: "Open in the workshop" }).click();
    await expect(page).toHaveURL(/[?&]document=/);
    await expect(page.getByRole("dialog")).toBeVisible();
});

test("a project that publishes nothing has no plan on its page", async ({ page }) => {
    await page.goto("/threshold");
    await expect(page.getByRole("main").getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByRole("region", { name: "Plan" })).toHaveCount(0);
});

test("unknown paths return 404", async ({ page }) => {
    const response = await page.goto("/no-such-project/at-all");
    expect(response?.status()).toBe(404);
});

test("sitemap lists the shareable pages", async ({ request }) => {
    const body = await (await request.get("/sitemap.xml")).text();
    expect(body).toContain("/plan-spec-build-workshop/prd");
    expect(body).toContain("/tools/");
});
