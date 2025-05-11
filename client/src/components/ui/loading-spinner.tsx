import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  text?: string;
  color?: "primary" | "secondary" | "white";
}

export const LoadingSpinner = ({ 
  size = "md", 
  className, 
  showText = true,
  text = "Loading...",
  color = "primary"
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  const colorClasses = {
    primary: "text-[#1e3a8a]",
    secondary: "text-[#00c6ff]",
    white: "text-white"
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={cn(
        "animate-spin",
        sizeClasses[size],
        colorClasses[color],
        className
      )} />
      {showText && <p className={cn("mt-2 text-sm font-medium", colorClasses[color])}>{text}</p>}
    </div>
  );
};