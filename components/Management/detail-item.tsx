export const DetailItem = ({
  label,
  value,
  style,
}: {
  label: string;
  value: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div className="flex flex-col lg:flex-row gap-x-2 gap-y-1 font-normal text-base">
    <p className="text-[#747474] dark:text-white l:w-1/3" style={style}>
      {label}
    </p>
    <p className="lg:flex-1 text-black dark:text-darkText-1">{value}</p>
  </div>
);
