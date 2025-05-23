import React, { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { 
      className, 
      type = 'text', 
      label, 
      error, 
      icon, 
      iconPosition = 'left',
      ...props 
    }, 
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label 
            className="block text-sm font-medium text-foreground mb-1" 
            htmlFor={props.id}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              {icon}
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              icon && iconPosition === 'left' && "pl-10",
              icon && iconPosition === 'right' && "pr-10",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;