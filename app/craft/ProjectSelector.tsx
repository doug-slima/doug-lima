import NavSelector from "../components/NavSelector";
import type { Project } from "./data";

interface Props {
  projects: Project[];
  activeProject: string;
  onSelect: (name: string) => void;
}

export default function ProjectSelector({ projects, activeProject, onSelect }: Props) {
  return (
    <nav className="absolute left-[10.5rem] top-1/2 -translate-y-1/2 pointer-events-auto">
      <NavSelector
        variant="underline"
        direction="col"
        gap={16}
        items={projects.map((p) => ({
          label: p.name,
          active: p.name === activeProject,
          onClick: () => onSelect(p.name),
        }))}
      />
    </nav>
  );
}
