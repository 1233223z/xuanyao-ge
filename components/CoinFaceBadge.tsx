import type { CoinFace } from "@/types/yao";

export function CoinFaceBadge({ face, shaking = false }: { face: CoinFace; shaking?: boolean }) {
  const label = face === "back" ? "背" : "字";

  return (
    <span
      className={`grid h-12 w-12 place-items-center rounded-full border text-base transition sm:h-14 sm:w-14 ${
        face === "back"
          ? "border-brass-300/55 bg-brass-300/12 text-rice-50"
          : "border-rice-100/18 bg-rice-50/[0.045] text-rice-100/76"
      } ${shaking ? "coin-shake" : ""}`}
      aria-label={`铜钱${label}`}
    >
      {label}
    </span>
  );
}
