/**
 * Turning an API error body into something a person can read.
 *
 * `throw new Error(body.detail)` was used directly at every call site, which
 * assumed `detail` is always a string. It is not:
 *
 *   - the pipeline endpoint returns an object for a run that produced
 *     nothing, and `new Error({...})` renders as "[object Object]"
 *   - FastAPI's own 422 validation errors return an array of
 *     `{loc, msg, type}` objects
 *
 * Both reach the user as noise instead of a reason.
 */

export interface PipelineFailure {
  node: string;
  error_type: string;
  message: string;
}

interface PipelineErrorDetail {
  status?: string;
  failures?: PipelineFailure[];
}

interface ValidationErrorItem {
  loc?: (string | number)[];
  msg?: string;
}

/** Read the human-readable message out of an API error body. */
export function apiErrorMessage(body: unknown, fallback: string): string {
  const detail = (body as { detail?: unknown })?.detail;

  if (typeof detail === 'string' && detail.trim()) {
    return detail;
  }

  // FastAPI validation errors: [{loc: ["body", "jd_text"], msg: "..."}]
  if (Array.isArray(detail)) {
    const messages = (detail as ValidationErrorItem[])
      .map((item) => {
        const field = item.loc?.filter((p) => p !== 'body').join('.');
        return field && item.msg ? `${field}: ${item.msg}` : item.msg;
      })
      .filter(Boolean);

    if (messages.length) return messages.join('; ');
  }

  // The pipeline's own failure shape.
  if (detail && typeof detail === 'object') {
    const failure = (detail as PipelineErrorDetail).failures?.[0];
    if (failure?.message) {
      return `${failure.message} (failed during: ${humanizeStep(failure.node)})`;
    }
  }

  return fallback;
}

/** Turn a pipeline node name into something worth showing a user. */
export function humanizeStep(node: string): string {
  const names: Record<string, string> = {
    parse_resume: 'reading your resume',
    parse_job: 'reading the job description',
    analyze_gap: 'comparing your skills',
    generate_projects: 'generating project ideas',
    improve_resume: 'rewriting your resume',
  };

  return names[node] ?? node.replace(/_/g, ' ');
}
