import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseClasses = cn(
      "relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out",
      "group", // For hover effects on children
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50"
    );

    const sizeClasses = {
      default: "h-10 px-4 py-2 text-base",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-8 text-lg",
      icon: "h-10 w-10",
    };

    const variantClasses = {
      default: cn(
        "bg-primary text-primary-foreground",
        "border border-primary",
        "hover:bg-primary/90",
        "shadow-neon-glow", // Initial glow
        "hover:shadow-neon-glow-lg", // Larger glow on hover
        "rounded-md skew-x-[-10deg] transform", // Futuristic shape
        "before:absolute before:inset-0 before:bg-primary before:opacity-0 before:transition-opacity before:duration-300 before:ease-in-out",
        "hover:before:opacity-20"
      ),
      outline: cn(
        "bg-transparent text-primary",
        "border border-primary",
        "hover:bg-primary/10",
        "shadow-neon-glow",
        "hover:shadow-neon-glow-lg",
        "rounded-md skew-x-[-10deg] transform"
      ),
      ghost: cn(
        "bg-transparent text-primary",
        "hover:bg-primary/10",
        "rounded-md"
      ),
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        <span className="relative z-10 inline-block skew-x-[10deg] transform">
          {children}
        </span>
      </motion.button>
    );
  }
);
NeonButton.displayName = "NeonButton";

export { NeonButton };