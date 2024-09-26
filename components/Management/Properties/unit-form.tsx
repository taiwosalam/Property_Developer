import { useState, useRef } from "react";
import UnitPictures from "./unit-pictures";
import UnitDetails from "./unit-details";
import UnitFeatures from "./unit-features";
import UnitBreakdownNewTenant from "./unit-breakdown-new-tenant";
import UnitBreakdownRenewalTenant from "./unit-breakdown-renewal-tenants";
import { UnitFormContext } from "./unit-form-context";
import { getFormData } from "@/utils/getFormData";
import Button from "@/components/Form/Button/button";
import { useAddUnitStore } from "@/store/add-unit-store";
import { UnitTypeKey } from "@/data";

export interface UnitFormState {
  isEditing?: boolean;
  images: string[];
  unitType: "" | UnitTypeKey;
  formResetKey: number;
}

interface UnitFormProps {
  index?: number;
  data: any;
  empty: boolean;
  isEditing?: boolean;
  setIsEditing?: (a: boolean) => void;
  setSaved?: (a: boolean) => void;
  duplicate?: { val: boolean; count: number };
  setDuplicate?: (a: { val: boolean; count: number }) => void;
}

const UnitForm: React.FC<UnitFormProps> = ({
  index,
  empty = false,
  data,
  setIsEditing,
  isEditing,
  setSaved,
  duplicate,
  setDuplicate,
}) => {
  const addUnit = useAddUnitStore((s) => s.addUnit);
  const editUnit = useAddUnitStore((s) => s.editUnit);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<UnitFormState>({
    isEditing: isEditing,
    images: empty ? [] : data.images,
    unitType: empty ? "" : data.unitType,
    formResetKey: 0,
  });
  const setImages = (newImages: string[], options?: { append: boolean }) =>
    setState((x) => {
      const append = options?.append ?? true;
      if (append) {
        const totalImages = x.images.length + newImages.length;
        if (totalImages > 14) {
          // max of 14 images
          const allowedImages = newImages.slice(0, 14 - x.images.length);
          return { ...x, images: [...x.images, ...allowedImages] };
        }
        return { ...x, images: [...x.images, ...newImages] };
      } else {
        return { ...x, images: newImages.slice(0, 14) };
      }
    });
  const removeImage = (index: number) =>
    setState((x) => ({ ...x, images: x.images.filter((_, i) => i !== index) }));
  const setUnitType = (unitType: "" | UnitTypeKey) =>
    setState((x) => ({ ...x, unitType }));
  const resetForm = () =>
    setState((x) => ({ ...x, formResetKey: x.formResetKey + 1 }));

  const emptySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (form) {
      let unitData = getFormData(form);
      unitData.images = state.images;
      console.log(unitData);
      if (duplicate?.val) {
        addUnit(unitData, duplicate.count); // Pass duplicate count
        // console.log("addunit duplicate");
      } else {
        addUnit(unitData);
      }
      if (setDuplicate && duplicate?.val) {
        setDuplicate({
          val: false,
          count: duplicate?.count ?? 0, // Use existing count or default to 0
        });
        // console.log("reset val");
      }
      form.reset();
      resetForm();
    }
  };

  const editSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (form) {
      const unitData = getFormData(form);
      unitData.images = state.images;
      index && editUnit(index, unitData);
      if (setIsEditing) setIsEditing(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    if (setIsEditing) setIsEditing(false);
  };

  return (
    <UnitFormContext.Provider
      value={{ ...state, setImages, removeImage, setUnitType }}
    >
      <form
        id={empty ? "add-unit-form" : "edit-unit-form"}
        ref={formRef}
        className="space-y-6 lg:space-y-8 max-w-[970px]"
        onSubmit={empty ? emptySubmit : editSubmit}
      >
        {isEditing && (
          <>
            <p className="text-brand-9 font-semibold">Edit Unit</p>
            <hr className="!my-4 border-none bg-borders-dark h-[2px]" />
          </>
        )}
        <UnitPictures />
        <UnitDetails />
        <UnitFeatures />
        <UnitBreakdownNewTenant />
        <UnitBreakdownRenewalTenant />
        {!empty && (
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              size="sm_medium"
              variant="light_red"
              className="py-1 px-8"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm_medium" className="py-1 px-8">
              Update
            </Button>
          </div>
        )}
      </form>
    </UnitFormContext.Provider>
  );
};

export default UnitForm;
