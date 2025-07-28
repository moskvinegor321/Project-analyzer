export type ErrorCode =
  | 'UPLOAD_ERROR'
  | 'PDF_RENDER_ERROR'
  | 'DOC_EXTRACT_ERROR'
  | 'DOCS_FETCH_ERROR'
  | 'MODEL_INVALID_JSON'
  | 'BUDGET_EXCEEDED'
  | 'NOTION_ERROR'
  | 'TELEGRAM_POST_ERROR'
  | 'TELEGRAM_DM_ERROR'
  | 'DIAGRAM_ROI_UNSTABLE'
  | 'USERNAME_NOT_REGISTERED';

export interface DiagramFinding {
  page: number;
  type: 'diagram' | 'chart' | 'table' | 'unknown';
  description: string;
  implications: string;
  imageUrl?: string;
  bbox?: { x: number; y: number; w: number; h: number };
}

export interface AnalysisResult {
  feasibility: 'high' | 'medium' | 'low' | 'unknown';
  comments: string;
  missingRequirements: string[];
  estimatedTimeline: string;
  confidence: number; // 0..1
  documentSummary: string;
  diagramFindings?: DiagramFinding[];
  notionBlocks?: any[];
  process?: string;
  documentTypes?: string[];
  fieldsToExtract?: string[];
  volumePages?: { min?: number; max?: number; raw: string };
  arrRub?: number | null;
  acvRub?: number | null;
  placement?: 'Cloud' | 'On-prem' | 'Hybrid' | 'Unknown';
  securityTags?: string[];
  links?: {
    quota?: string;
    tz?: string;
    pipedrive?: string;
    examples?: string;
    blob?: string;
  };
}

export interface PromptContextLog {
  docSummaryUsed: string;
  selectedDocChunks: Array<{ id: string; title: string; reason: string }>;
  selectedImages: Array<{ page: number; url: string; reason: string }>;
  tokenEstimate: { input: number; output?: number };
  costEstimateUsd?: number;
  autoFixed?: boolean;
}

export interface SubmissionPayload {
  projectName: string;
  telegramUsername: string; // '@nick' или 'nick'
  documentationUrls: string[];
  tzLink?: string;
  quotaLink: string;
  pipedriveLink?: string;
  examplesLink?: string;
  blobUrl: string;
  fileName: string;
}

export interface ReviewRequest extends SubmissionPayload {
  id: string;
  createdAt: number;
  status: 'pending' | 'approved' | 'rejected' | 'needs-info' | 'completed' | 'error';
  notionPageId?: string;
  notionUrl?: string;
  analysis?: AnalysisResult;
  requester: { username: string; userId?: number };
  telegram: { channelMessageId?: number; threadId?: number };
}

export interface ApiErrorResponse {
  ok: false;
  code: ErrorCode;
  message: string;
}

export interface ProcessingStatus {
  stage:
    | 'uploading'
    | 'processing-docx'
    | 'processing-pdf'
    | 'selecting-images'
    | 'fetching-docs'
    | 'selecting-chunks'
    | 'analyzing'
    | 'creating-notion'
    | 'posting-telegram'
    | 'completed'
    | 'error';
  progress: number; // 0-100
  message: string;
  error?: { code: ErrorCode; details: string };
} 