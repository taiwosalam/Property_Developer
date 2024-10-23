const LabelValuePair: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => {
  return (
    <div className="flex justify-between gap-4 capitalize">
      <p className="text-text-label dark:text-darkText-1">{label}</p>
      <p className="text-text-secondary dark:text-darkText-1 text-right">
        {value}
      </p>
    </div>
  );
};

const OtherCard: React.FC<{
  items: { label: string; value: string }[];
}> = ({ items }) => {
  return (
    <div
      className="bg-white dark:bg-darkText-primary rounded-lg p-4 text-sm font-medium min-w-[350px] max-w-full"
      style={{
        boxShadow:
          "0px 0.753px 1.506px 0px rgba(21, 30, 43, 0.08), 0px 1.506px 3.013px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="space-y-2">
        {items.map((item, index) => (
          <LabelValuePair key={index} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
};

export default OtherCard;
