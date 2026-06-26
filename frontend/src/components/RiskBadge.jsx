const GRADE_STYLES = {
  A: { text: 'text-green-400',   border: 'border-green-500/30',   bg: 'bg-green-500/10'   },
  B: { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  C: { text: 'text-yellow-400',  border: 'border-yellow-500/30',  bg: 'bg-yellow-500/10'  },
  D: { text: 'text-orange-400',  border: 'border-orange-500/30',  bg: 'bg-orange-500/10'  },
  F: { text: 'text-red-400',     border: 'border-red-500/30',     bg: 'bg-red-500/10'     },
};

function RiskBadge({ grade, score }) {
  if (!grade) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border bg-zinc-800 text-zinc-500 border-zinc-700">
        N/A
      </span>
    );
  }

  const style = GRADE_STYLES[grade] || GRADE_STYLES.C;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
      {grade} · {score}/100
    </span>
  );
}

export default RiskBadge;
