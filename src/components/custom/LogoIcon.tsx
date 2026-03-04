import * as React from "react"
import { SVGProps } from "react"
import { cn } from "@/lib/utils"

export function LogoIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
    const depth = 12;
    const extrusion = Array.from({ length: depth });

    const topY = 56;
    const midY = 78;
    const botY = 100;

    const tipX = 100;
    const lightCY = topY + 32.5;  // 88.5 — front-bottom vertex of blue top face

    const sideBlue = "#2563eb";
    const sideWhite = "#d4d4d8";
    const sideGray = "#4b4b53";

    const hexPoints = (faceY: number, d: number) => {
        const tf = faceY;
        const bf = faceY + d;
        return `${tipX},${tf - 32.5} 165,${tf} 165,${bf} ${tipX},${bf + 32.5} 35,${bf} 35,${tf}`;
    };

    return (
        <svg
            // viewBox y-origin is -16 (not 0) to center the art vertically:
            // Art spans y≈23.5 (blue top) to y≈144.5 (gray extrusion bottom), center≈y:84.
            // Shifting origin to -16 moves the geometric center of a 200-tall viewport to y:84. (200/2)+(-16)=84. ✓
            viewBox="0 -16 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            // Default w-8 h-8 (32px); consumer components override via className (e.g., h-16, h-20).
            className={cn("w-8 h-8", className)}
            role="img"
            aria-label="Plan Spec Build Workshop logo"
            focusable="false"
            {...props}
        >
            {/* Title for screen readers — provides accessible name when role="img" */}
            <title>Plan Spec Build Workshop Logo</title>
            <defs>
                <g id="face">
                    <g transform="translate(100, 0) scale(1, 0.5) rotate(-45)">
                        <rect x="-46" y="-46" width="92" height="92" rx="4" />
                    </g>
                </g>

                <filter id="ao-shadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.25" />
                </filter>

                <linearGradient id="edge-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#000000" stopOpacity="0.12" />
                    <stop offset="50%" stopColor="#000000" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
                </linearGradient>

                <linearGradient id="top-blue" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="top-white" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e4e4e7" />
                </linearGradient>
                <linearGradient id="top-gray" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#71717a" />
                    <stop offset="100%" stopColor="#3f3f46" />
                </linearGradient>

                {/* Vertex light: r=110, peak 0.24, sigmoid falloff — wider and dimmer */}
                <radialGradient
                    id="vertex-light"
                    cx={tipX} cy={lightCY} r="110"
                    fx={tipX} fy={lightCY}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.24" />
                    <stop offset="15%" stopColor="#ffffff" stopOpacity="0.17" />
                    <stop offset="35%" stopColor="#ffffff" stopOpacity="0.09" />
                    <stop offset="60%" stopColor="#ffffff" stopOpacity="0.03" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>

                <clipPath id="layers-clip">
                    <polygon points={hexPoints(topY, depth)} />
                    <polygon points={hexPoints(midY, depth)} />
                    <polygon points={hexPoints(botY, depth)} />
                </clipPath>
            </defs>

            {/* Gray Layer */}
            <g filter="url(#ao-shadow)">
                {extrusion.map((_, i) => (
                    <use key={`bg-ext-${i}`} href="#face" y={botY + depth - i} fill={sideGray} />
                ))}
                <use href="#face" y={botY} fill="url(#top-gray)" />
                <use href="#face" y={botY} fill="none" stroke="url(#edge-stroke)" strokeWidth="1" />
            </g>

            {/* White Layer */}
            <g filter="url(#ao-shadow)">
                {extrusion.map((_, i) => (
                    <use key={`mid-ext-${i}`} href="#face" y={midY + depth - i} fill={sideWhite} />
                ))}
                <use href="#face" y={midY} fill="url(#top-white)" />
                <use href="#face" y={midY} fill="none" stroke="url(#edge-stroke)" strokeWidth="1" />
            </g>

            {/* Blue Layer */}
            <g filter="url(#ao-shadow)">
                {extrusion.map((_, i) => (
                    <use key={`top-ext-${i}`} href="#face" y={topY + depth - i} fill={sideBlue} />
                ))}
                <use href="#face" y={topY} fill="url(#top-blue)" />
                <use href="#face" y={topY} fill="none" stroke="url(#edge-stroke)" strokeWidth="1" />
            </g>

            {/* Unified vertex glow — clipped to layer polygons */}
            <ellipse
                cx={tipX} cy={lightCY}
                rx={110} ry={110}
                fill="url(#vertex-light)"
                clipPath="url(#layers-clip)"
            />
        </svg>
    )
}
