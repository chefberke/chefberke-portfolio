import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostBody from "@/components/post/PostBody";
import PostHeader from "@/components/post/PostHeader";
import SiteFooter from "@/components/home/SiteFooter";
import { markdownToHast } from "@/lib/markdown";
import { getPost, getPostSlugs } from "@/lib/posts";
import { postJsonLd } from "@/lib/postJsonLd";

/**
 * One post.
 *
 * Every slug is listed at build time and `dynamicParams` is off, so this route
 * compiles to a set of finished HTML files and nothing else. That is not a
 * preference: left at its default, an unknown slug would be answered by a
 * blocking render at request time, and the deploy target refuses any function
 * that is not Edge. `false` turns the same request into a 404 that costs
 * nothing to serve.
 *
 * It also fails the build if `generateStaticParams` ever stops covering the
 * folder, which is the tripwire you want.
 *
 * Note the asymmetry: `params` arrives as a promise on the page and on
 * `generateMetadata`, and as a plain object on `generateStaticParams`.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return {};

  const { title, description, date } = post.meta;
  const url = `/blog/${slug}`;

  return {
    // The root layout's "%s | Berke Kanber" template puts the name on the end,
    // so the bare title is what belongs here.
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: date,
      // The card is not named here. `opengraph-image.tsx` sits beside this file
      // and Next fills it in, hash and all.
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Post({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);

  // Unreachable in a built site -- with `dynamicParams` off, the only slugs
  // that resolve are the ones listed above. It is here to narrow the type.
  if (!post) notFound();

  const hast = await markdownToHast(post.body);

  return (
    <>
      {/* A script tag is display:none, so it is not a flex item here and lays
          out nothing. Same placement as the home page's graph. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(postJsonLd(post.meta)),
        }}
      />

      <div className="[--enter-delay:40ms]">
        <PostHeader {...post.meta} />
      </div>

      <div className="[--enter-delay:140ms]">
        <PostBody hast={hast} />
      </div>

      <div className="[--enter-delay:240ms]">
        <SiteFooter />
      </div>
    </>
  );
}
