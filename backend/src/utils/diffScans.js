function diffScans(fromScan, toScan) {

  const fromPorts = fromScan.raw_result?.ports || [];
  const toPorts = toScan.raw_result?.ports || [];

  const fromOpen = fromPorts.filter((p) => p.state === 'open');
  const toOpen = toPorts.filter((p) => p.state === 'open');

  const fromPortNumbers = new Set(fromOpen.map((p) => p.port));
  const toPortNumbers = new Set(toOpen.map((p) => p.port));

  const added = toOpen.filter((p) => !fromPortNumbers.has(p.port));

  const removed = fromOpen.filter((p) => !toPortNumbers.has(p.port));

  const unchanged = toOpen.filter((p) => fromPortNumbers.has(p.port));

  const gradeRank = { A: 5, B: 4, C: 3, D: 2, F: 1 };
  const fromRank = gradeRank[fromScan.risk_grade] || null;
  const toRank = gradeRank[toScan.risk_grade] || null;

  let riskDirection = 'unchanged';
  
  if (fromRank && toRank) {
    if (toRank > fromRank) riskDirection = 'improved';
    if (toRank < fromRank) riskDirection = 'worsened';
  }

  return {
    added,
    removed,
    unchanged,
    riskChange: {
      from: fromScan.risk_grade,
      to: toScan.risk_grade,
      direction: riskDirection,
    },
  };
}

module.exports = { diffScans };
