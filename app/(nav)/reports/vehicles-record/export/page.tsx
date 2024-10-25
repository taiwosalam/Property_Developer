"use client";

import CustomTable from "@/components/Table/table";
import ExportPageHeader from "@/components/reports/export-page-header";
import { empty } from "@/app/config";
import Image from "next/image";
import Button from "@/components/Form/Button/button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { vehicleRecordReportTableFields } from "../data";
import BackButton from "@/components/BackButton/back-button";

const ExportVehiclesRecord = () => {
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
      <BackButton>Back</BackButton>
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
        fields={vehicleRecordReportTableFields}
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

export default ExportVehiclesRecord;
