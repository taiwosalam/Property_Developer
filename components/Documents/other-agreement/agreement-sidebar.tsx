import { formatPhoneNumbers } from "@/app/(nav)/community/agent-forum/data";
import {
  AgreementEmailIcon,
  AgreementLocationIcon,
  AgreementPhoneIcon,
} from "@/public/icons/icons";
import { useGlobalStore } from "@/store/general-store";

const AgreementSidebarInfo = () => {
  const currentCompanyData = useGlobalStore.getState()?.profileSettingsData;
  const phone = formatPhoneNumbers(
    currentCompanyData?.companyData?.phone_number
  );
  const email = currentCompanyData?.companyData?.email ?? "";
  const address = `${currentCompanyData?.companyData?.head_office_address}, ${currentCompanyData?.companyData?.city}, ${currentCompanyData?.companyData?.state}`;

  return (
    <div className="w-[10%] flex items-center justify-center text-black min-h-[65vh]">
      <div className="transform -rotate-90 whitespace-pre text-center text-xs leading-5 space-y-2">
        {/* Use smaller icons and inline text to preserve compact width */}
        <div className="flex items-center justify-center space-x-1">
          <span className="text-brand-9">
            <AgreementPhoneIcon size={14} />
          </span>
          <span>{phone}</span>
        </div>
        <div className="flex items-center justify-center space-x-1">
          <span className="text-brand-9">
            <AgreementEmailIcon size={14} />
          </span>
          <span>{email}</span>
        </div>
        <div className="flex items-center justify-center space-x-1 max-w-[150px] mx-auto">
          <span className="text-brand-9">
            <AgreementLocationIcon size={14} />
          </span>
          <span className="text-[10px]">{address}</span>
        </div>
      </div>
    </div>
  );
};

export default AgreementSidebarInfo;
