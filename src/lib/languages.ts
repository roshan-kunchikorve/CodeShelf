// Every language CodeShelf supports, in one place.
//   value  -> what we store in the database
//   label  -> what the user sees
//   color  -> the colour of the "spine" on each snippet card
//   monaco -> the name the code editor uses for this language
//   hljs   -> the name the syntax highlighter uses for this language
export type Language = {
  value: string;
  label: string;
  color: string;
  monaco: string;
  hljs: string;
};

export const languages: Language[] = [
  { value: "javascript", label: "JavaScript", color: "#f1e05a", monaco: "javascript", hljs: "javascript" },
  { value: "typescript", label: "TypeScript", color: "#3178c6", monaco: "typescript", hljs: "typescript" },
  { value: "python", label: "Python", color: "#3572a5", monaco: "python", hljs: "python" },
  { value: "java", label: "Java", color: "#b07219", monaco: "java", hljs: "java" },
  { value: "cpp", label: "C++", color: "#f34b7d", monaco: "cpp", hljs: "cpp" },
  { value: "c", label: "C", color: "#555555", monaco: "c", hljs: "c" },
  { value: "csharp", label: "C#", color: "#178600", monaco: "csharp", hljs: "csharp" },
  { value: "go", label: "Go", color: "#00add8", monaco: "go", hljs: "go" },
  { value: "rust", label: "Rust", color: "#dea584", monaco: "rust", hljs: "rust" },
  { value: "php", label: "PHP", color: "#4f5d95", monaco: "php", hljs: "php" },
  { value: "ruby", label: "Ruby", color: "#701516", monaco: "ruby", hljs: "ruby" },
  { value: "swift", label: "Swift", color: "#f05138", monaco: "swift", hljs: "swift" },
  { value: "kotlin", label: "Kotlin", color: "#a97bff", monaco: "kotlin", hljs: "kotlin" },
  { value: "sql", label: "SQL", color: "#e38c00", monaco: "sql", hljs: "sql" },
  { value: "bash", label: "Bash", color: "#89e051", monaco: "shell", hljs: "bash" },
  { value: "html", label: "HTML", color: "#e34c26", monaco: "html", hljs: "xml" },
  { value: "css", label: "CSS", color: "#563d7c", monaco: "css", hljs: "css" },
  { value: "json", label: "JSON", color: "#8f9aa8", monaco: "json", hljs: "json" },
  { value: "yaml", label: "YAML", color: "#cb171e", monaco: "yaml", hljs: "yaml" },
  { value: "markdown", label: "Markdown", color: "#083fa1", monaco: "markdown", hljs: "markdown" },
  { value: "dockerfile", label: "Dockerfile", color: "#384d54", monaco: "dockerfile", hljs: "dockerfile" },
  { value: "plaintext", label: "Plain text", color: "#9aa5b5", monaco: "plaintext", hljs: "plaintext" },
];

export function isKnownLanguage(value: string): boolean {
  for (const language of languages) {
    if (language.value === value) return true;
  }
  return false;
}

// Looks up a language by its value. If it isn't found we fall back to plain text,
// so an unexpected value in the database can never crash a page.
export function getLanguage(value: string): Language {
  for (const language of languages) {
    if (language.value === value) return language;
  }
  return languages[languages.length - 1];
}
