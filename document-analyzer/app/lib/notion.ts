import { Client } from '@notionhq/client';
import { config } from '@/app/lib/config';
import { AnalysisResult, SubmissionPayload } from '@/app/types';

const notion = new Client({ auth: config.notion.token });

function mapProperty(name: string): string {
  return config.notion.propertyMap[name] || name;
}

export function buildProperties(payload: SubmissionPayload, analysis: AnalysisResult) {
  const props: any = {};
  props[mapProperty('Name')] = {
    title: [{ type: 'text', text: { content: payload.projectName } }],
  };
  props[mapProperty('Requester')] = {
    rich_text: [{ type: 'text', text: { content: payload.telegramUsername } }],
  };
  props[mapProperty('Quota Link')] = { url: analysis.links?.quota || payload.quotaLink };
  // Core evaluation fields
  if (analysis.feasibility) {
    props[mapProperty('Feasibility')] = { select: { name: analysis.feasibility } };
  }
  if (typeof analysis.confidence === 'number') {
    props[mapProperty('Confidence')] = { number: Math.round(analysis.confidence * 100) };
  }
  if (analysis.estimatedTimeline) {
    props[mapProperty('Timeline')] = {
      rich_text: [{ type: 'text', text: { content: analysis.estimatedTimeline } }],
    };
  }

  // Additional analysis details
  if (analysis.process) {
    props[mapProperty('Process')] = {
      rich_text: [{ type: 'text', text: { content: analysis.process } }],
    };
  }

  if (analysis.documentTypes?.length) {
    props[mapProperty('Document types')] = {
      multi_select: analysis.documentTypes.map((t) => ({ name: t })),
    };
  }

  if (analysis.fieldsToExtract?.length) {
    props[mapProperty('Fields to extract')] = {
      rich_text: [{ type: 'text', text: { content: analysis.fieldsToExtract.join(', ') } }],
    };
  }

  if (analysis.volumePages?.raw) {
    props[mapProperty('Volume, pages')] = { number: Number.parseInt(analysis.volumePages.raw.replace(/\D/g, ''), 10) || undefined };
  }

  if (typeof analysis.arrRub === 'number') {
    props[mapProperty('ARR (RUB)')] = { number: analysis.arrRub };
  }

  if (typeof analysis.acvRub === 'number') {
    props[mapProperty('ACV (RUB)')] = { number: analysis.acvRub };
  }

  if (analysis.placement) {
    props[mapProperty('Placement')] = { select: { name: analysis.placement } };
  }

  if (analysis.securityTags?.length) {
    props[mapProperty('Security / Compliance')] = {
      multi_select: analysis.securityTags.map((s) => ({ name: s })),
    };
  }

  // Links
  const linkMap: Record<string, string | undefined> = {
    'Quota Link': analysis.links?.quota || payload.quotaLink,
    'TZ Link': analysis.links?.tz || payload.tzLink,
    'Pipedrive Link': analysis.links?.pipedrive || payload.pipedriveLink,
    'Examples Link': analysis.links?.examples || payload.examplesLink,
    'Blob File URL': analysis.links?.blob || payload.blobUrl,
  };
  for (const [prop, url] of Object.entries(linkMap)) {
    if (url) props[mapProperty(prop)] = { url };
  }

  // Initial decision state
  props[mapProperty('Decision')] = { select: { name: 'Pending' } };

  return props;
}

export async function createAnalysisPage(payload: SubmissionPayload, analysis: AnalysisResult) {
  const properties = buildProperties(payload, analysis);
  const blocks = [
    {
      object: 'block',
      type: 'paragraph',
      paragraph: { rich_text: [{ type: 'text', text: { content: analysis.comments } }] },
    },
  ];
  return createPage(properties, blocks);
}

export async function createPage(properties: any, children: any[] = []) {
  const response = await notion.pages.create({
    parent: { database_id: config.notion.databaseId },
    properties,
    children,
  });
  return response as any;
}

export async function updatePage(pageId: string, properties: any) {
  await notion.pages.update({ page_id: pageId, properties });
} 