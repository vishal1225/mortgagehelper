import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Container";
import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/70">
      <Container>
        <div className="grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-3 text-sm text-slate-600">
            <Logo size="sm" />
            <p className="max-w-sm">
              {BRAND.descriptor}. Built for borrowers and brokers across{" "}
              {BRAND.region}.
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Borrowers
            </p>
            <div className="flex flex-col gap-2">
              <Link className="text-slate-600 hover:text-slate-900" href="/refinance/quiz">
                Start refinance quiz
              </Link>
              <Link
                className="text-slate-600 hover:text-slate-900"
                href="/self-employed/quiz"
              >
                Start self-employed quiz
              </Link>
              <Link className="text-slate-600 hover:text-slate-900" href="/privacy">
                Privacy policy
              </Link>
              <Link className="text-slate-600 hover:text-slate-900" href="/terms">
                Terms
              </Link>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Brokers
            </p>
            <div className="flex flex-col gap-2">
              <Link className="text-slate-600 hover:text-slate-900" href="/broker/login">
                Sign in
              </Link>
              <Link
                className="text-slate-600 hover:text-slate-900"
                href="/broker/signup"
              >
                Create account
              </Link>
              <Link className="text-slate-600 hover:text-slate-900" href="/terms">
                Broker terms & refunds
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200/70 py-6 text-xs text-slate-500">
          © 2026 {BRAND.name}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
