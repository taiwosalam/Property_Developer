"use client";

import { useState, useEffect, useRef } from "react";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import PropertyDetails from "@/components/Management/Properties/property-details";
import PropertySettings from "@/components/Management/Properties/property-settings";
import { useAddUnitStore } from "@/store/add-unit-store";
import AddUnitFormCard from "@/components/Management/Properties/add-unit-form-card";
import UnitForm from "@/components/Management/Properties/unit-form";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import useFetch from "@/hooks/useFetch";
import BackButton from "@/components/BackButton/back-button";
import { SinglePropertyResponse } from "../../../[id]/data";
import NetworkError from "@/components/Error/NetworkError";
import { transformPropertyData } from "./data";
import { useRouter } from "next/navigation";
import AddUnitFooter from "@/components/Management/Properties/AddUnitFooter";
import { UnitFormContext } from "@/components/Management/Properties/unit-form-context";
import { UnitTypeKey } from "@/data";
import FlowProgress from "@/components/FlowProgress/flow-progress";
import { useTourStore } from "@/store/tour-store";
import { useGlobalStore } from "@/store/general-store";

const AddUnit = ({ params }: { params: { propertyId: string } }) => {
  const { propertyId } = params;
  const customBackPath = `/management/properties/${propertyId}/edit-property`;
  const router = useRouter();
  const [dataNotFound, setDataNotFound] = useState(false);
  const [showUnitForm, setShowUnitForm] = useState(true);
  const { setShouldRenderTour, setPersist, isTourCompleted } = useTourStore();

  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const setAddUnitStore = useAddUnitStore((s) => s.setAddUnitStore);
  const newForm = useAddUnitStore((s) => s.newForm);

  const {
    data: propertyData,
    loading,
    isNetworkError,
    error,
  } = useFetch<SinglePropertyResponse>(`property/${propertyId}/view`);

  // State for UnitFormContext
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<(string | File)[]>([]);
  const [unitType, setUnitType] = useState<"" | UnitTypeKey>("");
  const [formResetKey, setFormResetKey] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [saveClick, setSaveClick] = useState(false);
  const [duplicate, setDuplicate] = useState({ val: false, count: 1 });
  const [clickedNo, setClickedNo] = useState(false);
  const closeUnitForm = useGlobalStore((s) => s.closeUnitForm);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const resetForm = () => {
    setImages([]);
    setImageFiles([]);
    setUnitType("");
    setFormResetKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!loading && propertyData) {
      setPersist(false);
      if (!isTourCompleted("AddUnitTour")) {
        setShouldRenderTour(true);
      } else {
        setShouldRenderTour(false);
      }
    } else {
      setShouldRenderTour(false);
    }

    return () => setShouldRenderTour(false);
  }, [loading, propertyData, setShouldRenderTour, setPersist, isTourCompleted]);

  useEffect(() => {
    if (propertyData) {
      const transformedData = transformPropertyData(propertyData);
      if (!transformedData) {
        setDataNotFound(true);
        return;
      }
      if (transformedData.propertyType === "facility") {
        router.push(
          `/management/properties/create-gated-estate-property/${propertyId}/add-unit`
        );
      }
      setDataNotFound(false);
      setAddUnitStore("property_id", transformedData.property_id);
      setAddUnitStore("propertyType", transformedData.propertyType);
      setAddUnitStore("propertyDetails", transformedData.propertyDetails);
      setAddUnitStore("propertySettings", transformedData.propertySettings);
      setAddUnitStore("addedUnits", transformedData.addedUnits);
      setAddUnitStore("newForm", showUnitForm);
    }
  }, [propertyData, setAddUnitStore, router, propertyId]);

  console.log("newForm", newForm);

  useEffect(() => {
    console.log("newForm", newForm);
    if (newForm) {
      setShowUnitForm(true);
    } else {
      setShowUnitForm(false);
    }
  }, [newForm]);

  useEffect(() => {
    if (showUnitForm) {
      setAddUnitStore("editMode", true);
    }
  }, [showUnitForm, setAddUnitStore]);

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (dataNotFound)
    return <div className="text-red-500">Property Data not found</div>;

  const SHOW_UNIT_FORM = (addedUnits.length > 0 && !closeUnitForm) || newForm;

  console.log("SHOW_UNIT_FORM", SHOW_UNIT_FORM);

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
          images,
          imageFiles,
          unitType,
          formResetKey,
          setImages: (a) => {
            setImages(a.images);
            setImageFiles(a.imageFiles);
          },
          setUnitType,
          submitLoading,
          setSaveClick,
          resetForm,
          duplicate,
          setDuplicate,
          setSubmitLoading,
          clickedNo,
          setClickedNo,
          shouldRedirect,
          setShouldRedirect,
        }}
      >
        <div className="pb-[100px]">
          <BackButton customBackPath={customBackPath}>Add Units</BackButton>
          <PageProgressBar
            breakpoints={[25, 50, 75]}
            percentage={37}
            className="mb-[52px] add-unit-flowgress"
          />
          <div className="space-y-6 lg:space-y-8">
            <PropertyDetails heading="Property Details" />
            <PropertySettings heading="Property Settings" />
            {addedUnits.length > 0 && (
              <>
                <h4 className="text-brand-9 text-lg lg:text-xl font-bold">
                  Added Units
                </h4>
                <hr className="!my-4 border-none bg-borders-dark h-[1px]" />
                {addedUnits.map((unit, index) => (
                  <AddUnitFormCard key={index} index={index} data={unit} />
                ))}
              </>
            )}
            {/* {(addedUnits.length === 0 || showUnitForm) && !closeUnitForm && ( */}
            {SHOW_UNIT_FORM && (
              <div>
                <UnitForm empty hideEmptyForm={() => setShowUnitForm(false)} />
              </div>
            )}
          </div>

          {/* {addedUnits.length > 0 && <AddUnitFooter noForm={true} />} */}
          {addedUnits.length > 0 && <AddUnitFooter noForm={!showUnitForm} />}
        </div>
      </UnitFormContext.Provider>
    </FlowProgress>
  );
};

export default AddUnit;
