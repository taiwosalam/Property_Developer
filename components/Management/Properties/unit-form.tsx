"use client";
import { useState } from "react";
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

export interface UnitFormState {
  images: string[];
  imageFiles: (string | File)[];
  unitType: "" | UnitTypeKey;
  formResetKey: number;
}

interface emptyUnitFormProps {
  empty: true;
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
  const [duplicate, setDuplicate] = useState({ val: false, count: 2 });
  const addUnit = useAddUnitStore((s) => s.addUnit);
  const editUnit = useAddUnitStore((s) => s.editUnit);
  const propertyType = useAddUnitStore((state) => state.propertyType);
  const propertyId = useAddUnitStore((state) => state.property_id);

  const [submitLoading, setSubmitLoading] = useState(false);

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
    }));

  const yesNoFields = [
    "en_suit",
    "prepaid",
    "wardrobe",
    "pets_allowed",
    "negotiation",
  ];

  const handleSubmit = async (
    formData: Record<string, any>,
    e?: React.FormEvent<HTMLFormElement>
  ) => {
    if (!propertyId) return;
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
        const unitData = await getUnitById(unitId);
        if (unitData) {
          if (duplicate?.val) {
            addUnit(unitData, duplicate.count);
            setDuplicate({
              val: false,
              count: 1,
            });
            e?.currentTarget.reset();
            resetForm();
          } else {
            addUnit(unitData);
            e?.currentTarget.reset();
            resetForm();
          }
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
      imagesLength={state.images.length}
      minImages={propertyType !== "facility" ? 1 : 0}
      showProgressBar={false}
    >
      <UnitFormContext.Provider
        value={{
          ...state,
          setImages,
          setUnitType,
          duplicate,
          setDuplicate,
          submitLoading,
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
        >
          {!props.empty && props.isEditing && (
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
