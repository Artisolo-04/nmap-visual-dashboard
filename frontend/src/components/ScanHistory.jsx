import { History, Wifi, ChevronRight, Zap, ScanSearch, Layers} from 'lucide-react';

const gradeConfig = {
  A: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  B: { bg: 'bg-green-500/15',   text: 'text-green-400',   border: 'border-green-500/30'   },
  C: { bg: 'bg-yellow-500/15',  text: 'text-yellow-400',  border: 'border-yellow-500/30'  },
  D: { bg: 'bg-orange-500/15',  text: 'text-orange-400',  border: 'border-orange-500/30'  },
  F: { bg: 'bg-red-500/15',     text: 'text-red-400',     border: 'border-red-500/30'     },
};

const SCAN_TYPE_ICONS = {
  quick: Zap,
  detailed: ScanSearch,
  full: Layers,
};

function GradeBadge({ grade }) {
  if (!grade) return null;
  const cfg = gradeConfig[grade] ?? { bg: 'bg-zinc-800', text: 'text-zinc-400', border: 'border-zinc-700' };
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {grade}
    </span>
  );
}

function ScanHistory({ scans, onSelect }) {
  return (
    <div className="h-[480px] flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">

      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/40">
        <History size={13} className="text-emerald-500" />
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">History</span>
        {scans.length > 0 && (
          <span className="ml-auto text-[10px] text-zinc-600 bg-zinc-800 p-2 rounded-lg aspect-square">
            {scans.length}
          </span>
        )}
      </div>

      {scans.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-600">
          <Wifi size={24} className="opacity-30" />
          <p className="text-sm">No scans yet.</p>
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto divide-y divide-zinc-800/50">
          {scans.map((scan) => {

            const openCount = scan.raw_result?.ports?.filter((p) => p.state === 'open').length ?? 0;
            const TypeIcon = SCAN_TYPE_ICONS[scan.scan_type] || Zap;

            return (
              <li key={scan.id}>
                <button
                  onClick={() => onSelect(scan)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-900/70 transition-all duration-150 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                      {scan.target}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1.5">
                      <span>{
                        new Date(scan.scanned_at).toLocaleString(undefined, {
                          dateStyle: 'short',
                          timeStyle: 'medium',
                        }).replace(', ', ' - ')
                        }</span>
                      <span className="text-zinc-700">·</span>
                      <span className={openCount > 0 ? 'text-zinc-400' : 'text-zinc-600'}>
                        {openCount} open
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <TypeIcon size={14} className="text-zinc-500" />
                    <GradeBadge grade={scan.risk_grade} />
                  </div>
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
