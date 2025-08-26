"use client";

import BackButton from "@/components/BackButton/back-button";
import FlowProgress from "@/components/FlowProgress/flow-progress";
import {
  InstallmentPropertyDetails,
  InstallmentPropertySettings,
} from "@/components/Management/Properties/installment-property-unit-components";
import {
  OutrightPropertyDetails,
  OutrightPropertySettingsDetails,
} from "@/components/Management/Properties/outright-property-components";
import UnitForm from "@/components/Management/Properties/unit-form";
import { UnitFormContext } from "@/components/Management/Properties/unit-form-context";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";
import { UnitTypeKey } from "@/data";
import { useGlobalStore } from "@/store/general-store";
import clsx from "clsx";
import React, { useState } from "react";
import { sampleInstallmentUnits } from "./data";
import AddUnitFormCard from "@/components/Management/Properties/add-unit-form-card";
import { useAddUnitStore } from "@/store/add-unit-store";
import AddUnitFooter from "@/components/Management/Properties/AddUnitFooter";

const InstallmentPropertyAddUnit = ({
  params,
}: {
  params: { propertyId: string };
}) => {
  const { propertyId } = params;
  const customBackPath = `/management/properties/${propertyId}/edit-property`;
  const [dataNotFound, setDataNotFound] = useState(false);
  const [hideEmptyForm, setHideEmptyForm] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<(string | File)[]>([]);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [unitType, setUnitType] = useState<"" | UnitTypeKey>("");
  const [formResetKey, setFormResetKey] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [saveClick, setSaveClick] = useState(false);
  const [duplicate, setDuplicate] = useState({ val: false, count: 1 });
  const [showUnitForm, setShowUnitForm] = useState(true);
  const newForm = useAddUnitStore((s) => s.newForm);
  const closeUnitForm = useGlobalStore((s) => s.closeUnitForm);
  const editMode = false;

  // const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const addedUnits = sampleInstallmentUnits;

  const resetForm = () => {
    setImages([]);
    setImageFiles([]);
    setUnitType("");
    setFormResetKey((prev) => prev + 1);
  };

  // const {
  //   data: propertyData,
  //   loading,
  //   isNetworkError,
  //   error,
  // } = useFetch<SinglePropertyResponse>(`property/${propertyId}/view`);

  // useEffect(() => {
  //   if (propertyData) {
  //     const transformedData = transformPropertyData(propertyData);
  //     if (!transformedData) {
  //       setDataNotFound(true);
  //       return;
  //     }
  //    if (transformedData.propertyType === "rental") {
  //      router.push(
  //        `/management/properties/create-outright-property/${propertyId}/add-unit`
  //      );
  //    }
  //     setDataNotFound(false);
  //     setAddUnitStore("property_id", transformedData.property_id);
  //     setAddUnitStore("propertyType", transformedData.propertyType);
  //     setAddUnitStore("propertyDetails", transformedData.propertyDetails);
  //     setAddUnitStore("propertySettings", transformedData.propertySettings);
  //     setAddUnitStore("addedUnits", transformedData.addedUnits);
  //   }
  // }, [propertyData, setAddUnitStore, router, propertyId]);

  const SHOW_UNIT_FORM = !closeUnitForm && (newForm || addedUnits.length === 0);

  return (
    <div>
      <BackButton className="mb-1">
        <div className="flex gap-2 items-center">
          <h1 className="text-lg lg:text-xl capitalize font-normal">
            Add Property units
          </h1>
        </div>
      </BackButton>
      <div className="progress-overview-wrapper">
        <PageProgressBar
          breakpoints={[25, 50, 75]}
          percentage={55}
          className="mb-[52px]"
        />
      </div>
      <FlowProgress
        steps={1}
        activeStep={0}
        inputClassName="unit-form-input"
        showProgressBar={false}
        className={clsx({
          "p-6 bg-white dark:bg-darkText-primary rounded-2xl": editMode,
        })}
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
            shouldRedirect,
            setShouldRedirect,
          }}
        >
          <div className="space-y-6 lg:space-y-8">
            <div className="property-details-wrapper">
              <InstallmentPropertyDetails heading="Property Details" />
            </div>

            <div className="property-details-wrapper">
              <InstallmentPropertySettings heading="Property Settings" />
            </div>

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

            {SHOW_UNIT_FORM && (
              <div>
                <UnitForm empty hideEmptyForm={() => setShowUnitForm(false)} />
              </div>
            )}

            {addedUnits.length > 0 && <AddUnitFooter noForm={true} />}
          </div>
        </UnitFormContext.Provider>
      </FlowProgress>
    </div>
  );
};

export default InstallmentPropertyAddUnit;
