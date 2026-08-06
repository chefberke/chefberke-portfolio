import ArrowLink from "@/components/shared/ArrowLink";
import MicroLabel from "@/components/shared/MicroLabel";

export interface ExperienceRole {
  title: string;
  date: string;
}

export interface ExperienceItem {
  company: string;
  roles: ExperienceRole[];
}

export interface ProjectItem {
  title: string;
  description: string;
  github?: string;
  view?: string;
}

/*
 * Both lists are the same two-column row: a name on the left, everything that
 * name holds on the right. Fixing the left column at 13rem is what makes a list
 * of companies and a list of projects scan as one table, even though they hold
 * different things -- which matters more than usual here, because the tab strip
 * swaps one for the other in place.
 *
 * Below `sm` the columns stack, since a company name and a job title do not fit
 * side by side on a phone.
 *
 * The rows arrive one at a time -- `stagger-in` on the column, so a row is a
 * beat of the page's entry rather than the list being one. That runs on the
 * first load and again every time the tab strip swaps one list for the other;
 * see `components/shared/Tabs.tsx` for how the delay is rebased on a switch.
 *
 * Exported, because the blog index is the same row and should not restate the
 * measurement. See `components/post/PostList.tsx`, which fills the two cells
 * the other way round and says why.
 */
export const ROW = "grid gap-x-6 gap-y-2 sm:grid-cols-[13rem_minmax(0,1fr)]";

/* Both lists name things the same way, so the class lives in one place. */
const NAME = "lowercase";

export function ExperienceList({
  experiences,
}: {
  experiences: ExperienceItem[];
}) {
  return (
    <div className="stagger-in flex flex-col gap-6">
      {experiences.map((item) => (
        <div key={item.company} className={ROW}>
          {/* The company is the quieter half of the pair: a reader scanning
              this list is looking for what the job was, not who paid for it. */}
          <h3 className={`${NAME} text-faint`}>{item.company}</h3>
          <div className="flex flex-col gap-3">
            {item.roles.map((role) => (
              <div key={role.title} className="flex flex-col gap-1.5">
                <p className={`${NAME} text-primary`}>{role.title}</p>
                <MicroLabel as="p">{role.date}</MicroLabel>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectList({ projects }: { projects: ProjectItem[] }) {
  return (
    <div className="stagger-in flex flex-col gap-6">
      {projects.map((item) => {
        const githubLink = item.github?.trim();
        const viewLink = item.view?.trim();

        return (
          <div key={item.title} className={ROW}>
            <h3 className={`${NAME} text-primary`}>{item.title}</h3>
            <div className="flex flex-col gap-2.5">
              <p className="text-primary">{item.description}</p>
              {(githubLink || viewLink) && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {githubLink && (
                    <ArrowLink
                      href={githubLink}
                      label={`${item.title} on GitHub`}
                    >
                      github
                    </ArrowLink>
                  )}
                  {viewLink && (
                    <ArrowLink
                      href={viewLink}
                      label={`${item.title} live site`}
                    >
                      live
                    </ArrowLink>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
