"use client";
import { useState, useRef, useContext, useEffect } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import FullPageLoader from "@/components/Loader/start-rent-loader";
import { useGlobalStore } from "@/store/general-store";
import DynamicFooterActions from "./footer-action";

export interface UnitFormState {
  images: string[];
  imageFiles: (string | File)[];
  unitType: "" | UnitTypeKey;
  formResetKey: number;
}

interface emptyUnitFormProps {
  empty: true;
  hideEmptyForm: () => void;
  formRef?: React.RefObject<HTMLFormElement>;
}

interface editUnitFormProps {
  empty?: false;
  index: number;
  data: UnitDataObject & { notYetUploaded?: boolean };
  isEditing: boolean;
  setIsEditing: (a: boolean) => void;
  formRef?: React.RefObject<HTMLFormElement>;
}

type UnitFormProps = emptyUnitFormProps | editUnitFormProps;

const UnitForm: React.FC<UnitFormProps> = (props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const internalFormRef = useRef<HTMLFormElement>(null);
  const formRef = props.formRef || internalFormRef;
  const unitPicturesRef = useRef<HTMLDivElement>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [duplicate, setDuplicate] = useState({ val: false, count: 1 });
  const addUnit = useAddUnitStore((s) => s.addUnit);
  const editUnit = useAddUnitStore((s) => s.editUnit);
  const propertyType = useAddUnitStore((state) => state.propertyType);
  const propertyId = useAddUnitStore((state) => state.property_id);
  const {
    setSubmitLoading: setParentSubmitLoading,
    clickedNo,
    setClickedNo,
  } = useContext(UnitFormContext) || {};
  const setAddUnitStore = useAddUnitStore((s) => s.setAddUnitStore);
  const newForm = useAddUnitStore((state) => state.newForm);
  const allowEditUnit = useGlobalStore((s) => s.allowEditUnit);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [saveClick, setSaveClick] = useState(false);

  const navigateBackOrToProperties = () => {
    const page = searchParams.get("page");
    if (page === "rent-unit") {
      router.back();
    } else {
      router.push("/management/properties");
    }
  };

  const [state, setState] = useState<UnitFormState>(() => {
    if (props.empty) {
      // New unit: start with empty images
      return {
        images: [],
        imageFiles: [],
        unitType: "",
        formResetKey: 0,
      };
    } else if (props.data.notYetUploaded) {
      // Not yet uploaded: clear images to force upload
      return {
        images: [],
        imageFiles: [],
        unitType: props.data.unit_type as UnitTypeKey,
        formResetKey: 0,
      };
    } else {
      // Existing unit (editing or viewing): retain images
      return {
        images: props.data.images.map((img) => img.path),
        imageFiles: props.data.images.map((img) => img.path),
        unitType: props.data.unit_type as UnitTypeKey,
        formResetKey: 0,
      };
    }
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
    // if (propertyType !== "facility" && state.images.length === 0) {
    //   toast.warning("Please add at least one picture");
    //   return;
    // }

    // REQUIRE AT LEAST ONE PICTURE FOR RENTAL EDIT/CREATE
    if (
      propertyType !== "facility" &&
      (!state.imageFiles || state.imageFiles.length === 0)
    ) {
      toast.warning("Please add at least one picture");
      return;
    }

    // Validate that numeric fields contain digits
    const hasNoDigits = (str: string) => !/\d/.test(str);
    if (
      (formData.number_of && hasNoDigits(formData.number_of)) ||
      (formData.total_area_sqm && hasNoDigits(formData.total_area_sqm))
    ) {
      toast.warning("Please enter valid measurement values");
      return;
    }

    setSubmitLoading(true);
    if (setParentSubmitLoading) setParentSubmitLoading(true);
    convertYesNoToBoolean(formData, yesNoFields);

    // Transform the form data into the API payload
    const transformedData = transformUnitFormData(
      formData,
      state.imageFiles,
      propertyId,
      props.empty ? [] : props.data.images // Pass original images when editing
    );

    if (props.empty) {
      // Handle creation of a new unit
      if (!propertyId) {
        toast.error("Property ID is missing.");
        setSubmitLoading(false);
        if (setParentSubmitLoading) setParentSubmitLoading(false);
        return;
      }
      const unitId = await createUnit(propertyId, transformedData);
      if (unitId) {
        if (saveClick) {
          setSubmitLoading(false);
          if (setParentSubmitLoading) setParentSubmitLoading(false);
          resetForm();
          formRef.current?.reset();
          router.push("/management/properties/");
          return;
        }
        const unitData = await getUnitById(unitId);
        if (unitData) {
          if (duplicate?.val) {
            addUnit(unitData, duplicate.count);
            // setDuplicate({
            //   val: false,
            //   count: 1,
            // });
            props.hideEmptyForm();
          } else {
            addUnit(unitData);
          }
          formRef.current?.reset();
          resetForm();
          if (clickedNo) {
            setTimeout(() => {
              setClickedNo?.(false);
            }, 0);
          }
        }
      }
    } else {
      if (props.data.notYetUploaded) {
        if (!propertyId) {
          toast.error("Property ID is missing.");
          setSubmitLoading(false);
          if (setParentSubmitLoading) setParentSubmitLoading(false);
          return;
        }
        // Handle creation of a unit that hasn’t been uploaded yet
        const unitId = await createUnit(propertyId, transformedData);
        if (unitId) {
          const unitData = await getUnitById(unitId);
          if (unitData) {
            editUnit(props.index, unitData);
          }
        }
      } else {
        // Handle editing an existing unit
        const { newImages, retainedImages } = state.imageFiles.reduce<{
          newImages: File[];
          retainedImages: string[];
        }>(
          (acc, image) => {
            if (image instanceof File) {
              // New images uploaded during this edit
              acc.newImages.push(image);
            } else if (typeof image === "string") {
              // Existing images to retain (match by path)
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
          images: newImages, // New images to upload
          retain_images: retainedImages, // IDs of images to keep
        };

        const unitId = await editUnitApi(props.data.id, editUnitPayload);
        if (unitId) {
          window.dispatchEvent(new Event("refetchSingleProperty"));
          const unitData = await getUnitById(unitId);
          if (unitData) {
            editUnit(props.index, unitData);
          }
        }
      }
      props.setIsEditing(false);
    }

    setSubmitLoading(false);
    if (setParentSubmitLoading) setParentSubmitLoading(false);
  };
  // SCOLL TO PICTURES
  useEffect(() => {
    if (unitPicturesRef.current) {
      unitPicturesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [props.empty, newForm]);

  if (submitLoading) {
    return <FullPageLoader text="Processing Unit Data..." />;
  }

  return (
    <FlowProgress
      steps={1}
      activeStep={0}
      inputClassName="unit-form-input"
      showProgressBar={false}
      key="unit-form-progress"
    >
      <UnitFormContext.Provider
        value={{
          ...state,
          setImages,
          setUnitType,
          submitLoading,
          setSaveClick,
          resetForm,
          shouldRedirect,
          setShouldRedirect,
          ...(!props.empty
            ? {
                isEditing: props.isEditing,
                setIsEditing: props.setIsEditing,
                unitData: props.data,
                index: props.index,
              }
            : {
                duplicate,
                setDuplicate,
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
                <EditUnitActions />
              </div>
              <hr className="!my-4 border-none bg-borders-dark h-[2px]" />
            </>
          )}
          <UnitPictures ref={unitPicturesRef} />
          <UnitDetails />
          <UnitFeatures />
          {propertyType === "rental" ? (
            <>
              <UnitBreakdownNewTenant />
              <UnitBreakdownRenewalTenant />
            </>
          ) : (
            <>
              <UnitBreakdownFacility />
              <UnitBreakdownRenewalTenant />
            </>
          )}
          {!props.empty ? (
            <EditUnitActions />
          ) : (
            <AddUntFooter noForm={props.empty} />
          )}
          <DynamicFooterActions />
        </AuthForm>
      </UnitFormContext.Provider>
    </FlowProgress>
  );
};

export default UnitForm;
