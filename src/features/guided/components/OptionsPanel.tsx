import { Button } from '../../../components/ui/button'
import type { ReactNode } from 'react'

export interface OptionItem {
  id: string
  text: string
  icon?: ReactNode
}

interface OptionsPanelProps {
  options: OptionItem[]
  onSelect: (id: string, text: string) => void
  disabled?: boolean
  className?: string
}

export default function OptionsPanel({ options, onSelect, disabled = false, className = '' }: OptionsPanelProps) {
  return (
    <div className={`mt-3 grid grid-cols-1 gap-2 ${className}`}>
      {options.map((option) => (
        <Button
          key={option.id}
          variant="outline"
          size="sm"
          className="w-full justify-start text-left"
          onClick={() => onSelect(option.id, option.text)}
          disabled={disabled}
        >
          {option.icon && <span className="mr-2">{option.icon}</span>}
          {option.text}
        </Button>
      ))}
    </div>
  )
}


