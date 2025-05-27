import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex  items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-black text-white shadow hover:bg-[#1e3a8a] cursor-pointer',
        primary: 'bg-foreground text-black shadow hover:bg-gray-100 cursor-pointer',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-[#1e3a8a]',
        outline:
          'border border-input bg-white text-black shadow-sm hover:border-[#1e3a8a] cursor-pointer',
        secondary: 'bg-[#3b82f6] text-black shadow hover:bg-[#1e3a8a]',
        ghost: 'hover:[#1e3a8a] hover:text-accent-foreground',
        ['active-tab']: 'bg-foreground text-black shadow',
      },
      size: {
        default: 'rounded px-9 py-3',
        combobox: 'rounded px-3 py-2',
        rounded: 'rounded-full px-9 py-3',
        xs: 'rounded py-2 px-2',
        sm: 'rounded text-[15px] py-2 px-5',
        lg: 'rounded px-[35px] py-3 text-base',
        xl: 'rounded px-[49px] py-3 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
