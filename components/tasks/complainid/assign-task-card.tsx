"use client";
import { useEffect, useState } from "react";
import Button from "@/components/Form/Button/button";
import clsx from "clsx";
import { RadioCheckCircle } from "@/public/icons/icons";
import Select from "@/components/Form/Select/select";
import useFetch from "@/hooks/useFetch";
import {
  assignTask,
  IAssignTask,
} from "@/app/(nav)/tasks/complaints/[complainId]/manage-complain/data";
import { useParams } from "next/navigation";
import TextArea from "@/components/Form/TextArea/textarea";
import { toast } from "sonner";

interface StateType {
  assignedTo: string | { staff?: string; provider?: string } | null;
  selectedLandlord: boolean;
  selectedStaff: string;
  selectedProvider: string;
}

interface IAssignTaskProps {
  branchId?: number;
  taskStatus?: boolean;
}
const AssignTaskCard = ({ branchId, taskStatus }: IAssignTaskProps) => {
  const myClasses =
    "border border-[#C1C2C366] rounded-lg py-[11px] px-[18px] text-xs md:text-sm font-medium hover:border-[#00000099] transition-colors duration-300 ease-in-out";

  const [state, setState] = useState<StateType>({
    assignedTo: null,
    selectedLandlord: false,
    selectedStaff: "",
    selectedProvider: "",
  });
  const [providerOptions, setProviderOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const [branchOPtions, setBranchOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const { assignedTo, selectedLandlord, selectedStaff, selectedProvider } =
    state;

  const { data: providerData, silentLoading: providerSilentLoading } =
    useFetch<any>(`service-providers`);

  const { data: branchStaff } = useFetch<any>(
    branchId ? `staffs?branch_id=${branchId}` : null
  );
  const [proceedTask, setProceed] = useState<"assign" | "note">("assign");

  const param = useParams();
  const paramId = param.complainId;

  useEffect(() => {
    if (branchStaff && branchStaff?.data?.staff.length > 0) {
      const branches = branchStaff?.data?.staff?.map(
        (branch: { id: number; name: string }) => ({
          id: branch?.id,
          name: branch?.name,
        })
      );
      setBranchOptions(branches);
    }
  }, [branchStaff]);

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

  const [note, setNote] = useState("");
  // Determine if the Proceed button should be enabled
  const isProceedDisabled = !assignedTo;

  const taskProviders = providerOptions?.map((name) => name.name);
  const taskStaff = branchOPtions?.map((staff) => staff.name);

  const [isLoading, setIsLoading] = useState(false);

  const handleAssignTask = async () => {
    const payload: IAssignTask = {
      id: paramId as string,
      note,
      assign_to: selectedProvider || selectedStaff || "landlord",
      assign_to_type: selectedProvider
        ? "provider"
        : selectedStaff
        ? "staff"
        : "landlord",
    };
    try {
      setIsLoading(true);
      const res = await assignTask(payload);
      if (res) {
        toast.success("Task assigned");
        setProceed("assign");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasStaff = branchOPtions.length > 0;
  const hasProviders = providerOptions.length > 0;

  return (
    <div
      className="rounded-lg border border-[rgba(193,194,195,0.40)]"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="font-medium bg-brand-1 dark:bg-darkText-2 pt-4 pb-2 px-[70px] text-center rounded-t-lg">
        <h6 className="text-black text-base">Assign Task</h6>
        <p className="text-text-label text-sm">
          Kindly select who you want to add to this task
        </p>
      </div>

      {proceedTask === "assign" ? (
        <div className="bg-white dark:bg-darkText-primary rounded-b-lg font-medium text-text-secondary px-4 py-6 custom-flex-col gap-2">
          <Select
            disabled={!hasStaff || taskStatus}
            id="staff-select"
            isSearchable={false}
            options={taskStaff || []}
            placeholder={
              hasStaff ? "Assign Task to Staff" : "No staff available"
            }
            inputTextClassName={clsx(
              "!font-medium",
              !hasStaff ? "text-gray-400" : "text-text-secondary"
            )}
            value={selectedStaff}
            onChange={(staff) => handleStaffSelection(staff)}
          />
          <Select
            disabled={!hasProviders || taskStatus}
            id="provider-select"
            isSearchable={false}
            options={taskProviders || []}
            placeholder={
              hasProviders
                ? "Assign Task to Service Provider"
                : "No service providers available"
            }
            inputTextClassName={clsx(
              "!font-medium",
              !hasProviders ? "text-gray-400" : "text-text-secondary"
            )}
            value={selectedProvider}
            onChange={(provider) => handleProviderSelection(provider)}
          />
          <button
            disabled={taskStatus}
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
            disabled={taskStatus}
            size="sm_medium"
            onClick={() => {
              setProceed("note");
            }}
            className={clsx(
              "mt-10 py-2 px-8",
              !isProceedDisabled ? "opacity-100" : "opacity-50",
              isProceedDisabled && "pointer-events-none"
            )}
          >
            Proceed
          </Button>
        </div>
      ) : (
        <>
          <div className="px-5">
            <div className="flex justify-between items-center py-4">
              <div className="">
                <p className="text-text-label">Assign task to:</p>
                <p className="text-black">
                  {selectedStaff || selectedProvider || "Landlord"}
                </p>
              </div>

              <button
                className="text-brand-9 underline"
                onClick={() => setProceed("assign")}
              >
                Change
              </button>
            </div>
            <TextArea
              id="notes"
              label="Attach note"
              value={note}
              onChange={(value: string) => setNote(value)}
              className="w-full min-h-[200px] mb-4"
              placeholder="Edit your note here..."
            />
            <div className="flex items-center justify-end gap-3 w-full pb-6">
              <Button
                disabled={isLoading}
                size="xs_medium"
                className="px-4 py-2 w-full"
                onClick={handleAssignTask}
              >
                {isLoading ? "Please wait..." : "Update"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignTaskCard;
