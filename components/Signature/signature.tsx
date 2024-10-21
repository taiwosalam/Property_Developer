import React from "react";
import Image from "next/image";

// Images
import SignatureImage from "@/public/accounting/signature.svg";

const Signature = () => {
  return (
    <div className="custom-flex-col gap-2 text-text-quaternary text-base font-medium">
      <p>Authorized Signature </p>
      <div className="flex">
        <Image src={SignatureImage} alt="signature" height={60} />
      </div>
      <p>
        ESQ John Doe
        <br />
        Legal Practitioner
      </p>
    </div>
  );
};

export default Signature;
