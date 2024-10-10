"use client";

import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import Image from "next/image";
import Button from "@/components/Form/Button/button";
import { useRouter } from "next/navigation";

const ExportUnits = () => {
  const router = useRouter();
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "Unit ID", accessor: "unit_id" },
    {
      id: "2",
      label: "Property Name",
      accessor: "property_name",
    },
    { id: "3", label: "Unit Name", accessor: "unit_name" },
    {
      id: "5",
      label: "Unit Description",
      accessor: "unit_description",
    },
    { id: "6", label: "status", accessor: "status" },
    { id: "7", label: "Annual Rent", accessor: "annual_rent" },
  ];

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      unit_id: (index + 1).toString(),
      property_name: `Property ${index + 1}`,
      unit_name: `unit ${index + 1}`,
      unit_description: `unit desc ${index + 1}`,
      status: index % 2 === 0 ? "vacant" : "occupied",
      annual_rent: `2,600,800`,
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

export default ExportUnits;
