import { useState } from "react";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import { useModal } from "@/components/Modal/modal";
import { Pointer } from "@/public/icons/icons";
import { useAddUnitStore } from "@/store/add-unit-store";

interface ModalProps {
  setSaved: (a: boolean) => void;
  duplicate: {
    val: boolean;
    count: number;
  };
  setDuplicate: (dup: { val: boolean; count: number }) => void;
}

const FooterModal: React.FC<ModalProps> = ({
  setSaved,
  duplicate,
  setDuplicate,
}) => {
  const { setIsOpen } = useModal();
  const [countPopup, setCountPopup] = useState(false);
  const [count, setCount] = useState(duplicate.count);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white py-7 px-6 shadow-lg text-center z-50">
      {countPopup && (
        <div className="absolute top-[-90%] left-[50%] translate-x-[-50%] bg-neutral-2 p-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-base text-text-secondary mb-2">
                How many units more?
              </p>
              <Input
                id=""
                type="number"
                placeholder="Select"
                inputClassName="keep-spinner"
                min={1}
                max={20}
                value={count.toString()}
                onChange={(val) => setCount(Number(val))}
              />
            </div>
            <Button
              form="add-unit-form"
              type="button"
              size="base_medium"
              className="py-2 px-8"
              onClick={(e) => {
                setDuplicate({ val: true, count });
                setIsOpen(false); // Close the modal
                e.currentTarget.form?.requestSubmit();
              }}
            >
              Add
            </Button>
          </div>
          <div className="text-neutral-2 absolute top-full left-[50%] translate-x-[-50%]">
            <Pointer />
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
          onClick={() => setCountPopup(true)}
        >
          Yes
        </Button>
        <Button
          type="button"
          form="add-unit-form"
          onClick={(e) => {
            setIsOpen(false);
            e.currentTarget.form?.requestSubmit();
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
