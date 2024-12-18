"use client";

import { useState } from "react";

import Button from "@/components/Form/Button/button";
import { WalletLegalProcedureIcon } from "@/public/icons/icons";
import Image from "next/image";

const PaymentMethod: React.FC<{
  title: string;
  price: number;
  counter?: boolean;
}> = ({ title, price, counter }) => {
  return <AddFundsModalOptions title={title} price={price} counter={counter} />;
};

export default PaymentMethod;

const AddFundsModalOptions: React.FC<{
  title: string;
  price: number;
  counter?: boolean;
}> = ({ title, price, counter }) => {
  const [quantity, setQuantity] = useState(1);
  const incrementQuantity = () => {
    if (quantity < 5) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="custom-flex-col gap-4">
      <div className="w-full flex items-center justify-center flex-col">
        <h3>{title}</h3>
        <div className="flex gap-2 w-full flex-row justify-center items-center">
          <p className="not-italic leading-[30px] font-bold text-brand-9 text-[20px]">
            ₦ {price * quantity}.00
          </p>
          {counter && (
            <div className="flex items-center gap-2">
              <p className="text-text-quaternary dark:text-darkText-1 text-xs">
                ({quantity} {quantity === 1 ? "per Annum" : "years"})
              </p>
              <div className="btns flex flex-col">
                <CounterButton
                  onClick={incrementQuantity}
                  icon="/icons/plus.svg"
                  alt="plus"
                />
                <CounterButton
                  onClick={decrementQuantity}
                  icon="/icons/minus.svg"
                  alt="minus"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <WalletFunding title={title} />
    </div>
  );
};

export const CounterButton: React.FC<{
  onClick?: () => void;
  icon: string;
  alt: string;
}> = ({ onClick = () => {}, icon, alt }) => (
  <button className="text-white rounded-md" onClick={onClick}>
    <Image src={icon} alt={alt} width={20} height={20} />
  </button>
);

const WalletFunding: React.FC<{
  title: string;
}> = ({ title }) => {
  return (
    <div className="p-[18px] rounded-2xl overflow-hidden bg-neutral-2 dark:bg-darkText-primary dark:border dark:border-[#3C3D37] custom-flex-col gap-2">
      <div className="w-full flex gap-2">
        <WalletLegalProcedureIcon />
        <div className="flex flex-col">
          <h3> {title} </h3>
          <p className="text-[12px] font-medium tracking-[0px]">
            Wallet Balance: ₦ 50,000 (Sufficient funds){" "}
          </p>
        </div>
      </div>
      <div className="custom-flex-col gap-6">
        <div className="flex justify-end">
          <Button size="xs_medium" className="py-1 px-2">
            proceed
          </Button>
        </div>
      </div>
    </div>
  );
};
