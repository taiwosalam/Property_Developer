export const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | React.ReactNode;
}) => (
  <div className="flex items-center">
    <div className="font-normal text-gray-500 w-[170px]">
      <span className="text-left">{label}</span>
    </div>
    <div className="font-normal text-gray-700">
      <span className="text-left">{value}</span>
    </div>
  </div>
);
