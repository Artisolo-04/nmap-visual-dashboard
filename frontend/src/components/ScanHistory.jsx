import { useState } from 'react';
import { History, Wifi, Zap, ScanSearch, Layers, GitCompare, Check, Search, AlertTriangle } from 'lucide-react';

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

// Each type gets its OWN accent color when active, so the filter row itself
// teaches you the color language at a glance, same idea as the grade badges
const TYPE_FILTER_OPTIONS = [
  { type: 'quick',    label: 'Quick',    icon: Zap,        active: 'text-green-400 bg-green-500/15 border-green-500/40' },
  { type: 'detailed', label: 'Detailed', icon: ScanSearch, active: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/40'   },
  { type: 'full',     label: 'Full',     icon: Layers,     active: 'text-purple-400 bg-purple-500/15 border-purple-500/40' },
];

function GradeBadge({ grade }) {
  if (!grade) return null;
  const cfg = gradeConfig[grade] ?? { bg: 'bg-zinc-800', text: 'text-zinc-400', border: 'border-zinc-700' };
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {grade}
    </span>
  );
}

function ScanHistory({ scans, onSelect, onCompare }) {
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilters, setTypeFilters] = useState([]); // empty = show every type
  const [riskyOnly, setRiskyOnly] = useState(false);

  const anchorScan = selectedIds.length > 0 ? scans.find((s) => s.id === selectedIds[0]) : null;

  const filteredScans = scans.filter((scan) => {
    const matchesSearch = scan.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilters.length === 0 || typeFilters.includes(scan.scan_type);
    const matchesRisk = !riskyOnly || scan.risk_grade === 'D' || scan.risk_grade === 'F';
    return matchesSearch && matchesType && matchesRisk;
  });

  function isSelectable(scan) {
    if (!anchorScan) return true;
    if (scan.id === anchorScan.id) return true;
    return scan.scan_type === anchorScan.scan_type;
  }

  function toggleCompareMode() {
    setIsCompareMode((prev) => !prev);
    setSelectedIds([]);
  }

  function toggleTypeFilter(type) {
    setTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function toggleSelect(scanId) {
    setSelectedIds((prev) => {
      if (prev.includes(scanId)) {
        return prev.filter((id) => id !== scanId);
      }
      if (prev.length >= 2) {
        return [prev[1], scanId];
      }
      return [...prev, scanId];
    });
  }

  function handleRowClick(scan) {
    if (isCompareMode) {
      toggleSelect(scan.id);
    } else {
      onSelect(scan);
    }
  }

  function handleConfirmCompare() {
    const scanA = scans.find((s) => s.id === selectedIds[0]);
    const scanB = scans.find((s) => s.id === selectedIds[1]);
    if (scanA && scanB) {
      onCompare(scanA, scanB);
      setIsCompareMode(false);
      setSelectedIds([]);
    }
  }

  return (
    <div className="relative h-[480px] flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/40">
        <History size={13} className="text-emerald-500" />
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">History</span>

        <button
          onClick={toggleCompareMode}
          className={`ml-auto flex items-center gap-1.5 text-[10px] font-medium px-2 py-1.5 rounded-md border transition-colors ${
            isCompareMode
              ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
              : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:text-zinc-300'
          }`}
        >
          <GitCompare size={12} />
          {isCompareMode ? 'Cancel' : 'Compare'}
        </button>
      </div>

      {/* Search + filter icons share one compact row to save space */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800/60 bg-zinc-950/30">
        <Search size={13} className="text-zinc-600 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by target..."
          className="flex-1 min-w-0 bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 outline-none"
        />

        <div className="h-4 w-px bg-zinc-800 shrink-0" />

        <div className="flex items-center gap-1 shrink-0">
          {TYPE_FILTER_OPTIONS.map(({ type, label, icon: Icon, active }) => {
            const isActive = typeFilters.includes(type);
            return (
              <button
                key={type}
                title={`${label} scans`}
                onClick={() => toggleTypeFilter(type)}
                className={`flex items-center justify-center w-6 h-6 rounded-md border transition-colors ${
                  isActive ? active : 'text-zinc-600 border-zinc-800 hover:text-zinc-400'
                }`}
              >
                <Icon size={12} />
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-zinc-800 shrink-0" />

        <button
          title="Risky scans only (grade D or F)"
          onClick={() => setRiskyOnly((prev) => !prev)}
          className={`flex items-center justify-center w-6 h-6 rounded-md border transition-colors shrink-0 ${
            riskyOnly
              ? 'text-red-400 bg-red-500/15 border-red-500/40'
              : 'text-zinc-600 border-zinc-800 hover:text-zinc-400'
          }`}
        >
          <AlertTriangle size={12} />
        </button>
      </div>

      {filteredScans.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-zinc-600">
          <Wifi size={24} className="opacity-30" />
          <p className="text-sm">{scans.length === 0 ? 'No scans yet.' : 'No matches.'}</p>
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto divide-y divide-zinc-800/50">
          {filteredScans.map((scan) => {
            const openCount = scan.raw_result?.ports?.filter((p) => p.state === 'open').length ?? 0;
            const TypeIcon = SCAN_TYPE_ICONS[scan.scan_type] || Zap;
            const isSelected = selectedIds.includes(scan.id);

            return (
              <li key={scan.id}>
                <button
                  onClick={() => handleRowClick(scan)}
                  disabled={isCompareMode && !isSelectable(scan)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 group disabled:opacity-30 disabled:cursor-not-allowed ${
                    isSelected ? 'bg-cyan-500/10' : 'hover:bg-zinc-900/70'
                  }`}
                >
                  {isCompareMode && (
                    <span
                      className={`flex items-center justify-center w-4 h-4 rounded border shrink-0 transition-colors ${
                        isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-zinc-600'
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-zinc-950" />}
                    </span>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                      {scan.target}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                      {new Date(scan.scanned_at).toLocaleString(undefined, {
                        dateStyle: 'short',
                        timeStyle: 'short', // dropped seconds — shorter text, less likely to overflow
                      }).replace(', ', ' - ')}
                      <span className="text-zinc-700 mx-1">·</span>
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

      {isCompareMode && selectedIds.length === 2 && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-zinc-900 border-t border-cyan-500/30">
          <button
            onClick={handleConfirmCompare}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 font-medium text-sm py-2.5 hover:bg-cyan-500/25 transition-colors"
          >
            <GitCompare size={14} />
            Compare these 2 scans
          </button>
        </div>
      )}
    </div>
  );
}

export default ScanHistory;
