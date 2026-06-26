import BootScreen from './components/BootScreen';
import { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import api from './api';
import ScanForm from './components/ScanForm';
import ResultsTable from './components/ResultsTable';
import ScanHistory from './components/ScanHistory';

function App() {

  const [isBooting, setIsBooting] = useState(true);
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

  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

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
    <div className="relative z-10 min-h-screen flex items-center justify-center p-6">

      <div className="w-full max-w-5xl rounded-xl border border-zinc-800 bg-[#0d1311] shadow-[0_0_60px_rgba(34,197,94,0.08)] overflow-hidden">

        <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-950/80 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-xs text-zinc-500">root@dashboard:~/nmap</span>
        </div>

        <div className="p-6 space-y-6">
          <header className="flex items-center gap-3">
            <ShieldCheck className="text-green-400" size={26} />
            <div>
              <h1 className="text-lg font-semibold text-zinc-100">Nmap Dashboard</h1>
              <p className="text-sm text-zinc-500">Run scans , read results , keep a history .</p>
            </div>
          </header>

          <section className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-5">
            <ScanForm onScan={handleScan} isScanning={isScanning} />
          </section>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-800/50 bg-red-950/40 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            <ResultsTable scan={activeScan} />
            <ScanHistory scans={scans} onSelect={setActiveScan} />
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
