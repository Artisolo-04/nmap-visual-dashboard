const PORT_RISK = {
  21    : 25,    // FTP — often unencrypted, old, frequently exploited
  23    : 30,    // Telnet — sends everything (even passwords) in plain text
  135   : 15,    // MSRPC — historically a common attack vector on Windows
  139   : 15,    // NetBIOS — legacy Windows file sharing, often unnecessary exposure
  445   : 20,    // SMB — same family, very commonly targeted (e.g. WannaCry used this)
  3389  : 25,    // RDP — remote desktop, a top target for brute-force attacks
  5900  : 20,    // VNC — remote control, frequently misconfigured with weak/no auth
  3306  : 15,    // MySQL — a database exposed directly to the network is risky
  5432  : 15,    // PostgreSQL — same reasoning
  27017 : 15,    // MongoDB — same reasoning, famously left open & raided in the wild
  6379  : 15,    // Redis — same reasoning, often has no auth by default
};

const LOW_RISK_DEFAULT = 5 ;
const UNKNOWN_PORT_DEFAULT = 8 ;

const LOW_RISK_PORTS = new Set([22, 443]);

function scoreOnePort(port) {
  const portNumber = Number(port.port);

  if (PORT_RISK[portNumber] !== undefined) {
    return PORT_RISK[portNumber];
  }
  if (LOW_RISK_PORTS.has(portNumber)) {
    return LOW_RISK_DEFAULT;
  }
  return UNKNOWN_PORT_DEFAULT;
}

function scoreToGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function calculateRisk(parsedResult) {
  const openPorts = (parsedResult.ports || []).filter((p) => p.state === 'open');

  let score = 100;

  for (const port of openPorts) {
    score -= scoreOnePort(port);
  }

  score = Math.max(0, score);

  return { score, grade: scoreToGrade(score) };
}

module.exports = { calculateRisk };
