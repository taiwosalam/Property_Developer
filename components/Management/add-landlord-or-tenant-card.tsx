// Imports
import Button from "../Form/Button/button";
import { useModal } from "../Modal/modal";
interface AddLandlordOrTenantCardProps {
  desc?: string;
  title: string;
  buttonText: string;
  buttonHref?: string;
  onClick?: () => void;
}

const AddLandlordOrTenantCard: React.FC<AddLandlordOrTenantCardProps> = ({
  desc,
  title,
  onClick,
  buttonText,
  buttonHref,
}) => {
  const { setIsOpen } = useModal();
  return (
    <div className="w-[250px] h-[250px] flex gap-5 flex-col text-center items-center justify-center rounded-2xl border border-solid border-brand-9 dark:border-[#3C3D37] bg-neutral-2 dark:bg-darkText-primary">
      <p className="text-brand-9 text-xl font-medium capitalize mb-4">
        {title}
      </p>
      {desc && (
        <p className="text-[#606060] dark:text-darkText-1 text-xs font-normal mb-8">
          {desc}
        </p>
      )}
      <Button
        {...(buttonHref
          ? { href: buttonHref, onClick: () => setIsOpen(false) }
          : { onClick })}
        size="base_medium"
        className="py-2 px-8"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default AddLandlordOrTenantCard;
