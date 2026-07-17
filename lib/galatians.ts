import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ChapterContentSchema, type ChapterContent } from "@/lib/schemas";
import { padChapter } from "@/lib/utils";

export const GALATIANS = {
  slug: "galatians",
  name: "Galatians",
  chapterCount: 6,
  verseCounts: [24, 21, 29, 31, 26, 18]
} as const;

export type ChapterAdjacency = { previous: number | null; next: number | null };

export function getGalatiansStaticParams() {
  return Array.from({ length: GALATIANS.chapterCount }, (_, index) => ({ chapter: String(index + 1) }));
}

export function parseGalatiansChapterNumber(chapter: number | string): number | null {
  const rawChapter = String(chapter);
  if (!/^[1-9]\d*$/.test(rawChapter)) return null;
  const chapterNumber = Number(rawChapter);
  if (!Number.isSafeInteger(chapterNumber) || chapterNumber > GALATIANS.chapterCount) return null;
  return chapterNumber;
}

export function getGalatiansChapter(chapter: number | string): ChapterContent | null {
  const chapterNumber = parseGalatiansChapterNumber(chapter);
  if (chapterNumber === null) return null;
  const path = join(process.cwd(), "content", GALATIANS.slug, `chapter-${padChapter(chapterNumber)}.json`);
  if (!existsSync(path)) return null;
  const parsed = ChapterContentSchema.parse(JSON.parse(readFileSync(path, "utf8")));
  const expectedVerseCount = GALATIANS.verseCounts[chapterNumber - 1];
  if (parsed.chapterNumber !== chapterNumber || parsed.verses.length !== expectedVerseCount) {
    throw new Error(`Galatians ${chapterNumber} content structure is invalid.`);
  }
  parsed.verses.forEach((verse, index) => {
    if (verse.verse !== `Galatians ${chapterNumber}:${index + 1}`) {
      throw new Error(`Galatians ${chapterNumber} contains an invalid verse slot.`);
    }
  });
  return parsed;
}

export function getGalatiansChapterAdjacency(chapter: number | string): ChapterAdjacency | null {
  const chapterNumber = parseGalatiansChapterNumber(chapter);
  if (chapterNumber === null) return null;
  return {
    previous: chapterNumber > 1 ? chapterNumber - 1 : null,
    next: chapterNumber < GALATIANS.chapterCount ? chapterNumber + 1 : null
  };
}
