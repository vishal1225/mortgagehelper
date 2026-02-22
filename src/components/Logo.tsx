import Link from "next/link";
import { BRAND } from "@/lib/brand";

type LogoProps = {
  size?: "md" | "sm";
};

export function Logo({ size = "md" }: LogoProps) {
  const markSize = size === "sm" ? "h-9 w-9 text-sm" : "h-11 w-11 text-base";
  const titleSize = size === "sm" ? "text-base" : "text-lg";
  const markText = (() => {
    const words = BRAND.name.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return words[0].slice(0, 2).toUpperCase();
  })();

  return (
    <Link href="/" className="flex items-center gap-3">
      <span
        className={`inline-flex ${markSize} items-center justify-center rounded-xl bg-blue-600 font-semibold text-white shadow-sm`}
      >
        {markText}
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-semibold text-slate-900 ${titleSize}`}>
          {BRAND.name}
        </span>
        <span className="text-xs font-medium text-slate-500">
          {BRAND.region}
        </span>
      </span>
    </Link>
  );
}
