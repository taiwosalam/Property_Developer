import TruncatedText from "@/components/TruncatedText/truncated-text";
interface EstateDetailItemProps {
  label: string;
  value: string;
  style?: React.CSSProperties;
  truncate?: boolean;
}

export const EstateDetailItem: React.FC<EstateDetailItemProps> = ({
  label,
  value,
  style,
  truncate,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-x-2 gap-y-1 font-normal text-base">
      <p
        className="text-[#747474] dark:text-white lg:w-1/3 capitalize"
        style={style}
      >
        {label}
      </p>
      <p className="lg:flex-1 text-black dark:text-darkText-2 capitalize">
        {truncate ? <TruncatedText lines={3}>{value}</TruncatedText> : value}
      </p>
    </div>
  );
};
