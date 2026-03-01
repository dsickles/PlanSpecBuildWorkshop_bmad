"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ABOUT_PARAM } from "@/lib/constants";

export default function AboutRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home with the about parameter set
        router.replace(`/?${ABOUT_PARAM}=true`);
    }, [router]);

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 font-medium text-sm">
            Redirecting to Workshop Context...
        </div>
    );
}
