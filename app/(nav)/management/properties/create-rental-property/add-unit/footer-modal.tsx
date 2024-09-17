import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import { useModal } from "@/components/Modal/modal";
import { useState } from "react";
interface FooterModalProps {
  handleNoClick: () => void;
  // handleYesClick: () => void;
}

const FooterModal: React.FC<FooterModalProps> = ({
  handleNoClick,
  // handleYesClick,
}) => {
  const { setIsOpen } = useModal();
  const [countModal, setCountModal] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white py-7 px-6 shadow-lg text-center z-50">
      {countModal && (
        <div className="absolute top-[-90%] left-[50%] translate-x-[-50%] bg-white p-4">
          <div className="flex  items-center gap-4">
            <div>
              <p className="text-base text-text-secondary mb-2">
                How many units more?
              </p>
              <Select
                id=""
                placeholder="Select"
                isSearchable={false}
                options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
              />
            </div>
            <Button type="button" size="base_medium" className="py-2 px-8">
              Add
            </Button>
          </div>
        </div>
      )}
      <p className="text-brand-10 text-base font-medium mb-5">
        Does the new unit you want to add have similar details, breakdown, and
        features to the one you added last?
      </p>
      <div className="flex justify-center items-center gap-10 [&>button]:py-2 [&>button]:px-8">
        <Button
          type="button"
          size="base_medium"
          onClick={() => setCountModal(true)}
        >
          Yes
        </Button>
        <Button
          type="button"
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
