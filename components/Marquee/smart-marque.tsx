import { useMarqueeData } from "./data";
import Marquee from "./marquee";
import { DynamicMarqueeConfig } from "./types";


interface SmartMarqueeProps extends DynamicMarqueeConfig {
  className?: string;
}

export const SmartMarquee = ({ className, ...config }: SmartMarqueeProps) => {
  const { currentMarquee, hasMarquees } = useMarqueeData(config);

  if (!hasMarquees || !currentMarquee) return null;

  return (
    <Marquee
      text={currentMarquee.text}
      url={currentMarquee.url}
      urlText={currentMarquee.urlText}
      speed={currentMarquee.speed}
      showMarquee={true}
      className={className}
    />
  );
};
