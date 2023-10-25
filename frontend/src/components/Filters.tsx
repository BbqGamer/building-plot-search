import { MapPinIcon } from "@heroicons/react/24/solid";
import { memo, useState } from "react";
import { DEFAULT_RADIUS } from "../utils";
import { Combobox } from "./Combobox";
import { Input } from "./Input";
import { RadiusInput } from "./RadiusInput";

const options = [
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
];

export const Filters = memo(() => {
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [purpose, setPurpose] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex-1 flex flex-wrap gap-2">
        <Input
          label="X"
          value={x}
          setValue={setX}
          className="flex-1 basis-[80px]"
        />
        <Input
          label="Y"
          value={y}
          setValue={setY}
          className="flex-1 basis-[80px]"
        />
        <div className="grow basis-[190px] flex gap-2">
          <RadiusInput value={radius} setValue={setRadius} />
          <button className="text-neutral-800 p-2 rounded-md bg-neutral-100 mt-6">
            <MapPinIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {/* Area */}

      <Combobox
        label="Purpose"
        options={options}
        selected={purpose}
        setSelected={setPurpose}
      />
    </div>
  );
});
