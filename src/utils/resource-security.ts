/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Validates if a URL is safe and has a valid http/https protocol.
 * Rejects javascript:, data:, and other unsafe protocols.
 */
export const isValidHttpUrl = (urlStr: string): boolean => {
  if (!urlStr) return false;
  
  const trimmed = urlStr.trim().toLowerCase();
  
  // Reject unsafe protocol prefixes
  if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:") || trimmed.startsWith("vbscript:")) {
    return false;
  }
  
  try {
    const url = new URL(urlStr.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    // If it doesn't parse but starts with http:// or https://, we can try to be lenient,
    // otherwise reject
    return trimmed.startsWith("http://") || trimmed.startsWith("https://");
  }
};

/**
 * Checks if a string contains obvious credential keywords or patterns
 * (e.g., password, token, api_key, secret, oauth, user:pass@).
 */
export const containsCredentials = (str: string): boolean => {
  if (!str) return false;
  const lower = str.toLowerCase();
  
  // Look for standard basic auth pattern: user:pass@host
  // e.g. https://username:password@github.com
  const basicAuthPattern = /[a-zA-Z0-9_.-]+:[^@/]+@/;
  if (basicAuthPattern.test(str)) {
    return true;
  }

  // Obvious credential keywords
  const suspiciousKeywords = [
    "password",
    "passwd",
    "token",
    "api_key",
    "apikey",
    "secret",
    "private_key",
    "privatekey",
    "client_secret",
    "bearer",
    "oauth_token"
  ];

  return suspiciousKeywords.some(keyword => {
    // Check if keyword is part of a query string or path segment, but be careful not to
    // trigger false positives for words like "token" in a normal medium URL if not formatted as a secret assignment.
    // However, the rule is "Local paths must not contain obvious credentials" and "Never accept password, token, secret, or API-key fields".
    // To be perfectly safe, check for patterns like key=xyz, password=xyz, token=xyz, or just general inclusion in local paths.
    if (lower.includes(keyword)) {
      // Check if it's an assignment like `token=` or `secret=` or if it's in a local path
      // Local paths shouldn't contain these words at all to be safe.
      return true;
    }
    return false;
  });
};

/**
 * Sanitizes local paths to ensure they don't contain absolute OS roots unless safe,
 * and don't contain credential-like patterns.
 */
export const isValidLocalPath = (pathStr: string): boolean => {
  if (!pathStr) return false;
  const trimmed = pathStr.trim();
  
  // Reject if it looks like a URL
  if (trimmed.toLowerCase().startsWith("http://") || trimmed.toLowerCase().startsWith("https://")) {
    return false;
  }
  
  // Reject if it contains credentials
  if (containsCredentials(trimmed)) {
    return false;
  }
  
  // Must look like a valid path (Windows or Unix-like)
  // Allow ~, /, ./, ../, letters/numbers, slashes, hyphens, underscores
  const validPathPattern = /^([a-zA-Z]:|\/|~|\.\/|\.\.\/|[a-zA-Z0-9_-])[a-zA-Z0-9_\s./~-]*$/;
  return validPathPattern.test(trimmed);
};
