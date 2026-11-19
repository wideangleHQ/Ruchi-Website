import { AlertTriangle } from "lucide-react";
import type { CartIssue } from "@/utils/cart-health";

/** Plain-language list of problems that must be fixed before checkout. Renders nothing for a healthy cart. */
export function CartHealthNotice({ issues }: { issues: CartIssue[] }) {
  if (issues.length === 0) return null;
  return (
    <div role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
      <p className="mb-1 flex items-center gap-1.5 font-semibold">
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> Please review your cart
      </p>
      <ul className="list-disc space-y-0.5 pl-5">
        {issues.map((i) => (
          <li key={i.lineId}>{i.message}</li>
        ))}
      </ul>
    </div>
  );
}
