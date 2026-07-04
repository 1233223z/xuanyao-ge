import { changedNature, positionNames } from "@/lib/yao";
import type { YaoLine } from "@/types/yao";

type YaoLineViewProps = {
  line: YaoLine;
  useChangedLine?: boolean;
  compact?: boolean;
};

export function YaoLineView({ line, useChangedLine = false, compact = false }: YaoLineViewProps) {
  const nature = useChangedLine ? changedNature(line) : line.nature;
  const isYang = nature === "yang";

  return (
    <div className="grid grid-cols-[3rem_1fr_2.8rem] items-center gap-3 text-sm text-rice-100/68">
      <span>{positionNames[line.position - 1]}</span>
      <div className={`flex h-5 items-center ${compact ? "max-w-40" : "max-w-56"}`} aria-label={isYang ? "阳爻" : "阴爻"}>
        {isYang ? (
          <span className="block h-[6px] w-full rounded-sm bg-rice-100/88" />
        ) : (
          <span className="flex w-full items-center gap-4">
            <span className="block h-[6px] flex-1 rounded-sm bg-rice-100/88" />
            <span className="block h-[6px] flex-1 rounded-sm bg-rice-100/88" />
          </span>
        )}
      </div>
      <span className="flex items-center justify-end gap-1 text-xs text-rice-100/54">
        {line.isMoving && !useChangedLine ? (
          <>
            <span className="h-2 w-2 rounded-full bg-cinnabar-400" />
            动
          </>
        ) : (
          <span>{line.label}</span>
        )}
      </span>
    </div>
  );
}
