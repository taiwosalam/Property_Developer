"use client";

import React, { useEffect, useRef, useState } from "react";

// Imports
import PinField from "react-pin-field";
import Button from "@/components/Form/Button/button";
import { useWalletStore } from "@/store/wallet-store";
import { toast } from "sonner";
import useBranchStore from "@/store/branch-store";
import { withdrawBranchFunds, withdrawFunds } from "../data";
import { useModal } from "@/components/Modal/modal";

const InputPin = ({ branch: branchState } : { branch?: boolean; }) => {
  const { setIsOpen } = useModal()
  const pinFieldRef = useRef<HTMLInputElement[] | null>(null);
  const [pin, setPin] = useState("");
  const { branch } = useBranchStore()
  const [loading, setLoading] = useState(false);
  const id = useWalletStore((state) => state.id);
  const amount = useWalletStore((state) => state.amount);
  const desc = useWalletStore((state) => state.desc);
  const branch_id = branch.branch_id
  // console.log(amount, desc)

  useEffect(() => {
    if (pinFieldRef.current && pinFieldRef.current.length > 0) {
      pinFieldRef.current[0].focus();
    }
  }, []);

  const handleWithdraw = async () => {
    if (branchState && !desc) {
      toast.warning("Please enter a description");
      return;
    }
    if (!(amount > 0)) {
      toast.warning("Please enter an amount");
      return;
    }
    if (pin.length !== 4) {
      toast.warning("Please enter your PIN");
      return;
    }
    try {
      setLoading(true)
      const action = branchState ? withdrawBranchFunds(branch_id, { amount, description: desc, pin }) : withdrawFunds(id as string, { amount, pin })
      const res = await action;
      if (res) {
        setIsOpen(false)
        toast.success("Withdrawal successful")
        window.dispatchEvent(new Event("refetch-wallet"));
        window.dispatchEvent(new Event("refetch_staff"));
        // back()
      }
    } catch (err) {
      toast.error("Failed to withdraw")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="custom-flex-col gap-20">
      <div className="custom-flex-col gap-10">
        <p className="text-text-tertiary dark:text-darkText-1 text-center text-sm font-medium">
          Please enter your 4-digit PIN
        </p>
        <div className="flex gap-6 justify-center">
          <PinField
            length={4}
            ref={pinFieldRef}
            validate={/^[0-9]$/}
            onChange={setPin}
            className="w-10 h-10 text-center border border-solid border-[#2B2B2B] rounded-lg custom-primary-outline"
          />
        </div>
      </div>
      <Button onClick={handleWithdraw} size="sm_medium" className="py-2 px-8">
        {loading ? "Withdrawing..." : "Withdraw"}
      </Button>
    </div>
  );
};

export default InputPin;
