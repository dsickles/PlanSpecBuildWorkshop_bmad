"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFilterState } from "@/hooks/useFilterState";
import { Rocket, Layers, Github, FileText, ArrowLeft } from "lucide-react";
import { LogoIcon } from "@/components/custom/LogoIcon";
import { ParsedArticle, ErrorFrontmatter } from "@/lib/schema";
import { calculateMetrics } from "@/lib/metrics";

interface AboutModalProps {
    allContent: (ParsedArticle | ErrorFrontmatter)[];
}

export function AboutModal({ allContent }: AboutModalProps) {
    const { activeAbout, setAbout } = useFilterState();

    const metrics = React.useMemo(() => {
        try {
            return calculateMetrics(allContent);
        } catch (e) {
            return { totalProjects: 0, totalAgents: 0, totalDocs: 0, totalPrototypes: 0 };
        }
    }, [allContent]);

    const handleOpenChange = (open: boolean) => {
        setAbout(open);
    };

    return (
        <Dialog open={activeAbout} onOpenChange={handleOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="max-w-7xl h-[90vh] bg-background border-border text-foreground p-0 shadow-2xl overflow-hidden flex flex-col"
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>About the Plan-Spec-Build Workshop</DialogTitle>
                </DialogHeader>
                {/* Header / Navigation */}
                <div className="shrink-0 bg-background border-b border-border/50 z-20 relative">
                    <div className="bg-background px-8 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* h-16: matches the homepage's 1.21× icon-to-text-block ratio (53px text block × 1.21 ≈ 64px = h-16). */}
                            <LogoIcon className="w-auto h-16 shrink-0" aria-hidden="true" />
                            <div className="overflow-hidden">
                                <h2 className="text-2xl font-semibold tracking-tight text-foreground leading-tight whitespace-nowrap">
                                    Plan Spec Build Workshop
                                </h2>
                                <p className="text-sm text-muted-foreground mt-0.5 whitespace-nowrap">
                                    AI-powered context engineering in practice, from concept to production.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAbout(false)}
                            className="text-muted-foreground hover:text-foreground hover:bg-accent px-3 flex items-center gap-2 group shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Back
                        </Button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="container mx-auto px-8 md:px-12 py-8 max-w-7xl">
                        {/* ROW 1: PHILOSOPHY */}
                        <section className="mb-12">
                            <h2 className="text-xs font-bold text-muted-foreground tracking-[0.2em] mb-8">
                                01 // Philosophy
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                                {/* LEFT: METHODOLOGY */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-foreground tracking-widest">Plan Spec Build Workshop</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            A disciplined methodology for AI-driven development, focused on extreme clarity and verifiable software execution.
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <StructureItem
                                            title="Plan"
                                            description="Identify the right problem. Pressure-test assumptions."
                                        />
                                        <StructureItem
                                            title="Spec"
                                            description="Define scope. Clarify Behaviors. Remove ambiguity."
                                        />
                                        <StructureItem
                                            title="Build"
                                            description="Ship working software that delivers what was defined."
                                        />
                                    </div>
                                </div>

                                {/* RIGHT: FRAMEWORK IN PRACTICE */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-foreground tracking-widest">The Framework in Practice</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            This workspace is modularized into three functional zones that demonstrate the full Plan-Spec-Build lifecycle in motion.
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <StructureItem
                                            title="Agent Studio"
                                            description="Specialized AI identities with distinct context boundaries."
                                        />
                                        <StructureItem
                                            title="Blueprints"
                                            description="Verifiable requirements, architecture specs, and PRDs."
                                        />
                                        <StructureItem
                                            title="Build Lab"
                                            description="Functional software, live builds, and integration-ready prototypes."
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ROW 2: OPERATIONS */}
                        <section className="border-t border-border/50 pt-12 mb-12">
                            <h2 className="text-xs font-bold text-muted-foreground tracking-[0.2em] mb-8">
                                02 // Operations
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                                {/* LEFT: MODES */}
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-foreground tracking-widest">Workspace Modes</h3>
                                        <div className="space-y-6">
                                            <StructureItem
                                                title="Browse"
                                                description="The default workspace state. Explore Agent Studio, Blueprints, and Projects through the grid, or use filters to pivot to Focus mode."
                                            />
                                            <StructureItem
                                                title="Focus"
                                                description="Triggered by selecting a specific project or tag. This state isolates the workspace for deep-dives into specific topics."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: IDENTIFIERS */}
                                <div className="space-y-8">
                                    <h3 className="text-sm font-bold text-foreground tracking-widest">Artifact Identifiers</h3>
                                    <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
                                        <IconKeyItem
                                            icon={<Layers className="w-5 h-5" />}
                                            label="Project State"
                                            description="Focus workspace to one project."
                                        />
                                        <IconKeyItem
                                            icon={<Github className="w-5 h-5" />}
                                            label="Source Repo"
                                            description="Link to repo."
                                        />
                                        <IconKeyItem
                                            icon={<FileText className="w-5 h-5" />}
                                            label="Active Spec"
                                            description="View more details."
                                        />
                                        <IconKeyItem
                                            icon={<Rocket className="w-5 h-5" />}
                                            label="Live Build"
                                            description="Launch the prototype."
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* FULL WIDTH SYSTEM ACTIVITY */}
                        <div className="space-y-10 mb-12">
                            <section>
                                <h2 className="text-xs font-bold text-muted-foreground tracking-[0.2em] mb-8">
                                    03 // System Activity
                                </h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-8 md:gap-12 bg-muted/30 border border-border/50 rounded-3xl p-10 md:p-12">
                                        <MetricItem label="Projects" value={metrics.totalProjects} />
                                        <MetricItem label="Agents" value={metrics.totalAgents} />
                                        <MetricItem label="Blueprints" value={metrics.totalDocs} />
                                        <MetricItem label="Prototypes" value={metrics.totalPrototypes} />
                                    </div>

                                    {/* CTA Card */}
                                    <div className="bg-muted border border-border p-10 md:p-12 flex flex-col justify-center gap-8 rounded-3xl">
                                        <div className="space-y-3">
                                            <h3 className="text-base font-semibold text-foreground">Build your own workshop</h3>
                                            <p className="text-sm text-zinc-400 leading-relaxed m-0">
                                                Fork the open-source portfolio engine to showcase your agentic builds with the same structure.
                                            </p>
                                        </div>
                                        <Button
                                            asChild
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg text-sm font-bold transition-all w-fit shadow-lg"
                                        >
                                            <a href="https://github.com/dsickles/PlanSpecBuildWorkshop_bmad" target="_blank">
                                                <Github className="w-5 h-5 mr-2" />
                                                Use Repository
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function StructureItem({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex gap-4 items-start">
            <div className="mt-2.5 w-1 h-1 rounded-full bg-muted-foreground shrink-0" />
            <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground leading-tight tracking-wide">{title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed m-0">
                    {description}
                </p>
            </div>
        </div>
    );
}

function MetricItem({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex flex-col items-center md:items-start">
            <span className="text-4xl font-bold text-foreground tracking-tighter leading-none mb-1.5">
                {value}
            </span>
            <span className="text-xs font-bold text-muted-foreground tracking-widest leading-none">
                {label}
            </span>
        </div>
    );
}

function IconKeyItem({ icon, label, description }: { icon: React.ReactNode; label: string; description: string }) {
    return (
        <div className="flex gap-4 items-start">
            <div className="mt-0.5 shrink-0 bg-muted border border-border p-2.5 rounded-xl h-fit">
                <div className="w-5 h-5 text-foreground flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div className="space-y-1">
                <h4 className="text-base font-bold text-foreground leading-tight">{label}</h4>
                <p className="text-sm text-muted-foreground leading-snug m-0">
                    {description}
                </p>
            </div>
        </div>
    );
}
