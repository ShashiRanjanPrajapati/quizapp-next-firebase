import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  photoURL?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
};

const imageSizes = {
  sm: 32,
  md: 40,
  lg: 56,
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({
  photoURL,
  name,
  size = "md",
  className,
}: AvatarProps) {
  const initials = getInitials(name);

  if (photoURL) {
    return (
      <Image
        src={photoURL}
        alt={name}
        width={imageSizes[size]}
        height={imageSizes[size]}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-secondary font-semibold text-foreground ring-2 ring-border",
        sizeClasses[size],
        className
      )}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
