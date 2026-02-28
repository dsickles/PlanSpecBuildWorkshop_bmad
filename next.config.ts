import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "unified",
    "remark-parse",
    "remark-gfm",
    "remark-rehype",
    "rehype-sanitize",
    "rehype-stringify",
    "vfile",
    "vfile-message",
    "unist-util-visit",
    "unist-util-is",
    "unist-util-position",
    "mdast-util-from-markdown",
    "mdast-util-to-hast",
    "hast-util-sanitize",
    "hast-util-to-html",
    "hast-util-whitespace",
    "space-separated-tokens",
    "comma-separated-tokens",
    "property-information",
    "html-void-elements",
    "zwitch",
    "decode-named-character-reference",
    "character-entities",
    "trough",
    "bail",
    "is-plain-obj",
    "parse-entities",
    "character-entities-legacy",
    "character-reference-invalid",
    "stringify-entities",
    "character-entities-html4",
    "ccount",
    "markdown-table",
    "devlop",
    "html-url-attributes"
  ]
};

export default nextConfig;
