import { useEffect } from "react";
import { useSoundStore } from "@/store/sound-store";
export function useSoundPreference() {
    const { selectedSound, setSelectedSound, savePreference } = useSoundStore();

    // Load saved preference on mount
    useEffect(() => {
        const stored = localStorage.getItem("preferredSound");
        if (stored) setSelectedSound(stored);
    }, [setSelectedSound]);

    return {
        selectedSound,
        previewSound: setSelectedSound, // update store immediately
        savePreference,
    };
}
