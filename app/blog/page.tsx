import type { Metadata } from "next";
import MicroLabel from "@/components/shared/MicroLabel";
import PostList from "@/components/post/PostList";
import Whereabouts from "@/components/shared/Whereabouts";
import SiteFooter from "@/components/home/SiteFooter";
import { getPostList } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes by Berke Kanber on building web products with Next.js, React, and TypeScript.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Blog | Berke Kanber",
    description:
      "Notes by Berke Kanber on building web products with Next.js, React, and TypeScript.",
  },
  // Next merges metadata field by field, not object by object, so a page that
  // sets `openGraph` and stops keeps the root layout's `twitter` whole -- and
  // this page's card would go out titled and described as the home page. Every
  // other route that names one names both.
  twitter: {
    card: "summary_large_image",
    title: "Blog | Berke Kanber",
    description:
      "Notes by Berke Kanber on building web products with Next.js, React, and TypeScript.",
  },
};

/**
 * The shelf.
 *
 * It is the same column in the same grammar as every other page here -- a micro
 * label saying what the thing is, and the rows under it saying what it holds.
 * The header and the footer do not move when a post is published; only the
 * middle block changes.
 *
 * The empty state is kept rather than dropped, for the same reason
 * `Contributions` returns `null` when the scrape fails: a labelled box with
 * nothing in it is worse than a sentence saying so.
 *
 * The delays follow the home page's -- a block starts while the one above it is
 * still arriving.
 */
export default function Blog() {
  const posts = getPostList();

  return (
    <>
      <div className="[--enter-delay:40ms]">
        {/* The same two-column corner the home page opens with: what this page
            is on the left, where it is written from on the right. The header
            itself is a plain flex row so that each column runs its own cascade
            -- one `.stagger-in` inside another would move its subtree twice. */}
        <header className="flex items-start justify-between gap-4">
          <div className="stagger-in flex flex-col gap-2">
            <MicroLabel as="p">blog</MicroLabel>
            <h1 className="text-primary">
              {posts.length > 0
                ? "Notes on what I am building."
                : "Nothing published yet."}
            </h1>
          </div>
          <Whereabouts />
        </header>
      </div>

      <div className="[--enter-delay:140ms]">
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <p className="block-in text-pretty text-primary">
            This page is the shelf, not the books. The first notes go here when
            they are written &mdash; on the things this site is made of, and on
            whatever I happen to be building at the time.
          </p>
        )}
      </div>

      <div className="[--enter-delay:240ms]">
        <SiteFooter />
      </div>
    </>
  );
}
