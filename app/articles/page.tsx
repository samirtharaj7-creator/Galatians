import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";

export const metadata: Metadata = {
  title: "Articles",
  description: "Articles accompanying the Galatians commentary."
};

export default function ArticlesPage() {
  return (
    <main className="articles-coming-page">
      <section className="articles-coming-card" aria-labelledby="articles-title">
        <span className="articles-coming-icon" aria-hidden="true">
          <BookOpenText className="h-7 w-7" />
        </span>
        <p className="articles-coming-kicker">Galatians Study Library</p>
        <h1 id="articles-title">New articles coming soon.</h1>
        <p>
          Additional studies will be added here to accompany the chapter-by-chapter commentary.
        </p>
        <Link href="/galatians/1" className="articles-coming-link">
          Read the commentary <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
