// What a form action sends back to the form after the user presses "Save".
export type FormState = {
  error?: string; // a general problem, e.g. "Snippet not found"
  fieldErrors?: Record<string, string>; // one message per field, e.g. { title: "Give your snippet a title." }
  values?: Record<string, string>; // what the user typed, so we can refill the form
};
