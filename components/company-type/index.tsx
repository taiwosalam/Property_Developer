import Image from "next/image";
import { companyTypeProps } from "./types";

export default function CompanyType({
  icon,
  name,
  description,
}: companyTypeProps) {
  return (
    <div>
      <Image
        src={`/icons/${icon}`}
        alt="icon"
        width="24"
        height='24'
      />
      <p>{name}</p>
      <p>{description}</p>
    </div>
  );
}
