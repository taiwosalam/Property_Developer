"use client";
import { useState, useEffect } from "react";
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
// import { useCustomBackNavigation } from "@/hooks/useCustomBackNavigation";
import { useRouter } from "next/navigation";
import AddUntFooter from "@/components/Management/Properties/AddUnitFooter";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import FooterModal from "@/components/Management/Properties/footer-modal";
import { UnitFormContext } from "@/components/Management/Properties/unit-form-context";

const AddUnit = ({ params }: { params: { propertyId: string } }) => {
  const { propertyId } = params;
  const customBackPath = `/management/properties/${propertyId}/edit-property`;
  const router = useRouter();
  const [dataNotFound, setDataNotFound] = useState(false);

  const [hideEmptyForm, setHideEmptyForm] = useState(false);

  const addedUnits = useAddUnitStore((s) => s.addedUnits);

  const setAddUnitStore = useAddUnitStore((s) => s.setAddUnitStore);
  // const resetStore = useAddUnitStore((s) => s.resetStore);
  // resetStore();
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
    }
  }, [propertyData, setAddUnitStore, router, propertyId]);

  // useCustomBackNavigation({ customBackPath });
  console.log("addedUnits", addedUnits);

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (dataNotFound)
    return <div className="text-red-500">Property Data not found</div>;

  return (
    <div className="pb-[100px]">
      <BackButton customBackPath={customBackPath}>Add Units</BackButton>
      <PageProgressBar
        breakpoints={[25, 50, 75]}
        percentage={37}
        className="mb-[52px]"
      />
      <div className="space-y-6 lg:space-y-8">
        <PropertyDetails heading="Property Details" />
        <PropertySettings heading="Property Settings" />
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

        {/* {addedUnits.length > 0 && (
          <FixedFooter>
            <div className="flex justify-end w-full">
              <Modal>
                <ModalTrigger>
                  <Button> Add More Units</Button>
                </ModalTrigger>
                <ModalContent>
                  <UnitFormContext.Consumer>
                    {(context) => (
                      <FooterModal
                        duplicate={context?.duplicate}
                        setDuplicate={context?.setDuplicate}
                        submitLoading={context?.submitLoading}
                      />
                    )}
                  </UnitFormContext.Consumer>
                </ModalContent>
              </Modal>
            </div>
          </FixedFooter>
        )} */}
      </div>
    </div>
  );
};

export default AddUnit;
