"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, FileText, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { portfolio } from "@/data/portfolio";
import { CommandPalette } from "./command-palette";

const sectionLinks = portfolio.navigation.filter((item) => item.href.startsWith("/#"));

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("work");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = sectionLinks
      .map((item) => document.getElementById(item.href.split("#")[1]))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -58%", threshold: [0, 0.15, 0.35] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div className="site-header-wrap">
      <header className="site-header" data-menu-open={menuOpen} data-scrolled={scrolled}>
        <Link className="wordmark" href="/">
          <span className="wordmark-mark">AT</span>
          <span className="wordmark-label">Aayush Tiwari</span>
          <span className="sr-only">— home</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {sectionLinks.map((item) => {
            const section = item.href.split("#")[1];
            return (
              <Link
                className="nav-link"
                data-active={pathname === "/" && activeSection === section}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          <CommandPalette />
          <Link className="icon-button" href="/resume" aria-label="View résumé">
            <FileText aria-hidden="true" size={15} />
          </Link>

          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger asChild>
              <button className="menu-trigger" type="button" aria-label="Open navigation menu">
                <Menu aria-hidden="true" size={18} />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="mobile-dialog" aria-describedby="mobile-menu-description">
                <div className="mobile-dialog-header">
                  <Dialog.Title className="technical-label">Navigation / Index</Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="icon-button" type="button" aria-label="Close navigation menu">
                      <X aria-hidden="true" size={18} />
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only" id="mobile-menu-description">
                  Navigate to a portfolio section or the web résumé.
                </Dialog.Description>
                <nav className="mobile-nav" aria-label="Mobile navigation">
                  {portfolio.navigation.map((item, index) => (
                    <Dialog.Close asChild key={item.href}>
                      <Link href={item.href}>
                        <span>{item.label}</span>
                        <span className="technical-label">{String(index + 1).padStart(2, "0")}</span>
                      </Link>
                    </Dialog.Close>
                  ))}
                  <a href={portfolio.links.github} target="_blank" rel="noreferrer">
                    <span>GitHub</span><ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                  <a href={portfolio.links.linkedin} target="_blank" rel="noreferrer">
                    <span>LinkedIn</span><ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
    </div>
  );
}
