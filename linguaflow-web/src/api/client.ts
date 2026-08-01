// Small typed fetch wrapper around the LinguaFlow API.
// - Reads the base URL from VITE_API_URL (see .env / .env.example).
// - Attaches the JWT as `Authorization: Bearer <token>` when present.
// - Surfaces a typed ApiError; 401s are broadcast so the app can log out.

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5215').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// The auth layer keeps the client's token in sync. The token is set SYNCHRONOUSLY
// (during render, not in an effect) so the very first authenticated request after
// login already carries the Bearer header — otherwise a race with child data-fetch
// effects would send a tokenless request, 401, and trip the logout handler.
let authToken: string | null = null;
let onUnauthorized: () => void = () => {};

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  // When true, do NOT trigger the global logout on a 401 (used by probes/optional calls).
  silent401?: boolean;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, silent401 } = opts;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError(
      0,
      `Cannot reach the API at ${BASE_URL}. Is it running? (${String(networkErr)})`,
      null,
    );
  }

  if (res.status === 401 && !silent401) onUnauthorized();

  // 204 No Content and empty bodies.
  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, extractMessage(data, res.status), data);
  }

  return data as T;
}

// ASP.NET ProblemDetails uses `detail`/`title`; fall back to a plain string body.
function extractMessage(data: unknown, status: number): string {
  if (typeof data === 'string' && data.trim()) return data;
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (typeof obj.detail === 'string') return obj.detail;
    if (typeof obj.title === 'string') return obj.title;
  }
  return `Request failed (${status})`;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get: <T>(path: string, o?: RequestOptions) => request<T>(path, { ...o, method: 'GET' }),
  post: <T>(path: string, body?: unknown, o?: RequestOptions) =>
    request<T>(path, { ...o, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, o?: RequestOptions) =>
    request<T>(path, { ...o, method: 'PUT', body }),
  del: <T>(path: string, o?: RequestOptions) => request<T>(path, { ...o, method: 'DELETE' }),
};

export { BASE_URL };
