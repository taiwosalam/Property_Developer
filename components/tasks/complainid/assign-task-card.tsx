"use client";
import { useState } from "react";
import Button from "@/components/Form/Button/button";
import clsx from "clsx";
import { RadioCheckCircle } from "@/public/icons/icons";
import Select from "@/components/Form/Select/select";

interface StateType {
  assignedTo: string | { staff?: string; provider?: string } | null;
  selectedLandlord: boolean;
  selectedStaff: string;
  selectedProvider: string;
}

const AssignTaskCard = () => {
  const myClasses =
    "border border-[#C1C2C366] rounded-lg py-[11px] px-[18px] text-xs md:text-sm font-medium hover:border-[#00000099] transition-colors duration-300 ease-in-out";

  const [state, setState] = useState<StateType>({
    assignedTo: null,
    selectedLandlord: false,
    selectedStaff: "",
    selectedProvider: "",
  });
  const { assignedTo, selectedLandlord, selectedStaff, selectedProvider } =
    state;

  // Handle staff selection
  const handleStaffSelection = (staff: string) => {
    setState((x) => ({
      ...x,
      selectedStaff: staff,
      assignedTo: staff ? { staff } : "",
      selectedProvider: "",
      selectedLandlord: false,
    }));
  };

  // Handle provider selection
  const handleProviderSelection = (provider: string) => {
    setState((x) => ({
      ...x,
      selectedProvider: provider,
      assignedTo: provider ? { provider } : null,
      selectedStaff: "",
      selectedLandlord: false,
    }));
  };

  // Handle landlord selection
  const handleLandlordClick = () => {
    setState((x) => ({
      ...x,
      selectedLandlord: true,
      assignedTo: "landlord",
      selectedProvider: "",
      selectedStaff: "",
    }));
  };

  // Determine if the Proceed button should be enabled
  const isProceedDisabled = !assignedTo;

  return (
    <div
      className="rounded-lg border border-[rgba(193,194,195,0.40)]"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="font-medium bg-brand-1 pt-4 pb-2 px-[70px] text-center rounded-t-lg">
        <h6 className="text-black text-base">Assign Task</h6>
        <p className="text-text-label text-sm">
          Kindly select who you want to add to this task
        </p>
      </div>

      <div className="bg-white rounded-b-lg font-medium text-text-secondary px-4 py-6 custom-flex-col gap-2">
        <Select
          id="staff-select"
          isSearchable={false}
          options={["Mr Ayobami", "Mr Oladapo", "Mr Tolu"]}
          placeholder="Assign Task to Staff"
          inputTextClassName="!font-medium text-text-secondary"
          value={selectedStaff}
          onChange={(staff) => handleStaffSelection(staff)}
        />
        <Select
          id="provider-select"
          isSearchable={false}
          options={["Provider 1", "Provider 2", "Provider 3"]}
          placeholder="Assign Task to Service Provider"
          inputTextClassName="!font-medium text-text-secondary"
          value={selectedProvider}
          onChange={(provider) => handleProviderSelection(provider)}
        />
        <button
          className={clsx(myClasses, "flex justify-between")}
          onClick={handleLandlordClick}
        >
          Assign Task to Landlord
          <span
            className={selectedLandlord ? "text-brand-9" : "text-neutral-4"}
          >
            <RadioCheckCircle />
          </span>
        </button>

        <Button
          size="sm_medium"
          className={clsx(
            "mt-10 py-2 px-8",
            !isProceedDisabled ? "opacity-100" : "opacity-50",
            isProceedDisabled && "pointer-events-none"
          )}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default AssignTaskCard;
