// Allowed domains for redirect URLs
const ALLOWED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'lovable.app',
  'lovable.dev',
  'fintutto.de',
  'fintutto.com',
  'vermietify.de',
  'vermietify.com',
];

/**
 * Validates that a URL is safe for redirection
 * Prevents open redirect attacks by ensuring URLs match allowed domains
 */
export function isValidRedirectUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    
    // Only allow http/https schemes
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    
    // Allow localhost for development (with any port)
    if (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1') {
      return true;
    }
    
    // Require https for production URLs
    if (parsedUrl.protocol !== 'https:') {
      return false;
    }
    
    // Check if hostname matches allowed domains (including subdomains)
    const hostname = parsedUrl.hostname.toLowerCase();
    return ALLOWED_DOMAINS.some(domain => {
      if (domain === 'localhost' || domain === '127.0.0.1') {
        return hostname === domain;
      }
      // Match exact domain or subdomains
      return hostname === domain || hostname.endsWith('.' + domain);
    });
  } catch {
    // Invalid URL
    return false;
  }
}

/**
 * Validates redirect URL and throws if invalid
 */
export function validateRedirectUrl(url: string, fieldName: string): void {
  if (!isValidRedirectUrl(url)) {
    throw new Error(`Invalid ${fieldName}: URL must be from an allowed domain`);
  }
}
