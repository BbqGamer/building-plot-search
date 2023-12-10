import { Combobox as HeadlessCombobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { memo, useState } from "react";

export type Option = { id: number; name: string };

export type ComboboxProps = {
  label?: string;
  options?: Option[];
  selected: Option | null;
  setSelected: (x: Option) => void;
};

export const Combobox = memo(
  ({ label, options, selected, setSelected }: ComboboxProps) => {
    const [query, setQuery] = useState("");

    const filtered = options
      ? query === ""
        ? options
        : options.filter((x) =>
            x.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, "")),
          )
      : [];

    return (
      <HeadlessCombobox
        disabled={!options}
        value={selected}
        onChange={setSelected}
        nullable
      >
        <div className="relative text-sm">
          {label && (
            <HeadlessCombobox.Label className="block mb-1">
              {label}
            </HeadlessCombobox.Label>
          )}
          <div className="relative">
            <HeadlessCombobox.Input
              className="w-full rounded-md border-none bg-white py-2 pl-3 pr-10 text-neutral-800 placeholder-neutral-400"
              displayValue={(x?: Option) => (x ? x.name : "Any")}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              placeholder="Search"
            />
            <HeadlessCombobox.Button
              className="absolute inset-y-0 right-0 flex items-center pr-2"
              onClick={() => {
                setQuery("");
              }}
            >
              <ChevronUpDownIcon
                className="h-5 w-5 text-neutral-800"
                aria-hidden="true"
              />
            </HeadlessCombobox.Button>
          </div>
          <div className="rounded-md overflow-hidden h-fit absolute mt-2 w-full z-[1]">
            <HeadlessCombobox.Options className="max-h-80 overflow-auto rounded-md bg-white py-1">
              {filtered.length === 0 && query !== "" ? (
                <div className="select-none py-2 px-4 text-neutral-400">
                  Nothing found
                </div>
              ) : (
                filtered.map((x) => (
                  <HeadlessCombobox.Option
                    key={x.id}
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active
                          ? "bg-neutral-400 text-white"
                          : "text-neutral-800"
                      }`
                    }
                    value={x}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {x.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-neutral-800"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </HeadlessCombobox.Option>
                ))
              )}
            </HeadlessCombobox.Options>
          </div>
        </div>
      </HeadlessCombobox>
    );
  },
);
