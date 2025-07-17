import Input from "@/components/Form/Input/input";
import DateInput from "@/components/Form/DateInput/date-input";
import {
  currencySymbols,
  formatCostInputValue,
} from "@/utils/number-formatter";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import Button from "@/components/Form/Button/button";
import {
  deleteMaintenance,
  getMaintenanceById,
  updateMaintenance,
} from "@/app/(nav)/tasks/maintenance/data";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";
import { toast } from "sonner";
import TruncatedText from "@/components/TruncatedText/truncated-text";

type IStatus =
  | "not started"
  | "ongoing"
  | "completed"
  | "pending"
  | "in_progress";
interface MaintenanceModalProps {
  status: "not started" | "ongoing" | "completed" | "pending" | "in_progress";
  maintenanceId: number;
  property_name: string;
  created_at: string;
  priority: "high" | "critical" | "low" | "very low" | "medium";
  service_type: string;
  service_provider: string;
  work_details: string;
  quotation: string;
  start_date: string;
  end_date: string;
  cost: string;
  units: string;
  requested_by: string;
  branch_name: string;
  maintenance_type: string;

  setIsOpen?: (open: boolean) => void;
}
const ManageMaintenanceModal = ({ ...props }: MaintenanceModalProps) => {
  const CURRENCY_SYMBOL = currencySymbols.naira; // Make this dynamic
  const [startDate, setStartDate] = useState<Dayjs | null>(
    props?.start_date ? dayjs(props.start_date) : null
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    props?.end_date ? dayjs(props.end_date) : null
  );

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStartDateChange = (date?: Dayjs | null) => {
    setStartDate(date || null);
  };
  const handleEndDateChange = (date?: Dayjs | null) => {
    setEndDate(date || null);
  };

  const [maintenanceCost, setMaintenanceCost] = useState(
    props?.cost ? props.cost : ""
  );
  const handleMaintenanceCostChange = (value: string) => {
    setMaintenanceCost(formatCostInputValue(value));
  };

  const handleUpdate = async () => {
    if (!props?.maintenanceId) return;
    if (!startDate || !endDate) return; // Ensure dates are not null

    const costInt = Number(maintenanceCost.toString().replace(/[^0-9.]/g, ""));
    const status: IStatus =
      props?.status === "not started" ? "in_progress" : "completed";

    if (!costInt || costInt === 0) {
      toast.error("Maintenance cost is required");
      return;
    }

    const data = {
      start_date: startDate.toDate(),
      end_date: endDate.toDate(),
      cost: costInt,
      status,
    };
    try {
      setIsUpdating(true);
      const res = await updateMaintenance(props?.maintenanceId, data);
      if (res) {
        props?.setIsOpen?.(false);
        toast.success("Updated successfully");
      }
      // handle response if needed
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!props?.maintenanceId) return;
    try {
      setIsDeleting(true);
      const res = await deleteMaintenance(props?.maintenanceId);
      if (res) {
        props?.setIsOpen?.(false);
        toast.success("Deleted successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  console.log(props?.status);

  return (
    <ModalPreset title="Manage Maintenance">
      <div className="space-y-[10px]">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-[18px] [&>div]:flex [&>div]:flex-col [&>div]:gap-2 px-4 py-6 rounded-lg"
          style={{
            boxShadow:
              "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
          }}
        >
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">
              Maintenance ID:
            </p>
            <p className="text-text-secondary text-sm dark:text-darkText-2">
              {props?.maintenanceId}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">
              Property Name:
            </p>
            <p className="text-text-secondary text-sm dark:text-darkText-2">
              {props?.property_name}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">
              Date Created:
            </p>
            <p className="text-text-secondary text-sm dark:text-darkText-2">
              {props?.created_at}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">
              Priority:
            </p>
            <p className="text-text-secondary text-sm dark:text-darkText-2 capitalize">
              {props?.priority}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">
              Service Type:
            </p>
            <p className="text-text-secondary text-sm dark:text-darkText-2">
              {props?.service_type}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">
              Affected Units:
            </p>
            <p className="text-text-secondary text-sm dark:text-darkText-2 capitalize">
              {props?.units}
            </p>
          </div>
           <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">
              Requested By:
            </p>
            <p className="text-text-secondary text-sm dark:text-darkText-2 capitalize">
              {props?.requested_by}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">
              Branch Name:
            </p>
            <p className="text-text-secondary text-sm dark:text-darkText-2 capitalize">
              {props?.branch_name}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">
              Maintenance Type:
            </p>
            <p className="text-text-secondary text-sm dark:text-darkText-2 capitalize">
              {props?.maintenance_type}
            </p>
          </div>
        </div>

        <hr className="!my-4 border-t border-dashed border-brand-7 opacity-50 -mx-6  " />

        <div className="space-y-3">
          <p className="text-text-tertiary dark:text-white text-base">
            Work Details:
          </p>
          <div
            className="px-4 py-6 rounded-lg"
            style={{
              boxShadow:
                "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
            }}
          >
            <TruncatedText>
              <div
                className="text-text-secondary dark:text-darkText-2 text-sm"
                dangerouslySetInnerHTML={{ __html: props.work_details }}
              />
            </TruncatedText>
          </div>
        </div>
        {props.quotation?.length > 11 && (
          <div className="space-y-3">
            <p className="text-text-tertiary dark:text-white text-base">
              Maintenance Quotation:
            </p>

            <div
              className="px-4 py-6 rounded-lg"
              style={{
                boxShadow:
                  "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
              }}
            >
              <TruncatedText>
                <div
                  className="text-text-secondary dark:text-darkText-2 text-sm"
                  dangerouslySetInnerHTML={{ __html: props.quotation }}
                />
              </TruncatedText>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateInput
            disabled={props?.status !== "pending"}
            id="start_date"
            label="Start Date"
            labelclassName="!text-sm"
            // containerClassName="bg-white dark:bg-darkText-primary"
            onChange={handleStartDateChange}
            value={startDate}
          />
          <DateInput
            id="end_date"
            disabled={props?.status !== "pending"}
            // containerClassName="bg-white"
            onChange={handleEndDateChange}
            labelclassName="!text-sm"
            label="End Date"
            minDate={startDate || undefined}
            value={endDate}
          />
          <Input
            required
            id="maintenance_cost"
            label="Maintenance Cost"
            labelclassName="!text-sm"
            CURRENCY_SYMBOL={CURRENCY_SYMBOL}
            onChange={handleMaintenanceCostChange}
            defaultValue={props?.cost}
            value={maintenanceCost}
            inputClassName="bg-white"
          />
          <div className="flex items-center gap-3 self-end justify-end">
            <Button
              disabled={isDeleting}
              variant="light_red"
              size="xs_normal"
              className="py-2 px-6"
              onClick={handleDelete}
            >
              {isDeleting ? "Please wait..." : "Delete"}
            </Button>
            {props?.status !== "completed" && (
              <Button
                disabled={isUpdating}
                size="xs_normal"
                className="py-2 px-8"
                onClick={handleUpdate}
              >
                {isUpdating
                  ? "Please wait..."
                  : props?.status === "not started"
                  ? "start"
                  : props?.status === "ongoing"
                  ? "Complete"
                  : "Update"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </ModalPreset>
  );
};

export default ManageMaintenanceModal;
