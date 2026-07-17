import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const metadata: Metadata = {
  title: "Historical Background to Galatians",
  description: "The setting, crisis, purpose, structure, and major theological themes of Paul’s letter to the Galatians."
};

type Block =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; text: string }
  | { type: "quote"; text: string };

type Section = { id: string; title: string; blocks: Block[] };

const sectionGroups = [
  {
    id: "author-date-and-place",
    title: "Author, Date, and Place",
    sections: ["authorship", "date-and-place-of-writing"]
  },
  {
    id: "readers-and-churches",
    title: "Readers and the Galatian Churches",
    sections: ["the-meaning-of-galatia", "paul-s-first-ministry-among-the-galatians"]
  },
  {
    id: "galatia-and-its-world",
    title: "Galatia and Its World",
    sections: ["the-religious-background-of-the-churches"]
  },
  {
    id: "circumstances-purpose-and-message",
    title: "Circumstances, Purpose, and Main Message",
    sections: [
      "the-letter-and-its-crisis", "the-teachers-troubling-the-galatians",
      "paul-s-visits-to-jerusalem", "the-antioch-confrontation", "the-purpose-of-galatians"
    ]
  },
  {
    id: "literary-character-and-foundations",
    title: "Literary Character and Biblical Foundations",
    sections: ["literary-character-and-structure"]
  },
  {
    id: "images-and-theological-themes",
    title: "Major Images and Theological Themes",
    sections: ["major-theological-themes", "the-enduring-significance-of-galatians"]
  }
] as const;

const bookAtAGlance = [
  ["Author", "The apostle Paul"],
  ["Date", "Possibly AD 48–49 before the Jerusalem Council, or the early-to-middle 50s if written during Paul’s later missionary activity"],
  ["Place of writing", "Possibly Syrian Antioch on the early-date view; the precise place cannot be established with certainty"],
  ["Original readers", "Churches in Galatia, likely including the southern provincial cities of Pisidian Antioch, Iconium, Lystra, and Derbe"],
  ["Historical crisis", "Teachers were urging Gentile believers to receive circumcision and adopt Mosaic covenant identity as necessary for full acceptance"],
  ["Literary character", "An urgent pastoral letter combining autobiography, theological argument, scriptural interpretation, appeal, warning, and ethical exhortation"],
  ["Central message", "Sinners are justified through faith in Christ, not works of law, and the freedom received in Him becomes a life of love through the Spirit"],
  ["Major themes", "Grace, Christ’s cross, faith, Abraham and the promise, law, adoption, the Holy Spirit, Christian freedom, unity, and new creation"],
  ["Key passage", "Galatians 2:20: the believer’s new life is grounded in union with Christ and faith in the Son of God who gave Himself for us"]
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[“”"']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseIntroduction(markdown: string): Section[] {
  const sections: Section[] = [];
  let current: Section | null = null;
  let paragraph: string[] = [];
  let quote: string[] = [];

  function flushParagraph() {
    if (current && paragraph.length) {
      current.blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    }
    paragraph = [];
  }

  function flushQuote() {
    if (current && quote.length) {
      current.blocks.push({ type: "quote", text: quote.join(" ") });
    }
    quote = [];
  }

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith("# ")) continue;
    if (line.startsWith("## ")) {
      flushParagraph();
      flushQuote();
      const title = line.slice(3).trim();
      current = { id: slugify(title), title, blocks: [] };
      sections.push(current);
      continue;
    }
    if (!current) continue;
    if (line.startsWith("### ")) {
      flushParagraph();
      flushQuote();
      current.blocks.push({ type: "subheading", text: line.slice(4).trim() });
      continue;
    }
    if (line.startsWith(">")) {
      flushParagraph();
      quote.push(line.replace(/^>\s?/, ""));
      continue;
    }
    if (!line || line === "---") {
      flushParagraph();
      flushQuote();
      continue;
    }
    flushQuote();
    paragraph.push(line);
  }

  flushParagraph();
  flushQuote();
  return sections;
}

function IntroductionBlock({ block, nested = false }: { block: Block; nested?: boolean }) {
  if (block.type === "subheading") return nested ? <h4>{block.text}</h4> : <h3>{block.text}</h3>;
  if (block.type === "quote") return <blockquote>{block.text}</blockquote>;
  return <p>{block.text}</p>;
}

export default function BackgroundPage() {
  const markdown = readFileSync(join(process.cwd(), "content", "galatians", "introduction.md"), "utf8");
  const sections = parseIntroduction(markdown);
  const sectionById = new Map(sections.map((section) => [section.id, section]));

  return (
    <main className="background-page galatians-background-page">
      <section className="background-hero" aria-labelledby="background-title">
        <div className="background-hero-copy">
          <h1 id="background-title">
            <span className="background-title-prefix">Historical Background to</span>
            <span className="background-title-book">Galatians</span>
          </h1>
          <p className="background-subtitle">
            The setting, crisis, purpose, and theology of Paul’s urgent defense of the gospel of grace.
          </p>
        </div>
      </section>

      <section className="background-section-nav" aria-label="Introduction page sections">
        <div className="background-section-nav-scroll">
          <nav>
            {sectionGroups.map((group, index) => (
              <a key={group.id} href={`#${group.id}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>{group.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="background-shell" aria-label="Introduction to Galatians">
        <div className="background-study">
          <div className="background-section-list">
            {sectionGroups.map((group, index) => (
              <section key={group.id} id={group.id} className="background-section">
                <span className="background-section-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="background-section-body">
                  <h2>{group.title}</h2>
                  {group.sections.map((sectionId) => {
                    const section = sectionById.get(sectionId);
                    if (!section) return null;
                    const isOnlySection = group.sections.length === 1;
                    if (isOnlySection) {
                      return section.blocks.map((block, blockIndex) => (
                        <IntroductionBlock key={`${section.id}-${block.type}-${blockIndex}`} block={block} />
                      ));
                    }
                    return (
                      <section key={section.id} id={section.id} className="background-subsection">
                        <h3>{section.title}</h3>
                        {section.blocks.map((block, blockIndex) => (
                          <IntroductionBlock key={`${section.id}-${block.type}-${blockIndex}`} block={block} nested />
                        ))}
                      </section>
                    );
                  })}
                  {group.id === "literary-character-and-foundations" ? (
                    <section className="background-subsection">
                      <h3>The Book at a Glance</h3>
                      <div className="background-table-wrap" role="region" aria-label="Galatians at a glance" tabIndex={0}>
                        <table className="background-data-table">
                          <caption className="sr-only">Galatians at a glance</caption>
                          <thead><tr><th>Detail</th><th>Information</th></tr></thead>
                          <tbody>
                            {bookAtAGlance.map(([detail, information]) => (
                              <tr key={detail}><td>{detail}</td><td>{information}</td></tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
