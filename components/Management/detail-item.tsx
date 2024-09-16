export const DetailItem = ({
  label,
  value,
  style,
}: {
  label: string;
  value: string | number | React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div className="flex items-center">
    <div className="font-normal text-gray-500 w-[170px]" style={style}>
      <span className="text-left">{label}</span>
    </div>
    <div className="font-normal text-gray-700">
      <span className="text-left">{value}</span>
    </div>
  </div>
);
