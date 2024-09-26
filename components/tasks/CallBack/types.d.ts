export interface userDeailItemsProp {
  label: string;
  value: string;
}

export interface RequestCallBackCardProps {
  userDetails: UserDetailItem[];
  userName: string;
  requestDate: string;
  requestId: string;
  status: string;
  pictureSrc: string;
  phoneNumber: string;
  propertyName: string;
  propertyAddress: string;
  branch: string;
  accountOfficer: string;
  resolvedBy: string;
  resolvedDateTime: string;
}

export interface CallRequestModalProps {
  requesterName: string;
  requesterPicture: string | StaticImageData;
  requestDate: string;
  phoneNumber: string;
  propertyName: string;
  propertyAddress: string;
  branch: string;
  accountOfficer: string;
  resolvedBy: string;
  resolvedDateTime: string;
}
