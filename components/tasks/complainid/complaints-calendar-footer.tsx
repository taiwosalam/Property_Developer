import React, { useState } from "react";
import { format } from "date-fns";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import CreateTaskModal from "./create-task-modal";
import CreateReminderModal from "./create-reminder-modal";

const ComplaintsCalendarFooter: React.FC<{
  activeDate: Date;
  buttonText: string;
  //   modalContent: React.ReactNode;
}> = ({ activeDate, buttonText }) => {
  const formattedDate = format(activeDate, "EEEE, dd MMMM yyyy");

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-between items-center gap-2 px-3">
      <div className="space-y-1">
        <p className="text-black text-sm font-normal">Date</p>
        <p className="text-brand-9 text-xs font-medium">{formattedDate}</p>
      </div>
      <Modal
        state={{
          isOpen,
          setIsOpen,
        }}
      >
        <ModalTrigger asChild>
          <Button size="xs_normal" className="py-2 px-3">
            {buttonText}
          </Button>
        </ModalTrigger>
        <ModalContent>
          {buttonText === "Set Reminder" ? (
            <CreateReminderModal activeDate={activeDate}  setIsOpen={setIsOpen}/>
          ) : buttonText === "Create Task" ? (
            <CreateTaskModal activeDate={activeDate} />
          ) : null}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ComplaintsCalendarFooter;
