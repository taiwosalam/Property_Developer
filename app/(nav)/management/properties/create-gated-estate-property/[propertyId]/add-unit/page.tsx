"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PropertyDetails from "@/components/Management/Properties/property-details";
import PropertySettings from "@/components/Management/Properties/property-settings";
import { useAddUnitStore } from "@/store/add-unit-store";
import NetworkError from "@/components/Error/NetworkError";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import AddUnitFormCard from "@/components/Management/Properties/add-unit-form-card";
import UnitForm from "@/components/Management/Properties/unit-form";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import BackButton from "@/components/BackButton/back-button";
import useFetch from "@/hooks/useFetch";
import { SinglePropertyResponse } from "../../../[id]/data";
// import { useCustomBackNavigation } from "@/hooks/useCustomBackNavigation";
import { transformPropertyData } from "../../../create-rental-property/[propertyId]/add-unit/data";
import { UnitTypeKey } from "@/data";
import { UnitFormContext } from "@/components/Management/Properties/unit-form-context";
import AddUnitFooter from "@/components/Management/Properties/AddUnitFooter";

const AddUnitGated = ({ params }: { params: { propertyId: string } }) => {
  const { propertyId } = params;
  const router = useRouter();
  const customBackPath = `/management/properties/${propertyId}/edit-property`;
  const [dataNotFound, setDataNotFound] = useState(false);
  const [hideEmptyForm, setHideEmptyForm] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<(string | File)[]>([]);
  const [unitType, setUnitType] = useState<"" | UnitTypeKey>("");
  const [formResetKey, setFormResetKey] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [saveClick, setSaveClick] = useState(false);
  const [duplicate, setDuplicate] = useState({ val: false, count: 1 });

  const resetForm = () => {
    setImages([]);
    setImageFiles([]);
    setUnitType("");
    setFormResetKey((prev) => prev + 1);
  };

  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const setAddUnitStore = useAddUnitStore((s) => s.setAddUnitStore);
  const propertyDetails = useAddUnitStore((s) => s.propertyDetails);

  const {
    data: propertyData,
    loading,
    isNetworkError,
    error,
  } = useFetch<SinglePropertyResponse>(`property/${propertyId}/view`);

  useEffect(() => {
    if (propertyData) {
      const transformedData = transformPropertyData(propertyData);
      if (!transformedData) {
        setDataNotFound(true);
        return;
      }
      if (transformedData.propertyType === "rental") {
        router.push(
          `/management/properties/create-rental-property/${propertyId}/add-unit`
        );
      }
      setDataNotFound(false);
      setAddUnitStore("property_id", transformedData.property_id);
      setAddUnitStore("propertyType", transformedData.propertyType);
      setAddUnitStore("propertyDetails", transformedData.propertyDetails);
      setAddUnitStore("propertySettings", transformedData.propertySettings);
      setAddUnitStore("addedUnits", transformedData.addedUnits);
    }
  }, [propertyData, setAddUnitStore, router, propertyId]);

  // useCustomBackNavigation({ customBackPath });

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (dataNotFound)
    return <div className="text-red-500">Property Data not found</div>;
  if (!propertyDetails) {
    return null;
  }

  return (
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
      }}
    >
      <div className="pb-[100px]">
        <BackButton customBackPath={customBackPath}>Add Units</BackButton>
        <PageProgressBar
          breakpoints={[25, 50, 75]}
          percentage={37}
          className="mb-[52px]"
        />
        <div className="space-y-6 lg:space-y-8">
          <PropertyDetails heading="Estate/Facility Details" />
          <PropertySettings heading="Estate/Facility Settings" />
          {addedUnits.length > 0 && (
            <>
              <h4 className="text-primary-navy text-lg lg:text-xl font-bold">
                {hideEmptyForm ? "Units Summary" : "Added Units"}
              </h4>
              <hr className="!my-4 border-none bg-borders-dark h-[1px]" />
              {addedUnits.map((unit, index) => (
                <AddUnitFormCard key={index} index={index} data={unit} />
              ))}
            </>
          )}

          {!hideEmptyForm && (
            <UnitForm empty hideEmptyForm={() => setHideEmptyForm(true)} />
          )}
        </div>
        {addedUnits.length > 0 && <AddUnitFooter noForm={true} />}
      </div>
    </UnitFormContext.Provider>
  );
};

export default AddUnitGated;
