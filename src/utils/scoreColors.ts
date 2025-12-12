/**
 * Get score color as hex value (for inline styles, canvas)
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#10B981'; // Excellent - bright green
  if (score >= 60) return '#E8A849'; // Good - amber gold
  return '#EF4444'; // Poor - bright red
}

/**
 * Get score color as Tailwind class (for className usage)
 */
export function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-[#10B981]';
  if (score >= 60) return 'text-[#E8A849]';
  return 'text-[#EF4444]';
}
