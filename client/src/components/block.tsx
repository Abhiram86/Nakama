export const Block = ({ imgSrc, desc }: { imgSrc: string; desc: string }) => {
  return (
    <div className="flex flex-row items-center gap-x-3 p-2 rounded-lg border border-emerald-900">
      <div className="border cursor-pointer rounded-2xl transition-all p-2 border-emerald-500 bg-gradient-to-br from-emerald-700 via-emerald-950 to-zinc-800 lg:h-72 lg:w-[480px] md:h-72 md:w-[720px] w-[640px] h-[240px] overflow-clip">
        <h1>Nakama</h1>
        <div>
          <img src={imgSrc} alt="bg2" className="w-full sm:w-[640px]" />
        </div>
      </div>
      <p
        className="text-base font-bold
        md:px-8 
      mx-auto text-balance tracking-tight"
      >
        {desc}
      </p>
    </div>
  );
};
