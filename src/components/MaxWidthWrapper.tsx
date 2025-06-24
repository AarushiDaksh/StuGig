import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type WrapperSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

interface MaxWidthWrapperProps {
  className?: string;
  children?: ReactNode;
  size?: WrapperSize;
  fullWidth?: boolean;
}

const MaxWidthWrapper = ({
  className,
  children,
  size = 'xl',
  fullWidth = false, 
}: MaxWidthWrapperProps) => {
  const widthMap = {
    'xs': 'mx-auto w-full max-w-screen-sm px-2.5 md:px-6',
    'sm': 'mx-auto w-full max-w-screen-md px-2.5 md:px-8',
    'md': 'mx-auto w-full max-w-screen-lg px-2.5 md:px-12',
    'lg': 'mx-auto w-full max-w-screen-xl px-2.5 md:px-16',
    'xl': 'mx-auto w-full max-w-screen-xl px-2.5 md:px-20',
    '2xl': 'mx-auto w-full max-w-screen-2xl px-2.5 md:px-24',
    '3xl': 'mx-auto w-full max-w-screen-3xl px-2.5 md:px-32',
  }

  return (
    <div
      className={cn(
        'h-full ',
        !fullWidth ? widthMap[size] : 'w-full',
        className
      )}>
      {children}
    </div>
  )
}

export default MaxWidthWrapper