import { useRef, useState, useEffect } from "react";

interface IMarqueeProps {
  text: string;
  speed: number;
  url?: string;
  className?: string;
  urlText?: string;
  showMarquee?: boolean;
}

const Marquee = ({
  text,
  speed,
  url,
  urlText,
  className,
  showMarquee = false,
}: IMarqueeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationDuration, setAnimationDuration] = useState(0);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (marqueeRef.current && textRef.current) {
      const containerWidth = marqueeRef.current.offsetWidth;
      const textWidth = textRef.current.offsetWidth;
      const totalDistance = containerWidth + textWidth;

      const duration = totalDistance / speed;
      setAnimationDuration(duration);
    }
  }, [speed, text]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {showMarquee && (
        <div className={`relative overflow-hidden z-50 ${className}`}>
          <div
            ref={marqueeRef}
            className="w-full h-4 flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              ref={textRef}
              className="whitespace-nowrap flex items-center gap-4"
              style={{
                animationName: "marquee",
                animationDuration: `${animationDuration}s`,
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
                animationPlayState: isHovered ? "paused" : "running",
              }}
            >
              <div
                className="text-brand-9 text-sm"
                dangerouslySetInnerHTML={{ __html: text }}
              />
              {url && urlText && (
                <a
                  href={url}
                  onClick={handleLinkClick}
                  className="text-blue-600 text-sm hover:text-blue-800 underline font-medium transition-colors duration-200"
                >
                  {urlText}
                </a>
              )}
            </div>
          </div>

          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(100%);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default Marquee;