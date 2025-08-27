import Input from "@/components/Form/Input/input";
import Select from "@/components/Form/Select/select";
import { currencySymbols } from "@/utils/number-formatter";

export const InstallmentPrice = () => {
  const CURRENCY_SYMBOL = currencySymbols["naira"];
  const PERCENTAGES = [
    "1%",
    "2%",
    "2.5%",
    "3%",
    "3.5%",
    "5%",
    "6%",
    "7%",
    "7.5%",
    "8%",
    "9%",
    "10%",
  ];
  return (
    <div>
      <div className="flex items-center gap-2">
        <h4 className="text-primary-navy dark:text-white text-lg md:text-xl font-bold">
          Unit Price
        </h4>
      </div>

      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Input
          id="initial_price"
          label="Initial Price"
          required
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          type="text"
          autoComplete="off"
          formatNumber
        />
        <Input
          id="first_deposit"
          label="First deposit"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          type="text"
          autoComplete="off"
          formatNumber
        />
        <Select
          id="is_discount"
          required
          options={["yes", "no"]}
          label="Is there a discount?"
          inputContainerClassName="bg-white"
          hiddenInputClassName="unit-form-input"
        />
        <Select
          id="discount_rate"
          required
          options={PERCENTAGES}
          label="Discount Rate(%)"
          inputContainerClassName="bg-white"
          hiddenInputClassName="unit-form-input"
        />
        <Input
          id="discount_name"
          label="Discount Name"
          inputClassName="bg-white"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          type="text"
          autoComplete="off"
        />
        <Select
          id="negotiation"
          required
          options={["yes", "no"]}
          label="Are you open to negotiation?"
          inputContainerClassName="bg-white"
          hiddenInputClassName="unit-form-input"
        />
      </div>
    </div>
  );
};

export const DepositPlan = ({ heading }: { heading: string }) => {
  const CURRENCY_SYMBOL = currencySymbols["naira"];
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2">
        <h4 className="text-primary-navy dark:text-white text-lg md:text-xl font-bold">
          {heading}
        </h4>
      </div>

      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Input
          id="6_months_plan"
          label="6 Months Plan"
          required
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          type="text"
          autoComplete="off"
          formatNumber
        />
        <Input
          id="12_months_plan"
          label="12 Months Plan"
          required
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          type="text"
          autoComplete="off"
          formatNumber
        />
        <Input
          id="24_months_plan"
          label="24 Months Plan"
          required
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          type="text"
          autoComplete="off"
          formatNumber
        />
        <Input
          id="48_months_plan"
          label="48 Months Plan"
          required
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          type="text"
          autoComplete="off"
          formatNumber
        />
        <button
          type="button"
          className="text-brand-9 mb-2 text-xs md:text-sm font-normal md:self-end md:justify-self-start"
        >
          Add More Plans
        </button>
      </div>
    </div>
  );
};

export const InstallmentOtherCharges = () => {
  const CURRENCY_SYMBOL = currencySymbols["naira"];
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2">
        <h4 className="text-primary-navy dark:text-white text-lg md:text-xl font-bold">
          Other Charges
        </h4>
      </div>

      <hr className="my-4" />
      <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Input
          id="document_fee"
          label="Document Fee"
          required
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          type="text"
          autoComplete="off"
          formatNumber
        />
        <Input
          id="survey_fee"
          label="Survey Fee"
          required
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          type="text"
          autoComplete="off"
          formatNumber
        />
        <Input
          id="developmental_fee"
          label="Developmental Fee"
          required
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          type="text"
          autoComplete="off"
          formatNumber
        />
        <Input
          id="other_fee"
          label="Other Fee"
          required
          inputClassName="bg-white unit-form-input"
          CURRENCY_SYMBOL={CURRENCY_SYMBOL}
          type="text"
          autoComplete="off"
          formatNumber
        />
      </div>
    </div>
  );
};
