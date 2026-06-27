import { useState } from 'react';
import ScanTypeSelect from './ScanTypeSelect';

function ScanForm({ onScan, isScanning }) {

  const [target, setTarget] = useState('');
  const [scanType, setScanType] = useState('quick');

  function handleSubmit(e) {
    e.preventDefault();
    if (!target.trim() || isScanning) return;
    onScan(target.trim(), scanType);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="localhost , 192.168.1.1..."
        disabled={isScanning}
        className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-green-400 placeholder:text-zinc-500 outline-none focus:border-green-500"
      />

      <ScanTypeSelect value={scanType} onChange={setScanType} disabled={isScanning} />

      <button
        type="submit"
        disabled={isScanning || !target.trim()}
        className="bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold px-5 py-2 rounded transition-colors"
      >
        Run scan
      </button>
    </form>
  );
}

export default ScanForm;
