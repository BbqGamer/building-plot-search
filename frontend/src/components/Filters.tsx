import { memo, useState } from "react";
import { Combobox } from "./Combobox";
import { Location } from "./Location";

export const options = [
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
];

export const Filters = memo(() => {
  const [purpose, setPurpose] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <Location />

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
