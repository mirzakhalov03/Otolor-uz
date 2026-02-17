/**
 * Utility Functions
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns The debounced function
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * 
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @returns The throttled function
 */
export function throttle<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func(...args);
    }
  };
}

/**
 * Deep clones an object
 * 
 * @param obj - The object to clone
 * @returns The cloned object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Formats a number as currency
 * 
 * @param value - The number to format
 * @param currency - The currency code (default: USD)
 * @param locale - The locale (default: en-US)
 * @returns The formatted currency string
 */
export function formatCurrency(
  value: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Capitalizes the first letter of a string
 * 
 * @param str - The string to capitalize
 * @returns The capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates initials from a name
 * 
 * @param firstName - First name
 * @param lastName - Last name
 * @returns The initials
 */
export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
}
