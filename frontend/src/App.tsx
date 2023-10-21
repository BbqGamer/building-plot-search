import { memo } from "react";

export const App = memo(() => {
  return (
    <div className="flex flex-col h-screen bg-neutral-800 p-4 gap-4">
      <div className="text-neutral-100 font-bold flex items-center">
        <h1 className="text-2xl">Building plot search</h1>
        <span className="h-8 mx-4 w-[2px] bg-neutral-100 rounded-full" />
        <div className="font-normal flex gap-4">
          <button>Guide</button>
          <button>Settings</button>
          <button>Contacts</button>
        </div>
      </div>
      <div className="flex flex-1 gap-4">
        <div className="flex flex-col w-[500px] gap-4">
          <div className="flex-1 bg-neutral-100 rounded-md p-4">
            <h2>Filters</h2>
          </div>
          <div className="flex-1 bg-neutral-100 rounded-md p-4">
            <h2>Results</h2>
          </div>
        </div>
        <div className="flex-1 bg-neutral-100 rounded-md p-4">Map</div>
      </div>
    </div>
  );
});
