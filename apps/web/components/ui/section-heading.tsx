import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small uppercase kicker above the title */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "start";
  className?: string;
  titleClassName?: string;
}

/**
 * Consistent section header: eyebrow + bold display title + supporting copy.
 * Used to give every landing section the same strong, scannable hierarchy.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-start",
        className
      )}
    >
      {eyebrow && (
        <span className={cn("eyebrow mb-4", align === "center" && "justify-center")}>
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "section-heading text-3xl md:text-4xl lg:text-5xl",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-8 text-text-2">{description}</p>
      )}
    </div>
  );
}
