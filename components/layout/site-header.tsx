"use client";

import { Menu, Search } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export interface NavigationItem {
  readonly label: string;
  readonly href: string;
}

export interface SiteHeaderProps {
  readonly displayName: string;
  readonly navigation: readonly NavigationItem[];
  readonly githubHref: string;
  readonly linkedinHref: string;
}

const DeferredCommandPalette = dynamic(
  () => import("./command-palette").then((module) => module.CommandPalette),
  {
    loading: () => (
      <button
        aria-busy="true"
        aria-label="Loading command palette"
        className="command-trigger"
        disabled
        type="button"
      >
        <Search aria-hidden="true" size={14} />
      </button>
    ),
    ssr: false,
  },
);

const DeferredMobileMenu = dynamic(
  () => import("./mobile-menu").then((module) => module.MobileMenu),
  { ssr: false },
);

function CommandPaletteLauncher({ onRequest }: { onRequest: () => void }) {
  return (
    <button
      aria-keyshortcuts="Control+K Meta+K"
      aria-label="Open command palette"
      className="command-trigger"
      onClick={onRequest}
      title="Open command palette (Ctrl or Command + K)"
      type="button"
    >
      <Search aria-hidden="true" size={14} />
      <span className="command-label">Command</span>
      <kbd>⌘K</kbd>
    </button>
  );
}

export function SiteHeader({
  displayName,
  githubHref,
  linkedinHref,
  navigation,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const sectionLinks = useMemo(
    () => navigation.filter((item) => item.href.startsWith("/#")),
    [navigation],
  );
  const wordmarkInitials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuRequested, setMobileMenuRequested] = useState(false);
  const [commandRequested, setCommandRequested] = useState(false);
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);

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

    if (sections.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      let frame = 0;
      const updateFromScroll = () => {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(() => {
          const activationLine = Math.min(window.innerHeight * 0.32, 240);
          const current = sections
            .filter((section) => section.getBoundingClientRect().top <= activationLine)
            .at(-1);
          setActiveSection(current?.id ?? null);
        });
      };

      updateFromScroll();
      window.addEventListener("scroll", updateFromScroll, { passive: true });
      window.addEventListener("resize", updateFromScroll);
      return () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("scroll", updateFromScroll);
        window.removeEventListener("resize", updateFromScroll);
      };
    }

    const visibleSections = new Map<string, IntersectionObserverEntry>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        const visible = [...visibleSections.values()].sort(
          (a, b) =>
            Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top) ||
            b.intersectionRatio - a.intersectionRatio,
        )[0];
        setActiveSection(visible?.target.id ?? null);
      },
      { rootMargin: "-108px 0px -58%", threshold: [0, 0.15, 0.35] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname, sectionLinks]);

  useEffect(() => {
    if (commandRequested) return;

    const requestCommandPalette = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandRequested(true);
      }
    };

    document.addEventListener("keydown", requestCommandPalette);
    return () => document.removeEventListener("keydown", requestCommandPalette);
  }, [commandRequested]);

  const currentFor = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/" && activeSection === href.split("#")[1]
        ? ("location" as const)
        : undefined;
    }

    return pathname === href ? ("page" as const) : undefined;
  };

  return (
    <div className="site-header-wrap">
      <div aria-hidden="true" className="scroll-progress" />
      <header className="site-header" data-menu-open={menuOpen} data-scrolled={scrolled}>
        <Link className="wordmark" href="/">
          <span className="wordmark-mark">{wordmarkInitials}</span>
          <span className="wordmark-label">{displayName}</span>
          <span className="sr-only">— home</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {sectionLinks.map((item) => {
            const current = currentFor(item.href);
            return (
              <Link
                aria-current={current}
                className="nav-link"
                data-active={current === "location"}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          {commandRequested ? (
            <DeferredCommandPalette defaultOpen />
          ) : (
            <CommandPaletteLauncher onRequest={() => setCommandRequested(true)} />
          )}
          <Link
            aria-current={pathname === "/resume" ? "page" : undefined}
            className="resume-nav-link"
            href="/resume"
          >
            Résumé
          </Link>

          <button
            aria-controls={mobileMenuRequested ? "mobile-navigation-dialog" : undefined}
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            aria-label="Open navigation menu"
            className="menu-trigger"
            onClick={() => {
              setMobileMenuRequested(true);
              setMenuOpen(true);
            }}
            ref={mobileMenuTriggerRef}
            type="button"
          >
            <Menu aria-hidden="true" size={18} />
          </button>
          {mobileMenuRequested ? (
            <DeferredMobileMenu
              activeSection={activeSection}
              githubHref={githubHref}
              linkedinHref={linkedinHref}
              navigation={navigation}
              onOpenChange={setMenuOpen}
              open={menuOpen}
              pathname={pathname}
              triggerRef={mobileMenuTriggerRef}
            />
          ) : null}
        </div>
      </header>
    </div>
  );
}
