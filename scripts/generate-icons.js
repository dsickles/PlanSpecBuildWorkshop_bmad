const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const depth = 12;

function generateExtrusion(yOffset, sideColor) {
  let lines = [];
  for (let i = depth; i >= 1; i--) {
    lines.push(`    <use href="#face" y="${yOffset + i}" fill="${sideColor}" />`);
  }
  return lines.join('\n');
}

const topY = 56;
const midY = 78;
const botY = 100;

const tipX = 100;
// Light focal point: TOP-FRONT vertex of the blue top face
// Diamond top-tip is at y = topY - 32.5
const lightCY = topY + 32.5;  // 88.5 — front-bottom vertex of blue top face

// Each layer's 3D block as a hexagon (top-face diamond unioned with bottom-of-extrusion diamond)
function layerHexPoints(faceY, d) {
  const tf = faceY;
  const bf = faceY + d;
  return [
    `${tipX},${tf - 32.5}`,
    `165,${tf}`,
    `165,${bf}`,
    `${tipX},${bf + 32.5}`,
    `35,${bf}`,
    `35,${tf}`,
  ].join(' ');
}

const blueHex = layerHexPoints(topY, depth);
const whiteHex = layerHexPoints(midY, depth);
const grayHex = layerHexPoints(botY, depth);

const fullSvg = `
<svg viewBox="26 10 148 148" xmlns="http://www.w3.org/2000/svg" width="512" height="512">
  <defs>
    <g id="face">
      <g transform="translate(100, 0) scale(1, 0.5) rotate(-45)">
        <rect x="-46" y="-46" width="92" height="92" rx="4" />
      </g>
    </g>

    <filter id="ao-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000000" flood-opacity="0.25" />
    </filter>

    <linearGradient id="edge-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.12" />
      <stop offset="50%" stop-color="#000000" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.12" />
    </linearGradient>

    <linearGradient id="top-blue" x1="50%" y1="100%" x2="50%" y2="0%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <linearGradient id="top-white" x1="50%" y1="100%" x2="50%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e4e4e7" />
    </linearGradient>
    <linearGradient id="top-gray" x1="50%" y1="100%" x2="50%" y2="0%">
      <stop offset="0%" stop-color="#71717a" />
      <stop offset="100%" stop-color="#3f3f46" />
    </linearGradient>

    <!--
      Vertex light: focal point at top-front vertex of blue top face (${tipX}, ${lightCY}).
      Large radius (110px) so gradient is near-zero BEFORE hitting clip boundary — no visible edge.
      Sigmoid-style multi-stop falloff for natural diffusion.
      Peak opacity 0.30 — reads as material ambient catch, not a spotlight.
    -->
    <radialGradient id="vertex-light" cx="${tipX}" cy="${lightCY}" r="110"
                    fx="${tipX}" fy="${lightCY}" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.24" />
      <stop offset="15%"  stop-color="#ffffff" stop-opacity="0.17" />
      <stop offset="35%"  stop-color="#ffffff" stop-opacity="0.09" />
      <stop offset="60%"  stop-color="#ffffff" stop-opacity="0.03" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>

    <!-- Explicit polygon hexagons for clip (librsvg does not support <use> in <clipPath>) -->
    <clipPath id="layers-clip">
      <polygon points="${blueHex}" />
      <polygon points="${whiteHex}" />
      <polygon points="${grayHex}" />
    </clipPath>
  </defs>

  <!-- Gray Layer -->
  <g filter="url(#ao-shadow)">
${generateExtrusion(botY, '#4b4b53')}
    <use href="#face" y="${botY}" fill="url(#top-gray)" />
    <use href="#face" y="${botY}" fill="none" stroke="url(#edge-stroke)" stroke-width="1" />
  </g>

  <!-- White Layer -->
  <g filter="url(#ao-shadow)">
${generateExtrusion(midY, '#d4d4d8')}
    <use href="#face" y="${midY}" fill="url(#top-white)" />
    <use href="#face" y="${midY}" fill="none" stroke="url(#edge-stroke)" stroke-width="1" />
  </g>

  <!-- Blue Layer -->
  <g filter="url(#ao-shadow)">
${generateExtrusion(topY, '#2563eb')}
    <use href="#face" y="${topY}" fill="url(#top-blue)" />
    <use href="#face" y="${topY}" fill="none" stroke="url(#edge-stroke)" stroke-width="1" />
  </g>

  <!-- Unified vertex glow — large enough radius that edge is well outside clip boundary -->
  <ellipse cx="${tipX}" cy="${lightCY}" rx="110" ry="110"
           fill="url(#vertex-light)"
           clip-path="url(#layers-clip)" />
</svg>
`;

async function generateIcons() {
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sizes = [
    { name: 'icon-16x16.png', size: 16 },
    { name: 'icon-32x32.png', size: 32 },
    { name: 'apple-icon.png', size: 180 },
    { name: 'icon-512x512.png', size: 512 }
  ];

  for (const { name, size } of sizes) {
    const destPath = path.join(publicDir, name);
    await sharp(Buffer.from(fullSvg))
      .resize(size, size)
      .png()
      .toFile(destPath);
    console.log(`Generated ${name}`);
  }
}

generateIcons().catch(console.error);
