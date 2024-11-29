"use client";

import { useState, useEffect } from "react";

import type { TenantData } from "@/app/(nav)/management/tenants/types";
import type { LandlordPageData } from "@/app/(nav)/management/landlord/types";

export const hardcodedTenantData = {
  id: 1,
  picture: "/empty/SampleLandlord.jpeg",
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  user_tag: Math.random() > 0.5 ? "web" : "mobile",
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
  notes: {
    last_updated: "22/12/2022",
    write_up:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. building, is a residential property that living read more. They want to work with their budget in booking an appointment. They wants to ease themselves the stress having to que, and also reduce the time spent searching for something new.for something new. A multi-family home, also know as a duplex, triplex, or multi-unit building, is a residential property that living read more. They want to work with their budget in booking an appointment. ime spent searching",
  },
  documents: [
    {
      id: 1,
      name: "Invoice 1",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      thumbnail: "/empty/SampleLandlord.jpeg",
      document_type: "invoice",
    },
    {
      id: 2,
      name: "Invoice 2",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      thumbnail: "/empty/SampleLandlord2.svg",
      document_type: "invoice",
    },
    {
      id: 3,
      name: "Receipt 1",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      thumbnail: "/empty/SampleLogo.jpeg",
      document_type: "receipt",
    },
    {
      id: 4,
      name: "Receipt 2",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      thumbnail: "/empty/SampleProperty.jpeg",
      document_type: "receipt",
    },

    {
      id: 5,
      name: "Classified MI6 Info",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      document_type: "other document",
    },
    {
      id: 6,
      name: "Highly Classified FBI Database",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      document_type: "other document",
    },
  ],
};

export const hardcodedLandlordData = {
  picture: "/empty/SampleLandlord.jpeg",
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  phone_number: "1234567890",
  user_tag: Math.random() > 0.5 ? "web" : "mobile",
  id: 1,
  gender: "male",
  type: "Corporate Landlord",
  contact_address: {
    address: "123 Main St",
    city: "uratta",
    state: "abia",
    local_govt: "aba north",
  },
  others: {
    type: "full-time",
    note: "Some note",
    occupation: "employed",
    family_type: "nuclear",
  },
  guarantor1: {
    name: "Jane Doe",
    relationship: "father",
    email: "jane.doe@example.com",
    phone_number: "+44987654321",
    address: "456 Elm St",
  },
  guarantor2: {
    name: "Jane Doe",
    relationship: "father",
    email: "jane.doe@example.com",
    phone_number: "+44987654321",
    address: "456 Elm St",
  },
  next_of_kin: {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    address: "456 Elm St",
    phone: "+234987654321",
    relationship: "sister",
  },
  bank_details: {
    bank_name: "Suntrust Bank",
    wallet_id: "wallet123",
    account_name: "John Doe",
    account_number: "123456789",
  },
  notes: {
    last_updated: "22/12/2022",
    write_up:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. building, is a residential property that living read more. They want to work with their budget in booking an appointment. They wants to ease themselves the stress having to que, and also reduce the time spent searching for something new.for something new. A multi-family home, also know as a duplex, triplex, or multi-unit building, is a residential property that living read more. They want to work with their budget in booking an appointment. ime spent searching",
  },
  documents: [
    {
      id: 1,
      name: "Invoice 1",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      thumbnail: "/empty/SampleLandlord.jpeg",
      document_type: "invoice",
    },
    {
      id: 2,
      name: "Invoice 2",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      thumbnail: "/empty/SampleLandlord2.svg",
      document_type: "invoice",
    },
    {
      id: 3,
      name: "Receipt 1",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      thumbnail: "/empty/SampleLogo.jpeg",
      document_type: "receipt",
    },
    {
      id: 4,
      name: "Receipt 2",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      thumbnail: "/empty/SampleProperty.jpeg",
      document_type: "receipt",
    },

    {
      id: 5,
      name: "Classified MI6 Info",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      document_type: "other document",
    },
    {
      id: 6,
      name: "Highly Classified FBI Database",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      document_type: "other document",
    },
  ],
  properties_managed: [],
};
