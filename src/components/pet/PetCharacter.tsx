type PetCharacterProps = {
  pulse?: boolean;
};

export function PetCharacter({ pulse = false }: PetCharacterProps) {
  return (
    <div className="flex justify-center py-2">
      <div className={`relative h-36 w-36 ${pulse ? 'animate-pulse' : ''}`} aria-hidden="true">
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-sky-400 to-primary shadow-lg" />
        <div className="absolute left-7 top-9 h-9 w-9 rounded-full bg-white" />
        <div className="absolute right-7 top-9 h-9 w-9 rounded-full bg-white" />
        <div className="absolute left-10 top-12 h-3 w-3 rounded-full bg-slate-900" />
        <div className="absolute right-10 top-12 h-3 w-3 rounded-full bg-slate-900" />
        <div className="absolute left-1/2 top-[4.5rem] h-3 w-10 -translate-x-1/2 rounded-b-full bg-slate-800" />
        <div className="absolute left-8 top-14 h-3 w-5 rounded-full bg-rose-300/70" />
        <div className="absolute right-8 top-14 h-3 w-5 rounded-full bg-rose-300/70" />
        <div className="absolute left-3 top-5 h-4 w-4 rounded-full bg-orange-400" />
        <div className="absolute right-3 top-5 h-4 w-4 rounded-full bg-orange-400" />
        <div className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 gap-3">
          <div className="h-3 w-5 rounded-full bg-orange-500" />
          <div className="h-3 w-5 rounded-full bg-orange-500" />
        </div>
        <div className="absolute -bottom-3 left-1/2 h-3 w-20 -translate-x-1/2 rounded-full bg-primary/25 blur-sm" />
      </div>
    </div>
  );
}
