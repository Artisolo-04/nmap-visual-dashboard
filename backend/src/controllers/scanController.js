const { exec } = require('child_process');

const pool = require('../db/pool');

const { parseNmapXML } = require('../utils/nmapParser');

const SAFE_TARGET_REGEX = /^[a-zA-Z0-9.\-:]+$/;

async function runScan(req, res) {

  const { target } = req.body;

  if (!target || !SAFE_TARGET_REGEX.test(target)) {
    return res.status(400).json({ error: 'Invalid target. Use a hostname or IP only.' });
  }

  const command = `nmap -T4 -F -oX - ${target}`;

  exec(command, { timeout: 60000 }, async (error, stdout, stderr) => {

    if (error) {
      return res.status(500).json({ error: 'Scan failed', details: stderr || error.message });
    }

    try {

      const parsed = await parseNmapXML(stdout);

      const status = parsed.state === 'up' ? 'completed' : 'host_unreachable';

      const result = await pool.query(

        ` INSERT INTO scans ( target , status , raw_result )
          VALUES ($1, $2, $3)
          RETURNING id , target , status , raw_result , scanned_at ` ,
          [target , status , parsed]
      );

      res.status(201).json(result.rows[0]);

    } catch (parseErr) {
      res.status(500).json({ error: 'Failed to parse scan', details: parseErr.message });
    }
  });
}

async function getScans(req, res) {
  const result = await pool.query(
    ' SELECT id , target , status , raw_result , scanned_at FROM scans ORDER BY scanned_at DESC LIMIT 50 '
  );
  res.json(result.rows);
}

async function getScanById(req, res) {
  const result = await pool.query('SELECT * FROM scans WHERE id = $1', [req.params.id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Scan not found' });
  }

  res.json(result.rows[0]);
}

module.exports = { runScan, getScans, getScanById };
