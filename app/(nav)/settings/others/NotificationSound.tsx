"use client";
import React, { useRef, useState, useEffect } from "react";
import { useSoundPreference } from "@/hooks/useGetSound";
import { getAllSounds } from "@/lib/action"; // async function
import { SettingsUpdateButtonProps } from "@/components/Settings/types";
import { toast } from "sonner";

export default function SoundSelector({
  button,
}: {
  button: React.FC<SettingsUpdateButtonProps>;
}) {
  const Button = button;
  const [sounds, setSounds] = useState<{ name: string; path: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { selectedSound, previewSound, savePreference } = useSoundPreference();

  useEffect(() => {
    let isMounted = true;
    getAllSounds().then((res) => {
      if (isMounted) {
        setSounds(res);
        // default preview if nothing is selected
        if (!selectedSound && res.length > 0) {
          previewSound(res[0].path);
        }
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedSound, previewSound]);

  const handlePreview = (path: string) => {
    previewSound(path); // updates the store immediately
    if (audioRef.current) {
      audioRef.current.src = path;
      audioRef.current.play();
    }
  };

  if (loading) return <div>Loading sounds...</div>;

  return (
    <div>
      <div className="flex flex-wrap">
        {sounds.map((sound) => (
          <button
            key={sound.path}
            onClick={() => handlePreview(sound.path)}
            className={`m-1 p-2 rounded ${
              selectedSound === sound.path
                ? "bg-brand-9 text-white"
                : "bg-white text-black"
            }`}
          >
            {sound.name}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <Button
          action={async () => {
            savePreference(() => {
              toast.success("Notification Preference Updated Successfully!");
            });
          }}
        />
      </div>

      <audio ref={audioRef} />
    </div>
  );
}
