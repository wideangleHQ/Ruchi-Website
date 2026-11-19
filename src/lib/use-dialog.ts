"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal behaviour for drawers, menus and overlays:
 * focus moves in (to `[data-autofocus]` or the first control), Tab is trapped, Escape closes,
 * the page behind can't scroll, and focus returns to the opener on close.
 * `closeOnBack`: the phone/browser Back button closes the dialog instead of leaving the page.
 *   Put `onClickCapture` on the dialog so in-app links inside it replace the Back marker
 *   (otherwise closing would pop the marker and cancel the navigation).
 */
export function useDialog<T extends HTMLElement = HTMLDivElement>(open: boolean, onClose: () => void, { closeOnBack = false } = {}) {
  const ref = useRef<T>(null);
  const router = useRouter();
  const onCloseRef = useRef(onClose);
  const navigatingRef = useRef(false);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  const onClickCapture = useCallback(
    (e: React.MouseEvent) => {
      if (!closeOnBack || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      e.preventDefault();
      navigatingRef.current = true;
      onCloseRef.current();
      router.replace(url.pathname + url.search + url.hash); // takes over the marker entry: Back then leaves the new page normally
    },
    [closeOnBack, router]
  );

  useEffect(() => {
    if (!open) return;
    const node = ref.current;
    const opener = document.activeElement as HTMLElement | null;
    const focusables = () =>
      node ? [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement) : [];

    const initial = node?.querySelector<HTMLElement>("[data-autofocus]") ?? focusables()[0] ?? node;
    initial?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !node.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !node.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Back button: push a marker entry that keeps the router's own state, so Next.js treats it as the same page.
    let marked = false;
    const onPop = () => {
      marked = false;
      onCloseRef.current();
    };
    if (closeOnBack) {
      window.history.pushState({ ...(window.history.state ?? {}), ruchiDialog: true }, "");
      marked = true;
      window.addEventListener("popstate", onPop);
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      if (closeOnBack) {
        window.removeEventListener("popstate", onPop);
        // Closed by a button or Escape: drop our marker. Closed by navigating away: the marker is no longer current, leave history alone.
        if (marked && !navigatingRef.current && window.history.state?.ruchiDialog) window.history.back();
        navigatingRef.current = false;
      }
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [open, closeOnBack]);

  return { ref, onClickCapture };
}
