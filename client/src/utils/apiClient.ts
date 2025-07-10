// Generic API client for all endpoints, using token from cookie
export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {},
  withAuth: boolean = true
): Promise<T> {
  let token: string | undefined;

  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/); // ✅ fixed
    if (match) token = decodeURIComponent(match[1]);
  }

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(withAuth && token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let mergedHeaders: Record<string, string> = { ...baseHeaders };
  if (options.headers) {
    for (const [key, value] of Object.entries(options.headers)) {
      mergedHeaders[key] = String(value);
    }
  }

  const response = await fetch(endpoint, {
    ...options,
    headers: mergedHeaders,
    credentials: 'include', 
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }

  const result = await response.json();
  return result.data;
}
