import { ComponentPropsWithoutRef, memo } from "react";

export type InputProps = {
  label: string;
  value: string;
  setValue: (x: string) => void;
  className?: string;
} & ComponentPropsWithoutRef<"input">;

export const Input = memo(
  ({ label, value, setValue, className, children, ...rest }: InputProps) => (
    <label className={`${className} text-sm`}>
      <span className="text-neutral-100">{label}</span>
      <div className="relative mt-1 ">
        <input
          placeholder="Enter"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className="w-full bg-neutral-100 rounded-md py-2 px-3 text-neutral-800 placeholder-neutral-400"
          {...rest}
        />
        {children}
      </div>
    </label>
  ),
);
