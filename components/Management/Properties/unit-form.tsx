"use client";
import { useState, useRef } from "react";
import UnitPictures from "./unit-pictures";
import UnitDetails from "./unit-details";
import UnitFeatures from "./unit-features";
import UnitBreakdownNewTenant from "./unit-breakdown-new-tenant";
import UnitBreakdownRenewalTenant from "./unit-breakdown-renewal-tenants";
import UnitBreakdownFacility from "./unit-breakdown-facility";
import { UnitFormContext } from "./unit-form-context";
import { getFormData } from "@/utils/getFormData";
import { useAddUnitStore } from "@/store/add-unit-store";
import { UnitTypeKey } from "@/data";
import FlowProgress from "@/components/FlowProgress/flow-progress";
import EditUnitActions from "./editUnitActions";
import AddUntFooter from "./AddUnitFooter";
import { useParams } from "next/navigation";
export interface UnitFormState {
  isEditing?: boolean;
  images: string[];
  unitType: "" | UnitTypeKey;
  formResetKey: number;
}

interface UnitFormProps {
  index?: number;
  data?: any;
  empty: boolean;
  isEditing?: boolean;
  setIsEditing?: (a: boolean) => void;
  duplicate?: { val: boolean; count: number };
  setDuplicate?: (a: { val: boolean; count: number }) => void;
}

const UnitForm: React.FC<UnitFormProps> = ({
  index,
  empty = false,
  data,
  setIsEditing,
  isEditing,
  duplicate,
  setDuplicate,
}) => {
  const addUnit = useAddUnitStore((s) => s.addUnit);
  const editUnit = useAddUnitStore((s) => s.editUnit);
  const formRef = useRef<HTMLFormElement>(null);
  // const propertyType = useAddUnitStore((state) => state.propertyType);
  const params = useParams();
  const propertyType = params.propertyType as "rental" | "facility";
  const [state, setState] = useState<UnitFormState>({
    isEditing: isEditing,
    images: empty ? [] : data.images,
    unitType: empty ? "" : data.unitType,
    formResetKey: 0,
  });

  const maxImages = propertyType === "facility" ? 5 : 14;
  const setImages = (newImages: string[], options?: { append: boolean }) =>
    setState((x) => {
      const append = options?.append ?? true;
      if (append) {
        const totalImages = x.images.length + newImages.length;
        if (totalImages > maxImages) {
          const allowedImages = newImages.slice(0, maxImages - x.images.length);
          return { ...x, images: [...x.images, ...allowedImages] };
        }
        return { ...x, images: [...x.images, ...newImages] };
      } else {
        return { ...x, images: newImages.slice(0, maxImages) };
      }
    });
  const removeImage = (index: number) =>
    setState((x) => ({ ...x, images: x.images.filter((_, i) => i !== index) }));
  const setUnitType = (unitType: "" | UnitTypeKey) =>
    setState((x) => ({ ...x, unitType }));
  const resetForm = () =>
    setState((x) => ({
      ...x,
      formResetKey: x.formResetKey + 1,
      images: empty ? [] : data.images,
      unitType: empty ? "" : data.unitType,
    }));

  const emptySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (form) {
      let unitData = getFormData(form);
      unitData.images = state.images;
      // console.log(unitData);
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
    <FlowProgress
      steps={1}
      activeStep={0}
      inputClassName="unit-form-input"
      images={state.images}
      imagesRequired={true}
      showProgressBar={false}
    >
      <UnitFormContext.Provider
        value={{
          ...state,
          setImages,
          removeImage,
          setUnitType,
          duplicate,
          setDuplicate,
        }}
      >
        <form
          id={empty ? "add-unit-form" : "edit-unit-form"}
          ref={formRef}
          className="space-y-6 lg:space-y-8"
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
          {propertyType === "rental" ? (
            <>
              <UnitBreakdownNewTenant />
              <UnitBreakdownRenewalTenant />
            </>
          ) : (
            <UnitBreakdownFacility />
          )}
          {!empty ? (
            <EditUnitActions handleCancel={handleCancel} />
          ) : (
            <AddUntFooter />
          )}
        </form>
      </UnitFormContext.Provider>
    </FlowProgress>
  );
};

export default UnitForm;
