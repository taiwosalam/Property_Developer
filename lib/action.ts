'use server';

import fs from "fs";
import path from "path";

export async function getAllSounds() {
    const soundsDir = path.join(process.cwd(), "public/sounds");
    const files = fs.readdirSync(soundsDir).filter(f => f.endsWith(".mp3"));

    return files.map(file => {
        let nameWithoutExt = file.replace(".mp3", "");
        // remove "mixkit-" prefix
        nameWithoutExt = nameWithoutExt.replace(/^mixkit-/, "");
        // remove trailing numbers (e.g., -1491)
        nameWithoutExt = nameWithoutExt.replace(/-\d+$/, "");
        // convert to title case
        const cleanName = nameWithoutExt
            .split("-")
            .map(word => word[0].toUpperCase() + word.slice(1))
            .join(" ");

        return {
            name: cleanName,
            path: `/sounds/${file}`
        };
    });
}
