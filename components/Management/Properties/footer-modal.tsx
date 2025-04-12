"use client";

import { useState, useRef } from "react";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import { useModal } from "@/components/Modal/modal";
import { Pointer } from "@/public/icons/icons";
import { useUnitForm } from "./unit-form-context";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useAddUnitStore } from "@/store/add-unit-store";

const FooterModal = ({
  showUnitForm,
  onAddUnits,
  noForm,
}: {
  showUnitForm?: boolean;
  noForm?: boolean;
  onAddUnits?: (count: number) => void;
}) => {
  const { setIsOpen } = useModal();
  const { duplicate, setDuplicate, submitLoading, setClickedNo } = useUnitForm();
  const [countPopup, setCountPopup] = useState(false);
  const [count, setCount] = useState(duplicate?.count || 1);
  const popupRef = useRef<HTMLDivElement>(null);
  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const addUnit = useAddUnitStore((s) => s.addUnit);
  const editMode = useAddUnitStore((s) => s.editMode);
  const setAddUnitStore = useAddUnitStore((s) => s.setAddUnitStore);
  const newForm = useAddUnitStore((s) => s.newForm);
  useOutsideClick(popupRef, () => setCountPopup(false));

  const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.form;

    if (editMode && addedUnits.length > 0) {
      // If in edit mode and there are added units, submit first, then duplicate
      setDuplicate?.({ val: true, count });

      setTimeout(() => {
        form?.requestSubmit(); // Submit the form first
        setTimeout(() => {
          const lastUnit = addedUnits[addedUnits.length - 1];
          for (let i = 0; i < count; i++) {
            const newUnit = {
              ...lastUnit,
              id: `temp-${Date.now()}-${i}`,
              notYetUploaded: true,
            };
            addUnit(newUnit);
          }
          setIsOpen(false);
        }, 500); // Delay duplication slightly to ensure form submission completes
      }, 0);
    } else if (addedUnits.length > 0) {
      // Regular duplication logic
      const lastUnit = addedUnits[addedUnits.length - 1];
      for (let i = 0; i < count; i++) {
        const newUnit = {
          ...lastUnit,
          id: `temp-${Date.now()}-${i}`,
          notYetUploaded: true,
        };
        addUnit(newUnit);
      }
      setIsOpen(false);
    } else {
      // Submit the form when no added units exist
      setDuplicate?.({ val: true, count });
      setTimeout(() => {
        setIsOpen(false);
        form?.requestSubmit();
      }, 0);
    }
    setAddUnitStore("newForm", false);
  };

  const handleNoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (noForm) {
      setIsOpen(false);
      e.currentTarget.form?.requestSubmit();
      setAddUnitStore("newForm", true);
      setClickedNo?.(true);
    } else {
      setClickedNo?.(true);
      setIsOpen(false);
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white py-7 px-6 shadow-lg text-center z-50">
      {countPopup && (
        <div
          ref={popupRef}
          className="absolute top-[-90%] left-[50%] translate-x-[-50%] bg-neutral-2 p-4"
        >
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
                max={20}
                min={1}
                value={count.toString()}
                onChange={(val) => setCount(Number(val))}
              />
            </div>
            <Button
              form="add-unit-form"
              type="button"
              size="base_medium"
              className="py-2 px-8"
              disabled={submitLoading}
              onClick={handleAddClick}
            >
              {submitLoading ? "Adding..." : "Add"}
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
      <div className="flex justify-center items-center gap-10">
        <Button
          type="button"
          size="base_medium"
          className="py-2 px-8"
          onClick={() => setCountPopup(true)}
        >
          Yes
        </Button>
        <Button
          type="button"
          form="add-unit-form"
          className="py-2 px-8"
          disabled={submitLoading}
          onClick={handleNoClick}
          size="base_medium"
        >
          {submitLoading ? "Please wait..." : "No"}
        </Button>
      </div>
    </div>
  );
};

export default FooterModal;
