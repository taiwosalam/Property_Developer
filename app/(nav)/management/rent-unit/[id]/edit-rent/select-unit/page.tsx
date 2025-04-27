"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { RentSectionTitle } from "@/components/Management/Rent And Unit/rent-section-container";
import PropertySwitchUnitItem from "@/components/Management/Rent And Unit/Edit-Rent/property-switch-unit-item";
import { useEffect, useState } from "react";
import {
  TransferUnit,
  transformTransferUnits,
  UnitsApiResponse,
} from "@/components/Management/Rent And Unit/Edit-Rent/data";
import useFetch from "@/hooks/useFetch";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Button from "@/components/Form/Button/button";
import { toast } from "sonner";
import { useOccupantStore } from "@/hooks/occupant-store";
import CardsLoading from "@/components/Loader/CardsLoading";
import ServerError from "@/components/Error/ServerError";
import BackButton from "@/components/BackButton/back-button";
import PostProceedContent from "@/components/Management/Rent And Unit/Edit-Rent/PostProceedContent";

const SelectUnitPage = () => {
  const searchParams = useSearchParams();
  const property_id = searchParams.get("p");
  const router = useRouter();
  const { id } = useParams();
  const unitId = searchParams.get("u");
  const propertyType = searchParams.get("type") as "rental" | "facility";
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [unitOptions, setUnitsOptions] = useState<TransferUnit[] | []>([]);
  const isRental = propertyType === "rental";
  const { calculation, deduction, setCalculation, setDeduction } =
    useOccupantStore();
  const [checked1, setChecked1] = useState(calculation);
  const [checked2, setChecked2] = useState(deduction);
  const [step1Done, setStep1Done] = useState(false);

  const {
    data: unitsData,
    error: unitsError,
    loading: UnitsLoading,
  } = useFetch<UnitsApiResponse>(`/unit/${property_id}/all`);

  useEffect(() => {
    if (unitsData) {
      const unitsTransformOptions = transformTransferUnits(unitsData).filter(
        (unit) => unit.id.toString() !== unitId
      );
      setUnitsOptions(unitsTransformOptions);
    }
  }, [unitsData, unitId]);

  const handleUnitSelect = (id: string) => {
    setSelectedUnitId(id === selectedUnitId ? null : id);
  };

  useEffect(() => {
    setChecked2(deduction);
  }, [deduction]);

  const handleChangeContent = () => setStep1Done(true);

  // const handleContinue = () => {
  //   if (!selectedUnitId) {
  //     toast.warning("Please select a unit");
  //     return;
  //   }
  //   router.push(
  //     // `/management/rent-unit/${id}/edit-rent/change-unit?type=${propertyType}&p=${property_id}&u=${selectedUnitId}`
  //     `/management/rent-unit/${id}/edit-rent/change-property?type=${propertyType}&p=${property_id}&u=${selectedUnitId}`
  //   );
  // };

  if (UnitsLoading)
    return (
      <div className="flex flex-col gap-5">
        <CardsLoading length={10} />;
      </div>
    );
  if (unitsError) return <ServerError error={unitsError} />;

  if (step1Done) {
    return (
      <PostProceedContent
        selectedUnitId={selectedUnitId as string}
        page="unit"
      />
    );
  }

  return (
    <div>
      <BackButton>Change Tenant&apos;s Unit</BackButton>
      {/* <RentSectionTitle>Select New Unit For Tenant</RentSectionTitle> */}
      <div className="space-y-4">
        {unitOptions.length === 0 ? (
          <div className="flex items-center mt-8 justify-center w-full">
            <p className="text-center text-xl"> No Unit Available </p>
          </div>
        ) : (
          unitOptions.map((u, index) => (
            <PropertySwitchUnitItem
              key={index}
              propertyType={propertyType as "rental" | "facility"}
              isSelected={selectedUnitId === u.id}
              onSelect={handleUnitSelect}
              isRental={isRental}
              {...u}
            />
          ))
        )}
      </div>
      <FixedFooter className="flex justify-end">
        <Button
          // onClick={handleContinue}
          onClick={handleChangeContent}
          type="submit"
          className="py-2 px-6"
          size="base_medium"
          disabled={!selectedUnitId}
        >
          Proceed
        </Button>
      </FixedFooter>
    </div>
  );
};

export default SelectUnitPage;
