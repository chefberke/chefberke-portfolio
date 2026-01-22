import profile from "@/data/profile.json";
import ProfileHeader from "@/components/home/ProfileHeader";
import AboutSection from "@/components/home/AboutSection";
import ActionBar from "@/components/home/ActionBar";
import Tabs from "@/components/shared/Tabs";
import SiteFooter from "@/components/home/SiteFooter";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-start justify-between bg-black px-16 py-32 max-[639px]:px-6 max-[639px]:py-20">
        <article className="flex flex-col gap-6 w-full">
          <ProfileHeader name="Berke Kanber" titles={profile.titles} />
          <AboutSection />
          <ActionBar />
          <Tabs experiences={profile.experiences} projects={profile.projects} />
          <SiteFooter />
        </article>
      </main>
    </div>
  );
}
