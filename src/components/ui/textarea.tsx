import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('w-full rounded-lg border border-white/10 bg-[#0d0f15] px-3 py-2.5 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-red-400/60 focus:ring-2 focus:ring-red-400/10', className)} {...props} />
}
