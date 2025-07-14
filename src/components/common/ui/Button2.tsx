import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils'; // Giả sử bạn có hàm cn này

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-[#3858F8] text-white shadow hover:bg-[#2C48E0] cursor-pointer',

        // --- PHẦN PRIMARY ĐÃ ĐIỀU CHỈNH ---
        primary: 'bg-white text-[#3858F8] shadow-sm hover:bg-[#F7F8FA] cursor-pointer',

        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-[#D4405E]', // Đổi hover sang màu đỏ đậm hơn cho destructive

        // --- PHẦN OUTLINE ĐÃ ĐIỀU CHỈNH ---
        outline:
          'border border-blue-600 bg-transparent text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white cursor-pointer',
        // Giải thích:
        // - border border-blue-600: Viền màu xanh (blue-600).
        // - bg-transparent: Nền trong suốt.
        // - text-blue-600: Chữ màu xanh (blue-600).
        // - hover:bg-blue-600 hover:text-white: Khi hover, nền thành màu xanh và chữ thành màu trắng.

        outline2:
          'border border-blue-600 rounded-full bg-transparent text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white cursor-pointer',

        secondary: 'bg-[#3b82f6] text-black shadow hover:bg-[#1e3a8a]', // Giữ nguyên
        secondary2: 'bg-[#3b82f6] text-white shadow ', // Giữ nguyên

        // --- PHẦN GHOST ĐÃ ĐIỀU CHỈNH ---
        ghost: 'text-[#3858F8] hover:bg-[#F7F8FA] hover:text-[#2C48E0] cursor-pointer shadow-sm',
        ghost2:
          'text-blue-600 rounded-full hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300 cursor-pointer',

        ['active-tab']: 'bg-foreground text-black shadow', // Giữ nguyên
        hero: 'bg-[#3858F8] text-white shadow hover:bg-[#2C48E0] rounded-full px-6 py-3 text-base hover:cursor-pointer',
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
        hero: 'rounded-full px-6 py-3 text-base',
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
