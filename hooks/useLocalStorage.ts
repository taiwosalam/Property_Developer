"use client";
import { useState, useEffect } from "react";

/**
 * A hook to get and persist a value in localStorage.
 * Safe for Next.js (won't break on server).
 * @param key The localStorage key
 * @param initialValue The initial value if nothing is in localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(initialValue);

    // Load from localStorage only on client
    useEffect(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setValue(JSON.parse(item));
            }
        } catch (error) {
            console.warn("useLocalStorage read error:", error);
        }
    }, [key]);

    // Keep localStorage in sync when value changes
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn("useLocalStorage write error:", error);
        }
    }, [key, value]);

    return [value, setValue] as const;
}
