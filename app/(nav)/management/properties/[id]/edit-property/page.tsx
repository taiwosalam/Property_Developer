"use client";

// Imports
import AddUnitFormCard from "@/components/Management/Properties/add-unit-form-card";
import CreatePropertyForm from "@/components/Management/Properties/create-property-form";
import { SectionSeparator } from "@/components/Section/section-components";
import BackButton from "@/components/BackButton/back-button";
import { SinglePropertyResponse } from "../data";
import useFetch from "@/hooks/useFetch";
import { useAddUnitStore } from "@/store/add-unit-store";
import NetworkError from "@/components/Error/NetworkError";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useEffect, useState } from "react";
import { transformPropertyData } from "../../create-rental-property/[propertyId]/add-unit/data";
import { updateProperty } from "./data";
import { transformPropertyFormData } from "@/components/Management/Properties/data";
import { useRouter } from "next/navigation";
import UnitForm from "@/components/Management/Properties/unit-form";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";

const EditProperty = ({ params }: { params: { id: string } }) => {
  const { id: propertyId } = params;
  const [dataNotFound, setDataNotFound] = useState(false);
  const [showNewUnitForm, setShowNewUnitForm] = useState(false);
  const propertyDetails = useAddUnitStore((s) => s.propertyDetails);
  const propertyType = useAddUnitStore((s) => s.propertyType);
  const closeUnitForm = useGlobalStore((s) => s.closeUnitForm);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const router = useRouter();

  const handleSubmit = async (
    data: ReturnType<typeof transformPropertyFormData>
  ) => {
    const { newImages, retainedImages } = data.images.reduce<{
      newImages: File[];
      retainedImages: string[];
    }>(
      (acc, image) => {
        if (image instanceof File) acc.newImages.push(image);
        else {
          const matchingImage = propertyDetails?.images.find(
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
    const status = await updateProperty(propertyId, {
      ...data,
      images: newImages,
      retain_images: retainedImages,
    });
    if (status) {
      refetch({ silent: true });
    }
  };

  const setAddUnitStore = useAddUnitStore((s) => s.setAddUnitStore);
  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const newForm = useAddUnitStore((s) => s.newForm);

  const {
    data: propertyData,
    loading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<SinglePropertyResponse>(`property/${propertyId}/view`);
  useRefetchOnEvent("refetchSingleProperty", () => refetch({ silent: true }));

  useEffect(() => {
    if (propertyData) {
      const transformedData = transformPropertyData(propertyData);
      if (!transformedData) {
        setDataNotFound(true);
        return;
      }
      setDataNotFound(false);
      setAddUnitStore("canDelete", transformedData.canDelete);
      setAddUnitStore("property_id", transformedData.property_id);
      setAddUnitStore("propertyType", transformedData.propertyType);
      setAddUnitStore("propertyDetails", transformedData.propertyDetails);
      setAddUnitStore("propertySettings", transformedData.propertySettings);
      setAddUnitStore("addedUnits", transformedData.addedUnits);
      // Removed setAddUnitStore("newForm", showNewUnitForm) to avoid overwriting newForm
    }
  }, [propertyData, setAddUnitStore]);

  useEffect(() => {
    console.log("newForm:", newForm, "showNewUnitForm:", showNewUnitForm, "closeUnitForm:", closeUnitForm);
    if (newForm || showNewUnitForm) {
      setGlobalStore("closeUnitForm", false);
    }
  }, [newForm, showNewUnitForm, setGlobalStore]);


  // SHOW_UNIT_FORM constant
  const SHOW_UNIT_FORM = !closeUnitForm && (newForm || showNewUnitForm || addedUnits.length === 0);

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;
  if (dataNotFound)
    return <div className="text-red-500">Property Data not found</div>;
  if (!propertyDetails) return null;

  return (
    <div className="space-y-7 pb-[100px]">
      <BackButton>Edit Property</BackButton>
      <SectionSeparator className="!my-2.5" />
      <CreatePropertyForm
        editMode
        handleSubmit={handleSubmit}
        formType={propertyType as "rental" | "facility"}
        propertyId={propertyId}
        onAddUnit={() => {
          setShowNewUnitForm(true);
          setGlobalStore("closeUnitForm", false); // Explicitly reset closeUnitForm
          setTimeout(() => {
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth",
            });
          }, 0);
        }}
      />

      <div className="custom-flex-col gap-10">
        {addedUnits.map((unit, index) => (
          <AddUnitFormCard key={index} data={unit} index={index} />
        ))}

        {SHOW_UNIT_FORM && (
          <div>
            <UnitForm empty hideEmptyForm={() => setShowNewUnitForm(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProperty;