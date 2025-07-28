/**
 * Safe API fetch utility that handles JSON parsing errors gracefully
 */
export async function safeFetch(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, options);
    
    // Check if response is actually JSON
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        isJson: true
      };
    } else {
      // Not JSON response, likely HTML error page
      const text = await response.text();
      return {
        ok: false,
        status: response.status,
        data: null,
        isJson: false,
        error: `Expected JSON but received ${contentType || 'unknown'} content`
      };
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      isJson: false,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

/**
 * Handle API errors gracefully and provide user-friendly messages
 */
export function handleApiError(error: any, context: string = 'API call') {
  console.error(`${context} failed:`, error);
  
  if (error.message && error.message.includes('<!doctype')) {
    console.warn(`${context}: API endpoint not available, falling back to mock data`);
    return false; // Indicates should use fallback
  }
  
  return true; // Indicates genuine error that should be handled
}
