"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft } from "@/public/icons/icons";
import PropertyDetails from "@/components/Management/Properties/property-details";
import PropertySettings from "@/components/Management/Properties/property-settings";
import { useAddUnitStore } from "@/store/add-unit-store";
import AddUnitFormCard from "@/components/Management/Properties/add-unit-form-card";
import UnitForm from "@/components/Management/Properties/unit-form";
import PageProgressBar from "@/components/PageProgressBar/page-progress-bar";

const AddUnitGated = () => {
  const [saved, setSaved] = useState(false);

  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const removeUnit = useAddUnitStore((s) => s.removeUnit);

  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  const [duplicate, setDuplicate] = useState({ val: false, count: 2 });

  //   useeffect to fetch property info from API with the Property ID.Change True/False Values to Yes/No. Set Unit Store Values.

  return (
    <div className="pb-[70px] lg:pb-[80px]">
      {/* Back Button & Page Title */}
      <div className="flex items-center gap-1 mb-1">
        <button
          type="button"
          aria-label="Go Back"
          onClick={goBack}
          className="p-2"
        >
          <ChevronLeft />
        </button>
        <p className="text-black font-bold text-lg lg:text-xl">Add Units</p>
      </div>
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
              {saved ? "Units Summary" : "Added Units"}
            </h4>
            <hr className="!my-4 border-none bg-borders-dark h-[1px]" />
            {addedUnits.map((unit, index) => (
              <AddUnitFormCard
                key={index}
                index={index}
                data={unit}
                handleRemove={() => removeUnit(index)}
              />
            ))}
          </>
        )}

        {!saved && (
          <UnitForm
            empty={true}
            duplicate={duplicate}
            setDuplicate={setDuplicate}
          />
        )}
      </div>
    </div>
  );
};

export default AddUnitGated;
