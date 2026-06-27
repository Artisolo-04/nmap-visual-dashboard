import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Zap, ScanSearch, Layers } from 'lucide-react';

const OPTIONS = [
  { value: 'quick', label: 'Quick Scan', desc: 'Top 100 ports, fast', icon: Zap },
  { value: 'detailed', label: 'Detailed Scan', desc: 'Top 100 ports + version detection', icon: ScanSearch },
  { value: 'full', label: 'Full Port Scan', desc: 'All 65535 ports, slow', icon: Layers },
];

function ScanTypeSelect({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = OPTIONS.find((opt) => opt.value === value) || OPTIONS[0];
  const SelectedIcon = selected.icon;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(optionValue) {
    onChange(optionValue);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-w-[180px]"
      >
        <SelectedIcon size={14} className="text-green-400" />
        <span className="flex-1 text-left">{selected.label}</span>
        <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-72 rounded border border-zinc-800 bg-zinc-950 shadow-[0_8px_30px_rgba(0,0,0,0.6)] overflow-hidden">
          {OPTIONS.map((opt) => {
            const OptIcon = opt.icon;
            const isSelected = opt.value === value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors ${
                  isSelected ? 'bg-green-500/10' : 'hover:bg-zinc-900'
                }`}
              >
                <OptIcon size={16} className={`mt-0.5 ${isSelected ? 'text-green-400' : 'text-zinc-500'}`} />
                <div>
                  <p className={`text-sm font-medium ${isSelected ? 'text-green-400' : 'text-zinc-200'}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-zinc-500">{opt.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ScanTypeSelect;
