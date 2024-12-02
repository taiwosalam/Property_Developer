// Images
import Avatar4 from "@/public/empty/avatar-4.svg";

// Imports
import Picture from "../Picture/picture";
import { secondaryFont } from "@/utils/fonts";
import { SectionSeparator } from "../Section/section-components";

const WalletBenefiary: React.FC<{
  name: string;
  picture: string;
  wallet_id: string;
  onClick?: () => void;
}> = ({ name, picture, wallet_id, onClick }) => {
  return (
    <div
      className="custom-flex-col gap-2"
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="flex items-center gap-2">
        <Picture src={picture || Avatar4} alt="profile picture" size={33} />
        <div className={`custom-flex-col ${secondaryFont.className}`}>
          <p className="text-text-primary dark:text-white text-base font-medium capitalize">
            {name}
          </p>
          <p className="text-text-label dark:text-darkText-1 text-xs font-normal">
            Wallet ID: {wallet_id}
          </p>
        </div>
      </div>
      <SectionSeparator />
    </div>
  );
};

export default WalletBenefiary;
