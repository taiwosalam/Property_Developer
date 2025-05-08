import {
  CampaignFields,
  FeatureFields,
  postCampaign,
} from "@/app/(nav)/settings/add-on/data";
import CustomTable from "../Table/table";
import { SettingsSectionTitle } from "./settings-components";
import SettingsSection from "./settings-section";
import { CustomTableProps } from "../Table/types";
import AutoResizingGrid from "../AutoResizingGrid/AutoResizingGrid";
import Input from "../Form/Input/input";
import Select from "../Form/Select/select";
import Button from "../Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import SponsorModal from "./Modals/sponsor-modal";
import Link from "next/link";
import { ChevronRight, Upload, UploadIcon } from "lucide-react";
import { useEffect, useState } from "react";
import FileInput from "../Form/FileInput/file-input";
import { PERIOD_OPTIONS } from "./subscription-components";
import FileUploadInput from "./fileInput";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { toast } from "sonner";
import { base64ToBlob } from "@/app/(nav)/settings/security/data";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import {
  CampaignHistoryResponse,
  ICampaignTable,
  transformCampaignData,
} from "./sponsor_data";

const campaignType = [
  {
    type: "mobile",
    amount: 5000,
  },
  {
    type: "web",
    amount: 3000,
  },
  {
    type: "tablet",
    amount: 2000,
  },
];

const headline = `Promote your brand, idea, or business by showcasing a banner with a clickable link across our general mobile app and website, accessible to all users on the platform. This advertising service enhances your visibility and broadens your reach by presenting your content to a wide audience across multiple devices.

To ensure optimal display quality and platform compatibility, only SVG file format is accepted for banner uploads. Please provide your banner in the following recommended dimensions: Mobile: 1080 x 1920 pixels, Tablet: 1536 x 2048 pixels and Web: 1920 x 1080 pixels.`;
export const Campaign = () => {
  const { company_id } = usePersonalInfoStore();
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [campaignName, setCampaignName] = useState("");
  const [campaignValue, setCampaignValue] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [campaignTable, setCampaignTable] = useState<ICampaignTable[] | null>(
    null
  );

  const { data: campaignData, refetch } = useFetch<CampaignHistoryResponse>(
    company_id ? `campaigns/${company_id}` : null
  );
  useRefetchOnEvent("companyCampaign", () => refetch({ silent: true }));

  useEffect(() => {
    if (campaignData) {
      const transData = transformCampaignData(campaignData);
      setCampaignTable(transData);
    }
  }, [campaignData]);

  const isFormIncomplete =
    !campaignName ||
    !campaignValue ||
    !selectedPage ||
    !selectedPeriod ||
    !uploadedFile;

  useEffect(() => {
    if (!selectedPeriod || !selectedPage) {
      setTotalAmount(0);
      return;
    }

    const periodValue = parseInt(selectedPeriod.split(" ")[0]); // Extract number from "2 months"
    const period = PERIOD_OPTIONS.find((p) => p.value === periodValue);
    const page = campaignType.find((p) => p.type === selectedPage);

    if (period && page) {
      const baseAmount = page.amount * period.value;
      const discount = period.discount || 0;
      const discountedAmount = baseAmount - baseAmount * discount;
      setTotalAmount(discountedAmount);
    }
  }, [selectedPeriod, selectedPage]);
  const table_style_props: Partial<CustomTableProps> = {
    tableHeadClassName: "h-[45px]",
  };

  const handlePostCampaign = async () => {
    if (!company_id) return;

    const monthString = selectedPeriod.split(" ")[0];

    try {
      const formData = new FormData();

      formData.append("period", String(Number(monthString)));
      formData.append("amount", String(totalAmount));
      //formData.append("company_id", company_id);
      formData.append("link", `https://${campaignValue}`);
      formData.append("name", campaignName);
      formData.append("type", selectedPage);

      if (uploadedFile) {
        if (uploadedFile.type !== "image/svg+xml") {
          toast.error("Only SVG files are allowed");
          return;
        }

        if (uploadedFile.size > 1024 * 1024) {
          toast.error("File size must be less than 1MB");
          return;
        }

        formData.append("attachment", uploadedFile);
      }

      const res = await postCampaign(formData, company_id);
      if (res) {
        toast.success("Campaign sent successfully");
        return true;
      }
    } catch (error) {}
  };

  return (
    <>
      <SettingsSection title="Campaign">
        <div className="custom-flex-col gap-6">
          <SettingsSectionTitle
            title="Advertise with a Banner on Our Platform"
            desc={headline}
          />
          <div className="flex gap-3 items-center">
            <div className="flex gap-6 items-center pb-8"></div>
          </div>
        </div>

        <div className="mb-10" id="campaign">
          <AutoResizingGrid minWidth={400}>
            <Input
              id="campaign_name"
              label="campaign name"
              placeholder="Write here"
              onChange={(val) => setCampaignName(val)}
            />
            <Input
              id="campaign_link"
              label="campaign link"
              value={campaignValue}
              onChange={(val) => setCampaignValue(val)}
              prefix="https://"
            />

            <FileUploadInput
              required
              id="upload_campaign"
              label="upload campaign"
              placeholder="SVG format only"
              sizeUnit="MB"
              size={2}
              onChange={(file) => setUploadedFile(file)}
            />
            {/* <FileInput
              required
              id="upload_campaign"
              label="upload campaign"
              placeholder="SVG format only"
              buttonName="Document"
              fileType="SVG"
              sizeUnit="MB"
              size={2}
              hiddenInputClassName="setup-f required w-full"
              settingsPage={true}
             
              endAdornment={<UploadIcon />} */}

            <Select
              id="pages"
              className=""
              options={campaignType.map((option) => ({
                value: option.type,
                label: `${option.type} - ₦${option.amount.toLocaleString()}`,
              }))}
              placeholder="select options"
              label="campaign type"
              value={selectedPage}
              onChange={(value) => setSelectedPage(value)}
              renderValue={(selected) => {
                const option = campaignType.find(
                  (opt) => opt.type === selected
                );
                return option
                  ? `${option.type} - ₦${option.amount.toLocaleString()}`
                  : "";
              }}
            />
            <Select
              className=""
              id="period"
              options={PERIOD_OPTIONS.map((option) => ({
                value: `${option.value} ${
                  option.value === 1 ? "month" : "months"
                }`,
                label: `${option.label}${
                  option.discount
                    ? ` (-${(option.discount * 100).toFixed(1)}%)`
                    : ""
                }`,
              }))}
              placeholder="Select period"
              label="Period"
              value={selectedPeriod}
              onChange={(value) => setSelectedPeriod(value)}
              renderValue={(selected) => {
                if (!selected) return "";
                const periodValue = parseInt(selected.split(" ")[0]);
                const option = PERIOD_OPTIONS.find(
                  (opt) => opt.value === periodValue
                );
                return option
                  ? `${option.label}${
                      option.discount
                        ? ` (-${(option.discount * 100).toFixed(1)}%)`
                        : ""
                    }`
                  : "";
              }}
            />
            <Input
              id="amount"
              className="focus:border-none focus-within:border-none focus:outline-none focus:ring-0 active:border-none hover:border-none"
              label="Amount"
              value={`₦${totalAmount.toLocaleString()}`}
              readOnly
              style={{ outline: "none" }}
            />
          </AutoResizingGrid>
          <Modal>
            <ModalTrigger>
              <Button
                variant="change"
                size="xs_normal"
                className="py-2 px-3 mt-8 w-0"
                disabled={isFormIncomplete}
              >
                Activate
              </Button>
            </ModalTrigger>
            <ModalContent>
              <SponsorModal
                count={parseInt(selectedPeriod)}
                cost={totalAmount / parseInt(selectedPeriod)}
                onSubmit={handlePostCampaign}
              />
            </ModalContent>
          </Modal>
        </div>

        <div className="flex justify-between mb-4">
          <h2 className="text-text-primary dark:text-white text-lg font-medium">
            Campaign History
          </h2>
          <Link
            href="/settings/subscription/sponsors"
            className="flex items-center gap-1"
          >
            <Link
              href={"/reports/adds-on-campaign"}
              className="text-text-label dark:text-darkText-1"
            >
              See all
            </Link>
            <ChevronRight color="#5A5D61" size={16} />
          </Link>
        </div>

        <CustomTable
          data={campaignTable ? campaignTable?.slice(0, 3) : []}
          fields={CampaignFields}
          {...table_style_props}
        />
      </SettingsSection>
    </>
  );
};
