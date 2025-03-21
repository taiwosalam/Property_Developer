import React, { useState } from "react";

const InputWithButton = ({
  name,
  label,
  btn_text,
  onSubmit,
}: {
  name: string;
  label: string;
  btn_text: string;
  onSubmit: (id: string) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    if (inputValue) {
      onSubmit(inputValue);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <div className="flex items-center pr-2 h-12 text-xs md:text-sm font-normal rounded-[4px] w-full custom-primary-outline border border-solid border-[#C1C2C366] bg-neutral-2 dark:bg-darkText-primary hover:border-[#00000099] dark:hover:border-darkText-2">
        <input
          type="text"
          className="w-full h-full rounded-[4px] outline-none px-2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          type="button"
          className="bg-brand-9 text-xs rounded-md px-2 text-white h-3/4"
          onClick={handleSubmit}
        >
          {btn_text}
        </button>
      </div>
    </div>
  );
};

export default InputWithButton;
