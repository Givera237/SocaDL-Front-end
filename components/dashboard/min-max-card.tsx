export function MinMaxCard({
  label,
  unit,
  max,
  min,
}: {
  label: string;
  unit?: string;
  max?: number;
  min?: number;
}) {
  return (
    <div className="rounded-xl border border-[#E8E2D8] bg-white p-4">
      <p className="text-[11px] font-semibold tracking-wide text-[#8A8478]">
        {label}
      </p>

      <div className="mt-3 space-y-2">
        <div>
          {max === undefined ? (
            <p className="text-sm text-[#B5AE9F]">Aucune donnée max</p>
          ) : (
            <p className="font-mono text-lg font-semibold tabular-nums text-[#1F2937]">
              {max}
              {unit ? <span className="ml-1 text-xs text-[#9A9284]">{unit}</span> : null}
              <span className="ml-1 text-xs font-normal text-[#9A9284]">max</span>
            </p>
          )}
        </div>
        <div>
          {min === undefined ? (
            <p className="text-sm text-[#B5AE9F]">Aucune donnée min</p>
          ) : (
            <p className="font-mono text-lg font-semibold tabular-nums text-[#1F2937]">
              {min}
              {unit ? <span className="ml-1 text-xs text-[#9A9284]">{unit}</span> : null}
              <span className="ml-1 text-xs font-normal text-[#9A9284]">min</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}