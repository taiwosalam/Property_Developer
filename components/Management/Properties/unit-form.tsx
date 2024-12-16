"use client";
import { useState, useRef } from "react";
import UnitPictures from "./unit-pictures";
import UnitDetails from "./unit-details";
import UnitFeatures from "./unit-features";
import UnitBreakdownNewTenant from "./unit-breakdown-new-tenant";
import UnitBreakdownRenewalTenant from "./unit-breakdown-renewal-tenants";
import UnitBreakdownFacility from "./unit-breakdown-facility";
import { UnitFormContext } from "./unit-form-context";
import { useAddUnitStore } from "@/store/add-unit-store";
import { UnitTypeKey } from "@/data";
import FlowProgress from "@/components/FlowProgress/flow-progress";
import EditUnitActions from "./editUnitActions";
import AddUntFooter from "./AddUnitFooter";
import { AuthForm } from "@/components/Auth/auth-components";
import { convertYesNoToBoolean } from "@/utils/checkFormDataForImageOrAvatar";
import { transformUnitFormData } from "./data";
import {
  createUnit,
  getUnitById,
  editUnit as editUnitApi,
} from "@/app/(nav)/management/properties/create-rental-property/[propertyId]/add-unit/data";
import { type UnitDataObject } from "@/app/(nav)/management/properties/data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface UnitFormState {
  images: string[];
  imageFiles: (string | File)[];
  unitType: "" | UnitTypeKey;
  formResetKey: number;
}

interface emptyUnitFormProps {
  empty: true;
  hideEmptyForm: () => void;
}

interface editUnitFormProps {
  empty?: false;
  index: number;
  data: UnitDataObject & { notYetUploaded?: boolean };
  isEditing: boolean;
  setIsEditing: (a: boolean) => void;
}

type UnitFormProps = emptyUnitFormProps | editUnitFormProps;

const UnitForm: React.FC<UnitFormProps> = (props) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [duplicate, setDuplicate] = useState({ val: false, count: 2 });
  const addUnit = useAddUnitStore((s) => s.addUnit);
  const editUnit = useAddUnitStore((s) => s.editUnit);
  const propertyType = useAddUnitStore((state) => state.propertyType);
  const propertyId = useAddUnitStore((state) => state.property_id);

  const [submitLoading, setSubmitLoading] = useState(false);
  const [saveClick, setSaveClick] = useState(false);

  const [state, setState] = useState<UnitFormState>({
    images: props.empty ? [] : props.data.images.map((img) => img.path),
    imageFiles: props.empty ? [] : props.data.images.map((img) => img.path),
    unitType: props.empty ? "" : (props.data.unit_type as UnitTypeKey),
    formResetKey: 0,
  });

  const maxImages = propertyType === "facility" ? 5 : 14;
  const setImages = (a: { images: string[]; imageFiles: (File | string)[] }) =>
    setState((x) => ({
      ...x,
      images: a.images.slice(0, maxImages),
      imageFiles: a.imageFiles.slice(0, maxImages),
    }));

  const setUnitType = (unitType: "" | UnitTypeKey) =>
    setState((x) => ({ ...x, unitType }));
  const resetForm = () =>
    setState((x) => ({
      ...x,
      formResetKey: x.formResetKey + 1,
      unitType: props.empty ? "" : (props.data.unit_type as UnitTypeKey),
      images: props.empty ? [] : props.data.images.map((img) => img.path),
      imageFiles: props.empty ? [] : props.data.images.map((img) => img.path),
    }));

  const yesNoFields = [
    "en_suit",
    "prepaid",
    "wardrobe",
    "pets_allowed",
    "negotiation",
  ];

  const handleSubmit = async (formData: Record<string, any>) => {
    if (!propertyId) return;
    if (propertyType !== "facility" && state.images.length === 0) {
      toast.warning("Please add at least one picture");
      return;
    }
    // Check if strings contain at least one digit
    const hasNoDigits = (str: string) => !/\d/.test(str);
    if (
      (formData.number_of && hasNoDigits(formData.number_of)) ||
      (formData.total_area_sqm && hasNoDigits(formData.total_area_sqm))
    ) {
      toast.warning("Please enter valid measurement values");
      return;
    }
    setSubmitLoading(true);
    convertYesNoToBoolean(formData, yesNoFields);
    const transformedData = transformUnitFormData(
      formData,
      state.imageFiles,
      propertyId
    );
    if (props.empty) {
      const unitId = await createUnit(propertyId, transformedData);
      if (unitId) {
        if (saveClick) {
          setSubmitLoading(false);
          resetForm();
          formRef.current?.reset();
          router.push("/management/properties/");
          return;
        }
        const unitData = await getUnitById(unitId);
        if (unitData) {
          if (duplicate?.val) {
            addUnit(unitData, duplicate.count);
            setDuplicate({
              val: false,
              count: 1,
            });
            props.hideEmptyForm();
          } else {
            addUnit(unitData);
          }
          formRef.current?.reset();
          resetForm();
        }
      }
    } else {
      if (props.data.notYetUploaded) {
        const unitId = await createUnit(propertyId, transformedData);
        if (unitId) {
          const unitData = await getUnitById(unitId);
          if (unitData) {
            editUnit(props.index, unitData);
          }
        }
      } else {
        const { newImages, retainedImages } = transformedData.images.reduce<{
          newImages: File[];
          retainedImages: string[];
        }>(
          (acc, image) => {
            if (image instanceof File) {
              acc.newImages.push(image);
            } else {
              const matchingImage = props.data.images.find(
                (img) => img.path === image
              );
              if (matchingImage) {
                acc.retainedImages.push(matchingImage.id);
              }
            }
            return acc;
          },
          { newImages: [], retainedImages: [] }
        );
        const editUnitPayload = {
          ...transformedData,
          images: newImages,
          retain_images: retainedImages,
        };
        const unitId = await editUnitApi(props.data.id, editUnitPayload);
        if (unitId) {
          const unitData = await getUnitById(unitId);
          if (unitData) {
            editUnit(props.index, unitData);
          }
        }
      }
      props.setIsEditing(false);
    }
    setSubmitLoading(false);
  };

  return (
    <FlowProgress
      steps={1}
      activeStep={0}
      inputClassName="unit-form-input"
      showProgressBar={false}
      key="unit-form"
    >
      <UnitFormContext.Provider
        value={{
          ...state,
          setImages,
          setUnitType,
          duplicate,
          setDuplicate,
          submitLoading,
          setSaveClick,
          ...(!props.empty && {
            isEditing: props.isEditing,
            setIsEditing: props.setIsEditing,
            unitData: props.data,
          }),
        }}
      >
        <AuthForm
          id={props.empty ? "add-unit-form" : undefined}
          className="space-y-6 lg:space-y-8"
          skipValidation
          onFormSubmit={handleSubmit}
          ref={formRef}
        >
          {!props.empty && props.isEditing && (
            <>
              <div className="flex justify-between items-center">
                <p className="text-brand-9 font-semibold">Edit Unit</p>
                <EditUnitActions
                  handleCancel={() => {
                    resetForm();
                    props.setIsEditing(false);
                  }}
                />
              </div>
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
          {!props.empty ? (
            <EditUnitActions
              handleCancel={() => {
                resetForm();
                props.setIsEditing(false);
              }}
            />
          ) : (
            <AddUntFooter />
          )}
        </AuthForm>
      </UnitFormContext.Provider>
    </FlowProgress>
  );
};

export default UnitForm;
