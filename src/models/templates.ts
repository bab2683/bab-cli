export interface Template {
  (name: string, formattedName?: string): { content: string; filename: string; test?: boolean };
}
