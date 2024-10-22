import { XIcon } from "@/public/icons/icons";
import Input from "@/components/Form/Input/input";
import DateInput from "@/components/Form/DateInput/date-input";
import {
  currencySymbols,
  formatCostInputValue,
} from "@/utils/number-formatter";
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import { useAuthStore } from "@/store/authstrore";
import {
  deleteMaintenance,
  getMaintenanceById,
  updateMaintenance,
} from "@/app/(nav)/tasks/maintenance/data";

const ManageMaintenanceModal = () => {
  const accessToken = useAuthStore((state) => state.access_token);
  const CURRENCY_SYMBOL = currencySymbols["NAIRA"]; // Make this dynamic
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const handleStartDateChange = (date?: Dayjs | null) => {
    setStartDate(date || null);
  };
  const [maintenanceCost, setMaintenanceCost] = useState("");
  const handleMaintenanceCostChange = (value: string) => {
    setMaintenanceCost(formatCostInputValue(value));
  };
  const [ManageMaintenanceModalData, setManageMaintenanceModalData] = useState(
    []
  );

  const handleUpdateMaintenance = ({
    id,
    data,
  }: {
    id: string;
    data: any; //change to formdata later
  }) => {
    console.log(data);
    updateMaintenance(accessToken, "2", data).then((res) => {
      console.log(res);
    });
  };

  const handleDeleteMaintenance = (id: string) => {
    deleteMaintenance(accessToken, id).then((res) => {
      console.log(res);
    });
  };

  useEffect(() => {
    const fetchManageMaintenanceModalData = async () => {
      const response = await getMaintenanceById(accessToken, "2").then(
        (res) => res
      );
      console.log(response);
    };

    fetchManageMaintenanceModalData();
  }, [accessToken]);

  return (
    <div
      className="font-medium rounded-lg border border-[rgba(193,194,195,0.40)] dark:border-[#3C3D37] w-[600px] max-w-[80%] max-h-[90vh] overflow-y-auto custom-round-scrollbar"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      {/* Header */}
      <div className="text-center text-text-secondary text-base pt-5 lg:pt-10 pb-4 rounded-t-lg bg-brand-1 sticky z-[1] top-0">
        Manage Maintenance
        <ModalTrigger asChild close>
          <button className="absolute top-2 right-4" aria-label="Close">
            <XIcon />
          </button>
        </ModalTrigger>
      </div>
      {/* Body */}
      <div className="px-6 pt-3 pb-8 bg-white dark:bg-darkText-primary rounded-b-lg">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-[18px] [&>div]:flex [&>div]:flex-col [&>div]:gap-2 px-4 py-6 rounded-lg"
          style={{
            boxShadow: "0px 1px 2px 0px rgba(21, 30, 43, 0.08)",
          }}
        >
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">Maintenance ID:</p>
            <p className="text-text-secondary text-sm dark:text-darkText-2">1234567890</p>
          </div>
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">Property Name:</p>
            <p className="text-text-secondary text-sm dark:text-darkText-2">David Hall, Moniya</p>
          </div>
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">Date Created:</p>
            <p className="text-text-secondary text-sm dark:text-darkText-2">21/01/2024</p>
          </div>
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">Priority:</p>
            <p className="text-text-secondary text-sm dark:text-darkText-2">High</p>
          </div>
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">Service Type:</p>
            <p className="text-text-secondary text-sm dark:text-darkText-2">Legal Work</p>
          </div>
          <div>
            <p className="text-text-tertiary text-base dark:text-darkText-1">Service Provider:</p>
            <p className="text-text-secondary text-sm dark:text-darkText-2">Lawyer</p>
          </div>
        </div>
        <hr className="my-4 border-t border-dashed border-brand-7 opacity-50" />
        <p className="text-text-tertiary dark:text-white text-base mb-3">Work Details</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="details"
            label="Details"
            labelclassName="!text-sm"
            inputClassName="bg-white"
          />
          <Input
            id="maintenance_quotation"
            label="Maintenance Quotation"
            labelclassName="!text-sm"
            inputClassName="bg-white"
          />
          <DateInput
            id="start_date"
            label="Start Date"
            labelclassName="!text-sm"
            containerClassName="bg-white dark:bg-darkText-primary"
            onChange={handleStartDateChange}
          />
          <DateInput
            id="end_date"
            containerClassName="bg-white"
            labelclassName="!text-sm"
            label="End Date"
            minDate={startDate || undefined}
          />
          <Input
            id="maintenance_cost"
            label="Maintenance Cost"
            labelclassName="!text-sm"
            CURRENCY_SYMBOL={CURRENCY_SYMBOL}
            onChange={handleMaintenanceCostChange}
            value={maintenanceCost}
            inputClassName="bg-white"
          />
          <div className="flex items-center gap-3 self-end justify-end">
            <Button
              variant="light_red"
              size="xs_normal"
              className="py-2 px-6"
              onClick={() => handleDeleteMaintenance("2")}
            >
              Delete
            </Button>
            <Button
              size="xs_normal"
              className="py-2 px-8"
              onClick={() =>
                handleUpdateMaintenance({
                  id: "2",
                  data: {
                    details: "details",
                    maintenance_quotation: "maintenance_quotation",
                    start_date: startDate,
                    end_date: startDate,
                    maintenance_cost: maintenanceCost,
                  },
                })
              }
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMaintenanceModal;
