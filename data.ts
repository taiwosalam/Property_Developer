export const industryOptions = [
  "Realtors",
  "Real Estate Agent",
  "Attorneys",
  "Investors",
  "Broker",
  "Estate Agent",
  "Barristers",
  "Arbitrators",
  "Solicitors",
  "Advocates",
  "Lawyer",
  "Legal Practitioner",
  "Law Firm",
  "Real Estate Appraiser",
  "Property Analyst",
  "Facility Manager",
  "Estate Surveyor & Valuer",
  "Property Manager",
  "Contractor",
  "Land Surveyor",
  "Hotel Manager",
  "Architect",
  "Builder",
  "Developer",
  "Town Planner",
  "Civil Engineer",
  "Caretaker",
  "Quantity Surveyor",
  "Property Supervisor",
  "Real Estate Developer",
  "Real Estate Investors",
  "Property Developers",
  "Hospitality Company",
  "Joint Business",
  "Enterprise",
  "Sole Proprietorship ",
  "Real Estate Company",
];

export const titleOrQualifications = [
  "Prince",
  "Princess",
  "Alhaji",
  "Alhaja",
  "Mr",
  "Mrs",
  "Esv",
  "Esq",
  "LL.B ",
  "RSV ",
  "Anvis",
  "ANIM",
  "Dr",
  "Proff",
  "Rtp",
  "Mnitp",
  "Mnim",
  "MMP",
  "Fipman",
  "Fcicpfm",
  "TPL",
  "MBA",
  "PMP",
  "F.ASCE",
  "M.NSE",
  "F.NICE",
  "MAPM",
  "OON",
  "FNIA",
  "PPNIA",
  "PPARCON",
  "MMI",
  "AIA",
  "ENGR",
];

export interface LocalGovernments {
  [localGovernment: string]: string[];
}

// Define the structure for the states array
export interface State {
  [stateName: string]: LocalGovernments;
}

export const states: State[] = [
  {
    Oyo: {
      Afijio: ["Ilora", "Fiditi"],
      "Ibadan North": ["Agbowo", "Bodija", "Sango"],
      "Ibadan North-East": ["Monatan", "Iyana Church", "Oje"],
      " Ibadan North-West": ["Dugbe", "Onireke", "Jericho"],
      "Ibadan South-East": ["Mapo", "Orita Aperin", "Oke Ado"],
      "Ibadan South-West": ["Ring Road", "Molete", "Challenge"],
      "Ibarapa Central": ["Igbo Ora", "Idere"],
      "Ibarapa East": ["Eruwa", "Lanlate"],
      " Ibarapa North": ["Ayete", "Tapa", "Igangan"],
      Ido: ["Apata", "Omi Adio"],
    },
  },
  {
    Lagos: {
      Ikeja: ["Ikeja", "Ogba", "Alausa"],
      Surulere: ["Surulere", "Aguda", "Ijesha"],
      "Eti-Osa": ["Victoria Island", "Lekki", "Ikoyi"],
      Badagry: ["Badagry", "Mowo", "Ajara"],
    },
  },
  {
    Kano: {
      "Kano Municipal": ["Tudun Wada", "Fagge", "Sabon Gari"],
      Nasarawa: ["Kano Nasarawa", "Gidan Salanke"],
      Gwale: ["Dorayi", "Goron Dutse"],
      Dala: ["Kofar Nassarawa", "Kofar Mata"],
    },
  },
];
