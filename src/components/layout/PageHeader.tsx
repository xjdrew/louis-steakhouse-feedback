import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  center?: boolean;
  size?: "sm" | "md" | "lg";
}

const titleClasses = {
  sm: "text-2xl font-bold text-foreground",
  md: "text-3xl font-bold text-foreground", 
  lg: "text-4xl font-bold text-foreground"
};

const descriptionClasses = {
  sm: "text-sm text-muted-foreground",
  md: "text-base text-muted-foreground",
  lg: "text-xl text-muted-foreground"
};

export default function PageHeader({
  title,
  description,
  children,
  className,
  center = false,
  size = "lg"
}: PageHeaderProps) {
  return (
    <div className={cn(
      "mb-8 sm:mb-12",
      center && "text-center",
      className
    )}>
      <h1 className={cn(
        titleClasses[size],
        description ? "mb-2 sm:mb-4" : "mb-0"
      )}>
        {title}
      </h1>
      
      {description && (
        <p className={cn(
          descriptionClasses[size],
          children ? "mb-6 sm:mb-8" : "mb-0"
        )}>
          {description}
        </p>
      )}
      
      {children && (
        <div className="mt-6 sm:mt-8">
          {children}
        </div>
      )}
    </div>
  );
}