import { useState, useEffect, useRef } from 'react';

const ESTIMATED_DURATION = {
  quick: 4000,
  detailed: 9000,
  full: 35000,
};

const STATUS_MESSAGES = [
  'Resolving target...',
  'Sending probe packets...',
  'Listening for responses...',
  'Identifying open ports...',
  'Matching service signatures...',
  'Finalizing report...',
];

function ScanningModal({ scanType, isFinishing, onFinish }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const progressRef = useRef(0);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (isFinishing) return;

    const duration = ESTIMATED_DURATION[scanType] || ESTIMATED_DURATION.quick;
    const startTime = Date.now();

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(92, (elapsed / duration) * 92));
      setMessageIndex(
        Math.min(STATUS_MESSAGES.length - 1, Math.floor((elapsed / duration) * STATUS_MESSAGES.length))
      );
    }, 50);

    return () => clearInterval(intervalId);
  }, [scanType, isFinishing]);

  useEffect(() => {
    if (!isFinishing) return;

    const startProgress = progressRef.current;
    const startTime = Date.now();
    const rushDuration = 350;

    const intervalId = setInterval(() => {
      const t = Math.min(1, (Date.now() - startTime) / rushDuration);
      setProgress(startProgress + (100 - startProgress) * t);

      if (t >= 1) {
        clearInterval(intervalId);
        setIsComplete(true);
      }
    }, 20);

    const finishTimer = setTimeout(onFinish, rushDuration + 450);

    return () => {
      clearInterval(intervalId);
      clearTimeout(finishTimer);
    };
  }, [isFinishing, onFinish]);

  const statusText = isComplete ? 'Scan complete' : STATUS_MESSAGES[messageIndex];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-xl border border-green-500/30 bg-[#0b0f0e] p-8 shadow-[0_0_60px_rgba(34,197,94,0.15)]">
        <p className={`text-center text-sm mb-8 font-mono ${isComplete ? 'text-green-400' : 'text-zinc-500'}`}>
          {statusText}
        </p>

        <div className="relative h-px bg-zinc-700 mt-2 mb-3">
          <div
            className="absolute top-0 left-0 h-px bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute left-0 -top-1.5 w-px h-3 bg-zinc-600" />
          <div
            className="absolute -top-1.5 w-px h-3 bg-green-400 transition-all duration-100"
            style={{ left: `${progress}%` }}
          />
          <div className="absolute right-0 -top-1.5 w-px h-3 bg-zinc-600" />
        </div>

        <p className="text-center text-green-400 font-mono text-sm">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

export default ScanningModal;
