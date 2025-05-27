import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const computeSalePercent = (price: number, estimatedPrice: number) => {
    if (!price || !estimatedPrice) return 0;
    return ((estimatedPrice - price) / estimatedPrice) * 100;
};

export function getMinutes(minutes: number) {
    // Convert minutes to seconds
    const totalSeconds = minutes * 60;

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;

    // Conditionally include hours part
    if (minutes >= 60) {
        return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    } else {
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
}

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};
