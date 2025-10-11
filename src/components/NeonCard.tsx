import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const NeonCard = React.forwardRef<HTMLDivElement, NeonCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative bg-card text-card-foreground border border-primary/30 rounded-lg p-6",
          "shadow-lg shadow-primary/20",
          "overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/10 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300",
          "hover:before:opacity-100",
          "hover:shadow-primary/40 hover:border-primary transition-all duration-300 ease-in-out",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.01 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
NeonCard.displayName = "NeonCard";

interface NeonCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
const NeonCardHeader = React.forwardRef<HTMLDivElement, NeonCardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-0 pb-4", className)}
      {...props}
    />
  )
);
NeonCardHeader.displayName = "NeonCardHeader";

interface NeonCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
const NeonCardTitle = React.forwardRef<HTMLHeadingElement, NeonCardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-bold leading-none tracking-tight text-primary text-neon-glow", className)}
      {...props}
    />
  )
);
NeonCardTitle.displayName = "NeonCardTitle";

interface NeonCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
const NeonCardDescription = React.forwardRef<HTMLParagraphElement, NeonCardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
NeonCardDescription.displayName = "NeonCardDescription";

interface NeonCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
const NeonCardContent = React.forwardRef<HTMLDivElement, NeonCardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-0 pt-0", className)} {...props} />
  )
);
NeonCardContent.displayName = "NeonCardContent";

interface NeonCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
const NeonCardFooter = React.forwardRef<HTMLDivElement, NeonCardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-0 pt-4", className)}
      {...props}
    />
  )
);
NeonCardFooter.displayName = "NeonCardFooter";

export { NeonCard, NeonCardHeader, NeonCardFooter, NeonCardTitle, NeonCardDescription, NeonCardContent };