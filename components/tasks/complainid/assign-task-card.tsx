"use client";
import { useState } from "react";
import Button from "@/components/Form/Button/button";
import clsx from "clsx";
import { ArrowDownIcon, RadioCheckCircle } from "@/public/icons/icons";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
const AssignTaskCard = () => {
  const dropDownClasses =
    "border border-[rgba(120,122,126,0.20)] rounded-[4px] py-3 px-[18px]";
  const [assignedTo, setAssignedTo] = useState<string | null>(null);
  const [selectedLandlord, setSelectedLandlord] = useState(false);

  // Handle changes for staff or service provider
  const handleSelectChange = (
    event: SelectChangeEvent,
    type: "staff" | "serviceProvider"
  ) => {
    const value = event.target.value;
    // setAssignedTo({ [type]: value });
    setSelectedLandlord(false); // Reset landlord selection if any dropdown is selected
  };

  // Handle landlord selection
  const handleLandlordClick = () => {
    setAssignedTo("landlord");
    setSelectedLandlord(true); // Mark landlord as selected
  };

  const handleChange = (event: SelectChangeEvent) => {};
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
        <div className={clsx(dropDownClasses)}>Assign Task to Staff</div>
        <div className={clsx(dropDownClasses)}>
          Assign Task to Service Provider
        </div>
        {/* <Select
          id="assign-to-staff"
          value={assignedTo?.staff || ""}
          onChange={(e) => handleSelectChange(e, "staff")}
          displayEmpty
          className={clsx(dropDownClasses, "w-full")}
        >
          <MenuItem value="Mr Ayobami">Mr Ayobami</MenuItem>
          <MenuItem value="Mr Oladapo">Mr Oladapo</MenuItem>
          <MenuItem value="Mr Tolu">Mr Tolu</MenuItem>
        </Select> */}
        {/* <Select
          id="assign-to-service-provider"
          placeholder="GA"
          value={assignedTo?.serviceProvider || ""}
          onChange={(e) => handleSelectChange(e, "serviceProvider")}
          displayEmpty
          className={clsx(dropDownClasses, "w-full")}
        >
          <MenuItem value="Provider 1">Provider 1</MenuItem>
          <MenuItem value="Provider 2">Provider 2</MenuItem>
          <MenuItem value="Provider 3">Provider 3</MenuItem>
        </Select> */}
        <button
          className={clsx(dropDownClasses, "flex justify-between")}
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
            assignedTo ? "opacity-100" : "opacity-50",
            !assignedTo && "pointer-events-none"
          )}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default AssignTaskCard;
