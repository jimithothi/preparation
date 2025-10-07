/**
 * Fetch wrapper for authenticated requests
 * 
 * Note: The HttpOnly 'token' cookie is automatically sent by the browser
 * with every request to the same domain. No need to manually add it!
 * 
 * This wrapper just ensures credentials are included and sets default headers.
 */
export async function authFetch(url: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: "include", // Important: This ensures cookies are sent
  });
}
