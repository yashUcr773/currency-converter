import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Consistent status color classes
export const statusColors = {
  primary: {
    bg: 'bg-primary',
    text: 'text-primary',
    border: 'border-primary',
    hover: 'hover:bg-primary-dark',
    light: 'bg-primary/10 border-primary/20 text-primary',
    icon: 'text-primary',
  },
  success: {
    bg: 'bg-success',
    text: 'text-success',
    border: 'border-success',
    hover: 'hover:bg-success/80',
    light: 'bg-success/10 border-success/20 text-success',
    icon: 'text-success',
  },
  warning: {
    bg: 'bg-warning',
    text: 'text-warning',
    border: 'border-warning',
    hover: 'hover:bg-warning/80',
    light: 'bg-warning/10 border-warning/20 text-warning',
    icon: 'text-warning',
  },
  destructive: {
    bg: 'bg-destructive',
    text: 'text-destructive',
    border: 'border-destructive',
    hover: 'hover:bg-destructive/80',
    light: 'bg-destructive/10 border-destructive/20 text-destructive',
    icon: 'text-destructive',
  },
  info: {
    bg: 'bg-info',
    text: 'text-info',
    border: 'border-info',
    hover: 'hover:bg-info/80',
    light: 'bg-info/10 border-info/20 text-info',
    icon: 'text-info',
  },
} as const

// Consistent card styling
export const cardStyles = {
  base: 'bg-card/80 backdrop-blur-sm border border-border shadow-lg rounded-lg',
  hover: 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300',
  interactive: 'cursor-pointer touch-manipulation',
} as const

// Consistent button variants
export const buttonVariants = {
  primary: 'bg-primary hover:bg-primary-dark text-primary-foreground',
  secondary: 'bg-secondary hover:bg-secondary/80 text-secondary-foreground',
  outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
} as const
