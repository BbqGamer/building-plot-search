import { Tab } from "@headlessui/react";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { memo } from "react";
import { useQuery } from "react-query";
import { fetchToponyms } from "../utils";
import { Combobox } from "./Combobox";
import { FibonacciInput } from "./FibonacciInput";
import { Input } from "./Input";
import { RequestState } from "./Prompt";

export const Location = memo(({ request, setRequest }: RequestState) => {
  const { data: toponyms } = useQuery(["toponyms"], fetchToponyms);

  return (
    <Tab.Group as="div" className="text-sm">
      <span
        className="text-neutral-100"
        onClick={() => {
          (
            document.querySelector(
              "#location > button[aria-selected='true']",
            ) as HTMLInputElement
          ).focus();
        }}
      >
        Location
      </span>
      <Tab.List id="location" className="flex mt-1">
        <Tab
          className={({ selected }) =>
            `${
              selected ? "bg-neutral-400" : "bg-neutral-500"
            } flex-1 h-8 rounded-tl-md focus:relative`
          }
        >
          Toponym
        </Tab>
        <Tab
          className={({ selected }) =>
            `${
              selected ? "bg-neutral-400" : "bg-neutral-500"
            } flex-1 h-8 rounded-tr-md focus:relative`
          }
        >
          Precise
        </Tab>
      </Tab.List>
      <Tab.Panels className="border-2 border-t-0 border-neutral-500 rounded-bl-md rounded-br-md p-2">
        <Tab.Panel
          tabIndex={-1}
          onFocus={(e) => {
            e.target.tagName === "DIV" && e.target.blur();
          }}
        >
          <Combobox
            selected={request.toponym || null}
            setSelected={(x) => {
              setRequest((y) => ({ ...y, toponym: x }));
            }}
            options={toponyms}
          />
        </Tab.Panel>
        <Tab.Panel
          className="flex-1 flex flex-wrap gap-2"
          tabIndex={-1}
          onFocus={(e) => {
            e.target.tagName === "DIV" && e.target.blur();
          }}
        >
          <Input
            label="X"
            value={String(request.x)}
            setValue={(x) => {
              setRequest((y) => ({ ...y, x: parseFloat(x) }));
            }}
            type="number"
            min={14}
            max={24}
            step={0.01}
            className="flex-1 basis-[80px]"
          />
          <Input
            label="Y"
            value={String(request.y)}
            setValue={(x) => {
              setRequest((y) => ({ ...y, y: parseFloat(x) }));
            }}
            type="number"
            min={49}
            max={55}
            step={0.01}
            className="flex-1 basis-[80px]"
          />
          <div className="grow basis-[190px] flex gap-2">
            <FibonacciInput
              value={request.radius!}
              setValue={(x) => {
                setRequest((y) => ({ ...y, radius: x }));
              }}
            />
            <button className="text-neutral-800 p-2 rounded-md bg-neutral-100 mt-6">
              <MapPinIcon className="h-5 w-5" />
            </button>
          </div>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
});
