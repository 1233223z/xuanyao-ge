import { YaoLineView } from "@/components/YaoLineView";
import type { Hexagram, YaoLine } from "@/types/yao";

type HexagramFigureProps = {
  title: string;
  hexagram: Hexagram;
  lines: YaoLine[];
  useChangedLines?: boolean;
};

export function HexagramFigure({ title, hexagram, lines, useChangedLines = false }: HexagramFigureProps) {
  return (
    <div className="rounded-lg border border-rice-100/12 bg-ink-950/32 p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-rice-100/48">{title}</p>
          <h3 className="mt-1 text-xl font-medium text-rice-50">{hexagram.name}</h3>
        </div>
        <span className="rounded border border-rice-100/12 px-2 py-1 text-xs text-rice-100/58">
          第{hexagram.sequence}卦
        </span>
      </div>

      <div className="space-y-3">
        {[...lines]
          .sort((a, b) => b.position - a.position)
          .map((line) => (
            <YaoLineView key={line.position} line={line} useChangedLine={useChangedLines} />
          ))}
      </div>
    </div>
  );
}
