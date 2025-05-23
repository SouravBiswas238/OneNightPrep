import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
    
    // Variant styles
    const variantStyles = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      success: 'bg-success text-success-foreground hover:bg-success/90',
    };
    
    // Size styles
    const sizeStyles = {
      sm: 'h-9 px-3 rounded-md text-sm',
      md: 'h-10 py-2 px-4 rounded-md',
      lg: 'h-11 px-8 rounded-md',
      icon: 'h-10 w-10 rounded-md',
    };
    
    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          loading && 'opacity-70 cursor-not-allowed',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="mr-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        ) : iconLeft ? (
          <span className="mr-2">{iconLeft}</span>
        ) : null}
        
        {children}
        
        {iconRight && !loading && (
          <span className="ml-2">{iconRight}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;