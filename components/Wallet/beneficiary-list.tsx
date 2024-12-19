"use client";
import { useState } from "react";
import WalletModalPreset from "./wallet-modal-preset";
import Button from "../Form/Button/button";
import FundsBeneficiary from "./SendFunds/funds-beneficiary";
import Input from "../Form/Input/input";
import { addBeneficiary, removeBeneficiary } from "./data";
import { useWalletStore } from "@/store/wallet-store";
import { useModal } from "../Modal/modal";
import { toast } from "sonner";

const BeneficiaryList = () => {
  const { setIsOpen } = useModal();
  const myWalletId = useWalletStore((state) => state.walletId);
  const beneficiaries = useWalletStore((state) => state.beneficiaries);
  const [beneficiaryWalletId, setBeneficiaryWalletId] = useState("");
  const [addReqLoading, setAddReqLoading] = useState(false);

  const handleAddBeneficiary = async () => {
    if (!beneficiaryWalletId) return;
    if (!/^\d{8}$/.test(beneficiaryWalletId.trim())) {
      toast.error("Invalid wallet Id");
      return;
    }

    if (beneficiaries.some((b) => b.wallet_id === beneficiaryWalletId.trim())) {
      toast.error("This wallet ID is already a beneficiary.");
      return;
    }
    if (myWalletId) {
      setAddReqLoading(true);
      const status = await addBeneficiary(
        beneficiaryWalletId.trim(),
        myWalletId
      );
      if (status) {
        setBeneficiaryWalletId("");
        window.dispatchEvent(new Event("refetch-wallet"));
      }
      setAddReqLoading(false);
    }
  };

  const handleRemoveBeneficiary = async (id: string) => {
    const status = await removeBeneficiary(id);
    if (status) {
      window.dispatchEvent(new Event("refetch-wallet"));
    }
  };

  return (
    <WalletModalPreset title="Beneficiary List">
      <div className="custom-flex-col gap-6">
        <div className="flex gap-6">
          <Input
            id="add-beneficiary"
            label="add beneficiary"
            placeholder="Input Wallet ID"
            className="flex-1"
            inputClassName="bg-white dark:bg-[#3C3D37]"
            value={beneficiaryWalletId}
            onChange={(value) => setBeneficiaryWalletId(value)}
          />
          <div className="flex items-end">
            <Button
              size="sm_medium"
              className="py-[11px] px-8"
              onClick={handleAddBeneficiary}
              disabled={addReqLoading}
            >
              {addReqLoading ? "Adding..." : "Add"}
            </Button>
          </div>
        </div>
        <div className="custom-flex-col gap-4 py-[18px] rounded-2xl bg-neutral-2 dark:bg-darkText-primary">
          <p className="pl-[18px] text-[#010A23] dark:text-white text-base font-medium">
            Beneficiaries
          </p>
          <div className="custom-flex-col gap-2 sections">
            {beneficiaries.length === 0 ? (
              <p className="text-text-label text-center text-sm dark:text-darkText-1">
                No beneficiary yet.
              </p>
            ) : (
              beneficiaries.map((b) => (
                <FundsBeneficiary
                  key={b.id}
                  remove={() => handleRemoveBeneficiary(b.id)}
                  {...b}
                />
              ))
            )}
          </div>
        </div>
        <Button
          size="sm_medium"
          className="py-2 px-8"
          onClick={() => setIsOpen(false)}
        >
          continue
        </Button>
      </div>
    </WalletModalPreset>
  );
};

export default BeneficiaryList;
