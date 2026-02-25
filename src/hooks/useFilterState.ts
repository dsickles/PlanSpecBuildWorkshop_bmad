"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PROJECT_PARAM, DOMAIN_PARAM, TECH_PARAM } from "@/lib/constants";

export function useFilterState() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Derived State
    const activeProject = searchParams.get(PROJECT_PARAM);
    const activeDomains = searchParams.get(DOMAIN_PARAM)?.split(",").filter(Boolean) || [];
    const activeTech = searchParams.get(TECH_PARAM)?.split(",").filter(Boolean) || [];

    const createQueryString = (params: Record<string, string | string[] | null>) => {
        const newParams = new URLSearchParams(searchParams.toString());

        Object.entries(params).forEach(([key, value]) => {
            if (value === null || (Array.isArray(value) && value.length === 0)) {
                newParams.delete(key);
            } else if (Array.isArray(value)) {
                newParams.set(key, value.join(","));
            } else {
                newParams.set(key, value);
            }
        });

        return newParams.toString();
    };

    const updateUrl = (params: Record<string, string | string[] | null>) => {
        const queryString = createQueryString(params);
        router.push(`${pathname}?${queryString}`, { scroll: false });
    };

    const setProject = (project: string | null) => {
        updateUrl({ [PROJECT_PARAM]: project });
    };

    const toggleDomain = (domain: string) => {
        let newDomains = [...activeDomains];
        if (newDomains.includes(domain)) {
            newDomains = newDomains.filter((d) => d !== domain);
        } else {
            newDomains.push(domain);
        }
        updateUrl({ [DOMAIN_PARAM]: newDomains });
    };

    const toggleTech = (tech: string) => {
        let newTech = [...activeTech];
        if (newTech.includes(tech)) {
            newTech = newTech.filter((t) => t !== tech);
        } else {
            newTech.push(tech);
        }
        updateUrl({ [TECH_PARAM]: newTech });
    };

    const clearFilters = () => {
        router.push(pathname, { scroll: false });
    };

    return {
        activeProject,
        activeDomains,
        activeTech,
        setProject,
        toggleDomain,
        toggleTech,
        clearFilters,
    };
}
