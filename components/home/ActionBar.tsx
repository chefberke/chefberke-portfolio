import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SocialLinks from "@/components/home/SocialLinks";

export default function ActionBar() {
  return (
    <section
      className="flex justify-between items-center text-sm max-[639px]:flex-wrap max-[639px]:gap-3"
      aria-label="Profile actions"
    >
      <Link
        target="_blank"
        rel="noreferrer noopener"
        href="/documents/berke-kanber-cv.pdf"
        className="bg-neutral-800 text-neutral-300 px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer transition-all duration-300 hover:bg-neutral-700 text-[12px] font-medium"
      >
        <span>Open CV</span>
        <ArrowUpRight size={16} className="text-current" />
      </Link>
      <SocialLinks />
    </section>
  );
}
