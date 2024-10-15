"use client";

import { useState, useEffect } from "react";

import { TenantData } from "@/app/(nav)/management/tenants/types";

export const MockFunction = () => {
  const [data, setData] = useState<TenantData | null>(null);

  useEffect(() => {
    // Simulate a delay before setting the hardcoded data
    const timer = setTimeout(() => {
      const hardcodedData: TenantData = {
        avatar: "",
        picture: "",
        name: "John Doe",
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
        guarantor: {
          name: "Jane Doe",
          email: "jane.doe@example.com",
          address: "456 Elm St",
          phone_number: "+44987654321",
          relationship: "father",
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
    }, 2000); // Simulate a 2-second delay

    return () => clearTimeout(timer);
  }, []);

  return { data, tenantId: "1" };
};
