import type { ServiceProviderData } from "./types";

export const serviceProviderData: ServiceProviderData = {
  id: 1,
  avatar: "/empty/avatar-1.svg",
  picture: "/empty/SampleLandlord.jpeg",
  user_tag: Math.random() < 0.5 ? "web" : "mobile",
  full_name: "John Doe",
  email: "john.doe@example.com",
  service_rendered: "Plumbing",
  personal_number: "08012345678",
  address: "123 Main St, Anytown, USA",
  state: "Lagos",
  local_government: "Ikeja",
  company_details: {
    name: "John Doe Plumbing",
    email: "john.doe@example.com",
    phone_number: "08012345678",
    address: "123 Main St, Anytown, USA",
  },
  bank_details: {
    bank_name: "Access Bank",
    account_number: "1234567890",
    account_name: "John Doe",
  },
  notes: {
    last_updated: "2021-01-01",
    write_up:
      "Hello World How are you doing today? Dont come late to work tomorrow and dont come last in your exams",
  },
  documents: [
    {
      id: 1,
      name: "FBI Report Highly Classified",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      thumbnail: "/empty/SampleLandlord.jpeg",
      document_type: "invoice",
    },
    {
      id: 2,
      name: "MI6 Report Highly Classified",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      thumbnail: "/empty/SampleLandlord2.svg",
      document_type: "invoice",
    },
    {
      id: 3,
      name: "CIA Report",
      link: "https://example.com/sample-attachment.pdf",
      date: "2021-01-01",
      thumbnail: "/empty/SampleLogo.jpeg",
      document_type: "receipt",
    },
    {
      id: 4,
      name: "NSA Report",
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
