import type { Pillar } from "@/types";
import { PillarColumn } from "./PillarColumn";

interface PillarGridProps {
  pillars: Pillar[];
}

export function PillarGrid({ pillars }: PillarGridProps) {
  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: `repeat(${pillars.length}, minmax(260px, 1fr))` }}
    >
      {pillars.map((pillar) => (
        <PillarColumn key={pillar.slug} pillar={pillar} />
      ))}
    </div>
  );
}
