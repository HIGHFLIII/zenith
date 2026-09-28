"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/library", label: "My Library" },
  { href: "/games", label: "Games" },
  { href: "/reviews", label: "Reviews" },
  { href: "/friends", label: "Friends" },
  { href: "/profile", label: "Profile" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [seenPath, setSeenPath] = useState(pathname);

  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="mr-2 rounded-md text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
        >
          Zenith
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} pathname={pathname} />
          ))}
        </nav>
        <div className="ml-auto hidden md:block">
          <NavLink href="/settings" pathname={pathname} label="Settings" />
        </div>
        <button
          type="button"
          className="ml-auto inline-flex h-11 items-center rounded-lg border border-border px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 pb-4 md:hidden"
        >
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} pathname={pathname} />
          ))}
          <NavLink href="/settings" pathname={pathname} label="Settings" />
        </nav>
      ) : null}
    </header>
  );
}

function NavLink({
  href,
  pathname,
  label,
}: {
  href: string;
  pathname: string;
  label?: string;
}) {
  const text = label ?? links.find((link) => link.href === href)?.label ?? href;
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {text}
    </Link>
  );
}
