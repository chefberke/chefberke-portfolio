"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import AboutUpper from "@/components/shared/about-upper";
import About from "@/components/shared/about";
import Projects from "@/components/shared/projects";
import Experience from "@/components/shared/experience";
import Education from "@/components/shared/education";
import Stack from "@/components/shared/stack";
import Languages from "@/components/shared/languages";
import Contact from "@/components/shared/contact";
import Footer from "@/components/shared/footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const sectionVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const dividerVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 0.2,
    },
  },
};

export default function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen"
    >
      <div className="flex items-center justify-center h-full py-12 md:py-36 relative px-6 sm:px-8 md:px-12 lg:px-16">
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-[320px] w-px border-l-2 border-dotted border-gray-200 dark:border-gray-600"></div>

        <div className="hidden md:block absolute right-1/2 top-0 bottom-0 translate-x-[320px] w-px border-r-2 border-dotted border-gray-200 dark:border-gray-600"></div>

        <div className="flex flex-col items-center justify-center w-full max-w-xl h-full relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <AboutUpper />
          </motion.div>

          <AnimatedSection>
            <About />
          </AnimatedSection>

          <AnimatedDivider />

          <AnimatedSection>
            <Projects />
          </AnimatedSection>

          <AnimatedDivider />

          <AnimatedSection>
            <Experience />
          </AnimatedSection>

          <AnimatedDivider />

          <AnimatedSection>
            <Education />
          </AnimatedSection>

          <AnimatedDivider />

          <AnimatedSection>
            <Stack />
          </AnimatedSection>

          <AnimatedDivider />

          <AnimatedSection>
            <Languages />
          </AnimatedSection>

          <AnimatedDivider />

          <AnimatedSection>
            <Contact />
          </AnimatedSection>

          <AnimatedDivider />

          <AnimatedSection>
            <Footer />
          </AnimatedSection>
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={sectionVariants}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

function AnimatedDivider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={dividerVariants}
      className="w-full h-px border-t-2 border-dotted border-gray-200 dark:border-gray-600 my-6 origin-left"
    />
  );
}
