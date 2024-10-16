export const DetailItem = ({
  label,
  value,
  style,
}: {
  label: string;
  value: string | number | React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div className="lg:grid lg:grid-cols-[170px,1fr] lg:gap-x-2">
    <p className="font-normal text-[#747474] w-[170px]" style={style}>
      {label}
    </p>
    <p className="font-normal text-black max-w-[198pxpx]">{value}</p>
  </div>
);
