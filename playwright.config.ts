import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end smoke tests and the accessibility scan (Roadmap 2.0, item 10).
 * They run against a production build: `npm run build` first, then
 * `npm run e2e`. Jest ignores the e2e/ folder.
 */
const PORT = Number(process.env.E2E_PORT ?? 3100);

export default defineConfig({
    testDir: "e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: "retain-on-failure",
    },
    projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
    webServer: {
        command: `npx next start -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
});
