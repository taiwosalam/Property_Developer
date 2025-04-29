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

const Signature = () => {
  const { data, loading, error } = useFetch<CompanySignaturesResponse>(
    "/company-signatures"
  );

  if (loading) return <p>Loading signature...</p>;
  //if (error) return <p>Error loading signature</p>;
  if (!data || data.signatures.length === 0) return null;

  return (
    <>
      <p>Authorized Signature</p>
      <div className="space-y- flex gap-4">
        {data.signatures.map((sig) => (
          <div
            key={sig.id}
            className="custom-flex-col gap-2 text-text-quaternary dark:text-darkText-1 text-base font-medium"
          >
            <div className="flex">
              <Image
                src={sig.signature}
                alt="signature"
                height={60}
                width={150} // Adjust width as needed
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
