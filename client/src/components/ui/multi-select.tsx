import * as React from "react"
import { X, ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface MultiSelectOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  maxSelected?: number
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Selecione opções...",
  className,
  disabled = false,
  maxSelected,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = React.useCallback((option: string) => {
    onChange(selected.filter((s) => s !== option))
  }, [onChange, selected])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = e.target as HTMLInputElement
    if (input.value === "") {
      if (e.key === "Backspace") {
        onChange(selected.slice(0, -1))
      }
    }
  }, [onChange, selected])

  const selectables = options.filter((option) => !selected.includes(option.value))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal",
            className,
            !selected?.length && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap items-center gap-1 overflow-hidden">
            {selected?.length > 0 ? (
              <>
                {selected.slice(0, 2).map((item) => {
                  const option = options.find((opt) => opt.value === item)
                  return (
                    <Badge
                      variant="secondary"
                      key={item}
                      className="mr-1 mb-1 h-6"
                    >
                      {option?.label}
                      <button
                        className="ml-1 outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUnselect(item)
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={() => handleUnselect(item)}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  )
                })}
                {selected.length > 2 && (
                  <Badge variant="secondary" className="mr-1 mb-1 h-6">
                    +{selected.length - 2} mais
                  </Badge>
                )}
              </>
            ) : (
              placeholder
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Pesquisar..."
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {selectables.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    if (maxSelected && selected.length >= maxSelected) {
                      return
                    }
                    onChange([...selected, option.value])
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.icon && (
                    <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}