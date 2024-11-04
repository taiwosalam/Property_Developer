export const DetailItem = ({
  label,
  value,
  style,
}: {
  label: string;
  value: string | number | React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div className="flex flex-col lg:flex-row gap-x-2 gap-y-1 font-normal text-base">
    <span className="text-[#747474] dark:text-white lg:w-1/3" style={style}>
      {label}
    </span>
    <span className="lg:flex-1 text-black dark:text-darkText-2">{value}</span>
  </div>
);
