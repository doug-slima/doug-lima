import type { Project } from "./data";

interface Props {
  projects: Project[];
  activeProject: string;
  onSelect: (name: string) => void;
}

export default function ProjectSelector({ projects, activeProject, onSelect }: Props) {
  return (
    <nav className="absolute left-[10.5rem] top-1/2 -translate-y-1/2 flex flex-col gap-[16px] pointer-events-auto">
      {projects.map((project) => (
        <button
          key={project.name}
          onClick={() => onSelect(project.name)}
          className={`w-fit font-fenix text-[20px] bg-transparent border-0 p-0 cursor-pointer text-left ${
            activeProject === project.name
              ? "text-text-active underline decoration-text-active underline-offset-[3px]"
              : "text-text-default hover:text-text-active hover:underline hover:decoration-text-active hover:underline-offset-[3px] transition-colors"
          }`}
        >
          {project.name}
        </button>
      ))}
    </nav>
  );
}
