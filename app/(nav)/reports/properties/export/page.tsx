"use client";

import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import Image from "next/image";
import Button from "@/components/Form/Button/button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import BackButton from "@/components/BackButton/back-button";

const ExportProperties = () => {
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "ID", accessor: "id" },
    {
      id: "2",
      label: "Property",
      accessor: "property",
    },
    { id: "3", label: "Branch", accessor: "branch" },
    {
      id: "5",
      label: "Account Officer",
      accessor: "account_officer",
      cellStyle: { textTransform: "uppercase" },
    },
    { id: "6", label: "landlord / landlady", accessor: "landlord" },
    { id: "7", label: "Date Created", accessor: "date_created" },
  ];

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: (index + 1).toString(),
      property: `Property ${index + 1}`,
      branch: `branch ${index + 1}`,
      account_officer: `Officer ${index + 1}`,
      landlord: `Landlord ${index + 1}`,
      date_created: `12/12/12`,
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
      <p className="text-center text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium">
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
            variant="sky_blue"
            className="py-2 px-8 font-bold text-sm lg:text-base"
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

export default ExportProperties;
