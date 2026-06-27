import { CheckCircle2, XCircle, Zap, ScanSearch, Layers } from 'lucide-react';
import RiskBadge from './RiskBadge';

function StatusPill({ status }) {
  const isUp = status === 'completed';
  const Icon = isUp ? CheckCircle2 : XCircle;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
      isUp
        ? 'bg-green-500/10 text-green-400 border-green-500/30'
        : 'bg-red-500/10 text-red-400 border-red-500/30'
    }`}>
      <Icon size={12} />
      {isUp ? 'HOST UP' : 'HOST DOWN'}
    </span>
  );
}

function PortDot({ state }) {
  return (
    <span className={`inline-block h-2 w-2 rounded-full shrink-0 ${
      state === 'open'
        ? 'bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.6)]'
        : 'bg-zinc-600'
    }`} />
  );
}

const SCAN_TYPE_ICONS = {
  quick: Zap,
  detailed: ScanSearch,
  full: Layers,
};

const SCAN_TYPE_LABELS = {
  quick: 'Quick',
  detailed: 'Detailed',
  full: 'Full',
};

function ScanTypeBadge({ scanType }) {
  const Icon = SCAN_TYPE_ICONS[scanType] || Zap;
  const label = SCAN_TYPE_LABELS[scanType] || 'Quick';

  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border bg-zinc-800/60 text-zinc-300 border-zinc-700">
      <Icon size={12} />
      {label}
    </span>
  );
}

const serviceColors = {
  ssh:             'text-blue-400      bg-blue-500/10     border-blue-500/20',
  http:            'text-cyan-400      bg-cyan-500/10     border-cyan-500/20',
  https:           'text-emerald-400   bg-emerald-500/10  border-emerald-500/20',
  ftp:             'text-yellow-400    bg-yellow-500/10   border-yellow-500/20',
  msrpc:           'text-purple-400    bg-purple-500/10   border-purple-500/20',
  upnp:            'text-pink-400      bg-pink-500/10     border-pink-500/20',
  ppp:             'text-zinc-400      bg-zinc-500/10     border-zinc-500/20',
  'http-proxy':    'text-cyan-400      bg-cyan-500/10     border-cyan-500/20',
  'netbios-ssn' :  'text-orange-400    bg-orange-500/10   border-orange-500/20',
  'microsoft-ds':  'text-orange-400    bg-orange-500/10   border-orange-500/20',
};

function ServiceTag({ name }) {
  const cls = serviceColors[name?.toLowerCase()] ?? 'text-zinc-400 bg-zinc-800 border-zinc-700';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${cls}`}>
      {name || '—'}
    </span>
  );
}

function StatCard({ value, label, accent }) {
  return (
    <div className="flex flex-col items-center justify-center py-3 px-2">
      <p className={`text-xl font-bold leading-none ${accent ?? 'text-zinc-100'}`}>{value}</p>
      <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

function ResultsTable({ scan }) {
  if (!scan) {
    return (
      <div className="h-[480px] flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 text-zinc-600 text-center p-6 gap-3">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="opacity-30">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p className="text-sm">No scan selected yet.<br/><span className="text-zinc-700">Run a scan or pick one from history.</span></p>
      </div>
    );
  }

  const ports = scan.raw_result?.ports || [];
  const openPorts = ports.filter((p) => p.state === 'open');

  return (
    <div className="h-[480px] flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">

      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/40">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-100 truncate leading-tight">{scan.target}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">{
            new Date(scan.scanned_at).toLocaleString(undefined, {
              dateStyle: 'short',
              timeStyle: 'medium',
            }).replace(', ', ' - ')
            }</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <ScanTypeBadge scanType={scan.scan_type} />
          <StatusPill status={scan.status} />
          <RiskBadge grade={scan.risk_grade} score={scan.risk_score} />
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-zinc-800/80 border-b border-zinc-800 bg-zinc-900/20">
        <StatCard value={openPorts.length} label="Open"    accent="text-green-400" />
        <StatCard value={ports.length}      label="Scanned" accent="text-zinc-100"  />
        <StatCard
          value={<span className="text-sm truncate max-w-[90px] block text-center">{scan.raw_result?.host || '—'}</span>}
          label="Resolved IP"
        />
      </div>

      <div className="flex-1 overflow-auto">
        {ports.length === 0 ? (
          <p className="px-5 py-8 text-center text-zinc-500 text-sm">No ports found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-zinc-950/95 z-10">
              <tr className="text-left text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                <th className="px-5 py-2.5 font-medium">Port</th>
                <th className="hidden sm:table-cell px-5 py-2.5 font-medium">Proto</th>
                <th className="px-5 py-2.5 font-medium">State</th>
                <th className="px-5 py-2.5 font-medium">Service</th>
                <th className="hidden md:table-cell px-3 sm:px-5 py-2">Version</th>
              </tr>
            </thead>
            <tbody>
              {ports.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-900/50 transition-colors group"
                >
                  <td className="px-5 py-2.5">
                    <span className="font-mono font-semibold text-zinc-100 group-hover:text-white transition-colors">
                      {p.port}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-5 py-2.5 text-zinc-600 text-xs uppercase tracking-wide">
                    {p.protocol}
                  </td>
                  <td className="px-5 py-2.5">
                    <span className="inline-flex items-center gap-2 text-zinc-300 text-xs">
                      <PortDot state={p.state} />
                      {p.state}
                    </span>
                  </td>
                  <td className="px-5 py-2.5">
                    <ServiceTag name={p.service} />
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-5 py-2.5 text-zinc-500 text-xs">
                    {[p.product, p.version].filter(Boolean).join(' ') || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ResultsTable;
