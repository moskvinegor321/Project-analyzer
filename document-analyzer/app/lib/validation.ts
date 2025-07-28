import { z } from 'zod';

export const SubmissionPayloadSchema = z.object({
  projectName: z.string().min(1),
  telegramUsername: z.string().min(1),
  documentationUrls: z.array(z.string().url()),
  tzLink: z.string().url().optional(),
  quotaLink: z.string().url(),
  pipedriveLink: z.string().url().optional(),
  examplesLink: z.string().url().optional(),
  blobUrl: z.string().url(),
  fileName: z.string(),
});

export const AnalysisResultSchema = z.object({
  feasibility: z.enum(['high', 'medium', 'low', 'unknown']),
  comments: z.string(),
  missingRequirements: z.array(z.string()),
  estimatedTimeline: z.string(),
  confidence: z.number().min(0).max(1),
  documentSummary: z.string(),
  diagramFindings: z
    .array(
      z.object({
        page: z.number(),
        type: z.enum(['diagram', 'chart', 'table', 'unknown']),
        description: z.string(),
        implications: z.string(),
        imageUrl: z.string().url().optional(),
        bbox: z
          .object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() })
          .optional(),
      })
    )
    .optional(),
  process: z.string().optional(),
  documentTypes: z.array(z.string()).optional(),
  fieldsToExtract: z.array(z.string()).optional(),
  volumePages: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      raw: z.string(),
    })
    .optional(),
  arrRub: z.number().nullable().optional(),
  acvRub: z.number().nullable().optional(),
  placement: z.enum(['Cloud', 'On-prem', 'Hybrid', 'Unknown']).optional(),
  securityTags: z.array(z.string()).optional(),
  links: z
    .object({
      quota: z.string().url().optional(),
      tz: z.string().url().optional(),
      pipedrive: z.string().url().optional(),
      examples: z.string().url().optional(),
      blob: z.string().url().optional(),
    })
    .optional(),
});

// Schemas for AI JSON responses
export const SelectedPageSchema = z.object({ page: z.number().min(1), reason: z.string() });
export const PdfImageSelectionSchema = z.object({
  selected: z.array(SelectedPageSchema),
  skip: z.array(SelectedPageSchema),
});

export const DocChunkSelectionSchema = z.object({
  selected: z.array(z.object({ id: z.string(), reason: z.string() })),
});

export const AnalyzeBodySchema = z.object({
  payload: SubmissionPayloadSchema,
  file: z.object({
    name: z.string(),
    type: z.string(),
    data: z.string(),
  }),
  documentation: z
    .object({
      rawMarkdown: z.string(),
    })
    .optional(),
});

export type AnalyzeBody = z.infer<typeof AnalyzeBodySchema>; 