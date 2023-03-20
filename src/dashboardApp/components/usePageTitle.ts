import { useEffect } from "react";

export function usePageTitle(
  title?: string | null | (string | null | undefined)[]
) {
  useEffect(() => {
    let buffer = ["ascii-pay"];
    if (Array.isArray(title)) {
      for (let t of title) {
        if (t) {
          buffer.push(t);
        }
      }
    } else if (title) {
      buffer.push(title);
    }

    document.title = buffer.join(" | ");
  }, [title]);
}
