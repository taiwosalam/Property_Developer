"use client";

import CustomTable from "@/components/Table/table";
import type { Field } from "@/components/Table/types";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import Image from "next/image";
import Button from "@/components/Form/Button/button";
import { useRouter } from "next/navigation";
import useDarkMode from "@/hooks/useCheckDarkMode";
import FixedFooter from "@/components/FixedFooter/fixed-footer";

const ExportLandlords = () => {
  const router = useRouter();
  const fields: Field[] = [
    { id: "0", label: "S/N", accessor: "S/N" },
    { id: "1", label: "Landlord / Landlady ID", accessor: "id" },
    {
      id: "2",
      label: "Name",
      accessor: "name",
      cellStyle: { textTransform: "uppercase" },
    },
    { id: "3", label: "Contact Address", accessor: "address" },
    { id: "5", label: "Telephone", accessor: "telephone" },
    { id: "6", label: "email", accessor: "email" },
  ];

  const generateTableData = (numItems: number) => {
    return Array.from({ length: numItems }, (_, index) => ({
      id: (index + 1).toString(),
      name: `name ${index + 1}`,
      address: `ADDRESS ${index + 1}`,
      telephone: `TELEPHONE ${index + 1}`,
      email: `${index + 1}@email.com`,
    }));
  };

  const tableData = generateTableData(10);
  const isDarkMode = useDarkMode();

  return (
    <div className="space-y-9 pb-[100px]">
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
          color: isDarkMode ? "#fff" : "#050901",
          fontSize: "14px",
        }}
        evenRowColor={isDarkMode ? "#3C3D37" : "#fff"}
        oddRowColor={isDarkMode ? "#020617" : "#FAFAFA"}
      />
      <div className="w-fit ml-auto text-text-quaternary dark:text-darkText-1 text-base font-medium space-y-2">
        <p>Authorized Signature </p>
        <Image src={empty} alt="signature" width={85} height={60} />
        <p>
          ESQ Taiwo Salam <br /> Legal Practitioner
        </p>
      </div>
      <FixedFooter className="flex flex-wrap gap-6 items-center justify-between">
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
      </FixedFooter>
    </div>
  );
};

export default ExportLandlords;
