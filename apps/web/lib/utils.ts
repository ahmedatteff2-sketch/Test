/**
 * Utility for conditionally joining CSS class names.
 * Filters out falsy values so you can do: cn('base', condition && 'extra')
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a number with locale-aware separators
 */
export function formatNumber(n: number, locale: string = "ar-EG"): string {
  return new Intl.NumberFormat(locale).format(n);
}

/**
 * Generate initials from a name (supports Arabic)
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Delay utility for staggered animations
 */
export function staggerDelay(index: number, baseMs: number = 80): string {
  return `${index * baseMs}ms`;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
