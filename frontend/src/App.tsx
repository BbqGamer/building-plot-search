import { memo } from "react";
import { Prompt } from "./components/Prompt";

export const App = memo(() => {
  return (
    <div className="flex text-neutral-100 flex-col h-screen bg-neutral-800 py-4 gap-4">
      <div className="flex items-center px-4">
        <h1 className="text-2xl">Building plot search</h1>
        <span className="h-6 mx-4 w-[2px] bg-neutral-400" />
        <div className="-ml-1 font-normal flex gap-2 [&>button]:rounded-md [&>button]:p-1">
          <button>Guide</button>
          <button>Settings</button>
          <button>Contacts</button>
        </div>
      </div>
      <Prompt />
    </div>
  );
});
