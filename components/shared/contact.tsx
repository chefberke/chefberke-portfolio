import Link from "next/link";
import React from "react";

function Contact() {
  return (
    <div className="flex flex-col items-start justify-center w-full pt-8">
      <div>
        <h1 className="text-neutral-500 text-sm">CONTACT</h1>
      </div>
      <div className="pt-3.5 w-full">
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-neutral-700">Email</h2>
            <p className="text-neutral-400 hover:text-neutral-800 cursor-pointer transition-all">
              <Link href="mailto:berkekanber@gmail.com">
                berkekanber@gmail.com
              </Link>
            </p>
          </div>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-neutral-700">LinkedIn</h2>
            <p className="text-neutral-400 hover:text-neutral-800 cursor-pointer transition-all">
              <Link
                href="https://www.linkedin.com/in/berkekanber/"
                target="_blank"
                rel="noopener noreferrer"
              >
                /in/berkekanber
              </Link>
            </p>
          </div>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-neutral-700">GitHub</h2>
            <p className="text-neutral-400 hover:text-neutral-800 cursor-pointer transition-all">
              <Link
                href="https://github.com/chefberke"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/chefberke
              </Link>
            </p>
          </div>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-neutral-700">Twitter</h2>
            <p className="text-neutral-400 hover:text-neutral-800 cursor-pointer transition-all">
              <Link
                href="https://x.com/chef_berke"
                target="_blank"
                rel="noopener noreferrer"
              >
                x.com/chef_berke
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
