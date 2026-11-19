// Shows code with syntax colours. This runs on the SERVER, so the browser receives ready-made
// coloured HTML and does not need to download a highlighting library.
import hljs from "highlight.js";
import { getLanguage } from "@/lib/languages";

type Props = {
  code: string;
  language: string;
  maxLines?: number; // show only the first N lines (used for the preview on cards)
};

export default function CodeBlock({ code, language, maxLines }: Props) {
  const lang = getLanguage(language);

  let text = code;
  if (maxLines) {
    text = code.split("\n").slice(0, maxLines).join("\n");
  }

  // highlight.js turns the text into HTML with <span class="hljs-keyword"> and so on.
  // It escapes any HTML inside the code, so it is safe to insert with dangerouslySetInnerHTML.
  const html = hljs.highlight(text, { language: lang.hljs, ignoreIllegals: true }).value;

  return (
    <pre className="overflow-x-auto bg-ink p-3 font-mono text-[13px] leading-5 text-white">
      <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
