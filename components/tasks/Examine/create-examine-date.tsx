// Types

import type { CreateExamineDateProps } from "./types";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import Select from "@/components/Form/Select/select";
import DateInput from "@/components/Form/DateInput/date-input";
import TextArea from "@/components/Form/TextArea/textarea";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import { useEffect, useState } from "react";
import { createExamine } from "@/app/(nav)/tasks/examine/data";
import { toast } from "sonner";
import { AuthForm } from "@/components/Auth/auth-components";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { number } from "zod";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import dayjs from "dayjs";

const CreateExamineDate: React.FC<CreateExamineDateProps> = ({
  next,
  setIsOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [announcement, setAnnouncement] = useState(false);

  const [branchOptions, setBranchOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [propertyOptions, setPropertyOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [accountOfficerOptions, setAccountOfficerOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const { company_id } = usePersonalInfoStore();

  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );
  const [selectedAccountOfficerId, setSelectedAccountOfficerId] = useState<
    number | null
  >(null);

  const handleCreateExamine = async (data: FormData) => {
    if (!company_id) return;

    const notes = data.get("note");

    if (String(notes).trim().length < 200) {
      toast.error("Notes must be at least 200 characters.");
      return;
    }
    data.append("company_id", company_id);
    try {
      setLoading(true);
      const res = await createExamine(data);
      if (res) {
        toast.success("Examine created");
        setIsOpen?.(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const { data: branchData, silentLoading: branchSilentLoading } =
    useFetch<any>(`branches`);

  const { data: propertyData, silentLoading: propertySilentLoading } =
    useFetch<any>(selectedBranchId ? `branch/${selectedBranchId}` : null);

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
      const accountOfficers = propertyData.data?.branch?.staffs.filter(
        (staff: { id: number; name: string; staff_role: string }) =>
          staff.staff_role === "staff"
      );
      const officersOptions = accountOfficers?.map(
        (staff: { id: number; name: string }) => {
          return {
            id: staff.id,
            name: staff.name,
          };
        }
      );

      setAccountOfficerOptions(officersOptions);
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

  console.log(selectedAccountOfficerId);

  return (
    <WalletModalPreset title="Create Examine Date">
      <AuthForm returnType="form-data" onFormSubmit={handleCreateExamine}>
        <div className="custom-flex-col gap-10">
          <div className="grid md:grid-cols-2 gap-y-[18px] gap-x-6">
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
              value={selectedAccountOfficerId ?? ""}
              type="hidden"
              aria-hidden
              id="account_officer_id"
              name="account_officer_id"
            />
            <Input
              required
              label="Title"
              id="title"
              placeholder="Add Title"
              className="md:col-span-2"
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
                  ? propertyOptions.find((p) => p.id === selectedPropertyId)
                      ?.name
                  : ""
              }
              onChange={(name) => {
                const property = propertyOptions.find((p) => p.name === name);
                setSelectedPropertyId(property ? property.id : null);
              }}
            />
            <Select
              required
              disabled={!selectedBranchId || !selectedPropertyId}
              placeholder={
                propertySilentLoading ? "Please wait..." : "Select options"
              }
              id=""
              label="assign staff"
              options={
                accountOfficerOptions.length > 0
                  ? accountOfficerOptions.map((staff) => staff.name)
                  : []
              }
              inputContainerClassName="bg-white"
              value={
                selectedAccountOfficerId
                  ? accountOfficerOptions.find(
                      (p) => p.id === selectedAccountOfficerId
                    )?.name
                  : ""
              }
              onChange={(name) => {
                const accountOfficer = accountOfficerOptions.find(
                  (p) => p.name === name
                );
                setSelectedAccountOfficerId(
                  accountOfficer ? accountOfficer.id : null
                );
              }}
            />

            <DateInput
              required
              id="examine_date"
              label="Examine Date"
              minDate={dayjs(new Date())}
            />
            <TextArea
              id="note"
              label="Attach note:"
              className="md:col-span-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <DocumentCheckbox
              alignCheckboxCenter
              title="Announce the event"
              className="w-fit"
              name="create_announcement"
              state={{
                isChecked: announcement,
                setIsChecked: setAnnouncement,
              }}
            />
          </div>
          <Button
            //onClick={next}
            disabled={loading}
            type="submit"
            size="sm_medium"
            className="py-2 px-8"
            style={{ textTransform: "none" }}
          >
            {loading ? "Please wait..." : "Add to Calendar"}
          </Button>
        </div>
      </AuthForm>
    </WalletModalPreset>
  );
};

export default CreateExamineDate;
