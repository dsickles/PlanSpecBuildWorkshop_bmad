import { AlertCircle } from "lucide-react";

/**
 * DAS-17: shown above a document whose `source_path` target can't be found.
 * The page still renders the local stub below it, so nothing breaks.
 */
export function SourceMissingNotice({ sourcePath }: { sourcePath: string }) {
    return (
        <div
            role="note"
            data-testid="source-missing-notice"
            aria-label="source document missing"
            className="mb-10 flex gap-3 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-sm"
        >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="space-y-1">
                <p className="font-medium text-foreground">This document&apos;s source file can&apos;t be found</p>
                <p className="text-muted-foreground leading-relaxed">
                    It points to <code className="text-xs bg-muted px-1 py-0.5 rounded">{sourcePath}</code>, which
                    isn&apos;t in the repository. What follows is the short placeholder kept alongside it.
                </p>
            </div>
        </div>
    );
}
