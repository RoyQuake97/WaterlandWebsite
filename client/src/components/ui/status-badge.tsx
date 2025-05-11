import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        success: "bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-600",
        warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-600",
        error: "bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-600",
        info: "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-600",
        default: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  withIcon?: boolean;
}

export function StatusBadge({
  className,
  variant,
  withIcon = true,
  ...props
}: StatusBadgeProps) {
  // Determine icon based on variant
  const IconComponent = variant === "success" 
    ? CheckCircle 
    : variant === "warning" 
      ? Clock 
      : variant === "error" 
        ? XCircle 
        : AlertCircle;

  return (
    <span className={cn(statusBadgeVariants({ variant }), className)} {...props}>
      {withIcon && <IconComponent className="h-3 w-3" />}
      <span>{props.children}</span>
    </span>
  );
}