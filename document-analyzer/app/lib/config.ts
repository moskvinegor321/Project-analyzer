export const config = {
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
    maxInputTokens: parseInt(process.env.AI_MAX_INPUT_TOKENS || '180000', 10),
    maxImages: parseInt(process.env.AI_MAX_IMAGES || '10', 10),
    compressLongDocs: process.env.AI_COMPRESS_LONG_DOCS === 'true',
    modelDrivenSelection: process.env.AI_MODEL_DRIVEN_SELECTION !== 'false',
    enableHeuristicsFallback: process.env.AI_ENABLE_HEURISTICS_FALLBACK === 'true',
    strictErrors: process.env.STRICT_ERRORS !== 'false',
    costSoftLimitUsd: parseFloat(process.env.COST_SOFT_LIMIT_USD || '0.5'),
    disableUploads: process.env.AI_DISABLE_UPLOADS === 'true',
  },
  notion: {
    token: process.env.NOTION_TOKEN!,
    databaseId: process.env.NOTION_DATABASE_ID!,
    propertyMap: JSON.parse(process.env.NOTION_PROPERTY_MAP || '{}') as Record<string, string>,
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN!,
    channelId: process.env.TELEGRAM_CHANNEL_ID!,
    threadId: parseInt(process.env.TELEGRAM_THREAD_ID || '0', 10),
    webhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET!,
    botUsername: process.env.TELEGRAM_BOT_USERNAME!,
    reviewers: (process.env.TELEGRAM_REVIEWERS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  },
  blob: {
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  },
  kv: {
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
    readOnlyToken: process.env.KV_REST_API_READ_ONLY_TOKEN!,
  },
  pdf: {
    maxPages: parseInt(process.env.PDF_MAX_PAGES || '200', 10),
    renderWidth: parseInt(process.env.PDF_RENDER_WIDTH || '1600', 10),
    maxDiagramPages: parseInt(process.env.PDF_MAX_DIAGRAM_PAGES || '10', 10),
    enableOcr: process.env.ENABLE_OCR === 'true',
  },
  security: {
    allowedDocDomains: (process.env.ALLOWED_DOC_DOMAINS || '')
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean),
    publicAppUrl: process.env.NEXT_PUBLIC_APP_URL!,
    nextAuthSecret: process.env.NEXTAUTH_SECRET!,
    needsInfoOnComment: process.env.NEEDS_INFO_ON_COMMENT !== 'false',
  },
} as const;

export type AppConfig = typeof config; 