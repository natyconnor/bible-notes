import { createFileRoute } from "@tanstack/react-router";

import { LegalMarkdown } from "@/components/legal/legal-markdown";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import termsMd from "@/content/legal/terms.md?raw";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPageLayout>
      <LegalMarkdown content={termsMd} />
    </LegalPageLayout>
  );
}
