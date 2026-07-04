import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const baseClass =
  "inline-flex min-h-11 items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-cinnabar-400/35 disabled:cursor-not-allowed disabled:opacity-45";

export function PrimaryButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={`${baseClass} border-cinnabar-400/45 bg-cinnabar-500/88 text-rice-50 shadow-lg shadow-cinnabar-950/20 hover:-translate-y-0.5 hover:bg-cinnabar-400 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={`${baseClass} border-rice-100/15 bg-rice-50/[0.045] text-rice-50 hover:-translate-y-0.5 hover:border-rice-100/28 hover:bg-rice-50/[0.08] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`${baseClass} border-cinnabar-400/45 bg-cinnabar-500/88 text-rice-50 shadow-lg shadow-cinnabar-950/20 hover:-translate-y-0.5 hover:bg-cinnabar-400`}
    >
      {children}
    </Link>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`${baseClass} border-rice-100/15 bg-rice-50/[0.045] text-rice-50 hover:-translate-y-0.5 hover:border-rice-100/28 hover:bg-rice-50/[0.08]`}
    >
      {children}
    </Link>
  );
}
