import { useRef } from "react";
import Button from "../Form/Button/button";
import AgreementLayout from "./other-agreement/agreement-preset";
import { ApplicationForm } from "./other-agreement/application-form";
import Guarantor1 from "./other-agreement/guarantor1";
import Guarantor2 from "./other-agreement/guarantor2";
import useMultiPageExport from "@/hooks/useMultipageExport";

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
  const { title, value, description } = selectedOption;
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);
  const { handleDownload, handlePrint } = useMultiPageExport([
    page1Ref,
    page2Ref,
    page3Ref,
  ]);

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
      <div className="agreement-preview-footer flex gap-4 p-5">
        <Button
          type="button"
          onClick={handleDownload}
          //   onClick={() => handleDownload(unitName)}
          size="custom"
          className="agreement-preview-download-button"
          variant="sky_blue"
          //   disabled={isDownloading}
        >
          Download
        </Button>
        <Button onClick={handlePrint} type="button" className="px-8 py-2">
          Print
        </Button>
      </div>
    </div>
  ) : (
    <AgreementLayout>
      <div>other form</div>
    </AgreementLayout>
  );
};

export default OtherAgreementDocument;
