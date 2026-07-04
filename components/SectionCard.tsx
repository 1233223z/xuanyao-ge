import type { ReactNode } from "react";

type SectionCardProps = {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({ title, eyebrow, children, className = "" }: SectionCardProps) {
  return (
    <section className={`paper-panel rounded-lg p-5 sm:p-6 ${className}`}>
      {(eyebrow || title) && (
        <div className="mb-4 space-y-1">
          {eyebrow ? <p className="text-xs text-cinnabar-400">{eyebrow}</p> : null}
          {title ? <h2 className="text-lg font-medium text-rice-50">{title}</h2> : null}
        </div>
      )}
      {children}
    </section>
  );
}
