function ResultsTable({ scan }) {
  
  if (!scan) {
    return (
      <div className="border border-dashed border-zinc-700 rounded p-10 text-center text-zinc-500">
        No scan selected yet. Run one above.
      </div>
    );
  }

  const ports = scan.raw_result?.ports || [];

  return (
    <div className="border border-zinc-700 rounded overflow-hidden">
      <div className="flex justify-between items-center bg-zinc-900 px-4 py-3 border-b border-zinc-700">
        <span className="text-green-400 font-medium">{scan.target}</span>
        <span className={scan.status === 'completed' ? 'text-green-400' : 'text-red-400'}>
          {scan.status}
        </span>
      </div>

      {ports.length === 0 ? (
        <p className="p-4 text-zinc-500 text-sm">No open ports found.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-zinc-500 text-left border-b border-zinc-800">
              <th className="px-4 py-2">Port</th>
              <th className="px-4 py-2">Protocol</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">Service</th>
            </tr>
          </thead>
          <tbody>
            {ports.map((p, index) => (
              <tr key={index} className="border-b border-zinc-800/50">
                <td className="px-4 py-2 text-green-400">{p.port}</td>
                <td className="px-4 py-2 text-zinc-400">{p.protocol}</td>
                <td className="px-4 py-2">{p.state}</td>
                <td className="px-4 py-2">{p.service}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ResultsTable;
