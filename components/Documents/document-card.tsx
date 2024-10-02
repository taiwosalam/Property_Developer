import React from "react";
import { SectionSeparator } from "../Section/section-components";
import Button from "../Form/Button/button";
import KeyValueList from "../KeyValueList/key-value-list";

const DocumentCard = () => {
  return (
    <div
      className="py-6 px-[18px] rounded-lg bg-white custom-flex-col gap-6"
      style={{
        boxShadow:
          " 0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="custom-flex-col gap-4">
        <div className="flex items-center gap-1 font-medium">
          <p className="text-text-tertiary text-base">Document ID:</p>
          <p className="text-text-secondary text-sm">134678765</p>
        </div>
        <div className="h-[1px] border border-dashed border-brand-7 opacity-50"></div>
      </div>
      <div className="custom-flex-col gap-4">
        <div className="flex">
          <KeyValueList
            data={{}}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "property name": "",
              "property ID": "",
              "date created": "",
              "No of units": "",
              "document type": "",
            }}
          />
        </div>
        <div className="flex justify-end">
          <Button href="/documents/manage-tenancy-agreement" size="xs_normal" className="py-2 px-7">
            manage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
