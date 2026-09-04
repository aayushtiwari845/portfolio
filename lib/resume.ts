import fs from "node:fs";
import path from "node:path";

const RESUME_DIR = path.join(process.cwd(), "public", "resume");

export interface ResumeDownload {
  readonly href: string;
  readonly sizeLabel: string;
}

/**
 * The résumé PDF is supplied out of band rather than committed with the code.
 * Drop a current PDF into `public/resume/` and the download appears; with no
 * file present the affordance is omitted entirely, because a dead or
 * placeholder download costs more trust than a missing one.
 *
 * Resolved at build time — the site stays static and ships no runtime check.
 */
export function getResumeDownload(): ResumeDownload | null {
  try {
    const file = fs
      .readdirSync(RESUME_DIR)
      .find((entry) => entry.toLowerCase().endsWith(".pdf"));

    if (!file) return null;

    const bytes = fs.statSync(path.join(RESUME_DIR, file)).size;
    if (bytes === 0) return null;

    return {
      href: `/resume/${file}`,
      sizeLabel: `PDF · ${Math.max(1, Math.round(bytes / 1024))} KB`,
    };
  } catch {
    return null;
  }
}
