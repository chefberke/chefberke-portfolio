import Link from "next/link";
import MicroLabel from "@/components/shared/MicroLabel";
import { ROW } from "@/components/shared/ProfileSections";
import { formatPostDate, type PostMeta } from "@/lib/posts";

/**
 * The index: every post, newest first.
 *
 * It is the same two-column row as the experience and project lists, and it
 * borrows the measurement from them rather than restating it, so a list of
 * posts and a list of jobs scan as one table.
 *
 * The two cells are filled the other way round, though. Those lists put the
 * name on the left; here the date is on the left and the title is on the right.
 * That is not a break from the grammar, it is the grammar -- for a post, the
 * date is the label and the title is the thing it names -- and thirteen rems
 * fits a date far better than it fits a headline.
 *
 * The title is the only link. A row that is a link end to end has no edges, and
 * on a page that says everything with hairlines, a target you cannot see the
 * shape of is the wrong kind of quiet.
 *
 * The rows arrive one at a time, like every other run of lines on the site.
 * `.stagger-in` numbers its children up to sixteen; a seventeenth post would
 * arrive with the first. That is the moment to paginate.
 */
export default function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <div className="stagger-in flex flex-col gap-6">
      {posts.map((post) => (
        <article key={post.slug} className={ROW}>
          <MicroLabel as="p">{formatPostDate(post.date)}</MicroLabel>
          <div className="flex flex-col gap-1.5">
            <h3>
              <Link
                href={`/blog/${post.slug}`}
                className="link-underline text-primary hover:text-link"
              >
                {post.title}
              </Link>
            </h3>
            <p className="text-pretty text-faint">{post.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
