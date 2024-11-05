"use client";
import clsx from "clsx";
import { ThichDownArrow } from "@/public/icons/icons";
import { SectionSeparator } from "@/components/Section/section-components";
import { useState } from "react";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { motion, AnimatePresence } from "framer-motion";
import { DetailItem } from "../detail-item";
import Picture from "@/components/Picture/picture";
import CustomTable from "@/components/Table/table";
import { LandlordTenantInfoDocument } from "../landlord-tenant-info-components";
import {
  previousRentRecordsTableFields as tableFields,
  previousRentRecordsData as tableData,
  sampleDocuments,
} from "./data";
import { groupDocumentsByType } from "@/utils/group-documents";

const TenancyRecord = () => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  const groupedDocuments = groupDocumentsByType(sampleDocuments);

  return (
    <div
      className="bg-white dark:bg-darkText-primary p-6 space-y-4 rounded-2xl"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-base font-bold text-brand-10">Tenancy Record</h3>
        <button
          type="button"
          className="rounded bg-brand-9 py-2 px-8"
          onClick={() => {
            setIsCollapsibleOpen((x) => !x);
          }}
        >
          <div
            className={clsx("transition-transform duration-300", {
              "rotate-180": isCollapsibleOpen,
            })}
          >
            <ThichDownArrow />
          </div>
        </button>
      </div>
      <SectionSeparator className="h-[2px]" />
      <div className="flex items-center gap-4 py-4 justify-between overflow-auto custom-round-scrollbar">
        <div className="grid grid-cols-2 gap-4 flex-shrink-0">
          <DetailItem
            label="Name"
            value={
              <span className="flex items-center">
                Abimbola Adedeji
                <BadgeIcon color="yellow" />
              </span>
            }
            style={{ width: "130px" }}
          />
          <DetailItem
            label="Period/Duration"
            value="02/10/2013 - 01/10/2024"
            style={{ width: "130px" }}
          />
          <DetailItem
            label="Email"
            value="abimbola adedeji@gmail.com"
            style={{ width: "130px" }}
          />
          <DetailItem
            label="Renewal Rent"
            value="₦300,000"
            style={{ width: "130px" }}
          />
          <DetailItem
            label="Phone Number"
            value="+2348065558146"
            style={{ width: "130px" }}
          />
          <DetailItem
            label="Renewal Package"
            value="₦300,000"
            style={{ width: "130px" }}
          />
        </div>
        <Picture
          containerClassName="flex-shrink-0"
          className="rounded-[12px]"
          src="/empty/SampleLandlord.jpeg"
          size={168}
          alt="tenant name"
        />
      </div>
      <AnimatePresence initial={false}>
        {isCollapsibleOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* STATEMENT */}
            <div className="space-y-4">
              <h4 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
                Statement
              </h4>
              <CustomTable fields={tableFields} data={tableData} />
            </div>
            {/* SHARED DOCUMENTS */}
            <div className="space-y-4">
              <h4 className="text-primary-navy dark:text-white text-lg lg:text-xl font-bold">
                Shared Documents
              </h4>
              {Object.entries(groupedDocuments).map(
                ([documentType, documents]) => {
                  if (documentType === "other document") return null; // Skip "other document" for now
                  return (
                    <div key={documentType} className="space-y-[6px]">
                      <h6 className="text-text-secondary text-base font-medium capitalize">
                        {documentType}
                      </h6>
                      <div className="flex flex-wrap gap-4">
                        {documents.map((document) => (
                          <LandlordTenantInfoDocument
                            key={document.id}
                            {...document}
                          />
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
              {groupedDocuments["other document"] && (
                <div className="space-y-[6px]">
                  <h6 className="text-text-secondary text-base font-medium">
                    Other Documents
                  </h6>
                  <div className="flex flex-wrap gap-4">
                    {groupedDocuments["other document"].map((document) => (
                      <LandlordTenantInfoDocument
                        key={document.id}
                        {...document}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* CLOSE BUTTON */}
            <div className="flex justify-end">
              <button
                type="button"
                className="rounded bg-brand-9 py-2 px-8"
                onClick={() => {
                  setIsCollapsibleOpen(false);
                }}
              >
                <div className="rotate-180">
                  <ThichDownArrow />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TenancyRecord;
