
interface DashboardGridProps {
    studioColumn: React.ReactNode;
    blueprintsColumn: React.ReactNode;
    labColumn: React.ReactNode;
}

const columnHeaderClass =
    "text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-500 mb-3 pb-2 border-b border-zinc-200 dark:border-zinc-800";

function ColumnHeader({ label }: { label: string }) {
    return <div className={columnHeaderClass}>{label}</div>;
}

export function DashboardGrid({
    studioColumn,
    blueprintsColumn,
    labColumn,
}: DashboardGridProps) {
    return (
        <div id="discovery-grid" data-testid="discovery-grid" className="grid min-h-[calc(100vh-3.5rem)] grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Studio Column */}
            <div className="flex flex-col">
                <ColumnHeader label="Agent Studio" />
                <div className="flex-1">{studioColumn}</div>
            </div>

            {/* Blueprints Column */}
            <div className="flex flex-col">
                <ColumnHeader label="Blueprints" />
                <div className="flex-1">{blueprintsColumn}</div>
            </div>

            {/* Lab Column */}
            <div className="flex flex-col">
                <ColumnHeader label="Build Lab" />
                <div className="flex-1">{labColumn}</div>
            </div>
        </div>
    );
}
