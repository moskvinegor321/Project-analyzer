# Document Analyzer

AI-first Next.js application that analyzes DOCX/PDF documents, creates structured results in Notion and Telegram, and stores files on Vercel Blob.

## Quick Start

1. **Install dependencies** (section 15.1):

```bash
npx create-next-app@latest document-analyzer --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*"
cd document-analyzer
# then install packages exactly as in spec section 15.1
```

2. **Copy `.env.example` to `.env`** and fill every variable.

3. **Enable Vercel Blob & KV** in Vercel project settings.

4. **Deploy** on Vercel.

### Troubleshooting
Refer to section 18 of the spec for common error codes and fixes. 