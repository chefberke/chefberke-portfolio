import path from "node:path";
import { imageSizeFromFile } from "image-size/fromFile";
import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";

/**
 * What a markdown image needs before it can be a `next/image`.
 *
 * `![alt](/images/blog/x.png)` says nothing about how big the picture is, and
 * `next/image` will not lay out a box without knowing. Asking the author to
 * write the numbers is asking them to keep two files in step by hand, so the
 * build reads them off the file instead: the picture is measured once, at the
 * moment it is turned into markup, and the real numbers are carried through on
 * the node. The column then reserves the right height before a single byte of
 * the image has arrived, and nothing under it moves as it loads.
 *
 * This runs at build time only, like everything else that touches the disk
 * here. See `lib/posts.ts`.
 */
const PUBLIC_DIR = path.join(process.cwd(), "public");

/** A source this plugin has no business measuring: it is not ours to read. */
function isRemote(src: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/i.test(src) || src.startsWith("//");
}

async function measure(node: Element, src: string): Promise<void> {
  // A src with no leading slash is document-relative, so `/blog/a-post` would
  // ask the browser for `/blog/images/...`. It is refused here rather than
  // resolved, because measuring it is what does the damage: the dimensions land
  // on the node, PostBody hands it to `next/image` instead of the plain-tag
  // escape hatch, and the loader's own leading-slash check is development-only.
  // The build would pass and the built page would 404.
  if (!src.startsWith("/")) {
    throw new Error(
      `Image "${src}" has to start with "/" -- the path in a post is the path the browser asks for.`
    );
  }

  const absolute = path.join(PUBLIC_DIR, src.replace(/^\/+/, ""));

  // `![](/../../etc/passwd)` is a path traversal that would be read at build
  // time. Nothing legitimate needs it, and the check documents the invariant:
  // a post may point at `public/`, and only at `public/`.
  if (absolute !== PUBLIC_DIR && !absolute.startsWith(PUBLIC_DIR + path.sep)) {
    throw new Error(`Image "${src}" resolves outside public/.`);
  }

  let size;

  try {
    size = await imageSizeFromFile(absolute);
  } catch {
    throw new Error(
      `Image "${src}" was not found. Put the file at public${src} -- the path in a post is the path the browser asks for.`
    );
  }

  // Orientation 5 through 8 means the file is stored turned on its side, so
  // what it reports as width is what a reader sees as height. Photographs off a
  // phone arrive this way; a screenshot never does.
  const turned = size.orientation !== undefined && size.orientation >= 5;

  node.properties.width = turned ? size.height : size.width;
  node.properties.height = turned ? size.width : size.height;
}

/**
 * An image on its own line is parsed as a paragraph holding one image, because
 * markdown counts an image as part of a sentence. It is not one here -- it is a
 * figure, and the moment `components/post/PostBody.tsx` wraps it in anything to
 * give it room, React refuses the markup, since a paragraph may not contain a
 * block. So the image is lifted out of the paragraph that only exists to hold
 * it.
 *
 * `rehype-unwrap-images` is this function and a package.json entry.
 */
function unwrapLoneImages(tree: Root): void {
  visit(tree, "element", (node, index, parent) => {
    if (
      parent === undefined ||
      index === undefined ||
      node.tagName !== "p" ||
      node.children.length !== 1
    ) {
      return;
    }

    const only = node.children[0];

    if (only.type === "element" && only.tagName === "img") {
      parent.children[index] = only;
    }
  });
}

export function rehypeImageSize() {
  return async function transform(tree: Root): Promise<void> {
    const pending: Array<Promise<void>> = [];

    visit(tree, "element", (node) => {
      if (node.tagName !== "img") return;

      const src = node.properties.src;

      if (typeof src !== "string" || src === "" || isRemote(src)) return;

      pending.push(measure(node, src));
    });

    await Promise.all(pending);

    unwrapLoneImages(tree);
  };
}
