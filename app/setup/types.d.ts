// Define interfaces for nested structures first

export interface CompanyDetails {
  registrationDate: string;
  cacCertificate: File | null;
  industry: string;
  membershipCertificate: File | null;
}

export interface DirectorDetails {
  profilePicture: File | null;
  fullName: string;
  titleOrQualification: string;
  yearsInBusiness: number;
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
