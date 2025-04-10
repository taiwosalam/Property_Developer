"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import clsx from "clsx";
import Label from "../Label/label";
import { checkValidatonError } from "@/utils/validation";
import Picture from "@/components/Picture/picture";
import { formatCostInputValue } from "@/utils/number-formatter";
import { EyeHideIcon, EyeShowIcon } from "@/public/icons/icons";
import { InputProps } from "./types";

export interface RestrictedWordsOptions {
  words?: string[];
  hook?: () => string[];
  errorMessage?: string;
}

const RestrictInput: React.FC<InputProps> = ({
  id,
  label,
  style,
  value,
  leftIcon,
  required,
  className,
  placeholder,
  initialValue,
  defaultValue,
  type = "text",
  validationErrors = {},
  labelclassName,
  onChange,
  inputClassName,
  CURRENCY_SYMBOL,
  readOnly,
  disabled,
  min,
  max,
  maxLength,
  requiredNoStar,
  formatNumber,
  endWith,
  isPinField,
  minLength,
  name,
  restrictedWordsOptions,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<string>(
    String(value || initialValue || defaultValue || "")
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const restrictedWords = useMemo(() => {
    if (restrictedWordsOptions?.hook) {
      return restrictedWordsOptions.hook().map((w) => w.toLowerCase());
    }
    return (restrictedWordsOptions?.words || []).map((w) => w.toLowerCase());
  }, [restrictedWordsOptions]);

  const containsRestrictedWord = (val: string): boolean => {
    const wordsInInput = val.toLowerCase().split(/\s+/); // split by whitespace
    return wordsInInput.some((word) => restrictedWords.includes(word));
  };

  useEffect(() => {
    if (value !== undefined) setInternalValue(String(value));
  }, [value]);

  useEffect(() => {
    if (initialValue !== undefined && onChange) {
      onChange(initialValue);
    }
  }, [initialValue, onChange]);

  useEffect(() => {
    const error = checkValidatonError({ errors: validationErrors, key: id });
    if (error) setValidationError(error);
  }, [validationErrors, id]);

  const validate = (val: string, e?: React.ChangeEvent<HTMLInputElement>) => {
    const inputWords = val.toLowerCase().split(/\s+/);
    const matchedRestrictedWords = inputWords.filter((word) =>
      restrictedWords.includes(word)
    );

    const hasRestrictedWord = matchedRestrictedWords.length > 0;

    if (restrictedWordsOptions && hasRestrictedWord) {
      const formattedWords = matchedRestrictedWords
        .map((w) => `"${w}"`)
        .join(", ");
      setValidationError(
        restrictedWordsOptions?.errorMessage ||
          `Please don’t include ${formattedWords} as it refers to an area, LGA, or state.`
      );

      // Handle both signatures
      if (onChange) {
        if (onChange.length === 1) {
          (onChange as (val: string | null) => void)(null);
        } else {
          onChange(null, e);
        }
      }
    } else {
      setValidationError(null);

      if (onChange) {
        if (onChange.length === 1) {
          (onChange as (val: string) => void)(val);
        } else {
          onChange(val, e);
        }
      }
    }
  };

  const handleFormatting = (
    val: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newVal = val;
    if (type === "number" && maxLength && newVal.length > maxLength) {
      newVal = newVal.slice(0, maxLength);
    }
    if (formatNumber) newVal = formatCostInputValue(newVal);
    if (endWith) {
      const isBackspace =
        (e.nativeEvent as InputEvent).inputType === "deleteContentBackward";
      newVal = newVal.replace(new RegExp(`${endWith}`), "").trim();
      if (isBackspace && newVal.length > 0) newVal = newVal.slice(0, -1);
      newVal = `${newVal} ${endWith}`;
    }
    if (isPinField) newVal = newVal.replace(/\D/g, "");
    return newVal;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = handleFormatting(e.target.value, e);
    setInternalValue(val);

    // Debounced validation
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => validate(val), 400);
  };

  const handleInputTypeChange = () => {
    setIsPasswordVisible((prev) => !prev);
    if (inputRef.current) {
      inputRef.current.type = isPasswordVisible ? "password" : "text";
    }
  };

  return (
    <div
      className={clsx(
        "custom-flex-col gap-2",
        disabled && "opacity-60",
        className
      )}
    >
      {label && (
        <Label id={id} required={required} labelclassName={labelclassName}>
          {label}
        </Label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3">
            <Picture src={leftIcon} alt="icon" size={24} />
          </div>
        )}
        {CURRENCY_SYMBOL && (
          <p className="absolute left-3 text-xs md:text-sm font-medium opacity-50">
            {CURRENCY_SYMBOL}
          </p>
        )}
        <input
          id={id}
          name={name || id}
          ref={inputRef}
          value={internalValue}
          required={required || requiredNoStar}
          readOnly={readOnly}
          disabled={disabled}
          placeholder={placeholder}
          defaultValue={defaultValue ? defaultValue : undefined}
          minLength={minLength}
          min={type === "number" ? min : undefined}
          max={type === "number" ? max : undefined}
          maxLength={maxLength}
          onChange={handleChange}
          type={type === "password" && isPasswordVisible ? "text" : type}
          className={clsx(
            "p-3 text-xs md:text-sm font-normal rounded-[4px] w-full custom-primary-outline border border-solid border-[#C1C2C366] bg-neutral-2 dark:bg-darkText-primary hover:border-[#00000099] dark:hover:border-darkText-2 transition-colors duration-300 ease-in-out",
            {
              "pr-11": type === "password",
              "pl-11": leftIcon,
              "pl-10": CURRENCY_SYMBOL,
              "cursor-not-allowed": disabled,
            },
            inputClassName
          )}
          style={style}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={handleInputTypeChange}
            className="absolute p-1 right-3"
            aria-label="Toggle password visibility"
          >
            {isPasswordVisible ? <EyeShowIcon /> : <EyeHideIcon />}
          </button>
        )}
      </div>
      {validationError && (
        <p className="text-sm text-red-500 font-medium">{validationError}</p>
      )}
    </div>
  );
};

export default RestrictInput;
