"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";

interface CompanySignature {
  id: number;
  company_id: number;
  name: string;
  title: string;
  professional_title: string;
  signature: string;
  created_at: string;
  updated_at: string;
}

export interface CompanySignaturesResponse {
  message: string;
  signatures: CompanySignature[];
}

const Signature = ({ noTitle }: { noTitle?: boolean }) => {
  const { data, loading, error } = useFetch<CompanySignaturesResponse>(
    "/company-signatures"
  );

  if (loading) return <p>Loading signature...</p>;
  //if (error) return <p>Error loading signature</p>;
  if (!data || data.signatures.length === 0) return null;

  return (
    <>
      {!noTitle && <p>Authorized Signature</p>}
      <div className="space-y- grid grid-cols-2 xs:flex gap-4">
        {data.signatures.map((sig) => (
          <div
            key={sig.id}
            className="custom-flex-col gap-2 text-text-quaternary dark:text-darkText-1 text-base font-medium"
          >
            <div className="flex h-[50px] w-[50px]">
              <Image
                src={sig.signature}
                alt="signature"
                height={200}
                width={200}
                className="h-full w-full object-contain"
              />
            </div>
            <p className="py-3 mt-2">
              {sig.name}
              <br />
              {sig.professional_title}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Signature;
