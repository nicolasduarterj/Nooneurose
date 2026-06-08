import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isImageUrl(url: string | null) {
    if (!url) return false;
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(url);
}