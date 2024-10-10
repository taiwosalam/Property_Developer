import UndoModalPreset from "./undo-modal-preset";
import BranchCard from "../Management/Staff-And-Branches/branch-card";
import UserCard from "../Management/landlord-and-tenant-card";
import InventoryCard from "../Management/Inventory/inventory-card";
import PropertyCard from "../Management/Properties/property-card";
import AnnouncementCard from "../tasks/announcements/announcement-card";
import ExamineCard from "../tasks/Examine/examine-card";
import MaintenanceCard from "../tasks/maintenance/maintenance-card";
import { TaskCard } from "../dashboard/kanban/TaskCard";
import OtherCard from "./other-card";
import DocumentCard from "./document-card";
import { empty } from "@/app/config";
import ModalPreset from "../Modal/modal-preset";
import { useState } from "react";
import Button from "../Form/Button/button";
import { ModalTrigger } from "../Modal/modal";

type EventDeleted =
  | "Landlord/Landlady Profile"
  | "Branch Details"
  | "Staff Profile"
  | "Inventory"
  | "Property"
  | "Complaint"
  | "Service Provider"
  | "Examine"
  | "Maintenance"
  | "Announcement"
  | "Invoice"
  | "Expenses"
  | "Disbursement"
  | "Tenancy Agreement"
  | "Personalized Domain";

interface UndoModalProps {
  event: EventDeleted;
  //   handleDelete: () => void;
  //   handleRestore: () => void;
}

const eventToComponentMap = {
  "Landlord/Landlady Profile": (
    <div className="min-w-[285px] max-w-full pb-7">
      <UserCard
        cardType="landlord"
        email="sam@gmail.com"
        first_name="John"
        last_name="Doe"
        user_tag="web"
        id="1"
        avatar={empty}
        phone_number="08012345678"
        picture_url={empty}
      />
    </div>
  ),
  "Branch Details": (
    <div className="min-w-[285px] max-w-full pb-7">
      <BranchCard
        id="1"
        branch_title="Branch 1"
        branch_full_address="123 Main St, Anytown, USA"
        avatar={empty}
        manager_name="Jane Doe"
        manager_avatar={empty}
        staff_count={10}
        property_count={5}
        unit_count={20}
      />
    </div>
  ),
  "Staff Profile": (
    <div className="min-w-[285px] max-w-full pb-7">
      <UserCard
        cardType="staff"
        email="sam@gmail.com"
        first_name="John"
        last_name="Doe"
        role="Branch Manager"
        id="1"
        avatar={empty}
        phone_number="08012345678"
        picture_url={empty}
      />
    </div>
  ),
  Inventory: (
    <div className="min-w-[330px] max-w-full">
      <InventoryCard
        data={{
          account_officer: "John Doe",
          branch_name: "Branch 1",
          created_date: "2021-01-01",
          edited_date: "2021-01-01",
          inventory_id: "1",
          property_name: "Property 1",
        }}
        viewOnly={true}
      />
    </div>
  ),
  Property: (
    <div className="min-w-[335px] max-w-full">
      <PropertyCard
        isClickable={false}
        address="123 Main St, Anytown, USA"
        id="1"
        images={[empty, empty, empty, empty]}
        name="Property 1"
        propertyId="1"
        price={1000}
        type="gated"
        units={10}
      />
    </div>
  ),
  Complaint: (
    <TaskCard
      viewOnly={true}
      task={{
        id: "task9",
        columnId: "approved",
        content: {
          messageCount: 2,
          linkCount: 1,
          userAvatars: [
            "/empty/avatar.png",
            "/empty/avatar.png",
            "/empty/avatar.png",
          ],
          date: "25 Jan 2024",
          status: "approved",
          progress: 50,
        },
        name: "John Doe",
        title: "Project Manager",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        avatarSrc: "/empty/avatar.png",
      }}
    />
  ),

  "Service Provider": (
    <div className="min-w-[285px] max-w-full pb-7">
      <UserCard
        cardType="service-provider"
        email="sam@gmail.com"
        first_name="John"
        last_name="Doe"
        user_tag="web"
        id="1"
        avatar={empty}
        phone_number="08012345678"
        picture_url={empty}
        service="Plumbing"
      />
    </div>
  ),
  Examine: (
    <div className="min-w-[350px] max-w-full">
      <ExamineCard viewOnly={true} />
    </div>
  ),
  Maintenance: (
    <MaintenanceCard
      viewOnly={true}
      dateCreated="12/12/12"
      serviceProvider="John Doe"
      startEndDate="12/12/12"
      priority="High"
      serviceType="Plumbing"
      maintenanceId="1"
      status="not started"
      propertyName="Property 1"
    />
  ),

  Announcement: (
    <div className="min-w-[315px] max-w-full">
      <AnnouncementCard
        viewOnly={true}
        title="Announcement 1"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        id="1"
        date="12/12/12"
        views={10}
        newViews={10}
        likes={10}
        dislikes={10}
        imageUrls={[empty, empty, empty, empty]}
        mediaCount={10}
        announcementId="1"
      />
    </div>
  ),

  Invoice: (
    <OtherCard
      items={[
        { label: "Landlord/Landlady", value: "Ajadi David" },
        { label: "Payment ID", value: "12345678" },
        { label: "Amount", value: "₦115,000.00" },
        { label: "Date", value: "12/12/12" },
        { label: "Mode", value: "Wallet" },
        { label: "Description", value: "Payment for rent" },
      ]}
    />
  ),

  Expenses: (
    <OtherCard
      items={[
        { label: "Client Name", value: "Ajadi David" },
        { label: "Amount", value: "₦115,000.00" },
        { label: "Payment", value: "₦115,000.00" },
        { label: "Balance", value: "₦115,000.00" },
        { label: "Date", value: "12/12/12" },
        { label: "Description", value: "Electrical Work" },
      ]}
    />
  ),

  Disbursement: (
    <OtherCard
      items={[
        { label: "Landlord/Landlady", value: "Ajadi David" },
        { label: "Payment ID", value: "12345678" },
        { label: "Amount", value: "₦115,000.00" },
        { label: "Date", value: "12/12/12" },
        { label: "Mode", value: "Wallet" },
      ]}
    />
  ),

  "Tenancy Agreement": (
    <DocumentCard
      documentId="12345678"
      property_name="Property 1"
      date_created="12/12/12"
      document_type="Tenancy Agreement"
      property_id="1"
      number_of_units="1"
      cardViewDetails={[
        { label: "Property Name", accessor: "property_name" },
        { label: "Date Created", accessor: "date_created" },
        { label: "Document Type", accessor: "document_type" },
        { label: "Property ID", accessor: "property_id" },
        { label: "Number of Units", accessor: "number_of_units" },
      ]}
    />
  ),

  "Personalized Domain": (
    <OtherCard
      items={[
        { label: "URL", value: "yourdomain.com" },
        { label: "Redirect Type", value: "Permanent 301" },
        { label: "Redirects", value: "ourproperty.ng" },
        { label: "Date", value: "12/03/2023" },
        { label: "Due Date", value: "12/03/2023" },
      ]}
    />
  ),
};

export type ActiveStep = "details" | "warning" | "success";
export type ActionType = "delete" | "restore" | null;

const UndoModal: React.FC<UndoModalProps> = ({ event }) => {
  const [activeStep, setActiveStep] = useState<ActiveStep>("details");

  const [actionType, setActionType] = useState<ActionType>(null);

  const Component = eventToComponentMap[event];

  if (activeStep === "details") {
    return (
      <UndoModalPreset
        heading={`${event} Details`}
        setActiveStep={setActiveStep}
        setActionType={setActionType}
      >
        {Component}
      </UndoModalPreset>
    );
  }

  if (activeStep === "warning") {
    return (
      <ModalPreset type="warning">
        <p className="text-text-disabled text-sm font-normal">
          {actionType === "delete"
            ? "Are you sure you want to proceed with permanently deleting it?"
            : "Are you certain you want to proceed with restoring it?"}
        </p>
        <div className="flex flex-col items-center gap-4">
          <Button type="button">proceed</Button>
          <button
            onClick={() => setActiveStep("details")}
            className="text-brand-primary text-sm font-medium"
          >
            Back
          </button>
        </div>
      </ModalPreset>
    );
  }

  if (activeStep === "success") {
    return (
      <ModalPreset type="success">
        <p className="text-text-disabled text-sm font-normal">
          You have successfully deleted or restored this profile. //Change
          according to the action type
        </p>
        <ModalTrigger asChild close>
          <Button type="button">ok</Button>
        </ModalTrigger>
      </ModalPreset>
    );
  }
  return null;
};

export default UndoModal;
