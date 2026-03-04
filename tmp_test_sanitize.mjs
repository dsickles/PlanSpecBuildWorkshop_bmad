import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

async function test() {
    const content = `<div class="grid grid-cols-2 gap-4"><div class="p-4 border">Item 1</div><div>Item 2</div></div>`;
    const vfile = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .process(content);
    console.log(String(vfile));
}

test().catch(console.error);
