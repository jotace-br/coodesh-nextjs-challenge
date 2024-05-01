import * as React from 'react';

import { cn } from '@utils/shadcn-utils';
import { LucideIcon, LucideProps } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  iconProps?: LucideProps;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, iconProps = {}, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;
    const [show, setShow] = React.useState(false);
    const { className: iconClassName, ...iconRest } = iconProps;

    return (
      <div className='w-full relative'>
        {StartIcon && (
          <div className='absolute left-1.5 top-1/2 transform -translate-y-1/2'>
            <StartIcon size={18} className='text-muted-foreground text-icons' />
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-9 w-full rounded-md border border-input border-icons text-gray-950 bg-slate-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            startIcon ? 'pl-8' : '',
            endIcon ? 'pr-8' : '',
            className
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            <EndIcon className='text-muted-foreground text-icons' size={18} />
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
