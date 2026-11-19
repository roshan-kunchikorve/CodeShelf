"use client";

// Asks "are you sure?" before deleting. window.confirm needs the browser, so this is a client component.
import { Trash2 } from "lucide-react";

export default function DeleteButton({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        // If the user clicks "Cancel" we stop the form from being sent.
        if (!window.confirm("Delete this snippet? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className="btn btn-sm hover:bg-danger hover:text-white" aria-label="Delete snippet">
        <Trash2 size={16} aria-hidden="true" />
        Delete
      </button>
    </form>
  );
}
