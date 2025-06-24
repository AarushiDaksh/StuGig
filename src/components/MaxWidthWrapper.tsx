import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface MaxWidthWrapperProps {
  className?: string;
  children?: ReactNode;
  fullWidth?: boolean;
}

const MaxWidthWrapper = ({
  className,
  children,
  fullWidth = false,
}: MaxWidthWrapperProps) => {
  return (
    <div
      className={cn(
        'w-full h-full px-4', // consistent padding
        !fullWidth && 'max-w-[1280px] mx-auto', 
        className
      )}
    >
      {children}
    </div>
  )
}

export default MaxWidthWrapper
