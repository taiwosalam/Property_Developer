"use client";

import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import Image from "next/image";
import Button from "@/components/Form/Button/button";
import { useRouter } from "next/navigation";

const ExportVehiclesRecord = () => {
  const router = useRouter();
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "ID", accessor: "id" },
    {
      id: "2",
      label: "Full Name",
      accessor: "full_name",
    },
    { id: "3", label: "Plate Number", accessor: "plate_number" },
    { id: "4", label: "Guest / Visitor", accessor: "guest_visitor" },
    { id: "5", label: "Check In", accessor: "check_in" },
    { id: "6", label: "Check Out", accessor: "check_out" },
    { id: "7", label: "Passenger In", accessor: "passenger_in" },
    { id: "8", label: "Passenger Out", accessor: "passenger_out" },
    { id: "9", label: "Status", accessor: "status" },
  ];

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: (index + 1).toString(),
      full_name: `full_name ${index + 1}`,
      plate_number: `plate_number ${index + 1}`,
      guest_visitor: index % 2 === 0 ? "Guest" : "Visitor",
      check_in: `check_in ${index + 1}`,
      check_out: `check_out ${index + 1}`,
      passenger_in: `${index + 1} People`,
      passenger_out: `${index + 1} People`,
      status: index % 2 === 0 ? "Completed" : "Pending",
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9 pb-[100px]">
      <ExportPageHeader
        logo={empty}
        location="States and Local Govt"
        website="https://realesate.com"
        phoneNumbers={["09022312133", "07012133313", "0901212121"]}
        email="example@mail.com"
      />
      <p className="text-center text-black text-lg md:text-xl lg:text-2xl font-medium">
        Summary
      </p>
      <CustomTable
        fields={fields}
        data={tableData}
        tableHeadClassName="bg-brand-9 h-[45px]"
        tableHeadCellSx={{
          color: "#EFF6FF",
          fontWeight: 500,
          border: "none",
          textAlign: "left",
          fontSize: "14px",
        }}
        tableBodyCellSx={{
          border: "none",
          textAlign: "left",
          fontWeight: 500,
          color: "#050901",
          fontSize: "14px",
        }}
        evenRowColor="#fff"
        oddRowColor="#FAFAFA"
      />
      <div className="w-fit ml-auto text-text-quaternary text-base font-medium space-y-2">
        <p>Authorized Signature </p>
        <Image src={empty} alt="signature" width={85} height={60} />
        <p>
          ESQ Taiwo Salam <br /> Legal Practitioner
        </p>
      </div>
      <div className="sticky z-[3] bottom-0 right-0 w-full bg-white py-5 px-[25px] lg:px-[60px] flex justify-between">
        <Button
          size="custom"
          className="py-2 px-8 font-bold text-sm lg:text-base"
          style={{ color: "#0033C4", backgroundColor: "#EFF6FF" }}
          onClick={() => router.back()}
        >
          Back
        </Button>

        <div className="flex gap-6">
          <Button
            size="custom"
            className="py-2 px-8 font-bold text-sm lg:text-base"
            style={{ color: "#0033C4", backgroundColor: "#EFF6FF" }}
          >
            Download
          </Button>
          <Button
            size="custom"
            className="py-2 px-8 font-bold text-sm lg:text-base"
          >
            Print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportVehiclesRecord;
