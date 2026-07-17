import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookChapterStrip } from "@/components/book-chapter-strip";
import { ChapterStudy, type PublicChapterContent } from "@/components/verse-accordion";
import { GALATIANS, getGalatiansChapter, getGalatiansChapterAdjacency, getGalatiansStaticParams } from "@/lib/galatians";
import { getReferencePreviewsForChapter } from "@/lib/reference-previews";
import type { ChapterContent } from "@/lib/schemas";

export function generateStaticParams() {
  return getGalatiansStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }): Promise<Metadata> {
  const { chapter } = await params;
  const content = getGalatiansChapter(chapter);
  if (!content) notFound();
  return { title: `Galatians ${content.chapterNumber}`, description: `Galatians ${content.chapterNumber} with the King James text and verse-by-verse commentary.` };
}

export default async function GalatiansChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  const content = getGalatiansChapter(chapter);
  const adjacency = getGalatiansChapterAdjacency(chapter);
  if (!content || !adjacency) notFound();
  const publicContent = withoutAuditSources(content);
  const referencePreviews = getReferencePreviewsForChapter(content);
  return (
    <main className="reader-page">
      <BookChapterStrip
        activeChapter={content.chapterNumber}
        bookSlug={GALATIANS.slug}
        bookName={GALATIANS.name}
        chapterCount={GALATIANS.chapterCount}
        verseCounts={GALATIANS.verseCounts}
      />
      <ChapterStudy
        chapter={publicContent}
        bookName={GALATIANS.name}
        referencePreviews={referencePreviews}
      />
      <nav className="reader-chapter-nav no-print" aria-label="Galatians adjacent chapters">
        {adjacency.previous ? <Link href={`/galatians/${adjacency.previous}`}><ChevronLeft className="h-4 w-4" />Galatians {adjacency.previous}</Link> : <span />}
        {adjacency.next ? <Link href={`/galatians/${adjacency.next}`}>Galatians {adjacency.next}<ChevronRight className="h-4 w-4" /></Link> : null}
      </nav>
    </main>
  );
}

function withoutAuditSources(chapter: ChapterContent): PublicChapterContent {
  return JSON.parse(JSON.stringify(chapter, (key, value) => key === "sources" || key === "sourceAudit" ? undefined : value)) as PublicChapterContent;
}
