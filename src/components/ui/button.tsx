import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60',
  {
    variants: {
      variant: {
        default: 'bg-red-500 text-white shadow-[0_0_22px_rgba(239,68,68,.18)] hover:bg-red-400',
        secondary: 'border border-white/10 bg-white/[0.045] text-white/75 hover:border-white/20 hover:bg-white/[0.08] hover:text-white',
        ghost: 'text-white/55 hover:bg-white/[0.07] hover:text-white',
        outline: 'border border-white/10 text-white/70 hover:border-red-400/40 hover:bg-red-400/[0.08] hover:text-white',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-3 text-xs',
        icon: 'size-9 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />
}
