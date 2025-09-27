export const PlaceCardSkeleton = () => {
  return (
    <div className="card relative group rounded-3xl h-[200px] py-4 px-5 bg-indigo-800 pointer-events-none select-none">
      <div className="w-full h-full relative flex items-end justify-between">
        <div className="flex flex-col gap-2.5">
          <div className="w-[140px] h-4 rounded-sm bg-indigo-700 animate-pulse"/>
          <div className="w-[220px] h-[24px] rounded-lg bg-indigo-400 animate-pulse"/>
          <div className="w-[100px] h-3 rounded-md bg-indigo-700 animate-pulse" />
          <div className="w-[370px] h-[11px] rounded-md bg-indigo-600 animate-pulse"/>
        </div>
      </div>
    </div>
  );
};
