interface InfoItemProps {
  label: string;
  value?: string | null;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div className="flex-col items-start justify-between gap-2">
    <p className="text-text-tertiary whitespace-nowrap dark:text-darkText-1 text-[16px] font-medium">
      {label}
    </p>
    <p className="text-sm font-medium text-text-secondary dark:text-darkText-2 whitespace-nowrap">
      {value || "-"}
    </p>
  </div>
);

export default InfoItem;
