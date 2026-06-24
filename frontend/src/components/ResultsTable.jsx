import { CheckCircle2, XCircle } from 'lucide-react';

function StatusPill({ status }) {
  const isUp = status === 'completed';
  const Icon = isUp ? CheckCircle2 : XCircle;
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${isUp ? 'text-green-400' : 'text-red-400'}`}>
      <Icon size={16} />
      {isUp ? 'HOST UP' : 'HOST DOWN'}
    </span>
  );
}

function PortDot({ state }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${
        state === 'open' ? 'bg-green-400 shadow-[0_0_6px_2px_rgba(74,222,128,0.6)]' : 'bg-zinc-600'
      }`}
    />
  );
}

function ResultsTable({ scan }) {
  if (!scan) {
    return (
      <div className="h-[480px] flex items-center justify-center rounded-lg border border-dashed border-zinc-800 text-zinc-600 text-center p-6">
        No scan selected yet. Run a scan or pick one from history.
      </div>
    );
  }

  const ports = scan.raw_result?.ports || [];
  const openPorts = ports.filter((p) => p.state === 'open');

  return (
    <div className="h-[480px] flex flex-col rounded-lg border border-zinc-800 bg-zinc-950/60 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
        <div>
          <p className="text-zinc-100 font-semibold leading-tight">{scan.target}</p>
          <p className="text-xs text-zinc-500">{new Date(scan.scanned_at).toLocaleString()}</p>
        </div>
        <StatusPill status={scan.status} />
      </div>

      <div className="grid grid-cols-3 divide-x divide-zinc-800 border-b border-zinc-800 text-center">
        <div className="px-3 py-2.5">
          <p className="text-xl font-semibold text-green-400">{openPorts.length}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wide">open</p>
        </div>
        <div className="px-3 py-2.5">
          <p className="text-xl font-semibold text-zinc-100">{ports.length}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wide">scanned</p>
        </div>
        <div className="px-3 py-2.5">
          <p className="text-sm font-semibold text-zinc-100 truncate">{scan.raw_result?.host || '—'}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wide">resolved IP</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {ports.length === 0 ? (
          <p className="px-5 py-8 text-center text-zinc-500 text-sm">No open ports found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-zinc-950/95">
              <tr className="text-left text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                <th className="px-3 sm:px-5 py-2">Port</th>
                <th className="hidden sm:table-cell px-3 sm:px-5 py-2">Protocol</th>
                <th className="px-3 sm:px-5 py-2">State</th>
                <th className="px-3 sm:px-5 py-2">Service</th>
              </tr>
            </thead>
            <tbody>
              {ports.map((p, i) => (
                <tr key={i} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-900/40">
                  <td className="px-3 sm:px-5 py-2.5 text-zinc-100 font-medium">{p.port}</td>
                  <td className="hidden sm:table-cell px-3 sm:px-5 py-2.5 text-zinc-500">{p.protocol}</td>
                  <td className="px-3 sm:px-5 py-2.5">
                    <span className="inline-flex items-center gap-2 text-zinc-200">
                      <PortDot state={p.state} />
                      {p.state}
                    </span>
                  </td>
                  <td className="px-3 sm:px-5 py-2.5 text-zinc-200">{p.service}</td>
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
