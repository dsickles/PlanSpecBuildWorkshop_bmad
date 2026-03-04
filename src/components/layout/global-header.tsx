"use client";

import { Info, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useFilterState } from "@/hooks/useFilterState";
import { useEffect, useState } from "react";
import { LogoIcon } from "@/components/custom/LogoIcon";

const iconButtonClass =
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300 h-9 w-9";

export function GlobalHeader() {
    const { setTheme, resolvedTheme } = useTheme();
    const { setAbout } = useFilterState();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by only rendering the toggle after mounting
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    return (
        <header className="w-full border-b border-zinc-200 dark:border-zinc-800/60 bg-background mb-header-mb">
            <div className="container max-w-screen-2xl mx-auto px-4 md:px-8 py-6 md:py-8 flex items-start justify-between">
                <div className="flex items-center gap-4">
                    {/* h-14/h-20: calibrated to match the two-line text block height at text-3xl + text-base. */}
                    <LogoIcon className="w-auto h-14 md:h-20 shrink-0" aria-hidden="true" />
                    <div className="overflow-hidden">
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white whitespace-nowrap">
                            Plan Spec Build Workshop
                        </h1>
                        <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1 whitespace-nowrap">
                            AI-powered context engineering in practice, from concept to working prototype.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-8">
                    <nav className="flex items-center gap-2">
                        {mounted ? (
                            <button
                                className={iconButtonClass}
                                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                                type="button"
                                aria-label="Toggle theme"
                            >
                                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </button>
                        ) : (
                            <div className={`${iconButtonClass} opacity-0 pointer-events-none`} aria-hidden="true" />
                        )}
                        <button
                            onClick={() => setAbout(true)}
                            className={iconButtonClass}
                            aria-label="Information"
                            type="button"
                        >
                            <Info className="h-4 w-4" />
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
}
