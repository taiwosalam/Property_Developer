"use client";

import { useState, useEffect } from "react";

import type { TenantData } from "@/app/(nav)/management/tenants/types";

export const MockFunction = () => {
  const [data, setData] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate a delay before setting the hardcoded data
    const timer = setTimeout(() => {
      const hardcodedData: TenantData = {
        avatar: "/empty/avatar-1.svg",
        picture: "/empty/SampleLandlord.jpeg",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        user_tag: "web",
        phone_number: "1234567890",
        gender: "male",
        birthdate: "1990-01-01",
        religion: "Christianity",
        marital_status: "single",
        contact_address: {
          state: "abia",
          local_govt: "aba north",
          city: "uratta",
          address: "123 Main St",
        },
        guarantor1: {
          name: "Jane Doe",
          email: "jane.doe@example.com",
          address: "456 Elm St",
          phone_number: "+44987654321",
          relationship: "father",
        },
        guarantor2: {
          name: "Joy Skaa",
          email: "joy.ska@example.com",
          address: "456 Elm St",
          phone_number: "+44987654321",
          relationship: "mother",
        },
        next_of_kin: {
          name: "Jane Doe",
          email: "jane.doe@example.com",
          address: "456 Elm St",
          phone: "+234987654321",
          relationship: "sister",
        },
        others: {
          type: "full-time",
          note: "Some note",
          occupation: "employed",
          family_type: "nuclear",
        },
        bank_details: {
          bank_name: "Bank of Example",
          wallet_id: "wallet123",
          account_name: "John Doe",
          account_number: "123456789",
        },
        attachment: "",
      };

      setData(hardcodedData);
      setLoading(false);
    }, 2000); // Simulate a 2-second delay

    return () => clearTimeout(timer);
  }, []);

  return { data, tenantId: "1", loading, error };
};
