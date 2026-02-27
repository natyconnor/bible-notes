import { createFileRoute } from "@tanstack/react-router"
import { PassageView } from "@/components/passage/passage-view"
import { parsePassageId } from "@/lib/verse-ref-utils"

export const Route = createFileRoute("/passage/$passageId")({
  component: PassagePage,
})

function PassagePage() {
  const { passageId } = Route.useParams()
  const { book, chapter } = parsePassageId(passageId)

  return <PassageView book={book} chapter={chapter} />
}
