// Fills {name} placeholders: fill('Step {n} of {total}', { n: 2, total: 3 }).
// Kept apart from the dictionaries so client components can import it
// without pulling every language's text into their bundle.
export function fill(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  );
}
