"use client";
import React, { useRef, useState, useEffect } from "react";
import { useSoundPreference } from "@/hooks/useGetSound";
import { getAllSounds } from "@/lib/action"; // async function
import { SettingsUpdateButtonProps } from "@/components/Settings/types";
import { toast } from "sonner";
import clsx from "clsx";

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
    previewSound(path);
    if (audioRef.current) {
      audioRef.current.src = path;
      audioRef.current.play();
    }
  };

  if (loading) return <div>Loading sounds...</div>;

  return (
    <div>
      <div className="flex gap-4 flex-wrap">
        {sounds.map((sound) => (
          <button
            key={sound.path}
            onClick={() => handlePreview(sound.path)}
            className={clsx("py-4 px-10 rounded-[4px] group", {
              "bg-brand-1 dark:bg-darkBrand-1": selectedSound === sound.path,
              "bg-[rgba(245,245,245,0.5)] dark:text-darkText-1":
                selectedSound !== sound.path,
            })}
          >
            <span
              className={clsx("text-sm font-normal", {
                "text-brand-9": selectedSound === sound.path,
                "text-[rgba(0,0,0,0.5)] dark:text-darkText-1 group-hover:text-black dark:group-hover:text-white duration-150":
                  selectedSound !== sound.path,
              })}
            >
              {sound.name}
            </span>
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
