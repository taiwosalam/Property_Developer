"use client";

import { useState, useRef } from "react";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import { useModal } from "@/components/Modal/modal";
import { Pointer } from "@/public/icons/icons";
import { useUnitForm } from "./unit-form-context";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useAddUnitStore } from "@/store/add-unit-store";
import { useGlobalStore } from "@/store/general-store";
import { useModule } from "@/contexts/moduleContext";
import {
  InstallmentUnitDataObject,
  UnitDataObject,
} from "@/app/(nav)/management/properties/data";

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
  const { activeModule } = useModule();
  const isPropertyDeveloperModule = activeModule.id === "property_developer";
  const { duplicate, setDuplicate, submitLoading, setClickedNo } =
    useUnitForm();
  const [countPopup, setCountPopup] = useState(false);
  const allowEditUnit = useGlobalStore((s) => s.allowEditUnit);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const [count, setCount] = useState(duplicate?.count || 1);
  const popupRef = useRef<HTMLDivElement>(null);
  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const installmentUnits = useAddUnitStore((s) => s.installmentUnits);
  const addUnit = useAddUnitStore((s) => s.addUnit);
  const editMode = useAddUnitStore((s) => s.editMode);
  const setAddUnitStore = useAddUnitStore((s) => s.setAddUnitStore);
  const addInstallmentUnit = useAddUnitStore((s) => s.addInstallmentUnit);
  const newForm = useAddUnitStore((s) => s.newForm);
  useOutsideClick(popupRef, () => setCountPopup(false));

  const handleAddClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("reached here 1");
    e.preventDefault();
    const form =
      e.currentTarget.form ||
      (document.getElementById("add-unit-form") as HTMLFormElement | null);

    const duplicateLastUnit = () => {
      if (isPropertyDeveloperModule) {
        if (installmentUnits.length === 0) return;
        const lastUnit = installmentUnits[installmentUnits.length - 1];
        for (let i = 0; i < count; i++) {
          const newUnit: InstallmentUnitDataObject & {
            notYetUploaded?: boolean;
          } = {
            ...lastUnit,
            id: `temp-${Date.now()}-${i}`,
            notYetUploaded: true,
          };
          addInstallmentUnit(newUnit);
        }
      } else {
        if (addedUnits.length === 0) return;
        const lastUnit = addedUnits[addedUnits.length - 1];
        for (let i = 0; i < count; i++) {
          const newUnit: UnitDataObject & { notYetUploaded?: boolean } = {
            ...lastUnit,
            id: `temp-${Date.now()}-${i}`,
            notYetUploaded: true,
          };
          addUnit(newUnit);
        }
      }
      setIsOpen(false);
      onAddUnits?.(count);
    };

    if (form) {
      // Form exists: submit the form
      try {
        await new Promise<void>((resolve, reject) => {
          const handleSubmit = () => {
            form.removeEventListener("submit", handleSubmit);
            resolve();
          };
          form.addEventListener("submit", handleSubmit);
          form.requestSubmit();
        });

        // After successful submission, duplicate form
        setDuplicate?.({ val: true, count });
        if (
          isPropertyDeveloperModule
            ? installmentUnits.length > 0
            : addedUnits.length > 0
        ) {
          duplicateLastUnit();
        }
      } catch (error) {
        console.error("Form submission failed:", error);
      }
    } else if (
      isPropertyDeveloperModule
        ? installmentUnits.length > 0
        : addedUnits.length > 0
    ) {
      // No form but units exist: duplicate the last unit
      setDuplicate?.({ val: true, count });
      duplicateLastUnit();
    } else {
      // No form and no units: close modal
      setIsOpen(false);
    }
  };

  const handleNoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const formInDom = document.getElementById(
      "add-unit-form"
    ) as HTMLFormElement | null;
    setAddUnitStore("newForm", true);
    if (noForm) {
      setIsOpen(false);
      e.currentTarget.form?.requestSubmit();
      setAddUnitStore("newForm", true);
      setGlobalStore("closeUnitForm", false);
      setGlobalStore("allowEditUnit", true);
      setClickedNo?.(true);
      if (formInDom) {
        setAddUnitStore("newForm", true);
        setGlobalStore("closeUnitForm", false);
        setGlobalStore("allowEditUnit", true);
        setClickedNo?.(true);
        formInDom.reset();
      }
    } else {
      setClickedNo?.(true);
      setIsOpen(false);
      e.currentTarget.form?.requestSubmit();
      if (formInDom) {
        setAddUnitStore("newForm", true);
        setGlobalStore("closeUnitForm", false);
        setGlobalStore("allowEditUnit", true);
        formInDom.reset();
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-darkText-primary py-7 px-6 shadow-lg text-center z-50">
      {countPopup && (
        <div
          ref={popupRef}
          className="absolute top-[-90%] left-[50%] translate-x-[-50%] bg-neutral-2 dark:bg-darkText-primary p-4"
        >
          <div className="flex items-end gap-4">
            <div>
              <p className="text-base dark:text-darkText-1 text-text-secondary mb-2">
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
          <div className="text-neutral-2 dark:text-darkText-primary absolute top-full left-[50%] translate-x-[-50%]">
            <Pointer />
          </div>
        </div>
      )}
      <p className="text-brand-10 dark:text-white text-base font-medium mb-5">
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
