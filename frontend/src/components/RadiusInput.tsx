import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { memo, useEffect, useState } from "react";
import { DEFAULT_RADIUS } from "../utils";
import { Input } from "./Input";

export type RadiusInputProps = {
  value: number;
  setValue: (x: number) => void;
};

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

export const RadiusInput = memo(({ value, setValue }: RadiusInputProps) => {
  const [number, setNumber] = useState(value);

  const parseNumber = (x: string) => {
    if (!x) {
      setNumber(0);
      return;
    }

    if (!/^\d+$/.test(x) || x[0] === "0") return;

    const number = parseInt(x);
    const clamped = Math.min(number, 144);
    setNumber(clamped);
  };

  useEffect(() => {
    setNumber(value);
  }, [value]);

  const previousFibonacci = [...FIBONACCI].reverse().find((x) => x < number);
  const nextFibonacci = FIBONACCI.find((x) => x > number);

  return (
    <Input
      label="Radius"
      placeholder={number ? undefined : DEFAULT_RADIUS.toString()}
      value={number ? number.toString() : ""}
      setValue={parseNumber}
      onBlur={() => {
        setValue(number || DEFAULT_RADIUS);
      }}
      className="flex-1"
    >
      <div className="absolute right-0 top-0 text-neutral-800 flex items-center h-full">
        <span className="mr-3 select-none">km</span>
        <button
          disabled={!previousFibonacci}
          className="focus:outline-none text-neutral-800 px-2 disabled:text-neutral-400"
          tabIndex={-1}
          onClick={() => {
            previousFibonacci && setValue(previousFibonacci);
          }}
        >
          <MinusIcon className="w-5" />
        </button>
        <button
          disabled={!nextFibonacci}
          className="focus:outline-none text-neutral-800 px-2 disabled:text-neutral-400"
          tabIndex={-1}
          onClick={() => {
            nextFibonacci && setValue(nextFibonacci);
          }}
        >
          <PlusIcon className="w-5" />
        </button>
      </div>
    </Input>
  );
});
