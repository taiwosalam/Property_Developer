"use client";

import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import Image from "next/image";
import Button from "@/components/Form/Button/button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import BackButton from "@/components/BackButton/back-button";

const ExportRent = () => {
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "Unit ID", accessor: "unit_id" },
    {
      id: "2",
      label: "Property Name",
      accessor: "property_name",
    },
    { id: "3", label: "Tenant / Occupant", accessor: "tenant_name" },
    {
      id: "5",
      label: "Start Date",
      accessor: "start_date",
    },
    { id: "6", label: "End Date", accessor: "end_date" },
    { id: "7", label: "Status", accessor: "status" },
    { id: "8", label: "First Deposit", accessor: "first_deposit" },
  ];

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      unit_id: (index + 1).toString(),
      property_name: `Property ${index + 1}`,
      tenant_name: `Tenant ${index + 1}`,
      unit_description: `unit desc ${index + 1}`,
      start_date: "12/12/12",
      end_date: "12/12/12",
      status: index % 2 === 0 ? "vacant" : "occupied",
      first_deposit: `2,600,800`,
    }));
  };

  const tableData = generateTableData(10);

  return (
    <div className="space-y-9 pb-[100px]">
      <BackButton>Back</BackButton>
      <ExportPageHeader
        logo={empty}
        location="States and Local Govt"
        website="https://realesate.com"
        phoneNumbers={["09022312133", "07012133313", "0901212121"]}
        email="example@mail.com"
      />
      <p className="text-center text-black dark:text-darkText-1 text-lg md:text-xl lg:text-2xl font-medium">
        Summary
      </p>
      <CustomTable
        fields={fields}
        data={tableData}
        tableHeadClassName="h-[45px]"
      />
      <div className="w-fit ml-auto text-text-quaternary dark:text-darkText-1 text-base font-medium space-y-2">
        <p>Authorized Signature </p>
        <Image src={empty} alt="signature" width={85} height={60} />
        <p>
          ESQ Taiwo Salam <br /> Legal Practitioner
        </p>
      </div>
      <FixedFooter className="flex flex-wrap gap-6 items-center justify-end">
        <div className="flex gap-6">
          <Button
            size="custom"
            className="py-2 px-8 font-bold text-sm lg:text-base"
            variant="sky_blue"
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
      </FixedFooter>
    </div>
  );
};

export default ExportRent;
