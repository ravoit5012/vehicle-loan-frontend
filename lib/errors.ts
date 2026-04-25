/**
 * Extract a human-readable error message from an axios/fetch error or any thrown value.
 *
 * Handles the common shapes the NestJS backend returns:
 *   - `{ message: "string" }`
 *   - `{ message: ["string", ...] }`
 *   - `{ message: [{ property, constraints: {...} }, ...] }` (class-validator errors)
 *   - plain Error / string / unknown
 */
export function extractErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (!err) return fallback;

  // axios error: err.response.data
  const anyErr = err as any;
  const data = anyErr?.response?.data ?? anyErr?.data ?? anyErr;

  const msg = data?.message ?? data?.error ?? data;

  if (typeof msg === "string") return msg;

  if (Array.isArray(msg)) {
    const parts = msg.map((m) => {
      if (typeof m === "string") return m;
      if (m && typeof m === "object") {
        if (m.constraints && typeof m.constraints === "object") {
          return Object.values(m.constraints).join(", ");
        }
        if (typeof m.message === "string") return m.message;
        if (typeof m.property === "string") return `Invalid ${m.property}`;
      }
      return null;
    }).filter(Boolean);
    if (parts.length) return parts.join("; ");
  }

  if (err instanceof Error && err.message) return err.message;

  if (typeof err === "string") return err;

  return fallback;
}
