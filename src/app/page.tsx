import { getSortedParsedContent } from "@/lib/content-parser";
import { DashboardGrid } from "@/components/layout/dashboard-grid";

export default async function Home() {
  // Pre-fetch content — Epic 2 will render these as cards
  await getSortedParsedContent();

  return (
    <DashboardGrid
      studioColumn={
        <div className="text-sm text-muted-foreground">
          Studio column {"\u2014"} project agent cards will appear here.
        </div>
      }
      blueprintsColumn={
        <div className="text-sm text-muted-foreground">
          Blueprints column {"\u2014"} document cards will appear here.
        </div>
      }
      labColumn={
        <div className="text-sm text-muted-foreground">
          Lab column {"\u2014"} prototype cards will appear here.
        </div>
      }
    />
  );
}

