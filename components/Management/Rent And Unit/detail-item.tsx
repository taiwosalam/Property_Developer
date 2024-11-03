interface EstateDetailItemProps {
  label: string;
  value: string;
  style?: React.CSSProperties;
}

export const EstateDetailItem: React.FC<EstateDetailItemProps> = ({
  label,
  value,
  style,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-x-2 gap-y-1">
      <span
        className="text-sm font-medium text-gray-500 dark:text-white lg:w-1/3"
        style={style}
      >
        {label}
      </span>
      <span className="lg:flex-1 text-base font-medium text-gray-900 dark:text-darkText-2">
        {value}
      </span>
    </div>
  );
};
