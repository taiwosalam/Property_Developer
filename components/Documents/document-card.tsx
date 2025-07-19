"use client";

import Button from "../Form/Button/button";
import KeyValueList from "../KeyValueList/key-value-list";
import { Document } from "./types";

const DocumentCard = ({
  document_id,
  property_name,
  document_type,
  property_id,
  total_unit,
  created_date,
  last_updated,
  page,
}: Document) => {
  // switch case for route
  const getRoute = () => {
    switch (page) {
      case 'manager':
        return `/manager/documents/manage-tenancy-agreement/?d=${document_id}`;
      case 'account':
        return `/documents/manage-tenancy-agreement/?d=${document_id}`;
    }
  };

  return (
    <div
      className="pt-6 px-[18px] rounded-lg bg-white dark:bg-darkText-primary custom-flex-col gap-6"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="custom-flex-col gap-4">
        <div className="flex items-center gap-1 font-medium">
          <p className="text-text-tertiary dark:text-darkText-1 text-base">
            Document ID:
          </p>
          <p className="text-text-secondary dark:text-darkText-2 text-sm">
            {document_id}
          </p>
        </div>
        <div className="h-[1px] border border-dashed border-brand-7 opacity-50"></div>
      </div>
      <div className="pb-6 overflow-x-auto custom-round-scrollbar">
        <div className="custom-flex-col gap-4">
          <div className="flex">
            <KeyValueList
              data={{
                "property name": property_name,
                "property ID": `${property_id}`,
                "date created": created_date,
                "No of units": `${total_unit}`,
                "document type": document_type,
                "last updated": last_updated,
              }}
              chunkSize={2}
              direction="column"
              referenceObject={{
                "property name": "",
                "property ID": "",
                "date created": "",
                "No of units": "",
                "document type": "",
                "last updated": "",
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button
              href={getRoute()}
              size="xs_normal"
              className="py-2 px-7"
            >
              manage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
