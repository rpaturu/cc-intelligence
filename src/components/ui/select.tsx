import * as React from "react"
import { cn } from "../../lib/utils"
import { ChevronDown } from "lucide-react"

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

interface SelectContentProps {
  children: React.ReactNode
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
}

interface SelectValueProps {
  placeholder?: string
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, setIsOpen } = React.useContext(SelectContext)

    return (
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        ref={ref}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder }: SelectValueProps) => {
  const { value } = React.useContext(SelectContext)
  
  return (
    <span className={value ? "text-gray-900" : "text-gray-500"}>
      {value || placeholder}
    </span>
  )
}

const SelectContent = ({ children }: SelectContentProps) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isOpen && !target.closest('[role="combobox"]') && !target.closest('[role="listbox"]')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen, setIsOpen])

  if (!isOpen) return null

  return (
    <div
      role="listbox"
      className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg"
    >
      {children}
    </div>
  )
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { onValueChange, setIsOpen } = React.useContext(SelectContext)

    return (
      <div
        role="option"
        className={cn(
          "relative flex cursor-default select-none items-center px-3 py-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 cursor-pointer",
          className
        )}
        onClick={() => {
          onValueChange?.(value)
          setIsOpen(false)
        }}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } 