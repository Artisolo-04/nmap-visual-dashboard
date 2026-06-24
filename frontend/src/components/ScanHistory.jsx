function ScanHistory({ scans, onSelect }) {
  return (
    <div className="border border-zinc-700 rounded">
      <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-700 text-zinc-400 text-sm uppercase">
        History
      </div>

      {scans.length === 0 ? (
        <p className="p-4 text-zinc-500 text-sm">No scans yet.</p>
      ) : (
        <ul>
          {scans.map((scan) => (
            <li key={scan.id}>
              <button
                onClick={() => onSelect(scan)}
                className="w-full text-left px-4 py-3 border-b border-zinc-800/50 hover:bg-zinc-900 transition-colors"
              >
                <p className="text-green-400 text-sm">{scan.target}</p>
                <p className="text-zinc-500 text-xs">
                  {new Date(scan.scanned_at).toLocaleString()}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ScanHistory;
