"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import { useRef, type RefObject } from "react";

import type { NavigationItem } from "./site-header";

export interface MobileMenuProps {
  readonly activeSection: string | null;
  readonly githubHref: string;
  readonly linkedinHref: string;
  readonly navigation: readonly NavigationItem[];
  readonly onOpenChange: (open: boolean) => void;
  readonly open: boolean;
  readonly pathname: string;
  readonly triggerRef: RefObject<HTMLButtonElement | null>;
}

export function MobileMenu({
  activeSection,
  githubHref,
  linkedinHref,
  navigation,
  onOpenChange,
  open,
  pathname,
  triggerRef,
}: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const pendingSectionFocus = useRef<string | null>(null);

  const currentFor = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/" && activeSection === href.split("#")[1]
        ? ("location" as const)
        : undefined;
    }

    return pathname === href ? ("page" as const) : undefined;
  };

  const prepareNavigation = (href: string) => {
    if (pathname === "/" && href.startsWith("/#")) {
      pendingSectionFocus.current = href.split("#")[1];
    }
    onOpenChange(false);
  };

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          aria-describedby="mobile-menu-description"
          className="mobile-dialog"
          id="mobile-navigation-dialog"
          onCloseAutoFocus={(event) => {
            const section = pendingSectionFocus.current;
            pendingSectionFocus.current = null;
            event.preventDefault();

            if (!section) {
              triggerRef.current?.focus();
              return;
            }

            window.requestAnimationFrame(() => {
              const target =
                document.getElementById(`${section}-heading`) ??
                document.getElementById(section);
              if (!target) {
                triggerRef.current?.focus();
                return;
              }

              const hadTabIndex = target.hasAttribute("tabindex");
              if (!hadTabIndex) target.setAttribute("tabindex", "-1");
              target.focus({ preventScroll: true });
              if (!hadTabIndex) {
                target.addEventListener(
                  "blur",
                  () => target.removeAttribute("tabindex"),
                  { once: true },
                );
              }
            });
          }}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            firstLinkRef.current?.focus();
          }}
          style={{ maxHeight: "calc(100dvh - 24px)", overflowY: "auto" }}
        >
          <div className="mobile-dialog-header">
            <Dialog.Title className="technical-label">
              Navigation / Index
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close navigation menu"
                className="icon-button"
                type="button"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only" id="mobile-menu-description">
            Navigate to a portfolio section or the web résumé.
          </Dialog.Description>
          <nav aria-label="Mobile navigation" className="mobile-nav">
            {navigation.map((item, index) => (
              <Dialog.Close asChild key={item.href}>
                <Link
                  aria-current={currentFor(item.href)}
                  href={item.href}
                  onClick={() => prepareNavigation(item.href)}
                  ref={index === 0 ? firstLinkRef : undefined}
                >
                  <span>{item.label}</span>
                  <span className="technical-label">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>
              </Dialog.Close>
            ))}
            <a href={githubHref} rel="noreferrer" target="_blank">
              <span>GitHub</span>
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
            <a href={linkedinHref} rel="noreferrer" target="_blank">
              <span>LinkedIn</span>
              <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
