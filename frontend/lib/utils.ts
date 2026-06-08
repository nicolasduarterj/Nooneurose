import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isImageUrl(url: string | null): Promise<boolean> {
    if (!url) return Promise.resolve(false);

    return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        
        img.src = url;
    });
}