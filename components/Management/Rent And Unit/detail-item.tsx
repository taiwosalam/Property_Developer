import TruncatedText from "@/components/TruncatedText/truncated-text";
import { cn } from "@/lib/utils";

interface EstateDetailItemProps {
  label: string;
  value?: string;
  style?: React.CSSProperties;
  column?: boolean;
  truncate?: boolean;
}

export const EstateDetailItem: React.FC<EstateDetailItemProps> = ({
  label,
  value = "",
  style,
  truncate,
  column,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row gap-x-2 gap-y-1 font-normal text-base",
        column && "lg:flex-col"
      )}
    >
      <p
        className={cn(
          "text-[#747474] dark:text-white lg:w-1/3 capitalize",
          column && "lg:w-full"
        )}
        style={style}
      >
        {label}
      </p>
      <p
        className={cn(
          "lg:flex-1 text-black dark:text-darkText-2 capitalize",
          !truncate && "line-clamp-2"
        )}
      >
        {truncate ? (
          <TruncatedText lines={3}>
            <span dangerouslySetInnerHTML={{ __html: value }} />
          </TruncatedText>
        ) : (
          <span dangerouslySetInnerHTML={{ __html: value }} />
        )}
      </p>
    </div>
  );
};
