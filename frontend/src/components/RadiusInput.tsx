import { memo, useCallback, useState } from "react";
import { DEFAULT_RADIUS } from "../utils";
import { Input } from "./Input";

export type RadiusInputProps = {
  value: number;
  setValue: (x: number) => void;
};

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

export const RadiusInput = memo(({ value, setValue }: RadiusInputProps) => {
  const [number, setNumber] = useState(value);

  const parseNumber = useCallback((x: string) => {
    if (!x) {
      setNumber(0);
      return;
    }

    if (!/^\d+$/.test(x) || x[0] === "0") return;

    const number = parseInt(x);
    const clamped = Math.min(number, 999);
    setNumber(clamped);
  }, []);

  const applyNumber = useCallback(() => {
    !number && setNumber(DEFAULT_RADIUS);
    setValue(number || DEFAULT_RADIUS);
  }, [number, setValue]);

  return (
    <div className="relative">
      <Input
        label="Radius"
        placeholder={number ? undefined : DEFAULT_RADIUS.toString()}
        value={number ? number.toString() : ""}
        setValue={parseNumber}
        onBlur={applyNumber}
      />
      {/* <span className="text-neutral-900">
        <PlusCircleIcon className="absolute h-5 w-5 top-0" />
      </span> */}
    </div>
  );
});
