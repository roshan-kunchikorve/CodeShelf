"use client";

// A client component, because copying needs the browser (navigator.clipboard) and a click handler.
import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";

type Props = {
  text: string; // what gets copied
  label: string; // the button text, e.g. "Copy code"
  isPath?: boolean; // true = `text` is a path like /s/123, so we add the site address in front
  small?: boolean;
};

export default function CopyButton({ text, label, isPath = false, small = false }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    // Building the full link in the browser makes it work on localhost AND on the deployed site.
    const value = isPath ? window.location.origin + text : text;
    await navigator.clipboard.writeText(value);

    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // go back to "Copy" after 1.5 seconds
  }

  let Icon = Copy;
  if (isPath) Icon = Link2;
  if (copied) Icon = Check;

  return (
    <button type="button" onClick={handleClick} className={small ? "btn btn-sm" : "btn"}>
      <Icon size={16} aria-hidden="true" />
      <span aria-live="polite">{copied ? "Copied!" : label}</span>
    </button>
  );
}
