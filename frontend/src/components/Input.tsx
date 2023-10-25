import { ComponentPropsWithoutRef, memo } from "react";

export type InputProps = {
  label: string;
  value: string;
  setValue: (x: string) => void;
  className?: string;
} & ComponentPropsWithoutRef<"input">;

export const Input = memo(
  ({ label, value, setValue, className, ...rest }: InputProps) => (
    <label className={`${className} text-sm`}>
      {label}
      <input
        placeholder="Enter"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className="mt-1 w-full rounded-md border-none py-2 px-3 text-neutral-900 focus:outline outline-2 outline-neutral-400 placeholder-neutral-400"
        {...rest}
      />
    </label>
  ),
);
