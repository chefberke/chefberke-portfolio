import React from "react";

function Languages() {
  return (
    <div className="flex flex-col items-start justify-center w-full pt-8">
      <div>
        <h1 className="text-neutral-500 text-sm">LANGUAGES</h1>
      </div>
      <div className="pt-3.5 w-full">
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          <div className="flex items-center justify-between w-full">
            <h2 className="text-neutral-700">Turkish</h2>
            <p className="text-neutral-400 text-sm">Native</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-neutral-700">English</h2>
            <p className="text-neutral-400 text-sm">Intermediate</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <h2 className="text-neutral-700">Deutsch</h2>
            <p className="text-neutral-400 text-sm">Basic</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Languages;
