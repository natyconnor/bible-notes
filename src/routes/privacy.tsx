import { createFileRoute } from "@tanstack/react-router";

import { LegalMarkdown } from "@/components/legal/legal-markdown";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import privacyMd from "@/content/legal/privacy.md?raw";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPageLayout>
      <LegalMarkdown content={privacyMd} />
    </LegalPageLayout>
  );
}
