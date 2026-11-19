"use client";

import { useEffect } from "react";
import { recordVisit } from "@/lib/attribution-client";

/** Invisible: records where the visitor came from once per page load, for lead attribution on enquiries. */
export function AttributionCapture() {
  useEffect(() => {
    recordVisit();
  }, []);
  return null;
}
