import React, { useEffect, useRef } from "react";

interface AudioWaveformProps {
  url: string;
  options?: {
    waveColor?: string;
    progressColor?: string;
    cursorColor?: string;
    height?: number;
    barWidth?: number;
  };
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ url, options }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    if (waveformRef.current) {
      // Dynamically import wavesurfer.js to ensure we have the runtime instance.
      import("wavesurfer.js").then((WaveSurferModule) => {
        const WaveSurfer = WaveSurferModule.default;
        if (!wavesurfer.current && isMounted) {
          wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current!, // non-null assertion
            waveColor: options?.waveColor || "#ddd",
            progressColor: options?.progressColor || "#ff4500",
            cursorColor: options?.cursorColor || "#333",
            height: options?.height || 60,
            barWidth: options?.barWidth || 2,
            // Use fetchParams to control CORS behavior:
            fetchParams: {
                mode: 'no-cors',      // Attempt to bypass CORS (opaque response)
                credentials: 'omit',  // Typically used for no-cors
              },
          });

          // Attach an error listener for debugging.
          wavesurfer.current.on("error", (err: any) => {
            console.error("WaveSurfer error:", err);
          });

          // Load the audio URL.
          wavesurfer.current.load(url);
        }
      });
    }

    return () => {
      isMounted = false;
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [url, options]);

  return <div ref={waveformRef} className="w-full" />;
};

export default AudioWaveform;
