import { memo } from "react";
import { Combobox } from "./Combobox";
import { Input } from "./Input";
import { Location } from "./Location";
import { RequestState } from "./Prompt";

const options = [
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
];

export const Filters = memo(({ request, setRequest }: RequestState) => {
  return (
    <div className="flex flex-col gap-2">
      <Location request={request} setRequest={setRequest} />

      <div className="flex gap-2">
        <Input
          className="flex-1"
          label="Min area"
          value={String(request.minArea)}
          type="number"
          setValue={(x) => {
            setRequest((y) => ({ ...y, minArea: parseInt(x) }));
          }}
        />
        <Input
          className="flex-1"
          label="Max area"
          value={String(request.maxArea)}
          type="number"
          setValue={(x) => {
            setRequest((y) => ({ ...y, maxArea: parseInt(x) }));
          }}
        />
      </div>

      <Combobox
        label="Purpose"
        options={options}
        selected={request.purpose || null}
        setSelected={(x) => {
          setRequest((y) => ({ ...y, purpose: x }));
        }}
      />
    </div>
  );
});
