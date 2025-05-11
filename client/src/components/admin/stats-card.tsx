import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

const statsCardVariants = cva(
  "p-6 transition-all duration-200 hover:shadow-md",
  {
    variants: {
      variant: {
        blue: "bg-blue-50 border-l-4 border-[#1e3a8a]",
        green: "bg-green-50 border-l-4 border-green-500",
        yellow: "bg-yellow-50 border-l-4 border-yellow-500",
        red: "bg-red-50 border-l-4 border-red-500",
        purple: "bg-purple-50 border-l-4 border-purple-500",
        teal: "bg-teal-50 border-l-4 border-teal-500",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  }
);

export interface StatsCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statsCardVariants> {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  className,
  variant,
  title,
  value,
  icon: Icon,
  trend,
  ...props
}: StatsCardProps) {
  return (
    <Card className={cn(statsCardVariants({ variant }), className)} {...props}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          
          {trend && (
            <div className={cn(
              "text-xs font-medium mt-1 flex items-center gap-1",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.isPositive ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span>+{trend.value}%</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span>-{Math.abs(trend.value)}%</span>
                </>
              )}
            </div>
          )}
        </div>
        <div className={cn(
          "text-2xl p-3 rounded-full",
          variant === "blue" && "text-[#1e3a8a] bg-blue-100",
          variant === "green" && "text-green-500 bg-green-100",
          variant === "yellow" && "text-yellow-500 bg-yellow-100",
          variant === "red" && "text-red-500 bg-red-100",
          variant === "purple" && "text-purple-500 bg-purple-100",
          variant === "teal" && "text-teal-500 bg-teal-100",
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}