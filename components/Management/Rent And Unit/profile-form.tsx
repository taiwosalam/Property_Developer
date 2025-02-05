import Select from "@/components/Form/Select/select";
import { useState, useEffect } from "react";
import { Occupant } from "./types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import AddOccupantWithId from "./add-occupant-with-id-modal";
import DateInput from "@/components/Form/DateInput/date-input";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import { MatchedProfile } from "./matched-profile";
import { DUMMY_OCCUPANT, calculateDueDate, type RentPeriod } from "./data";
import { RentSectionTitle } from "./rent-section-container";
import { Dayjs } from "dayjs";

export const ProfileForm: React.FC<{
  occupants: { name: string; id: string }[];
  isRental: boolean;
  selectedOccupant: Occupant | null;
  onOccupantSelect: (occupant: Occupant | null) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onError: (error: Error | null) => void;
  occupantLoading: boolean;
  occupantError: Error | null;
}> = ({
  occupants,
  isRental,
  selectedOccupant,
  onOccupantSelect,
  onError,
  onLoadingChange,
  occupantLoading,
  occupantError,
}) => {
  const [selectedId, setSelectedId] = useState<string>("");

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [rentPeriod, setRentPeriod] = useState<RentPeriod>("biennially");


  // Simulate API call
  useEffect(() => {
    if (!selectedId) {
      onOccupantSelect(null);
      onLoadingChange(false);
      onError(null);
      return;
    }

    const fetchOccupantData = async () => {
      onLoadingChange(true);
      onError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Simulate API response
        onOccupantSelect(DUMMY_OCCUPANT as Occupant);
      } catch (error) {
        console.error("Error fetching occupant:", error);
        onOccupantSelect(null);
        onError(
          error instanceof Error
            ? error
            : new Error("Failed to fetch occupant data")
        );
      } finally {
        onLoadingChange(false);
      }
    };

    fetchOccupantData();
  }, [selectedId, onOccupantSelect, onLoadingChange, onError]);

  // Calculate due date when start date or rent period changes
  useEffect(() => {
    if (!startDate) {
      setDueDate(null);
      return;
    }
    setDueDate(calculateDueDate(startDate, rentPeriod));
  }, [startDate, rentPeriod]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end gap-x-[35px] gap-y-4">
          <Select
            id={`available_${isRental ? "tenant" : "occupant"}`}
            label={`Choose Available ${isRental ? "Tenant" : "Occupant"}`}
            options={occupants.map((occupant) => ({
              label: occupant.name,
              value: occupant.id,
            }))}
            className="md:flex-1 md:max-w-[300px]"
            onChange={setSelectedId}
          />
          <Modal>
            <ModalTrigger asChild>
              <Button size="16_bold" className="py-2 px-6">
                Choose With ID
              </Button>
            </ModalTrigger>
            <ModalContent>
              <AddOccupantWithId />
            </ModalContent>
          </Modal>
        </div>
        <div className="block lg:hidden">
          <MatchedProfile
            occupant={selectedOccupant}
            isLoading={occupantLoading}
            error={occupantError}
            title="Matched Profile"
          />
        </div>
      </div>
      <RentSectionTitle>
        Start {isRental ? "Rent" : "Counting"}
      </RentSectionTitle>
      <div className="h-[1px] bg-[#C0C2C8] mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <DateInput
          id="start date"
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
        />
        <DateInput
          id="due date"
          label="Due Date"
          disabled
          value={dueDate}
          className="opacity-50"
        />
      </div>
      <div className="flex items-center justify-end gap-4 flex-wrap">
        {[
          "Create Invoice",
          "Mobile Notification",
          "SMS Alert",
          "Email Alert",
        ].map((option) => (
          <Checkbox
            sm
            key={option}
            defaultChecked={option === "Create Invoice"}
          >
            {option}
          </Checkbox>
        ))}
      </div>
    </div>
  );
};
