import { useState, useEffect, useCallback } from 'react';
import api from './api';
import ScanForm from './components/ScanForm';
import ResultsTable from './components/ResultsTable';
import ScanHistory from './components/ScanHistory';

function App() {
  
  const [scans, setScans] = useState([]);
  const [activeScan, setActiveScan] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  const loadScans = useCallback(async () => {
    try {
      const res = await api.get('/scans');
      setScans(res.data);
    } catch (err) {
      console.error('Failed to load history', err);
    }
  }, []);

  useEffect(() => {
    loadScans();
  }, [loadScans]);

  async function handleScan(target) {
    setIsScanning(true);
    setError(null);

    try {
      const res = await api.post('/scans', { target });
      setActiveScan(res.data);
      await loadScans();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-zinc-200 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-green-400">Nmap Dashboard</h1>
          <p className="text-zinc-500 text-sm">Run scans, see results, keep history.</p>
        </header>

        <ScanForm onScan={handleScan} isScanning={isScanning} />

        {error && (
          <div className="bg-red-950 border border-red-700 text-red-400 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
          <ResultsTable scan={activeScan} />
          <ScanHistory scans={scans} onSelect={setActiveScan} />
        </div>
      </div>
    </div>
  );
}

export default App;
