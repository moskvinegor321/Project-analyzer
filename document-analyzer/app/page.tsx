import { SubmitForm } from '@/app/components/SubmitForm';

export default function HomePage() {
  return (
    <main className="container mx-auto py-16 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Document Analyzer</h1>
      <p className="text-muted-foreground mb-4">
        Отправьте PDF/DOCX документ и получите структурированную оценку с созданием страницы в Notion и постом в Telegram.
      </p>
      <SubmitForm />
    </main>
  );
} 