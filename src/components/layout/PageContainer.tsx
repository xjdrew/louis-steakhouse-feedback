import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl";
  padding?: "sm" | "md" | "lg";
  center?: boolean;
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md", 
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl"
};

const paddingClasses = {
  sm: "py-6 sm:py-8 px-4 sm:px-6 lg:px-8",
  md: "py-8 sm:py-12 px-4 sm:px-6 lg:px-8", 
  lg: "py-12 px-4 sm:px-6 lg:px-8"
};

export default function PageContainer({
  children,
  className,
  maxWidth = "4xl",
  padding = "lg",
  center = false
}: PageContainerProps) {
  return (
    <div className={cn(
      "min-h-screen bg-background",
      paddingClasses[padding],
      center && "flex flex-col justify-center",
      className
    )}>
      <div className={cn(
        "mx-auto",
        maxWidthClasses[maxWidth]
      )}>
        {children}
      </div>
    </div>
  );
}