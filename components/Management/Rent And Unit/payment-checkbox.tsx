import Checkbox from "@/components/Form/Checkbox/checkbox";
import useWindowWidth from "@/hooks/useWindowWidth";

type CheckboxOption = {
  label: string;
  key: string;
};

type PaymentCheckBoxsProps = {
  options: CheckboxOption[];
  selectedOptions: Record<string, boolean>;
  onChange: (optionKey: string, checked: boolean) => void;
  isWebUser?: boolean;
  isMobileUser?: boolean;
  currency?: string;
  sm?: boolean;
  className?: string;
};

const PaymentCheckBoxs: React.FC<PaymentCheckBoxsProps> = ({
  options,
  selectedOptions,
  onChange,
  isWebUser,
  isMobileUser,
  currency,
  sm,
  className,
}) => {
  const { isMobile } = useWindowWidth();
  return (
    <div className={`flex items-center gap-4 flex-wrap ${className || ""}`}>
      {options.map(({ label, key }) => (
        <Checkbox
          sm={isMobile || sm}
          key={key}
          checked={selectedOptions[key]}
          onChange={(checked) => onChange(key, checked)}
          disabled={
            (key === "mobile_notification" && isWebUser) ||
            (key === "create_invoice" &&
              (!isMobileUser || (currency !== "naira" && isMobileUser)))
          }
        >
          {label}
        </Checkbox>
      ))}
    </div>
  );
};

export default PaymentCheckBoxs;
