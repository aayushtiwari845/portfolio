import { VIEW_INIT_SCRIPT } from "./mode";

/**
 * Sets the document presentation before first paint on every page arrival.
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
