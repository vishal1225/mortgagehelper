import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
};

export function ButtonLink({ href, children }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className="btn-primary"
    >
      {children}
    </Link>
  );
}
