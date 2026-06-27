const SCAN_TYPES = {
  quick: {
    flags: '-T4 -F',
    label: 'Quick Scan',
  },
  detailed: {
    flags: '-T4 -F -sV',
    label: 'Detailed Scan',
  },
  full: {
    flags: '-T4 -p-',
    label: 'Full Port Scan',
  },
};

function getScanConfig(scanType) {
  return SCAN_TYPES[scanType] || SCAN_TYPES.quick;
}

module.exports = { SCAN_TYPES, getScanConfig };
