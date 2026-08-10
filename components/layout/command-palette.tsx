"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Command } from "cmdk";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Code2,
  ContactRound,
  Copy,
  FileText,
  GraduationCap,
  Mail,
  Search,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { portfolio, projects } from "@/data/portfolio";

type Action = {
  label: string;
  value: string;
  group: "Navigate" | "Projects" | "Connect";
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
  href?: string;
  copy?: string;
  external?: boolean;
  shortcut?: string;
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const actions = useMemo<Action[]>(
    () => [
      { label: "Selected work", value: "selected work projects", group: "Navigate", icon: BriefcaseBusiness, href: "/#work" },
      { label: "Experience", value: "experience internships", group: "Navigate", icon: UserRound, href: "/#experience" },
      { label: "Capabilities", value: "capabilities technologies skills", group: "Navigate", icon: GraduationCap, href: "/#capabilities" },
      { label: "About", value: "about education", group: "Navigate", icon: UserRound, href: "/#about" },
      { label: "View résumé", value: "resume cv", group: "Navigate", icon: FileText, href: "/resume" },
      ...projects.map((project) => ({
        label: project.title,
        value: `${project.title} ${project.subtitle} ${project.domain}`,
        group: "Projects" as const,
        icon: BriefcaseBusiness,
        href: `/projects/${project.slug}`,
      })),
      { label: "Copy email", value: "copy email address", group: "Connect", icon: copied ? Check : Copy, copy: portfolio.identity.email, shortcut: copied ? "COPIED" : undefined },
      { label: "Email Aayush", value: "email contact", group: "Connect", icon: Mail, href: portfolio.links.email },
      { label: "Open GitHub", value: "github profile", group: "Connect", icon: Code2, href: portfolio.links.github, external: true },
      { label: "Open LinkedIn", value: "linkedin profile", group: "Connect", icon: ContactRound, href: portfolio.links.linkedin, external: true },
    ],
    [copied],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  async function run(action: Action) {
    if (action.copy) {
      try {
        await navigator.clipboard.writeText(action.copy);
        setCopied(true);
        if (copyTimer.current) clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => setCopied(false), 1800);
      } catch {
        window.open(portfolio.links.email, "_self");
      }
      return;
    }

    setOpen(false);
    if (!action.href) return;
    if (action.external) {
      window.open(action.href, "_blank", "noopener,noreferrer");
    } else if (action.href.startsWith("mailto:")) {
      window.open(action.href, "_self");
    } else {
      router.push(action.href);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="command-trigger" type="button">
          <Search aria-hidden="true" size={14} />
          <span>COMMAND</span>
          <kbd>⌘K</kbd>
          <span className="sr-only">— open command palette</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="command-dialog" aria-describedby="command-description">
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <Dialog.Description className="sr-only" id="command-description">
            Search for a page, project, or contact action.
          </Dialog.Description>
          <Command label="Site command palette" loop>
            <div className="command-header">
              <Search aria-hidden="true" size={17} />
              <Command.Input className="command-input" autoFocus placeholder="Navigate, explore, or connect…" />
              <span className="command-shortcut">ESC</span>
            </div>
            <Command.List className="command-list">
              <Command.Empty className="command-empty">No signal found.</Command.Empty>
              {(["Navigate", "Projects", "Connect"] as const).map((group) => (
                <Command.Group className="command-group" heading={group} key={group}>
                  {actions.filter((action) => action.group === group).map((action) => {
                    const Icon = action.icon;
                    return (
                      <Command.Item
                        className="command-item"
                        key={`${group}-${action.label}`}
                        onSelect={() => void run(action)}
                        value={action.value}
                      >
                        <Icon aria-hidden={true} size={15} />
                        <span>{action.label}</span>
                        <span className="command-shortcut">
                          {action.shortcut ?? (action.external ? <ArrowUpRight aria-hidden="true" size={13} /> : "↵")}
                        </span>
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
      <span className="sr-only" aria-live="polite">{copied ? "Email address copied" : ""}</span>
    </Dialog.Root>
  );
}
