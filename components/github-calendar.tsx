import React from "react";
import GitHubCalendar from "react-github-calendar";

function GithubCal() {
  return (
    <div className="w-full overflow-x-auto hidden md:block">
      <GitHubCalendar username="chefberke" fontSize={12} blockSize={10} />
    </div>
  );
}

export default GithubCal;
