// Imports
import Button from "@/components/Form/Button/button";
import AddLandlordModal from "@/components/Management/Landlord/add-landlord-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/Modal";
import LandlordCard from "@/components/Management/Landlord/landlord-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import { landlords } from "../data";

const Landlord = () => {
  const fields: Field[] = [
    { id: "1", accessor: "avatar", isImage: true },
    { id: "2", accessor: "name" },
    { id: "3", accessor: "email" },
    { id: "4", accessor: "phone_number" },
    { id: "5", accessor: "user_tag" },
  ];
  return (
    <div className="w-full h-fit space-y-9">
      <section className="w-full h-fit flex items-center justify-between">
        <div className="grid grid-cols-3 gap-4">
          <ManagementStatistcsCard />
          <ManagementStatistcsCard />
          <ManagementStatistcsCard />
        </div>
        <div>
          <Modal>
            <ModalTrigger asChild>
              <Button>+ create new landlord</Button>
            </ModalTrigger>
            <ModalContent>
              <AddLandlordModal />
            </ModalContent>
          </Modal>
        </div>
      </section>
      <section>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
          {landlords.slice(0, 30).map((l) => (
            <LandlordCard key={l.id} {...l} />
          ))}
        </div> */}
        <CustomTable
          displayTableHead={false}
          fields={fields}
          data={landlords.slice(0, 30)}
          tableBodyCellSx={{
            fontWeight: 500,
            fontSize: "16px",
            color: "#050901",
            border: "none",
            textAlign: "center",
          }}
          evenRowColor="#fff"
          oddRowColor="#F1F2F4"
        />
      </section>
    </div>
  );
};

export default Landlord;
