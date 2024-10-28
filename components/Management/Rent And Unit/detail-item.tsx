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
    <div className="flex space-x-2">
      <span
        className="text-sm font-medium text-gray-500 dark:text-white w-1/3"
        style={style}
      >
        {label}
      </span>
      <span className="text-base font-semibold text-gray-900 dark:text-darkText-2 w-2/3">
        {value}
      </span>
    </div>
  );
};
