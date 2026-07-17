import { readFileSync, writeFileSync } from "node:fs";

const [sourcePath, chapterPath] = process.argv.slice(2);
if (!sourcePath || !chapterPath) {
  throw new Error("Usage: node scripts/import-verse-commentary.mjs SOURCE.json content/BOOK/chapter-NN.json");
}

const source = JSON.parse(readFileSync(sourcePath, "utf8"));
const chapter = JSON.parse(readFileSync(chapterPath, "utf8"));
const byVerse = new Map(source.map((entry) => [entry.verse, entry]));

for (const verse of chapter.verses) {
  const entry = byVerse.get(verse.verse);
  if (!entry) throw new Error(`Missing supplied commentary for ${verse.verse}`);
  verse.crossReferences = entry.crossReferences ?? [];
  verse.wordNotes = (entry.wordNotes ?? []).map((note) => ({
    term: [note.original, note.transliteration ? `(${note.transliteration})` : "", note.label ? `— ${note.label}` : ""]
      .filter(Boolean)
      .join(" "),
    explanation: note.explanation,
    scriptureReferences: note.references ?? []
  }));
  verse.commentary.detailedExplanation = entry.commentary?.detailedExplanation ?? "";
  verse.reviewStatus = "verified-seed";
}

if (byVerse.size !== chapter.verses.length) {
  throw new Error(`Supplied ${byVerse.size} entries for a chapter with ${chapter.verses.length} verses.`);
}

writeFileSync(chapterPath, `${JSON.stringify(chapter, null, 2)}\n`);
