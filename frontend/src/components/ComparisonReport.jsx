import { ShieldAlert, ShieldCheck, Minus, ArrowRight, X, AlertTriangle, Info, Zap, ScanSearch, Layers } from 'lucide-react';

const gradeConfig = {
  A: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  B: { text: 'text-green-400',   bg: 'bg-green-500/10',   border: 'border-green-500/30'   },
  C: { text: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30'  },
  D: { text: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/30'  },
  F: { text: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30'     },
};

const SCAN_TYPE_ICONS = { quick: Zap, detailed: ScanSearch, full: Layers };
const SCAN_TYPE_LABELS = { quick: 'Quick Scan', detailed: 'Detailed Scan', full: 'Full Port Scan' };

function GradeCircle({ grade }) {
  const cfg = gradeConfig[grade] || { text: 'text-zinc-500', bg: 'bg-zinc-800', border: 'border-zinc-700' };
  return (
    <div className={`flex items-center justify-center w-14 h-14 rounded-full border-2 ${cfg.bg} ${cfg.border}`}>
      <span className={`text-xl font-bold ${cfg.text}`}>{grade || '—'}</span>
    </div>
  );
}

function formatScanMeta(scan) {
  const TypeIcon = SCAN_TYPE_ICONS[scan.scan_type] || Zap;
  const label = SCAN_TYPE_LABELS[scan.scan_type] || 'Quick Scan';
  const date = new Date(scan.scanned_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  return { TypeIcon, label, date };
}

function PortRow({ port, tone }) {
  const toneText = {
    added: 'text-red-300',
    removed: 'text-zinc-400',
    unchanged: 'text-zinc-400',
  }[tone];

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50 last:border-0">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm font-semibold text-zinc-100">{port.port}</span>
        <span className="text-xs text-zinc-600 uppercase">{port.protocol}</span>
      </div>
      <span className={`text-sm ${toneText}`}>{port.service}</span>
    </div>
  );
}

function ComparisonReport({ data, onClose }) {
  const { from, to, diff } = data;
  const fromMeta = formatScanMeta(from);
  const toMeta = formatScanMeta(to);

  const riskColor = {
    improved: 'text-green-400',
    worsened: 'text-red-400',
    unchanged: 'text-zinc-400',
  }[diff.riskChange.direction];

  const scanTypeMismatch = from.scan_type !== to.scan_type;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90%] flex flex-col rounded-xl border border-cyan-500/30 bg-[#0b0f0e] shadow-[0_0_60px_rgba(34,211,238,0.12)] overflow-hidden">

        <div className="flex items-center justify-between px-5 py-2 bg-cyan-500/10 border-b border-cyan-500/20">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan-400">
            Security Assessment — Comparison Report
          </span>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 border-b border-zinc-800">
          <p className="text-lg font-semibold text-zinc-100 mb-4">{from.target}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Baseline</p>
              <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                <fromMeta.TypeIcon size={12} className="text-zinc-500" />
                {fromMeta.label}
              </div>
              <p className="text-[11px] text-zinc-600 mt-1">{fromMeta.date}</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Compared To</p>
              <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                <toMeta.TypeIcon size={12} className="text-zinc-500" />
                {toMeta.label}
              </div>
              <p className="text-[11px] text-zinc-600 mt-1">{toMeta.date}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 px-6 py-6 border-b border-zinc-800 bg-zinc-950/40">
          <GradeCircle grade={from.risk_grade} />
          <ArrowRight size={20} className={riskColor} />
          <GradeCircle grade={to.risk_grade} />
        </div>
        <p className={`text-center text-sm font-medium pb-4 ${riskColor}`}>
          {diff.riskChange.direction === 'improved' && 'Risk posture improved'}
          {diff.riskChange.direction === 'worsened' && 'Risk posture worsened'}
          {diff.riskChange.direction === 'unchanged' && 'Risk posture unchanged'}
        </p>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">

          {diff.added.length > 0 && (
            <div className="rounded-lg border border-red-500/20 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 text-xs font-semibold uppercase tracking-wide">
                <ShieldAlert size={13} />
                New Exposures ({diff.added.length})
              </div>
              {diff.added.map((p, i) => <PortRow key={i} port={p} tone="added" />)}
            </div>
          )}

          {diff.removed.length > 0 && (
            <div className="rounded-lg border border-green-500/20 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 text-xs font-semibold uppercase tracking-wide">
                <ShieldCheck size={13} />
                Closed Since Baseline ({diff.removed.length})
              </div>
              {diff.removed.map((p, i) => <PortRow key={i} port={p} tone="removed" />)}
            </div>
          )}

          {diff.unchanged.length > 0 && (
            <div className="rounded-lg border border-zinc-800 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/60 text-zinc-400 text-xs font-semibold uppercase tracking-wide">
                <Minus size={13} />
                Unchanged ({diff.unchanged.length})
              </div>
              {diff.unchanged.map((p, i) => <PortRow key={i} port={p} tone="unchanged" />)}
            </div>
          )}

          {diff.added.length === 0 && diff.removed.length === 0 && diff.unchanged.length === 0 && (
            <p className="text-center text-zinc-600 text-sm py-6">No open ports in either scan.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComparisonReport;
