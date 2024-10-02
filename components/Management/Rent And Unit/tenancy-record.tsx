import { ChevronLeft } from "@/public/icons/icons";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DetailItem } from "../detail-item";
import {
  LandlordTenantInfoDocument,
  LandlordTenantInfoSection,
} from "../landlord-tenant-info-components";
import Picture from "@/components/Picture/picture";

const TenancyRecord = () => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  return (
    <div className="bg-white shadow p-6 space-y-4">
      <div className="w-full flex items-center justify-between h-[25px]">
        <h6 className="text-[16px] font-bold text-[#1E3A8A]">Tenancy Record</h6>
        {!isCollapsibleOpen && (
          <div
            className="rounded bg-[#0033C4] py-2 px-8 cursor-pointer transition-transform duration-500 hover:scale-105"
            onClick={() => {
              setIsCollapsibleOpen(true);
            }}
          >
            <div className="-rotate-90">
              <ChevronLeft fill="white" />
            </div>
          </div>
        )}
      </div>
      <div className="h-[2px] w-full bg-[#C0C2C8]"></div>
      <div>
        <div className="w-full flex items-center gap-4 py-4">
          <div className="col-span-2 grid grid-cols-2 gap-y-4 flex-1">
            <DetailItem label="Name" value="Abimbola Adedeji" />
            <DetailItem label="Email" value="abimbola adedeji@gmail.com" />
            <DetailItem label="Phone Number Deposit" value="+2348065558146" />
            <DetailItem
              label="Period/Duration"
              value="02/10/2013 - 01/10/2024"
            />
            <DetailItem label="Renewal Rent" value="₦300,000" />
            <DetailItem label="Renewal Package" value="₦300,000" />
          </div>
          <div className="flex justify-end items-center relative w-[200px] h-[200px]">
            <Image
              src="/empty/SampleLandlord.jpeg"
              alt="Property"
              fill
              sizes="auto"
              className="rounded-lg"
            />
            <div className="absolute top-7 right-7 bg-blue-50 rounded py-2 px-3 flex items-center space-x-2">
              <CameraIcon width={14} height={14} />
              <span className="text-sm">+13</span>
            </div>
          </div>
        </div>
        {/* Collapsible */}
        <motion.div
          initial={false}
          animate={{ height: isCollapsibleOpen ? "auto" : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <AnimatePresence>
            {isCollapsibleOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-5"
              >
                <div className="w-full space-y-4">
                  <h6 className="text-text-quaternary text-3xl font-semibold">
                    Tenancy Records
                  </h6>
                  <div className="h-[1px] w-full bg-[#C0C2C8]"></div>
                </div>
                <LandlordTenantInfoSection title="statement">
                  <div className="rounded-lg w-full overflow-x-scroll no-scrollbar">
                    <table className="dash-table">
                      <colgroup>
                        <col className="w-[72px]" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th></th>
                          <th>name</th>
                          <th>payment ID</th>
                          <th>details</th>
                          <th>credit</th>
                          <th>debit</th>
                          <th>date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array(5)
                          .fill(null)
                          .map((_, idx) => (
                            <tr key={idx}>
                              <td>
                                <Picture
                                  src="/empty/SampleLandlord.jpeg"
                                  alt="profile picture"
                                  size={40}
                                  rounded
                                />
                              </td>
                              <td>
                                <p>Abimbola Adedeji</p>
                              </td>
                              <td>
                                <p>22132876554444</p>
                              </td>
                              <td>
                                <p>Rent cost: Start date: Sept 22, 2020</p>
                              </td>
                              <td>
                                <p className="text-status-success-3">₦ 100,000</p>
                              </td>
                              <td>
                                <p className="text-status-error-primary">
                                  --- ---
                                </p>
                              </td>
                              <td>
                                <p>12/12/12</p>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </LandlordTenantInfoSection>
                <LandlordTenantInfoSection title="shared documents">
                  <LandlordTenantInfoSection minimized title="invoice">
                    <div className="flex flex-wrap gap-4">
                      {Array(4)
                        .fill(null)
                        .map((_, idx) => (
                          <LandlordTenantInfoDocument key={idx} />
                        ))}
                    </div>
                  </LandlordTenantInfoSection>
                  <LandlordTenantInfoSection minimized title="receipts">
                    <div className="flex flex-wrap gap-4">
                      {Array(3)
                        .fill(null)
                        .map((_, idx) => (
                          <LandlordTenantInfoDocument key={idx} />
                        ))}
                    </div>
                  </LandlordTenantInfoSection>
                  <LandlordTenantInfoSection minimized title="other documents">
                    <div className="flex flex-wrap gap-4">
                      {Array(2)
                        .fill(null)
                        .map((_, idx) => (
                          <LandlordTenantInfoDocument key={idx} />
                        ))}
                    </div>
                  </LandlordTenantInfoSection>
                </LandlordTenantInfoSection>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        {/* collapsible */}
        <div
          className={`w-full flex items-center justify-between h-[25px] mt-4 ${
            !isCollapsibleOpen ? "hidden" : ""
          }`}
        >
          <span></span>
          <div
            className="rounded bg-[#0033C4] py-2 px-8 cursor-pointer transition-transform duration-500 hover:scale-105"
            onClick={() => setIsCollapsibleOpen(false)}
          >
            <div className="rotate-90">
              <ChevronLeft fill="white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenancyRecord;
