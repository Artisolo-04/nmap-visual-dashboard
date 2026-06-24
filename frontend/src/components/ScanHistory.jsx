import { History, ChevronRight } from 'lucide-react';

function ScanHistory({ scans, onSelect }) {
  return (

    <div className="h-[480px] flex flex-col rounded-lg border border-zinc-800 bg-zinc-950/60">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 text-xs uppercase tracking-widest text-zinc-500">
        <History size={14} />
        History
      </div>

      {scans.length === 0 ? (
        <p className="px-4 py-6 text-sm text-zinc-600">No scans yet.</p>
      ) : (
        <ul className="flex-1 overflow-y-auto">
          {scans.map((scan) => {
            const openCount = scan.raw_result?.ports?.filter((p) => p.state === 'open').length ?? 0;

            return (
              <li key={scan.id}>
                <button
                  onClick={() => onSelect(scan)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left border-b border-zinc-800/60 last:border-0 hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-200">{scan.target}</p>
                    <p className="text-xs text-zinc-500">
                      {new Date(scan.scanned_at).toLocaleString()} · {openCount} open
                    </p>
                  </div>
                  <ChevronRight size={14} className="shrink-0 text-zinc-600" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ScanHistory;
