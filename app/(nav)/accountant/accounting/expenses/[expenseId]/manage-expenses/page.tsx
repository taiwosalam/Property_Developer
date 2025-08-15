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
  ManageExpenseApiResponse,
  ManageExpensePageData,
  transformManageExpenseData,
} from "./data";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { useRole } from "@/hooks/roleContext";

const ManageExpenses = () => {
  const router = useRouter();
  // const { setIsOpen } = useModal()
  const { expenseId } = useParams();
  const [reqLoading, setReqLoading] = useState(false);
  const { role } = useRole();
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

  const [paymentTitle, setPaymentTitle] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

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
        router.push("/staff/accounting/expenses");
        break;
      default:
        router.push("/unauthorized");
        break;
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
        getRoute();
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

  const totalBalance = totalExpenses - totalDeductions;

  if (loading) return <PageCircleLoader />;
  if (error) return <div>Error loading expense data.</div>;
  if (!pageData) return <div>No data available.</div>;

  return (
    <div className="custom-flex-col gap-10 pb-[150px] sm:pb-[100px]">
      <div className="custom-flex-col gap-[18px]">
        <BackButton>Manage Expenses</BackButton>
        <ExportPageHeader />
        <div className="rounded-lg bg-white dark:bg-darkText-primary p-8 flex gap-6 lg:gap-0 flex-col lg:flex-row">
          <KeyValueList
            data={{
              "payment id": pageData?.expenseDetails.paymentId,
              "account officer": pageData?.expenseDetails.customerName,
              "property name": pageData?.expenseDetails.propertyName,
              date: pageData?.expenseDetails.date,
              "unit ID": pageData?.expenseDetails.unitId,
            }}
            chunkSize={2}
            direction="column"
            referenceObject={{
              "payment id": "",
              date: "",
              "property name": "",
              landlord: "",
              "account officer": "",
              "unit ID": "",
            }}
          />
        </div>
        <AccountingTitleSection title="Description">
          <p className="text-sm text-text-secondary dark:text-darkText-2">
            {pageData?.description}
          </p>
        </AccountingTitleSection>
        <AccountingTitleSection title="Add Expense">
          <div className="p-6 custom-flex-col gap-4 bg-white dark:bg-darkText-primary rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
              <Input
                id="payment-title"
                label="payment title"
                value={paymentTitle}
                onChange={(v) => setPaymentTitle(v)}
              />
              <Input
                id="payment_amount"
                label="amount"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                // placeholder="300,000"
                inputClassName="bg-white"
                formatNumber
                value={paymentAmount}
                onChange={(v) => setPaymentAmount(v)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                size="base_medium"
                className="py-2 px-14"
                disabled={reqLoading}
                onClick={handleAddPaymentClick}
              >
                {reqLoading ? "Please wait..." : "Add"}
              </Button>
            </div>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Expenses">
          <div className="space-y-8 bg-white dark:bg-darkText-primary w-full p-6 rounded-lg">
            <div className="w-full max-w-[968px] grid sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
              {payments.map((payment, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1 capitalize">
                    {payment.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[14px] text-text-secondary dark:text-darkText-2">
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(payment.amount)}
                    </p>
                    <Modal>
                      {/* <ModalTrigger aria-label={`Delete ${payment.title}`}>
                        <DeleteIconX />
                      </ModalTrigger> */}
                      <ModalContent>
                        <DeleteItemWarningModal
                          item={payment.title}
                          amount={payment.amount}
                          handleDelete={() => handleDeletePayment(index)}
                          useCase="expenses"
                        />
                      </ModalContent>
                    </Modal>
                  </div>
                </div>
              ))}
            </div>
            <SectionSeparator />
            <div className="flex flex-col gap-4">
              <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                Total Expenses
              </p>
              <p className="font-bold text-xl text-brand-9">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(totalExpenses)}
              </p>
            </div>
          </div>
        </AccountingTitleSection>
        <AccountingTitleSection title="Deduct Payment">
          <div className="p-6 custom-flex-col gap-4 bg-white dark:bg-darkText-primary rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
              <DateInput
                id="payment-date"
                label="Select Date"
                disablePast
                value={deductionDate}
                onChange={(date) => setDeductionDate(date)}
              />
              <Input
                id="amount"
                label="amount"
                CURRENCY_SYMBOL={CURRENCY_SYMBOL}
                inputClassName="bg-white"
                formatNumber
                value={deductionAmount}
                onChange={(value) => setDeductionAmount(value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                size="base_medium"
                className="py-2 px-14"
                onClick={handleDeductClick}
                disabled={reqLoading}
              >
                {reqLoading ? "Please wait..." : "Deduct"}
              </Button>
            </div>
          </div>
        </AccountingTitleSection>
        {deductions.length > 0 && (
          <AccountingTitleSection title="Deducted Payment">
            <div className="flex bg-white dark:bg-darkText-primary w-full p-6 rounded-lg flex-col gap-8">
              <div className="w-full max-w-[968px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[34px] gap-y-6">
                {deductions.map((deduction, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                      {format(deduction.date.toDate(), "dd MMMM yyyy")}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[14px] text-text-secondary dark:text-darkText-2">
                        {new Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: "NGN",
                        }).format(deduction.amount)}
                      </p>
                      <Modal>
                        {/* <ModalTrigger aria-label={`Delete ${deduction.date}`}>
                          <DeleteIconX />
                        </ModalTrigger> */}
                        <ModalContent>
                          <DeleteItemWarningModal
                            item={deduction.date.toDate().toLocaleDateString()}
                            amount={deduction.amount}
                            handleDelete={() => handleDeleteDeduction(index)}
                            useCase="deductions"
                          />
                        </ModalContent>
                      </Modal>
                    </div>
                  </div>
                ))}
              </div>
              <SectionSeparator />
              <div className="flex flex-col gap-4">
                <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                  Total Deductions
                </p>
                <p className="font-bold text-xl text-brand-9">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(pageData?.stats?.totalDeducted)}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-6">
              <p className="font-medium text-[16px] text-text-tertiary dark:darkText-1">
                Total Balance
              </p>
              <p className="font-bold text-xl text-brand-9">
                {new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(pageData?.stats?.totalBalance)}
              </p>
            </div>
          </AccountingTitleSection>
        )}
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
            <Button
              onClick={getRoute}
              size="base_bold"
              className="py-2 px-8"
            >
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
