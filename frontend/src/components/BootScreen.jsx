import { useState, useEffect } from 'react';

const BOOT_LINES = [
  'Initializing dashboard core...',
  'Loading network interfaces... OK',
  'Establishing secure session...',
  'Importing nmap signatures... done',
  'System ready.',
];

function BootScreen({ onComplete }) {

  const [visibleLines, setVisibleLines] = useState([]);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let timeoutId;

    function typeNextChar() {

      const line = BOOT_LINES[lineIndex];

      if (charIndex < line.length) {

        setCurrentText(line.slice(0, charIndex + 1));
        charIndex++;
        timeoutId = setTimeout(typeNextChar, 22);

      } else {

        setVisibleLines((prev) => [...prev, line]);
        setCurrentText('');
        lineIndex++;

        if (lineIndex < BOOT_LINES.length) {
          timeoutId = setTimeout(typeNextChar, 180);
        } else {
          timeoutId = setTimeout(onComplete, 700);
        }
      }
    }

    timeoutId = setTimeout(typeNextChar, 300);

    return () => clearTimeout(timeoutId);

  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-xl px-6 font-mono text-sm text-green-400 space-y-1.5 border-1 border-green-500 p-4 rounded-xl">
        {visibleLines.map((line, i) => (
          <p key={i}>
            <span className="text-zinc-600">$</span> {line}
          </p>
        ))}

        {currentText && (
          <p>
            <span className="text-zinc-600">$</span> {currentText}
            <span className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle animate-blink" />
          </p>
        )}
      </div>
    </div>
  );
}

export default BootScreen;
