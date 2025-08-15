"use client";
import dayjs, { Dayjs } from "dayjs";
import { SectionSeparator } from "@/components/Section/section-components";
import Select from "@/components/Form/Select/select";
import Input from "@/components/Form/Input/input";
import DateInput from "@/components/Form/DateInput/date-input";
import { SetStateAction, useEffect, useState } from "react";
import TextArea from "@/components/Form/TextArea/textarea";
import {
  currencySymbols,
  formatCostInputValue,
} from "@/utils/number-formatter";
import Button from "@/components/Form/Button/button";
import { AuthForm } from "@/components/Auth/auth-components";
import { maintenanceTypes, priorityLevels, priorityLevelsOption } from "./data";
import { createMaintenance } from "../data";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import BackButton from "@/components/BackButton/back-button";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import useFetch from "@/hooks/useFetch";
import { number } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import MultiSelectObj from "@/components/Form/MultiSelect/multi-select-object";
import clsx from "clsx";
import FileInput from "@/components/Form/FileInput/file-input";
import FileUploader from "@/components/FileUploader/FileUploader";

const CreateMaintenace = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const handleStartDateChange = (date?: Dayjs | null) => {
    setStartDate(date || null);
  };
  const router = useRouter();
  const [maintenanceCost, setMaintenanceCost] = useState("");
  const currencySymbol = currencySymbols.naira; // TODO: Make this dynamic
  const handleMaintenanceCostChange = (value: string) => {
    setMaintenanceCost(formatCostInputValue(value));
  };
  const [isLoading, setIsLoading] = useState(false);
  const [announcement, setAnnouncement] = useState(false);
  const [calendarEvent, setCalendarEvent] = useState(false);

  const [quotationFile, setQuotationFile] = useState<File | null>(null);

  const [quotation, setQuotation] = useState("");

  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);

  const [selectedBranch, setSelectedBranch] = useState<{
    id: number;
    branch_name: string;
  } | null>(null);

  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(
    null
  );

  const [providerOptions, setProviderOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [branchOptions, setBranchOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [propertyOptions, setPropertyOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [unitOptions, setUnitOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const { data: providerData, silentLoading: providerSilentLoading } =
    useFetch<any>(`service-providers`);
  const { data: branchData, silentLoading: branchSilentLoading } =
    useFetch<any>(`branches`);

  const { data: propertyData, silentLoading: propertySilentLoading } =
    useFetch<any>(selectedBranchId ? `branch/${selectedBranchId}` : null);

  const { data: unitsData, silentLoading: unitSilentLoading } = useFetch<any>(
    selectedPropertyId ? `property/${selectedPropertyId}/view` : null
  );

  useEffect(() => {
    if (unitsData) {
      const units = unitsData.data?.units?.map(
        (unit: { id: number; unit_name: string }) => {
          {
            return {
              id: unit.id,
              name: unit.unit_name,
            };
          }
        }
      );
      setUnitOptions(units);
    }
  }, [unitsData]);

  useEffect(() => {
    if (propertyData) {
      const properties = propertyData.data?.branch?.properties?.map(
        (property: { id: number; title: string }) => {
          return {
            id: property.id,
            name: property.title,
          };
        }
      );
      setPropertyOptions(properties);
    }
  }, [propertyData, selectedPropertyId]);

  useEffect(() => {
    if (branchData) {
      const branches = branchData?.data?.map(
        (branch: { id: number; branch_name: string }) => {
          return {
            id: branch.id,
            name: branch.branch_name,
          };
        }
      );
      setBranchOptions(branches);
    }
  }, [branchData]);

  useEffect(() => {
    if (providerData && providerData?.data?.providers?.data.length > 0) {
      const providers = providerData?.data?.providers?.data?.map(
        (provider: { id: number; company_name: string; name: string }) => {
          return {
            id: provider.id,
            name: `${provider.company_name} - ${provider.name}`,
          };
        }
      );
      setProviderOptions(providers);
    }
  }, [providerData]);

  // const handleSubmit = async (data: FormData) => {
  //   // BACKEND ERROR: METHOD NOT ALLOWED
  //   //data.delete("unit[]");

  //   const detail = data.get("detail");
  //   const cost = data.get("maintenance_cost");

  //   if (String(detail).trim().length < 30) {
  //     toast.error("Work detail must be at least 30 characters.");
  //     return;
  //   }

  //   if (!String(cost).trim()) {
  //     toast.error("Maintenance cost is required");
  //     return;
  //   }

  //   const quotationFile = data.get("quotation");

  //   if (quotationFile) {
  //     data.append("quotation_type", "file");
  //   }
  //   if (quotationFile) {
  //     data.append("quotation", quotationFile);
  //   }
  //   // Append each selected unit id as an array item
  //   selectedUnits.forEach((id) => {
  //     data.append("unit[]", id.toString());
  //   });

  //   data.append("calendar_event", "1");

  //   if (quotation && quotation.length > 0) {
  //     data.append("quotation_type", "text");
  //   }
  //   try {
  //     setIsLoading(true);
  //     const response = await createMaintenance(data);
  //     if (response) {
  //       toast.success("Maintenance created");
  //       //router.push("/tasks/maintenance");
  //     }
  //   } catch (error) {
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (data: FormData) => {
    const detail = data.get("detail");
    const cost = data.get("cost");

    const numericCost = String(cost).replace(/,/g, "");
    data.append("cost", numericCost);

    if (String(detail).trim().length < 30) {
      toast.error("Work detail must be at least 30 characters.");
      return;
    }

    if (!String(cost).trim()) {
      toast.error("Maintenance cost is required");
      return;
    }

    // Only send file if quotation length is less than 30
    if (quotation.length < 30 && quotationFile) {
      data.append("quotation_type", "file");
      data.append("quotation", quotationFile);
    }

    // If quotation is text and length >= 30, send as text
    if (quotation.length >= 30) {
      data.append("quotation_type", "text");
      data.append("quotation", quotation);
    }

    // Append each selected unit id as an array item
    selectedUnits.forEach((id) => {
      data.append("unit[]", id.toString());
    });

    data.append("calendar_event", "1");

    try {
      setIsLoading(true);
      const response = await createMaintenance(data);
      if (response) {
        toast.success("Maintenance created");
        router.push("/tasks/maintenance");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-medium space-y-6">
      <BackButton>New Maintenance Schedule</BackButton>
      <AuthForm
        returnType="form-data"
        onFormSubmit={handleSubmit}
        setValidationErrors={() => {}}
        className="space-y-5 pb-[150px]"
      >
        <h2 className="text-sm md:text-base text-brand-10">Details</h2>
        <SectionSeparator className="!mt-4 !mb-6" />
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <input
            value={selectedBranchId ?? ""}
            type="hidden"
            aria-hidden
            id="branch_id"
            name="branch_id"
          />
          <input
            value={selectedPropertyId ?? ""}
            type="hidden"
            aria-hidden
            id="property_id"
            name="property_id"
          />
          <input
            value={selectedUnits ?? ""}
            type="hidden"
            aria-hidden
            id="unit_id"
            name="unit_id"
          />
          <Select
            required
            id=""
            label="Branch"
            disabled={branchSilentLoading}
            placeholder={
              branchSilentLoading ? "Please wait..." : "Select options"
            }
            options={
              branchOptions.length > 0
                ? branchOptions.map((branch) => branch.name)
                : []
            }
            inputContainerClassName="bg-white"
            value={
              selectedBranchId
                ? branchOptions.find((b) => b.id === selectedBranchId)?.name
                : ""
            }
            onChange={(name) => {
              const branch = branchOptions.find((b) => b.name === name);
              setSelectedBranchId(branch ? branch.id : null);
            }}
          />
          <Select
            required
            disabled={!selectedBranchId || propertySilentLoading}
            placeholder={
              propertySilentLoading ? "Please wait..." : "Select options"
            }
            id=""
            label="Property"
            options={
              propertyOptions.length > 0
                ? propertyOptions.map((property) => property.name)
                : []
            }
            inputContainerClassName="bg-white"
            value={
              selectedPropertyId
                ? propertyOptions.find((p) => p.id === selectedPropertyId)?.name
                : ""
            }
            onChange={(name) => {
              const property = propertyOptions.find((p) => p.name === name);
              setSelectedPropertyId(property ? property.id : null);
              //setUnitOptions([{ id: null, name: "" }]);
              setSelectedUnits([]);
            }}
          />

          <MultiSelectObj
            required
            className={clsx({
              "opacity-70":
                !selectedPropertyId ||
                unitSilentLoading ||
                unitOptions.length === 0,
            })}
            disabled={
              !selectedPropertyId ||
              unitSilentLoading ||
              unitOptions.length === 0
            }
            id=""
            placeholder={
              unitSilentLoading
                ? "Please wait"
                : unitOptions.length === 0
                ? "No unit available"
                : "Choose option"
            }
            label="Affected Units"
            onValueChange={(selected) => setSelectedUnits(selected.map(String))}
            options={
              unitOptions.length > 0
                ? unitOptions.map((u) => ({ label: u.name, value: u.name }))
                : []
            }
          />
          <Select
            required
            id="priority"
            label="Priority"
            options={priorityLevelsOption.map((level) => {
              return {
                label: level.label,
                value: level.value,
              };
            })}
            isSearchable={false}
            inputContainerClassName="bg-white capitalize"
          />
          <Input
            required
            type="text"
            id="requested_by"
            label="Requested By"
            inputClassName="rounded-lg"
          />

          {/* <Select
            id="requested_by"
            label="Requested By"
            options={["user 1", "user 2"]}
            inputContainerClassName="bg-white"
          /> */}
          <Select
            required
            id="maintenance_type"
            label="Maintenance Type"
            options={maintenanceTypes}
            inputContainerClassName="bg-white"
          />

          <input
            value={selectedProviderId ?? ""}
            type="hidden"
            aria-hidden
            id="service_provider_id"
            name="service_provider_id"
          />
          <Select
            id=""
            label="Service Provider"
            disabled={providerSilentLoading}
            placeholder={
              providerSilentLoading ? "Please wait..." : "Select options"
            }
            options={
              providerOptions.length > 0
                ? providerOptions.map((option) => option.name)
                : []
            }
            value={
              selectedProviderId
                ? providerOptions.find((b) => b.id === selectedPropertyId)?.name
                : ""
            }
            onChange={(name) => {
              const provider = providerOptions.find((b) => b.name === name);
              setSelectedProviderId(provider ? provider.id : null);
            }}
            inputContainerClassName="bg-white"
          />
        </div>
        <h2 className="text-sm md:text-base text-brand-10">Schedule Details</h2>
        <SectionSeparator className="!mt-4 !mb-6" />
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <DateInput
            required
            id="start_date"
            label="Start Date"
            onChange={handleStartDateChange}
            containerClassName="bg-white"
            minDate={dayjs(new Date())}
          />
          <DateInput
            required
            id="end_date"
            label="End Date"
            minDate={startDate || undefined}
            containerClassName="bg-white"
          />
          <Input
            required
            id="cost"
            label="Maintenance Cost"
            CURRENCY_SYMBOL={currencySymbol}
            inputClassName="bg-white rounded-[8px]"
            onChange={handleMaintenanceCostChange}
            value={maintenanceCost}
          />
          <div className="col-span-full grid gap-4 md:gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <TextArea
                value={quotation}
                onChange={(value: string) => setQuotation(value)}
                id="quotation"
                label="Maintenance Quotation"
                inputSpaceClassName="bg-white dark:bg-darkText-primary"
              />
              <div
                className={`${
                  quotation.length > 19 ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <FileUploader
                  id="quotation"
                  label="Upload Quotation File"
                  file={quotationFile}
                  onFileChange={setQuotationFile}
                  disabled={quotation.length > 19}
                />
              </div>

              {quotationFile?.name && (
                <button
                  type="button"
                  className="underline text-blue-600 ml-2"
                  onClick={() => {
                    const fileURL = URL.createObjectURL(quotationFile);
                    window.open(fileURL, "_blank", "noopener,noreferrer");
                  }}
                >
                  {"Click to preview"}
                </button>
              )}
            </div>
            <TextArea
              required
              id="detail"
              label="Work Details"
              inputSpaceClassName="bg-white dark:bg-darkText-primary"
            />
          </div>
        </div>
        <FixedFooter className="flex items-center justify-between gap-x-10 gap-y-4 flex-wrap">
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            {/* <div>
              <DocumentCheckbox
                darkText
                name="announcement"
                state={{
                  isChecked: announcement,
                  setIsChecked: setAnnouncement,
                }}
              >
                Announce the event
              </DocumentCheckbox>
            </div> */}
            <div>
              {/* <DocumentCheckbox
                darkText
                name="calendar_event"
                state={{
                  isChecked: calendarEvent,
                  setIsChecked: setCalendarEvent,
                }}
              >
                Add to Calendar
              </DocumentCheckbox> */}
            </div>
          </div>
          <Button
            type="submit"
            size="custom"
            disabled={isLoading}
            className="px-8 py-2 text-sm lg:text-base"
          >
            {isLoading ? "Please wait..." : "Create Maintenance"}
          </Button>
        </FixedFooter>
      </AuthForm>
    </div>
  );
};

export default CreateMaintenace;
