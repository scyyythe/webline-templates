import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('h-10 w-full rounded-lg border border-white/10 bg-[#0d0f15] px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-red-400/60 focus:ring-2 focus:ring-red-400/10', className)} {...props} />
}
