"use client";

// The form used for BOTH "new snippet" and "edit snippet".
// It is a client component because the code editor and the language dropdown need state in the browser.
import Link from "next/link";
import { useActionState, useState } from "react";
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import type { Snippet } from "@prisma/client";
import { getLanguage, languages } from "@/lib/languages";
import type { FormState } from "@/lib/types";

type Props = {
  // The server action that saves the form: createSnippet, or updateSnippet with an id attached.
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  // Pass an existing snippet to edit it. Leave it out to create a new one.
  snippet?: Snippet;
};

const starterCode = "// Paste or write your code here\n";
const initialState: FormState = {};

// Teaches the editor our colours so it matches the rest of the page.
const defineTheme: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("codeshelf", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#14213d",
      "editor.lineHighlightBackground": "#1c2d52",
      "editorLineNumber.foreground": "#6f7fa3",
    },
  });
};

const handleEditorMount: OnMount = (editor, monaco) => {
  document.fonts.ready.then(() => {
    // Recalculate character widths after fonts load
    monaco.editor.remeasureFonts();

    // Refresh editor layout
    editor.layout();
  });
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm font-semibold text-danger">{message}</p>;
}

export default function SnippetForm({ action, snippet }: Props) {
  // `state` is whatever the action sent back last time: error messages, or the values the user typed.
  // `isPending` is true while the form is being saved.
  const [state, formAction, isPending] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};

  // The editor is not a normal <input>, so its text and the language live in state.
  const [code, setCode] = useState(state.values?.code ?? snippet?.code ?? starterCode);
  const [language, setLanguage] = useState(state.values?.language ?? snippet?.language ?? "javascript");

  // Start with the snippet being edited (if any). After a failed save, refill with what the user typed.
  const title = state.values?.title ?? snippet?.title ?? "";
  const description = state.values?.description ?? snippet?.description ?? "";
  const tags = state.values?.tags ?? snippet?.tags.join(", ") ?? "";
  const isPublic = state.values ? state.values.isPublic === "on" : (snippet?.isPublic ?? false);

  return (
    <form action={formAction} className="card space-y-5 p-6">
      {state.error && (
        <p
          role="alert"
          className="border-2 border-danger p-3 font-semibold text-danger"
        >
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="title" className="mb-1 block font-semibold">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={title}
          maxLength={80}
          placeholder="Debounce a function"
          className="input"
          aria-invalid={Boolean(errors.title)}
        />
        <FieldError message={errors.title} />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block font-semibold">
          Description <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id="description"
          name="description"
          defaultValue={description}
          maxLength={300}
          placeholder="Waits until the user stops typing before running the function"
          className="input"
          aria-invalid={Boolean(errors.description)}
        />
        <FieldError message={errors.description} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="language" className="mb-1 block font-semibold">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="input"
          >
            {languages.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <FieldError message={errors.language} />
        </div>

        <div>
          <label htmlFor="tags" className="mb-1 block font-semibold">
            Tags{" "}
            <span className="font-normal text-muted">
              (separate with commas)
            </span>
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={tags}
            placeholder="react, hooks, utils"
            className="input"
          />
        </div>
      </div>

      <div>
        <p id="code-label" className="mb-1 font-semibold">
          Code
        </p>
        <div
          className="h-80 border-2 border-ink"
          role="group"
          aria-labelledby="code-label"
        >
          <Editor
            height="100%"
            language={getLanguage(language).monaco}
            value={code}
            theme="codeshelf"
            beforeMount={defineTheme}
            onMount={handleEditorMount}
            onChange={(value) => setCode(value ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: '"JetBrains Mono", Consolas, monospace',
              fontWeight: "400",
              fontLigatures: false,
              scrollBeyondLastLine: false,
              tabSize: 2,
              padding: { top: 12, bottom: 12 },
            }}
          /> 
        </div>
        {/* The editor is not a form field, so we copy its text into a hidden input that gets submitted. */}
        <input type="hidden" name="code" value={code} />
        <FieldError message={errors.code} />
      </div>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="isPublic"
          defaultChecked={isPublic}
          className="mt-1 size-5 accent-ink"
        />
        <span>
          <span className="block font-semibold">Make this snippet public</span>
          <span className="block text-sm text-muted">
            Anyone with the link can view it. You can change this any time.
          </span>
        </span>
      </label>

      <div className="flex flex-wrap gap-3 border-t-2 border-ink pt-5">
        <button type="submit" disabled={isPending} className="btn btn-primary">
          {isPending ? "Saving..." : snippet ? "Save changes" : "Save snippet"}
        </button>
        <Link href="/dashboard" className="btn">
          Cancel
        </Link>
      </div>
    </form>
  );
}
