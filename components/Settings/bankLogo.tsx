import useBankLogo from "@/app/(nav)/bank";
import Image from "next/image";
import React from "react";

const BankLogo = ({ slug }: { slug: string }) => {
  const logo = useBankLogo({ slug });

  return (
    <div>
      <Image
        src={logo as string}
        alt={`Logo of ${slug}`}
        style={{ width: 100, height: 100 }}
        width={100}
        height={100}
      />
    </div>
  );
};

export default BankLogo;
