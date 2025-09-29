export const PlaceCardSkeleton = () => {
  return (
    <div className="card relative group rounded-3xl h-[200px] py-4 px-5 bg-indigo-800 pointer-events-none select-none">
      <div className="w-full h-full relative flex items-end justify-between">
        <div className="flex flex-col gap-2.5">
          <div className="w-[140px] h-4 rounded-sm bg-indigo-700 animate-pulse" />
          <div className="w-[220px] h-[24px] rounded-lg bg-indigo-400 animate-pulse" />
          <div className="w-[100px] h-3 rounded-md bg-indigo-700 animate-pulse" />
          <div className="w-[370px] h-[11px] rounded-md bg-indigo-600 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const PlaceCardSkeleton2 = () => {
  return (
    <div className="card relative group rounded-3xl h-[250px] py-4 px-5 bg-indigo-900 pointer-events-none select-none">
      <div className="w-full h-full relative flex items-end justify-between">
        <div className="flex flex-col gap-2.5">
          <div className="w-[130px] h-4 rounded-sm bg-indigo-800 animate-pulse" />
          <div className="flex items-baseline">
            <div className="w-[100px] h-[24px] me-2 rounded-lg bg-indigo-500 animate-pulse" />
            <div className="w-[200px] h-3 rounded-md bg-indigo-800 animate-pulse" />
          </div>
          <div className="w-[270px] h-[11px] rounded-md bg-indigo-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export const PlaceCardSkeleton3 = () => {
  return (
    <div className="card relative group rounded-3xl h-[500px] py-4 px-5 bg-indigo-900 pointer-events-none select-none">
      <div className="w-full h-full relative flex items-end justify-between">
        <div className="flex flex-col gap-2.5">
          <div className="w-[130px] h-4 rounded-sm bg-indigo-800 animate-pulse" />
          <div className="flex items-baseline">
            <div className="w-[100px] h-[24px] me-2 rounded-lg bg-indigo-500 animate-pulse" />
            <div className="w-[200px] h-3 rounded-md bg-indigo-800 animate-pulse" />
          </div>
          <div className="w-[270px] h-[11px] rounded-md bg-indigo-700 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
