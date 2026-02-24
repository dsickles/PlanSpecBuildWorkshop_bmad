
interface DashboardGridProps {
    studioColumn: React.ReactNode;
    blueprintsColumn: React.ReactNode;
    labColumn: React.ReactNode;
}

const columnHeaderClass =
    "px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/40";

function ColumnHeader({ label }: { label: string }) {
    return <div className={columnHeaderClass}>{label}</div>;
}

export function DashboardGrid({
    studioColumn,
    blueprintsColumn,
    labColumn,
}: DashboardGridProps) {
    return (
        <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-1 md:grid-cols-3">
            {/* Studio Column */}
            <div className="flex flex-col border-r border-border/40">
                <ColumnHeader label="Studio" />
                <div className="flex-1 p-4">{studioColumn}</div>
            </div>

            {/* Blueprints Column */}
            <div className="flex flex-col border-r border-border/40">
                <ColumnHeader label="Blueprints" />
                <div className="flex-1 p-4">{blueprintsColumn}</div>
            </div>

            {/* Lab Column — no border-r (rightmost column) */}
            <div className="flex flex-col">
                <ColumnHeader label="Lab" />
                <div className="flex-1 p-4">{labColumn}</div>
            </div>
        </div>
    );
}
