/**
 * Central export point for all utility functions
 */

export * from './formatting.js';
export * from './strings.js';

/**
 * Safely parses a JSON string, returning a default value if parsing fails
 * @param jsonString - The JSON string to parse
 * @param defaultValue - The default value to return if parsing fails
 * @returns The parsed JSON object or the default value
 */
export function safeParseJSON<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Checks if a value is a valid number
 * @param value - The value to check
 * @returns True if the value is a valid number, false otherwise
 */
export function isValidNumber(value: any): boolean {
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value);
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return !isNaN(parsed) && isFinite(parsed);
  }
  
  return false;
}

/**
 * Creates a delay using a Promise
 * @param ms - The number of milliseconds to delay
 * @returns A Promise that resolves after the specified delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates a unique ID using a timestamp and random string
 * @returns A unique ID string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
} 