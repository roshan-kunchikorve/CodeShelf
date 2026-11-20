// The landing page (the "/" route).
import Link from "next/link";
import { Globe, Search, Terminal } from "lucide-react";
import { auth } from "@/auth";
import CodeBlock from "@/components/CodeBlock";
import { getLanguage } from "@/lib/languages";

const features = [
  {
    icon: Search,
    title: "Find it in seconds",
    text: "Search by title, description, code or tag. Filter by language, or show only your favorites.",
  },
  {
    icon: Globe,
    title: "Share with a link",
    text: "Make a snippet public to get a link anyone can open. Private snippets stay private.",
  },
  {
    icon: Terminal,
    title: "Copy it or curl it",
    text: "Copy with one click, or fetch the raw code from a terminal with a short URL.",
  },
];

// A little pile of example snippets for the hero. They are real CodeBlocks, not screenshots.
function MiniCard(props: { title: string; language: string; code: string; className: string }) {
  const language = getLanguage(props.language);

  return (
    <div className={`card absolute flex w-[88%] overflow-hidden ${props.className}`}>
      <div className="w-3 shrink-0 border-r-2 border-ink" style={{ backgroundColor: language.color }} />
      <div className="min-w-0 flex-1 p-3">
        <p className="mb-2 font-bold">{props.title}</p>
        <div className="border-2 border-ink">
          <CodeBlock code={props.code} language={props.language} />
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const session = await auth();

  return (
    <>
      <section className="grid items-center gap-12 py-6 md:grid-cols-2">
        <div>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Every snippet you’ve ever needed, on one shelf.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Save code with tags, find it again with search, and send a link when a friend asks how you did it.
          </p>
          <div className="mt-8">
            {session?.user ? (
              <Link href="/dashboard" className="btn btn-primary text-lg">
                Open your shelf
              </Link>
            ) : (
              <Link href="/login" className="btn btn-primary text-lg">
                Start your shelf
              </Link>
            )}
          </div>
        </div>

        <div className="relative mx-auto hidden h-[460px] w-full max-w-md md:block" aria-hidden="true">
          <MiniCard
            title="debounce.js"
            language="javascript"
            className="left-0 top-0 -rotate-3"
            code={`function debounce(fn, wait = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}`}
          />
          <MiniCard
            title="chunk.py"
            language="python"
            className="right-0 top-40 rotate-2"
            code={`def chunk(items, size):
    for i in range(0, len(items), size):
        yield items[i:i + size]`}
          />
          <MiniCard
            title="busy_customers.sql"
            language="sql"
            className="bottom-0 left-6 -rotate-1"
            code={`SELECT email, COUNT(*) AS orders
FROM orders
GROUP BY email
HAVING COUNT(*) > 5;`}
          />
        </div>
      </section>

      <section className="mt-20 grid gap-8 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="border-t-2 border-ink pt-4">
              <span className="mb-3 grid size-10 place-items-center border-2 border-ink bg-lemon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <h2 className="text-xl font-bold">{feature.title}</h2>
              <p className="mt-1 text-muted">{feature.text}</p>
            </div>
          );
        })}
      </section>
    </>
  );
}
