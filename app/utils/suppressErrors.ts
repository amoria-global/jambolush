// suppressErrors.ts - Global error suppression utility

let originalConsoleError: typeof console.error;
let originalConsoleWarn: typeof console.warn;

/**
 * Suppresses all console errors and warnings globally
 * This prevents browser network errors from showing in the console
 */
export function suppressConsoleErrors(): void {
  if (typeof window === 'undefined') return;

  // Store original console methods
  originalConsoleError = console.error;
  originalConsoleWarn = console.warn;

  // COMPLETELY DISABLE console.error and console.warn
  console.error = () => {};
  console.warn = () => {};

  // Suppress ALL unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if ((event as any).stopImmediatePropagation) {
      (event as any).stopImmediatePropagation();
    }
  }, true);

  // Suppress ALL error events
  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (
      msg.includes('fetch') ||
      msg.includes('http://') ||
      msg.includes('localhost') ||
      msg.includes('404') ||
      msg.includes('403') ||
      msg.includes('401') ||
      msg.includes('500')
    ) {
      event.preventDefault();
      event.stopPropagation();
      if ((event as any).stopImmediatePropagation) {
        (event as any).stopImmediatePropagation();
      }
      return false;
    }
  }, true);
}

/**
 * Restores original console methods
 */
export function restoreConsoleErrors(): void {
  if (originalConsoleError) {
    console.error = originalConsoleError;
  }
  if (originalConsoleWarn) {
    console.warn = originalConsoleWarn;
  }
}

/**
 * Temporarily suppress errors during a callback execution
 */
export async function withSuppressedErrors<T>(callback: () => Promise<T> | T): Promise<T> {
  suppressConsoleErrors();
  try {
    return await callback();
  } finally {
    restoreConsoleErrors();
  }
}
