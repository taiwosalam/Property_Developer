"use client";
import { useEffect, useRef, useState } from "react";
import Button from "../Form/Button/button";
import AgreementLayout from "./other-agreement/agreement-preset";
import { ApplicationForm } from "./other-agreement/application-form";
import Guarantor1 from "./other-agreement/guarantor1";
import Guarantor2 from "./other-agreement/guarantor2";
import useMultiPageExport from "@/hooks/useMultipageExport";
import { ManagemenApplicationForm } from "./other-agreement/management-form";
import { ManagemenApplicationForm2 } from "./other-agreement/management-form-2";
import { ManagemenApplicationForm3 } from "./other-agreement/management-form-3";
import FullPageLoader from "../Loader/start-rent-loader";
import { useGlobalStore } from "@/store/general-store";
export interface OtherAgreementDocumentOption {
  title: string;
  value: string;
  description: string;
}

const OtherAgreementDocument = ({
  selectedOption,
}: {
  selectedOption: OtherAgreementDocumentOption;
}) => {
  const setGlobalInfoStore = useGlobalStore(
    (state) => state.setGlobalInfoStore
  );
  const { title, value, description } = selectedOption;
  const [isLoading, setIsLoading] = useState(true);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const { handleDownload, handlePrint, loading } = useMultiPageExport([
    page1Ref,
    page2Ref,
    page3Ref,
  ]);

  // Simulate loading until content is rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <FullPageLoader />; // Show a loading indicator while content is loading
  }

  const IS_TENANCY_APPLICATION_FORM = value === "tenancy_application_form";

  return IS_TENANCY_APPLICATION_FORM ? (
    <div className="first w-[70%] h-[80vh] bg-white custom-round-scrollbar custom-flex-col overflow-y-auto ">
      <div ref={page1Ref}>
        <AgreementLayout>
          <ApplicationForm />
        </AgreementLayout>
      </div>
      <div ref={page2Ref}>
        <AgreementLayout>
          <Guarantor1 />
        </AgreementLayout>
      </div>
      <div ref={page3Ref}>
        <AgreementLayout>
          <Guarantor2 />
        </AgreementLayout>
      </div>
      <div className="agreement-preview-footer justify-between items-center w-full flex gap-4 p-5">
        <div className="flex gap-4 w-full">
          <Button
            type="button"
            size="custom"
            variant="border"
            onClick={() => setGlobalInfoStore("openDocumentModal", false)}
            className="px-8 py-2"
          >
            Close
          </Button>
        </div>
        <div className="flex gap-4 items-center justify-end w-full">
          <Button
            type="button"
            onClick={handleDownload}
            size="custom"
            disabled={loading}
            className="px-8 py-2"
            variant="sky_blue"
          >
            {loading ? "Preparing..." : "Download"}
          </Button>

          <Button
            onClick={handlePrint}
            type="button"
            className="px-8 py-2"
            disabled={loading}
          >
            {loading ? "Preparing..." : "Print"}
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div className="first w-[70%] h-[80vh] bg-white custom-round-scrollbar custom-flex-col overflow-y-auto ">
      <div ref={page1Ref}>
        <AgreementLayout>
          <ManagemenApplicationForm />
        </AgreementLayout>
      </div>
      <div ref={page2Ref}>
        <AgreementLayout>
          <ManagemenApplicationForm2 />
        </AgreementLayout>
      </div>
      <div ref={page3Ref}>
        <AgreementLayout>
          <ManagemenApplicationForm3 />
        </AgreementLayout>
      </div>
      <div className="agreement-preview-footer justify-between items-center w-full flex gap-4 p-5">
        <div className="flex gap-4 w-full">
          <Button
            type="button"
            size="custom"
            variant="border"
            onClick={() => setGlobalInfoStore("openDocumentModal", false)}
            className="px-8 py-2"
          >
            Close
          </Button>
        </div>
        <div className="flex gap-4 items-center justify-end w-full">
          <Button
            type="button"
            onClick={handleDownload}
            size="custom"
            disabled={loading}
            className="px-8 py-2"
            variant="sky_blue"
          >
            {loading ? "Preparing..." : "Download"}
          </Button>

          <Button
            onClick={handlePrint}
            type="button"
            className="px-8 py-2"
            disabled={loading}
          >
            {loading ? "Preparing..." : "Print"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtherAgreementDocument;
