import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { memo, useEffect, useRef, useState } from "react";
import { DEFAULT_RADIUS } from "../helpers";
import { Input } from "./Input";

export type FibonacciInputProps = {
  value: number;
  setValue: (x: number) => void;
};

const FIBONACCI = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

export const FibonacciInput = memo(
  ({ value, setValue }: FibonacciInputProps) => {
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

    const timeoutRef = useRef<number>();
    const intervalRef = useRef<number>();

    const decrement = () => {
      previousFibonacci
        ? setValue(previousFibonacci)
        : clearInterval(intervalRef.current);
    };

    const increment = () => {
      nextFibonacci
        ? setValue(nextFibonacci)
        : clearInterval(intervalRef.current);
    };

    const decrementRef = useRef(decrement);
    decrementRef.current = decrement;

    const incrementRef = useRef(increment);
    incrementRef.current = increment;

    return (
      <Input
        label="Radius"
        placeholder={number ? undefined : DEFAULT_RADIUS.toString()}
        value={number ? number.toString() : ""}
        setValue={parseNumber}
        onBlur={() => {
          value === DEFAULT_RADIUS
            ? setNumber(DEFAULT_RADIUS)
            : setValue(number || DEFAULT_RADIUS);
        }}
        className="flex-1"
        onKeyDown={(e) => {
          e.key === "ArrowUp" && increment();
          e.key === "ArrowDown" && decrement();
        }}
        onWheel={(e) => {
          e.deltaY < 0 ? increment() : decrement();
        }}
      >
        <div className="absolute right-0 top-0 text-neutral-800 flex items-center h-full">
          <span className="mr-3 select-none">km</span>
          <button
            disabled={!previousFibonacci}
            className="focus:outline-none text-neutral-800 px-2 disabled:text-neutral-400"
            tabIndex={-1}
            onMouseDown={() => {
              decrement();
              timeoutRef.current = setTimeout(() => {
                intervalRef.current = setInterval(() => {
                  decrementRef.current();
                }, 150);
              }, 150);
            }}
            onMouseUp={() => {
              clearTimeout(timeoutRef.current);
              clearInterval(intervalRef.current);
            }}
          >
            <MinusIcon className="w-5" />
          </button>
          <button
            disabled={!nextFibonacci}
            className="focus:outline-none text-neutral-800 px-2 disabled:text-neutral-400"
            tabIndex={-1}
            onMouseDown={() => {
              increment();
              timeoutRef.current = setTimeout(() => {
                intervalRef.current = setInterval(() => {
                  incrementRef.current();
                }, 150);
              }, 150);
            }}
            onMouseUp={() => {
              clearTimeout(timeoutRef.current);
              clearInterval(intervalRef.current);
            }}
          >
            <PlusIcon className="w-5" />
          </button>
        </div>
      </Input>
    );
  },
);
