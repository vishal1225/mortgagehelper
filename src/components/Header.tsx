import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Container";

export function Header() {
  return (
    <header className="border-b border-slate-200/80 bg-white/75 backdrop-blur">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <Logo />
          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600">
            <Link className="btn-ghost" href="/refinance">
              Refinance
            </Link>
            <Link className="btn-ghost" href="/self-employed">
              Self-employed
            </Link>
            <Link className="btn-secondary" href="/broker">
              Broker portal
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  );
}
