import { VIEW_INIT_SCRIPT } from "./mode";

/**
 * Sets `data-view` before first paint, so a returning visitor whose browser is
 * known to support the orrery never sees the document layout flash first.
 *
 * The `id` is required: `@next/next/inline-script-id` is an error in this repo.
 */
export function ModeScript() {
  return (
    <script
      id="view-initializer"
      dangerouslySetInnerHTML={{ __html: VIEW_INIT_SCRIPT }}
    />
  );
}
