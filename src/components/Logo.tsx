// Placeholder wordmark, not the official RKU logo.
export function Logo({ className = 'text-2xl' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center font-extrabold tracking-tight ${className}`}>
      <span className="text-primary">UniFind</span>
      <span className="text-accent">✦</span>
    </span>
  )
}
