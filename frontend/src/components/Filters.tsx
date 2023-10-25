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
      <div className="flex gap-2">
        <Input label="X" value={x} setValue={setX} className="flex-1" />
        <Input label="Y" value={y} setValue={setY} className="flex-1" />
        <button className="text-neutral-100 w-6 h-6 mt-7">
          <MapPinIcon />
        </button>
      </div>

      <RadiusInput value={radius} setValue={setRadius} />
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
