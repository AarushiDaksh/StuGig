import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type SpacingSize = 'none' | 'xs' | 'small' | 'medium' | 'large' | 'xl';
type SpacingOnly = 'top' | 'bottom' | undefined;

interface SectionSpacerProps {
  className?: string;
  size?: SpacingSize;
  only?: SpacingOnly;
  children?: ReactNode;
}

/**
 * SectionSpacer component adds vertical padding sections
 *
 * Props:
 * - size: 'none' | 'xs' | 'small' | 'medium' | 'large' | 'xl'
 * - only: 'top' | 'bottom' (optional) – if set, applies padding only to that side
 * - className: additional Tailwind classes
 */
const SectionSpacer = ({
  className,
  size = 'medium',
  only,
  children,
}: SectionSpacerProps) => {
  // Define spacing for both top and bottom separately
  const spacingMapTop = {
    none: 'pt-0',
    xs: 'pt-4 md:pt-6',
    small: 'pt-8 md:pt-12',
    medium: 'pt-12 md:pt-16 lg:pt-20',
    large: 'pt-16 md:pt-24 lg:pt-32',
    xl: 'pt-24 md:pt-32 lg:pt-40',
  }

  const spacingMapBottom = {
    none: 'pb-0',
    xs: 'pb-4 md:pb-6',
    small: 'pb-8 md:pb-12',
    medium: 'pb-12 md:pb-16 lg:pb-20',
    large: 'pb-16 md:pb-24 lg:pb-32',
    xl: 'pb-24 md:pb-32 lg:pb-40',
  }

  const spacingMapBoth = {
    none: 'py-0',
    xs: 'py-4 md:py-6',
    small: 'py-8 md:py-12',
    medium: 'py-12 md:py-16 lg:py-20',
    large: 'py-16 md:py-24 lg:py-32',
    xl: 'py-24 md:py-32 lg:py-40',
  }

  // Select the appropriate spacing class based on 'only' prop
  let spacingClass;
  if (only === 'top') {
    spacingClass = spacingMapTop[size];
  } else if (only === 'bottom') {
    spacingClass = spacingMapBottom[size];
  } else {
    spacingClass = spacingMapBoth[size];
  }

  return (
    <section
      className={cn(
        'w-full',
        spacingClass,
        className
      )}
    >
      {children}
    </section>
  )
}

export default SectionSpacer