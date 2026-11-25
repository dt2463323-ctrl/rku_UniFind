import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  label: string
}

// Native select styled as a rounded pill.
export function SelectPill({ icon, value, onChange, options, label }: Props) {
  const active = value !== options[0]?.value
  return (
    <label
      className={`relative flex flex-1 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium ring-1 ${
        active ? 'bg-primary-soft text-primary ring-primary/30' : 'bg-white text-navy ring-black/5'
      }`}
    >
      {icon}
      <span className="truncate">{options.find((o) => o.value === value)?.label}</span>
      <ChevronDown size={14} className="ml-auto shrink-0" />
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
