"use client";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import DateInput from "@/components/Form/DateInput/date-input";
import { DeleteIconX } from "@/public/icons/icons";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import {
  Modal,
  ModalContent,
  ModalTrigger,
  useModal,
} from "@/components/Modal/modal";
import AccountingTitleSection from "@/components/Accounting/accounting-title-section";
import ExportPageHeader from "@/components/reports/export-page-header";
import DeleteExpenseModal from "@/components/Accounting/expenses/delete-expense-modal";
import { empty } from "@/app/config";
import BackButton from "@/components/BackButton/back-button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { SectionSeparator } from "@/components/Section/section-components";
import ModalPreset from "@/components/Modal/modal-preset";
import { currencySymbols } from "@/utils/number-formatter";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { format } from "date-fns";
import DeleteItemWarningModal from "@/components/Accounting/expenses/delete-item-warning-modal";
import useFetch from "@/hooks/useFetch";
import {
  addPayment,
  deductPayment,
  deleteExpense,
  expenseManageTableData,
  expenseManageTableFields,
  ManageExpenseApiResponse,
  ManageExpensePageData,
  transformManageExpenseData,
} from "./data";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useRole } from "@/hooks/roleContext";
import { sampleUser } from "../../../../application/data";
import UserProfileCard from "@/components/Management/Rent And Unit/application-user-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import { SearchBar } from "@/components/tasks/vehicles-record/components";
import Select from "@/components/Form/Select/select";
import MultiSelectObj from "@/components/Form/MultiSelect/multi-select-object";
import CustomTable from "@/components/Table/table";

const ManageExpenses = () => {
  const router = useRouter();
  // const { setIsOpen } = useModal()
  const { expenseId } = useParams();
  const { role } = useRole();
  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [reqLoading, setReqLoading] = useState(false);
  const CURRENCY_SYMBOL = currencySymbols.naira;
  const [pageData, setPageData] = useState<ManageExpensePageData | null>(null);
  const [payments, setPayments] = useState<{ title: string; amount: number }[]>(
    pageData?.payments || []
  );
  const [deductions, setDeductions] = useState<
    { date: Dayjs; amount: number }[]
  >(pageData?.deductions || []);
  const { data, error, loading, refetch } = useFetch<ManageExpenseApiResponse>(
    `/expenses/${expenseId}`
  );
  useRefetchOnEvent("fetch-expenses", () => refetch({ silent: true }));

  useEffect(() => {
    if (data) {
      setPageData(transformManageExpenseData(data));
    }
  }, [data]);

  useEffect(() => {
    if (pageData && pageData.payments) {
      setPayments(pageData.payments);
    }
  }, [pageData]);

  // Update deductions when pageData changes
  useEffect(() => {
    if (pageData?.deductions) {
      setDeductions(pageData.deductions);
    }
  }, [pageData]);

  const handleAddPaymentClick = async () => {
    if (paymentTitle && paymentAmount) {
      // Remove commas and parse the amount as a float
      const parsedAmount = parseFloat(paymentAmount.replace(/,/g, ""));
      if (!isNaN(parsedAmount)) {
        setPayments([
          ...payments,
          { title: paymentTitle, amount: parsedAmount },
        ]);
        setPaymentTitle("");
        setPaymentAmount("");
      }

      const payload = {
        amount: parsedAmount,
        payment_title: paymentTitle,
      };
      console.log(paymentTitle, paymentAmount);
      try {
        setReqLoading(true);
        const res = await addPayment(
          objectToFormData(payload),
          Number(expenseId)
        );
        if (res) {
          toast.success("Payment Added successfully");
          window.dispatchEvent(new Event("fetch-expenses"));
        }
      } catch (error) {
        toast.error("Failed to add payment. Please try again!");
      } finally {
        setReqLoading(false);
      }
    }
  };

  const getRoute = () => {
    switch (role?.trim()) {
      case "director":
        router.push("/accounting/expenses");
        break;
      case "manager":
        router.push("/manager/accounting/expenses");
        break;
      case "account":
        router.push("/accountant/accounting/expenses");
        break;
      case "staff":
        router.push("/manager/accounting/expenses");
        break;
      default:
        router.push("/accountant/accounting/expenses");
        break;
    }
  };

  const handleDeletePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const totalExpenses = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const [deductionDate, setDeductionDate] = useState<Dayjs | null>(null);
  const [deductionAmount, setDeductionAmount] = useState<string>("");

  const handleDeductClick = async () => {
    if (deductionDate && deductionAmount) {
      const parsedAmount = parseFloat(deductionAmount.replace(/,/g, ""));
      if (!isNaN(parsedAmount)) {
        setDeductions([
          ...deductions,
          { date: deductionDate, amount: parsedAmount },
        ]);
        setDeductionDate(null);
        setDeductionAmount("");
      }

      const payload = {
        amount: parsedAmount,
        date: dayjs(deductionDate).format("YYYY-MM-DD"),
      };
      // console.log("deduction", payload)
      try {
        setReqLoading(true);
        const res = await deductPayment(
          objectToFormData(payload),
          Number(expenseId)
        );
        if (res) {
          toast.success("Deducted successfully");
          window.dispatchEvent(new Event("fetch-expenses"));
        }
      } catch (error) {
        toast.error("Failed to deduct payment. Please try again!");
      } finally {
        setReqLoading(false);
      }
    }
  };

  const handleDeleteDeduction = (index: number) => {
    setDeductions(deductions.filter((_, i) => i !== index));
  };

  const handleDeleteExpense = async () => {
    const paymentId = pageData?.expenseDetails?.paymentId || expenseId;
    if (!paymentId) return toast.warning("Cannot Find Expense ID");
    // setDeductions(deductions.filter((_, i) => i !== index));
    try {
      setReqLoading(true);
      const res = await deleteExpense(Number(paymentId));
      if (res) {
        toast.success("Expense deleted successfully");
        router.push("/accounting/expenses");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReqLoading(false);
    }
  };

  const totalDeductions = deductions.reduce(
    (total, deduction) => total + deduction.amount,
    0
  );

  const clientOptionsMenu = [
    {
      label: "Client 1",
      value: "client_1",
    },
    {
      label: "Client 2",
      value: "client_2",
    },
  ];

  const unitOptionsMenu = [
    {
      label: "Unit 1",
      value: "unit_11",
    },
    {
      label: "Unit 2",
      value: "unit_2",
    },
  ];

  const totalBalance = totalExpenses - totalDeductions;

  // if (loading) return <PageCircleLoader />;
  // if (error) return <div>Error loading expense data.</div>;
  // if (!pageData) return <div>No data available.</div>;

  return (
    <div className="custom-flex-col gap-10 pb-[150px] sm:pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton>Manage Expenses</BackButton>
        <ExportPageHeader />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{
              "payment id": "6387889938",
              "property name": "Harmony Estate",
              "account officer": "Mr Ajadi",
              "client name": "Dupe Ololade",
              date: "29th July 2003",
              description:
                "Here's a full description of expenses form 29th of July",
            }}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "payment id": "",
              "property name": "",
              "account officer": "",
              "client name": "",
              date: "",
              description: "",
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left Section */}
          <div className="lg:col-span-3 space-y-8 py-10 mt-16">
            <AutoResizingGrid>
              <div className="space-y-6">
                <Select
                  id="client"
                  label={`Client Name`}
                  options={clientOptionsMenu}
                  //disabled={propertiesLoading}
                />
                <MultiSelectObj
                  id="units"
                  options={unitOptionsMenu}
                  label="Unit ID"
                  className="unit-selection-dropdown max-w-[300px]"
                  disabled={true}
                />
              </div>

              <div className="space-y-6">
                <Input id="" label="Total Expenses (₦)" />
                <Input id="" label="Part payment (₦)" />
              </div>
              <div className="spacey-6">
                <Input id="balance" label="Balance (₦)" />
                <div className="py-4 mt-10 flex gap-4">
                  <Button className="" variant="light_red">
                    Remove
                  </Button>
                  <Button>Add</Button>
                </div>
              </div>
            </AutoResizingGrid>

            <AccountingTitleSection title="Added Details">
              <CustomTable
                fields={expenseManageTableFields}
                data={expenseManageTableData()}
              />
            </AccountingTitleSection>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-2">
            <UserProfileCard
              user={sampleUser}
              showCloseButton={false}
              isSticky={false}
            />
          </div>
        </div>
      </div>
      <FixedFooter className="flex flex-wrap gap-6 items-center justify-between">
        <Modal>
          <ModalTrigger asChild>
            <Button variant="light_red" size="base_bold" className="py-2 px-8">
              delete expense
            </Button>
          </ModalTrigger>
          <ModalContent>
            <DeleteExpenseModal
              action={handleDeleteExpense}
              loading={loading}
            />
          </ModalContent>
        </Modal>
        <div className="flex justify-end">
          <Modal>
            {/* <ModalTrigger asChild> */}
            <Button onClick={getRoute} size="base_bold" className="py-2 px-8">
              save
            </Button>
            {/* </ModalTrigger> */}
            {/* <ModalContent>
              <ModalPreset className="w-full" type="success">
                <div className="flex flex-col gap-8">
                  <p className="text-[14px] text-text-secondary dark:text-darkText-2">
                    The expense has been successfully edited and updated
                  </p>
                  <Button
                    onClick={() => {
                      router.push("/accounting/expenses");
                    }}
                  >
                    OK
                  </Button>
                </div>
              </ModalPreset>
            </ModalContent> */}
          </Modal>
        </div>
      </FixedFooter>
    </div>
  );
};

export default ManageExpenses;
