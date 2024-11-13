"use client";
import { useState, useEffect } from "react";
import Menu, { MenuProps } from "@mui/material/Menu";
import useDarkMode from "@/hooks/useCheckDarkMode";
import {
  XIcon,
  CheckboxDefault,
  ChevronLeft,
  CheckboxChecked,
} from "@/public/icons/icons";
import Checkbox from "../Form/Checkbox/checkbox";
import useStep from "@/hooks/useStep";
import type { FormSteps } from "@/app/(onboarding)/auth/types";
import Button from "../Form/Button/button";
import SearchInput from "../SearchInput/search-input";

type FilterOption = {
  label: string;
  bgColor?: string;
};

interface MessagesFilterMenuProps extends MenuProps {
  filterOptions: FilterOption[];
}

const MessagesFilterMenu: React.FC<MessagesFilterMenuProps> = ({
  onClose,
  open,
  filterOptions,
  ...props
}) => {
  const isDarkMode = useDarkMode();
  const { activeStep, changeStep, setActiveStep } = useStep(2);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);

  const handleClose = (
    event: React.MouseEvent<HTMLElement> | {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    // Reset to step 1 when menu closes
    if (onClose) {
      onClose(event, reason);
    }
  };

  const commonClasses =
    "flex items-center justify-between bg-neutral-3 rounded-[3px] py-2 px-4 w-full";

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setActiveStep(1);
    }
  }, [open, setActiveStep]);

  return (
    <Menu
      open={open}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        paper: {
          className: "custom-round-scrollbar",
          sx: {
            mt: 1,
            width: "326px",
            maxWidth: "90vw",
            maxHeight: "340px",
            overflow: "auto",
            backgroundColor: isDarkMode ? "#1C1C1C" : "#FFFFFF",
            boxShadow:
              "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
            borderRadius: "8px",
            // padding: "16px",
            "& .MuiList-root": {
              padding: 0,
            },
          },
        },
      }}
      {...props}
      onClose={handleClose}
    >
      <div
        className="sticky top-0 z-[2] flex items-center justify-between gap-4 mb-[10px] bg-white dark:bg-[#1C1C1C] px-4 pt-4 remove-tab-index"
        // tabIndex={undefined}
      >
        <p className="text-base font-medium text-text-label dark:text-darkText-2 flex items-center gap-1">
          {activeStep !== 1 && (
            <button
              type="button"
              onClick={() => changeStep("prev")}
              aria-label="back"
            >
              <ChevronLeft />
            </button>
          )}
          {activeStep === 1 ? "Filter By" : "Branches"}
        </p>
        <button
          type="button"
          aria-label="close"
          onClick={() => handleClose({}, "backdropClick")}
        >
          <XIcon />
        </button>
      </div>

      <div className="space-y-2 text-text-secondary dark:text-darkText-1 text-sm font-medium px-4 pb-4">
        {activeStep === 1 ? (
          <Step1Menu
            changeStep={changeStep}
            commonClasses={commonClasses}
            hasSelectedBranches={selectedBranches.length > 0}
            filterOptions={filterOptions}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        ) : (
          <Step2Menu
            commonClasses={commonClasses}
            selectedBranches={selectedBranches}
            setSelectedBranches={setSelectedBranches}
          />
        )}
        <Button size="base_medium" className="!mt-8 w-full py-2 px-8">
          Apply Filter
        </Button>
      </div>
    </Menu>
  );
};

export default MessagesFilterMenu;

const Step1Menu: React.FC<{
  changeStep: (step: FormSteps) => void;
  commonClasses: string;
  hasSelectedBranches: boolean;
  filterOptions: FilterOption[];
  selectedFilters: string[];
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({
  changeStep,
  commonClasses,
  hasSelectedBranches,
  filterOptions,
  selectedFilters,
  setSelectedFilters,
}) => {
  const handleFilterToggle = (label: string) => {
    setSelectedFilters((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };
  return (
    <>
      <button
        type="button"
        className={commonClasses}
        onClick={() => changeStep("next")}
      >
        By Branches
        {hasSelectedBranches ? (
          <CheckboxChecked size={18} />
        ) : (
          <CheckboxDefault size={18} />
        )}
      </button>
      {filterOptions.map((option, index) => (
        <button
          type="button"
          className={`${commonClasses} ${
            selectedFilters.includes(option.label) ? "!bg-[#bfb3b3]" : ""
          }`}
          key={index}
          onClick={() => handleFilterToggle(option.label)}
        >
          <span>{option.label}</span>
          <span
            style={{ backgroundColor: option.bgColor || "#01BA4C" }}
            className="text-white rounded-full p-1 flex items-center justify-center w-5 h-5"
          >
            12
          </span>
        </button>
      ))}
    </>
  );
};

const Step2Menu: React.FC<{
  commonClasses: string;
  selectedBranches: string[];
  setSelectedBranches: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ commonClasses, selectedBranches, setSelectedBranches }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const branches = ["Branch 1", "Branch 2", "Branch 3"];
  const filteredBranches = branches.filter((branch) =>
    branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBranchToggle = (branch: string) => {
    setSelectedBranches((prev) =>
      prev.includes(branch)
        ? prev.filter((b) => b !== branch)
        : [...prev, branch]
    );
  };

  useEffect(() => {
    const removeTabIndexDiv = document.querySelector(".remove-tab-index");
    if (removeTabIndexDiv) {
      removeTabIndexDiv.removeAttribute("tabIndex");
    }
  }, []);

  return (
    <>
      <SearchInput
        placeholder="Search"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredBranches.map((branch, index) => (
        <Checkbox
          key={index}
          sm
          className={`${commonClasses} w-full flex-row-reverse`}
          checked={selectedBranches.includes(branch)}
          onChange={() => handleBranchToggle(branch)}
        >
          {branch}
        </Checkbox>
      ))}
    </>
  );
};
