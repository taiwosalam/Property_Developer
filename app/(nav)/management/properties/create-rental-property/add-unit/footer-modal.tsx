import Button from "@/components/Form/Button/button";
import { useModal } from "@/components/Modal/modal";

interface FooterModalProps {
  handleNoClick: () => void;
  handleYesClick: () => void;
}

const FooterModal: React.FC<FooterModalProps> = ({
  handleNoClick,
  handleYesClick,
}) => {
  const { setIsOpen } = useModal();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white py-7 px-6 shadow-lg text-center z-50">
      <p className="text-brand-10 text-base font-medium mb-5">
        Does the new unit you want to add have similar details, breakdown, and
        features to the one you added last?
      </p>
      <div className="flex justify-center items-center gap-10 [&>button]:py-2 [&>button]:px-8">
        <Button
          onClick={() => {
            handleYesClick();
            // setIsOpen(false);
          }}
          size="base_medium"
        >
          Yes
        </Button>
        <Button
          onClick={() => {
            handleNoClick();
            setIsOpen(false);
          }}
          size="base_medium"
        >
          No
        </Button>
      </div>
    </div>
  );
};

export default FooterModal;
