import AboutUpper from "@/components/shared/about-upper";
import About from "@/components/shared/about";
import Projects from "@/components/shared/projects";
import Experience from "@/components/shared/experience";
import Education from "@/components/shared/education";
import Stack from "@/components/shared/stack";
import Languages from "@/components/shared/languages";
import Contact from "@/components/shared/contact";
import Footer from "@/components/shared/footer";

export default function Home() {
  return (
    <div>
      <div className="flex items-center justify-center h-full py-36 relative">
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-[320px] w-px border-l-2 border-dotted border-gray-200 dark:border-gray-600"></div>

        <div className="absolute right-1/2 top-0 bottom-0 translate-x-[320px] w-px border-r-2 border-dotted border-gray-200 dark:border-gray-600"></div>

        <div className="flex flex-col items-center justify-center w-full max-w-xl h-full relative z-10">
          <AboutUpper />

          <About />

          <div className="w-full h-px border-t-2 border-dotted border-gray-200 dark:border-gray-600 my-8"></div>
          <Projects />

          <div className="w-full h-px border-t-2 border-dotted border-gray-200 dark:border-gray-600 my-6"></div>
          <Experience />

          <div className="w-full h-px border-t-2 border-dotted border-gray-200 dark:border-gray-600 my-6"></div>
          <Education />

          <div className="w-full h-px border-t-2 border-dotted border-gray-200 dark:border-gray-600 my-6"></div>
          <Stack />

          <div className="w-full h-px border-t-2 border-dotted border-gray-200 dark:border-gray-600 my-6"></div>
          <Languages />

          <div className="w-full h-px border-t-2 border-dotted border-gray-200 dark:border-gray-600 my-6"></div>
          <Contact />

          <div className="w-full h-px border-t-2 border-dotted border-gray-200 dark:border-gray-600 my-6"></div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
