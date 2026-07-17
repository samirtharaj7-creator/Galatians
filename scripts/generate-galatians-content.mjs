import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const chapterTitles = [
  "No Other Gospel",
  "Justified by Faith in Christ",
  "The Promise and the Law",
  "Children of Promise",
  "Freedom in the Spirit",
  "Bear One Another’s Burdens"
];

const emptyAudit = () => ({
  exegesis: [], historicalBackground: [], technicalNotes: [], theologicalInsight: [],
  structuralNotes: [], otherCommentaryInsights: [], application: []
});

mkdirSync("content/galatians", { recursive: true });

for (let chapter = 1; chapter <= 6; chapter += 1) {
  const source = JSON.parse(readFileSync(`/tmp/galatians-${chapter}.json`, "utf8"));
  const verses = source.verses.map(({ verse, text }) => ({
    verse: `Galatians ${chapter}:${verse}`,
    bibleText: text.replace(/\s+/g, " ").trim(),
    explanation: "", historicalBackground: "", literaryContext: "", theologicalInsight: "",
    structuralNotes: "", relatedConnection: "", crossReferences: [], application: "", sources: [],
    commentary: {
      detailedExplanation: "", exegesis: "", historicalBackground: "", technicalNotes: "",
      theologicalInsight: "", structuralNotes: "", otherCommentaryInsights: "", application: "", reviewFlags: []
    },
    wordNotes: [], sourceAudit: emptyAudit(), reviewStatus: "placeholder"
  }));

  const content = {
    chapterNumber: chapter,
    title: chapterTitles[chapter - 1],
    summary: "", historicalContext: "", literaryContext: "", themes: [], outline: [], verses,
    symbols: [], charts: [], images: [], crossReferences: [], relatedConnections: [],
    teachingNotes: {
      openingQuestion: "", mainPoint: "", keyVerses: [], importantTerms: [],
      discussionQuestions: [], commonMisunderstandings: [], emphasis: "", closingAppeal: ""
    },
    evangelisticNotes: {
      mainDoctrinalTheme: "", keyBibleTexts: [], flow: [], simpleIllustrations: [],
      appealQuestion: "", cautions: [], sources: []
    },
    reflectionQuestions: [], sources: []
  };

  writeFileSync(`content/galatians/chapter-${String(chapter).padStart(2, "0")}.json`, `${JSON.stringify(content, null, 2)}\n`);
}
