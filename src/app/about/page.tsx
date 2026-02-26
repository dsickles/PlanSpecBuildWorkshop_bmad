import { getSortedParsedContent } from "@/lib/content-parser";
import { calculateMetrics } from "@/lib/metrics";
import { Rocket, ArrowLeft, Layers, Github, FileText } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "About | Plan Spec Build Workshop",
    description: "Learn about the Tri-Pillar philosophy, how to use this page, and see project metrics.",
};

export default async function AboutPage() {
    let metrics = {
        totalProjects: 0,
        totalAgents: 0,
        totalDocs: 0,
        totalPrototypes: 0,
    };

    try {
        const allContent = await getSortedParsedContent();
        metrics = calculateMetrics(allContent);
    } catch (error) {
        console.error("Failed to fetch metrics for About page:", error);
        // metrics remain as fallback (0s)
    }

    return (
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl">
            {/* Back Button */}
            <div className="max-w-2xl mx-auto mb-12">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Portfolio
                </Link>
            </div>

            <div className="max-w-2xl mx-auto space-y-20">
                {/* 1. About this page Section */}
                <section>
                    <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">About this page (WIP)</h2>
                    <div className="prose prose-zinc dark:prose-invert">
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                            The <strong>Plan Spec Build Workshop</strong> is grounded in one idea: AI-driven development works best when paired with disciplined product thinking.
                        </p>
                        <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            <p>
                                <strong>Plan:</strong> Identify the right problem. Pressure-test assumptions.
                            </p>
                            <p>
                                <strong>Spec:</strong> Define scope. Clarify behaviors. Remove ambiguity.
                            </p>
                            <p>
                                <strong>Build:</strong> Ship working software that delivers what was defined.
                            </p>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-6">
                            This workshop showcases different AI-driven approaches to running that loop — from early brainstorming to structured specifications to functional prototypes — showcasing how the thinking and the execution are tightly connected.
                        </p>
                    </div>
                </section>

                {/* 2. How to use this page? */}
                <section>
                    <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">How to use this page?</h2>
                    <div className="grid gap-12">
                        {/* Usage Modes */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">Browse Mode</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed">
                                    The default view. Explore all projects and artifacts in a high-density grid.
                                    Use the top filter bar to drill down by Project, Domain, or Tech Stack.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">Focus Mode</h3>
                                <div className="space-y-4">
                                    <p className="text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed">
                                        Creates a focused <strong>Project State</strong> to highlight a specific project, domain, or tech stack for deep study. All state is stored in the URL for easy sharing.
                                    </p>
                                    <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-2 ml-1">
                                        <li>Click any Project filter or the <strong>Layers icon</strong> on any Blueprint or Prototype Card to instantly filter the view to only that project&apos;s artifacts.</li>
                                        <li>Click any Domain or Tech filter to highlight all artifacts in that domain or tech stack.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Structure of the page */}
                            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-6">Structure of the page</h3>
                                <div className="grid gap-8">
                                    <div>
                                        <h4 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">Filters</h4>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                            Located at the top of the workspace. Use these to drill down into specific Domains (e.g., Creative, Engineering) or Tech Stacks (e.g., Next.js, Python). Clicking a filter instantly updates the grid and the URL.
                                        </p>
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-8">
                                        <div>
                                            <h4 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">Agent Studio</h4>
                                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                                The first column. Shows the configured AI agents, their roles, and specialized instruction sets.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">Blueprints</h4>
                                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                                The middle column. Contains the planning documents, architecture specs, and PRDs that guide development.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">Build Lab</h4>
                                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                                The final column. Houses the functional prototypes, live builds, and working software outputs.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Icon Key */}
                        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-6">Icon Key</h3>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <IconKeyItem
                                    icon={<Layers className="w-4 h-4" />}
                                    label="Project State"
                                    description="Filters the entire workspace to artifacts belonging to this specific project."
                                />
                                <IconKeyItem
                                    icon={<Github className="w-4 h-4" />}
                                    label="Source Code"
                                    description="Direct link to the specific repository or module on GitHub."
                                />
                                <IconKeyItem
                                    icon={<FileText className="w-4 h-4" />}
                                    label="Documentation"
                                    description="View the underlying spec, logic, or engineering plan for this artifact."
                                />
                                <IconKeyItem
                                    icon={<Rocket className="w-4 h-4" />}
                                    label="Live Prototype"
                                    description="Open the functional build or deployed version of this component."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. At a Glance (Metrics) */}
                <section>
                    <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                        At a Glance
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <MetricItem label="Projects" value={metrics.totalProjects} />
                        <MetricItem label="Agent Sets" value={metrics.totalAgents} />
                        <MetricItem label="Blueprints" value={metrics.totalDocs} />
                        <MetricItem label="Prototypes" value={metrics.totalPrototypes} />
                    </div>
                </section>

                {/* 4. Open Source CTA */}
                <section className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 text-center">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Fork a Workshop</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
                        This entire portfolio engine is open-source. Use it to showcase your own agentic builds
                        with the same level of transparency and structure.
                    </p>
                    <div className="flex items-center justify-center">
                        <Link
                            href="https://github.com/Sickles/PlanSpecBuildWorkshop_bmad"
                            target="_blank"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-md font-medium transition-colors shadow-lg shadow-blue-500/10"
                        >
                            <Rocket className="w-4 h-4" />
                            Use Template on GitHub
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

function MetricItem({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex flex-col items-center md:items-start">
            <span className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tighter mb-1">
                {value}
            </span>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-500 uppercase tracking-widest leading-none">
                {label}
            </span>
        </div>
    );
}

function IconKeyItem({ icon, label, description }: { icon: React.ReactNode; label: string; description: string }) {
    return (
        <div className="flex gap-4">
            <div className="mt-0.5 shrink-0 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md h-fit">
                <div className="w-4 h-4 text-zinc-600 dark:text-zinc-400 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div>
                <h4 className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100 leading-none mb-1">{label}</h4>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-500 leading-snug">
                    {description}
                </p>
            </div>
        </div>
    );
}
