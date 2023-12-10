import { memo } from "react";
import { Prompt } from "./components/Prompt";

export const App = memo(() => {
  return (
    <div className="flex text-white flex-col h-screen bg-neutral-700 gap-4">
      <Prompt />
    </div>
  );
});
