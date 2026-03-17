import type { ExportableLinkedNote as ConvexExportableLinkedNote } from "../../../convex/lib/publicValues";

export type ExportScope = "booksWithNotes" | "allBooks";

export interface ImportIssue {
  severity: "error" | "warning";
  code: string;
  message: string;
  fileName?: string;
  sheetName?: string;
}

export interface ParsedImportedNote {
  book: string;
  chapter: number;
  verse: number;
  content: string;
  tags: string[];
  sourceFileName: string;
  sourceSheetName: string;
}

export interface ParsedImportWorkbook {
  fileName: string;
  book: string | null;
  notes: ParsedImportedNote[];
  issues: ImportIssue[];
  chapterNumbers: number[];
}

export interface ParsedImportPreview {
  workbooks: ParsedImportWorkbook[];
  notes: ParsedImportedNote[];
  issues: ImportIssue[];
}

export type ExportableLinkedNote = ConvexExportableLinkedNote;
