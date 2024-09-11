/**
 * Debounce function to limit the rate of function execution.
 * The provided function will be called after the specified `wait` time has passed
 * since the last invocation, preventing it from being executed too frequently.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The delay in milliseconds before the function is executed.
 * @returns {(...args: any[]) => void} - Returns a debounced function that delays the execution of `func`.
 *
 * @example
 * const debouncedLog = debounce((msg) => console.log(msg), 300);
 * window.addEventListener('resize', () => debouncedLog('Resized!'));
 *
 * @note The debounced function will delay the execution of `func` after every call. Only the last call within the delay time will trigger `func`.
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
) => {
  let timeout: ReturnType<typeof setTimeout>; // Use ReturnType for proper type inference of setTimeout
  return (...args: Parameters<T>) => {
    // Clear the previous timeout if a new one is set
    clearTimeout(timeout);
    // Set a new timeout with the provided delay
    timeout = setTimeout(() => func(...args), wait);
  };
};
