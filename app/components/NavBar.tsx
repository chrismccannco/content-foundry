"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = { label: string; href: string };

export default function NavBar({ nav, logo }: { nav: NavItem[]; logo: string }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fn-nav">
      <Link href="/" className="fn-logo" onClick={() => setOpen(false)}>
        {logo}
      </Link>
      <button
        type="button"
        className="fn-hamburger"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span /><span /><span />
      </button>
      <span className={open ? "fn-navlinks open" : "fn-navlinks"}>
        {nav.map((n) => (
          <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
            {n.label}
          </Link>
        ))}
      </span>
    </nav>
  );
}
