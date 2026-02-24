import { Info, Moon, Sun } from "lucide-react";
import Link from "next/link";

const iconButtonClass =
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300 h-9 w-9";

export function GlobalHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8 mx-auto">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold">
                            Plan. Spec. Build. Workshop
                        </span>
                    </Link>
                </div>

                {/* Mobile Logo Fallback */}
                <div className="flex flex-1 md:hidden">
                    <span className="font-bold">
                        PSB Workshop
                    </span>
                </div>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center gap-2">
                        <button
                            className={iconButtonClass}
                            type="button"
                            aria-label="Information"
                        >
                            <Info className="h-4 w-4" />
                        </button>
                        <button
                            className={iconButtonClass}
                            type="button"
                            aria-label="Toggle theme"
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
}
