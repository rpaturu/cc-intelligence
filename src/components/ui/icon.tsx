import { Icon as BaseIcon, IconProps, IconName, IconSize, iconSizes, hasIcon } from '../../lib/icon-mapping';
import { cn } from "../../lib/utils";

// Extended Icon component with additional styling options
interface ExtendedIconProps extends Omit<IconProps, 'className'> {
  name: IconName | string; // Allow string for dynamic usage
  size?: IconSize;
  className?: string;
  variant?: 'default' | 'muted' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning';
  animate?: boolean;
  clickable?: boolean;
  loading?: boolean;
}

const variantStyles = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  primary: 'text-primary',
  secondary: 'text-secondary-foreground',
  destructive: 'text-destructive',
  success: 'text-green-600',
  warning: 'text-yellow-600',
};

export function Icon({ 
  name, 
  size = 'sm', 
  className = '', 
  variant = 'default',
  animate = false,
  clickable = false,
  loading = false,
  ...props 
}: ExtendedIconProps) {
  // Handle dynamic string names that might not be in the mapping
  if (!hasIcon(name)) {
    console.warn(`Icon "${name}" not found. Using fallback.`);
    name = 'help-circle' as IconName;
  }

  const baseClasses = cn(
    iconSizes[size],
    variantStyles[variant],
    animate && 'transition-all duration-200',
    clickable && 'cursor-pointer hover:scale-110 active:scale-95',
    loading && 'animate-spin',
    className
  );

  return (
    <BaseIcon 
      name={name as IconName} 
      size={size}
      className={baseClasses}
      {...props}
    />
  );
}

// Specialized icon components for common use cases
export function LoadingIcon({ size = 'sm', className = '', ...props }: Omit<ExtendedIconProps, 'name' | 'loading'>) {
  return <Icon name="zap" loading size={size} className={className} {...props} />;
}

export function StatusIcon({ 
  status, 
  size = 'sm', 
  className = '', 
  ...props 
}: Omit<ExtendedIconProps, 'name' | 'variant'> & { 
  status: 'success' | 'error' | 'warning' | 'info' 
}) {
  const iconMap = {
    success: 'check-circle' as IconName,
    error: 'x-circle' as IconName,
    warning: 'alert-triangle' as IconName,
    info: 'info' as IconName,
  };

  const variantMap = {
    success: 'success' as const,
    error: 'destructive' as const,
    warning: 'warning' as const,
    info: 'primary' as const,
  };

  return (
    <Icon 
      name={iconMap[status]} 
      variant={variantMap[status]}
      size={size} 
      className={className} 
      {...props} 
    />
  );
}

// Research-specific icon with category-based fallbacks
export function ResearchIcon({ 
  name, 
  category = 'research',
  fallback = 'lightbulb',
  ...props 
}: ExtendedIconProps & { 
  category?: string;
  fallback?: IconName;
}) {
  let iconName = name;
  
  if (!hasIcon(name)) {
    // Try to find a suitable icon based on category
    if (category === 'contacts' || category === 'decision_makers') {
      iconName = 'users';
    } else if (category === 'technology' || category === 'tech_stack') {
      iconName = 'code';
    } else if (category === 'business' || category === 'challenges') {
      iconName = 'target';
    } else if (category === 'competitive') {
      iconName = 'radar';
    } else if (category === 'growth' || category === 'signals') {
      iconName = 'trending-up';
    } else {
      iconName = fallback;
    }
  }

  return <Icon name={iconName as IconName} {...props} />;
}

// Icon with tooltip (requires your existing tooltip component)
export function IconWithTooltip({ 
  name, 
  tooltip, 
  tooltipSide = 'top',
  ...props 
}: ExtendedIconProps & { 
  tooltip: string;
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
}) {
  // This would require your Tooltip component - placeholder implementation
  return (
    <div title={tooltip}>
      <Icon name={name as IconName} {...props} />
    </div>
  );
}

// Icon button component
export function IconButton({ 
  name, 
  onClick, 
  disabled = false,
  size = 'sm',
  variant = 'default',
  className = '',
  ...props 
}: ExtendedIconProps & { 
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2 transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      <Icon 
        name={name as IconName} 
        size={size} 
        variant={variant}
        clickable={false} // Handle interaction at button level
      />
    </button>
  );
}

// Export the base Icon as default
export default Icon;