export default function SkeletonProduct() {
  return (
    <div className="group flex h-[270px] animate-pulse flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="relative h-28 w-full bg-gray-200"></div>

      <div className="flex flex-1 flex-col justify-between gap-2 p-3">
        <div className="space-y-1">
          <div className="h-[20px] w-3/4 rounded bg-gray-300"></div>
          <div className="h-[30px] w-full rounded bg-gray-300"></div>
          <div className="h-[12px] w-1/3 rounded bg-gray-300"></div>
        </div>

        <div className="h-4 w-1/4 rounded bg-gray-300"></div>

        <div className="flex items-center justify-between gap-2">
          <div className="h-8 w-full rounded-md bg-gray-300"></div>
          <div className="h-8 w-8 rounded-md bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
}
