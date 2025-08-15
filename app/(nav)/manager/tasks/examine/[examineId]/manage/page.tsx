"use client";

import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import Button from "@/components/Form/Button/button";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import TextArea from "@/components/Form/TextArea/textarea";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { SectionContainer } from "@/components/Section/section-components";
import DeleteExamineModal from "@/components/tasks/Examine/delete-examine-modal";
import { LandlordTenantInfoBox } from "@/components/Management/landlord-tenant-info-components";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import {
  examineService,
  inspectionCheckList,
  transformExamineManageData,
  updateExamine,
} from "@/app/(nav)/tasks/examine/[examineId]/manage/data";
import { IExaminePageData } from "@/app/(nav)/tasks/examine/[examineId]/manage/data";
import { AuthForm } from "@/components/Auth/auth-components";
import { toast } from "sonner";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import { useRole } from "@/hooks/roleContext";
import InfoItem from "@/app/(nav)/tasks/examine/[examineId]/manage/comp";

const ManageExaminepage = () => {
  const [examinePageData, setExaminePageData] =
    useState<IExaminePageData | null>(null);
  const params = useParams();
  const router = useRouter();
  const paramId = params?.examineId;

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [sendToLandlord, setSendToLandlord] = useState(false);
  const [sendToTenant, setSendToTenant] = useState(false);
  const [inspectionChecklist, setInspectionChecklist] = useState<{
    [key: string]: string;
  }>({});

  const [siteSummary, setSiteSummary] = useState<{ [key: string]: string }>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const { role } = useRole();

  const toToMainPage = () => {
    switch (role) {
      case "director":
        router.push(`/tasks/examine`);
        break;
      case "manager":
        router.push(`/manager/tasks/examine`);
        break;
      case "account":
        router.push(`/accountant/tasks/examine`);
        break;
      case "staff":
        router.push(`/staff/tasks/examine`);
        break;
      default:
        router.push(`/unauthorized`);
    }
  };

  const {
    data: apiData,
    loading,
    error,
    silentLoading,
    isNetworkError,
  } = useFetch<ExamineSingleDataResponse>(`/examine/${paramId}`);

  useEffect(() => {
    if (apiData) {
      const transformData = transformExamineManageData(apiData);
      setExaminePageData(transformData);
    }
  }, [apiData]);

  const handleExamineUpdate = async () => {
    if (!paramId) return;

    if (notes && notes.trim().length < 204) {
      toast.error("Please enter a note with at least 30 characters.");
      return;
    }

    // Build the checklist array
    const checklistArray = Object.entries(inspectionChecklist)
      .filter(([_, value]) => value)
      .map(([key, value]) => ({ [key]: value }));

    const summaryArray = Object.entries(siteSummary)
      .filter(([_, value]) => value)
      .map(([key, value]) => ({ [key]: value }));

    // Build the payload object
    const payload = {
      services: selectedServices,
      send_to_landlord: !!sendToLandlord,
      send_to_tenant: !!sendToTenant,
      inspection_checklist: checklistArray,
      inspection_summary: notes,
      summary: summaryArray,
      // ...add other fields as needed
    };
    try {
      setIsUpdating(true);
      const res = await updateExamine(paramId as string, payload);
      if (res) {
        toast.success("Examine updated");
        toToMainPage();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (examinePageData) {
      setSelectedServices(examinePageData?.service);
      setNotes(examinePageData?.inspection_summary_notes);
      setSendToLandlord(examinePageData?.send_to_landlord);
      setSendToTenant(examinePageData?.send_to_tenant);

      if (Array.isArray(examinePageData.inspection_checklist)) {
        const checklistObj = examinePageData.inspection_checklist.reduce(
          (acc, item) => {
            try {
              // Parse the JSON string if item is a string, otherwise use as is
              const parsed = typeof item === "string" ? JSON.parse(item) : item;
              // Merge key-value into accumulator
              Object.entries(parsed).forEach(([key, value]) => {
                acc[key] = String(value);
              });
            } catch (e) {
              // Handle malformed JSON gracefully
            }
            return acc;
          },
          {} as { [key: string]: string }
        );
        setInspectionChecklist(checklistObj);
      }
    }
  }, [examinePageData]);

  useEffect(() => {
    if (
      examinePageData?.inspection_summary &&
      Array.isArray(examinePageData.inspection_summary)
    ) {
      const summaryObj = examinePageData.inspection_summary.reduce(
        (acc, item) => {
          const [key, value] = Object.entries(item)[0];
          acc[key] = value;
          return acc;
        },
        {} as { [key: string]: string }
      );
      setSiteSummary(summaryObj);
    }
  }, [examinePageData]);

  const commonClasses =
    "py-3 px-4 text-text-secondary text-base font-normal bg-neutral-3 dark:bg-darkText-primary rounded-[4px] flex-row-reverse justify-between dark:border dark:border-gray-500";

  const commonBoxStyle: React.CSSProperties = {
    boxShadow:
      "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
  };
  const commonBoxClassName = "py-6 px-4 rounded-lg space-y-2";
  return (
    <div>
      <div className="flex flex-col gap-8">
        <BackButton>Examine Title (Rent Increase)</BackButton>
        <div className="grid md:grid-cols-1 gap-8">
          <LandlordTenantInfoBox
            className={`min-h-0 ${commonBoxClassName} w-full`}
            style={commonBoxStyle}
          >
            <div className="lg:flex lg:justify-between px-4 grid gap-y-4 grid-cols-2">
              <InfoItem label="Inspected Date:" value={examinePageData?.date} />
              <InfoItem
                label="Assigned Staff:"
                value={examinePageData?.assign_staff}
              />
              <InfoItem
                label="Property Name:"
                value={examinePageData?.property_name}
              />
              <InfoItem
                label="Branch Name:"
                value={examinePageData?.branch_name}
              />

              <div className="pb-3 max-w-lg">
                <p className="text-base font-medium text-text-tertiary dark:text-darkText-1">
                  Attached Note:
                </p>
                {examinePageData?.description && (
                  <TruncatedText>
                    <div
                      className="text-sm font-medium text-text-secondary dark:text-darkText-2 break-words whitespace-normal overflow-wrap-anywhere"
                      dangerouslySetInnerHTML={{
                        __html: examinePageData?.description,
                      }}
                    />
                  </TruncatedText>
                )}
              </div>
            </div>
          </LandlordTenantInfoBox>
        </div>
        <section>
          <AuthForm onFormSubmit={handleExamineUpdate}>
            <SectionContainer heading="Service connected to property">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                {examineService?.map((service, i) => (
                  <Checkbox
                    id={"services"}
                    name={"services"}
                    checked={selectedServices?.includes(service)}
                    onChange={(checked) => {
                      setSelectedServices((prev) => {
                        const safePrev = Array.isArray(prev) ? prev : [];
                        return checked
                          ? [...safePrev, service]
                          : safePrev.filter((s) => s !== service);
                      });
                    }}
                    value={service}
                    key={i}
                    className={commonClasses}
                  >
                    {service}
                  </Checkbox>
                ))}
              </div>
            </SectionContainer>
            <SectionContainer heading="Site Summary" className="py-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                {["Age of Building", "Construction Type", "Roof"].map(
                  (item, index) => (
                    <Input
                      placeholder="Input here"
                      id={item + index}
                      type="text"
                      className="w-full"
                      key={index}
                      label={item}
                      value={siteSummary[item] || ""}
                      onChange={(value) =>
                        setSiteSummary((prev) => ({
                          ...prev,
                          [item]: value,
                        }))
                      }
                    />
                  )
                )}
                <Select
                  id="condition"
                  label="Condition"
                  options={["Very Good", "Good", "Bad", "Poor", "Very Poor"]}
                  value={siteSummary["Condition"] || ""}
                  onChange={(value) =>
                    setSiteSummary((prev) => ({
                      ...prev,
                      Condition: value,
                    }))
                  }
                />
                {["Extension/Renovation", "Out Buildings"].map(
                  (item, index) => (
                    <Input
                      placeholder="Input here"
                      id={item + index}
                      type="text"
                      className="w-full"
                      key={index}
                      label={item}
                      value={siteSummary[item] || ""}
                      onChange={(value) =>
                        setSiteSummary((prev) => ({
                          ...prev,
                          [item]: value,
                        }))
                      }
                    />
                  )
                )}
                {["Sub Floor", "Site"].map((item, index) => (
                  <Input
                    placeholder="Input here"
                    id={item + index}
                    type="text"
                    className="w-full"
                    key={index}
                    label={item}
                    value={siteSummary[item] || ""}
                    onChange={(value) =>
                      setSiteSummary((prev) => ({
                        ...prev,
                        [item]: value,
                      }))
                    }
                  />
                ))}
                <Select
                  id="compare"
                  label="Compare To Others"
                  options={["Very Good", "Good", "Bad", "Poor", "Very Poor"]}
                  value={siteSummary["Compare To Others"] || ""}
                  onChange={(value) =>
                    setSiteSummary((prev) => ({
                      ...prev,
                      "Compare To Others": value,
                    }))
                  }
                />
              </div>
            </SectionContainer>
            <SectionContainer heading="Inspection Checklist">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                {inspectionCheckList.map((item, index) => (
                  <Select
                    key={index}
                    id={item + index}
                    label={item}
                    placeholder="Select options"
                    options={["Very Good", "Good", "Bad", "Poor", "Very Poor"]}
                    value={inspectionChecklist[item] || ""}
                    onChange={(value) => {
                      setInspectionChecklist((prev) => ({
                        ...prev,
                        [item]: value,
                      }));
                    }}
                  />
                ))}
              </div>
            </SectionContainer>
            <SectionContainer heading="">
              <div className="pb-24">
                <div className="flex gap-1">
                  <p className="text-red-600">*</p>
                  <h1 className="text-text-primary pb-3 text-xl font-medium capitalize dark:text-[#f1f1fd]">
                    Inspection Summary Notes
                  </h1>
                </div>
                <TextArea
                  id="inspection_summary"
                  value={notes}
                  onChange={(value) => setNotes(value)}
                />
              </div>
            </SectionContainer>
            <FixedFooter className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={sendToLandlord}
                  onChange={setSendToLandlord}
                  name="send_to_landlord"
                  id="send_to_landlord"
                >
                  Send to Landlord
                </Checkbox>
                <Checkbox
                  checked={sendToTenant}
                  onChange={setSendToTenant}
                  name="send_to_tenant"
                  id="send_to_tenant"
                >
                  Send to Tenant
                </Checkbox>
              </div>

              <div className="flex items-center gap-4">
                <Modal>
                  <ModalTrigger>
                    <Button
                      variant="light_red"
                      size="base_medium"
                      className="py-2 px-6"
                    >
                      Delete
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <DeleteExamineModal />
                  </ModalContent>
                </Modal>
                <Button
                  type="submit"
                  size="base_medium"
                  className="py-2 px-6"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Please wait..." : "Submit"}
                </Button>
              </div>
            </FixedFooter>
          </AuthForm>
        </section>
      </div>
    </div>
  );
};

export default ManageExaminepage;
