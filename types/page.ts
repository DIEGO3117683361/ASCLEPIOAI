export type SummaryPayload = {
  suggestedTitle: string;
  structuredSummary: string;
  keyPoints: string[];
  importantConcepts: string[];
  examQuestions: string[];
};

export type PageDTO = {
  id: string;
  title: string;
  content: Record<string, unknown>;
  transcript: string;
  summary: SummaryPayload | Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
