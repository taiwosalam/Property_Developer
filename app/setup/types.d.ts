// Define interfaces for nested structures first

export interface CompanyDetails {
  registrationDate: string;
  cacNumber: string;
  membershipNumber: string;
  cacCertificate: File | null;
  industry: string;
  membershipCertificate: File | null;
  headOfficeAddress: string;
  utilityDate: string;
  utilityDocument: File | null;
}

export interface DirectorDetails {
  profilePicture: File | null;
  fullName: string;
  titleOrQualification: string;
  yearsInBusiness: number | null;
  aboutDirector: string;
  phoneNumber: string;
  altEmail: "";
}

// Main form data interface
export interface SetupFormData {
  companyType: string;
  companyName: string;
  referralId: string;
  companyDetails: CompanyDetails;
  companyMobileNumber: string[]; // Array of phone numbers
  companyLogo: File | null;
  directorDetails: DirectorDetails;
}
