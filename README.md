# 🛡️ Nmap Visual Dashboard

A full-stack security dashboard that takes `nmap` — a real command-line tool security pros actually use — and wraps it in a clean web UI. Scan a target, get an instant A–F risk grade, compare scans over time, and watch a hacker-style boot sequence every time you open it because why not 😄

Built this one because I love both sides of dev: making things look good AND understanding what's actually happening under the hood on a network. This project is exactly that overlap.

> ⚠️ **Heads up:** only scan things you own or have permission to test — your own laptop, your own router, or a lab VM. Scanning random networks without permission is illegal, even if you're just curious like me.

---

## What it actually does

**3 scan modes, your choice**
- ⚡ Quick Scan — top 100 ports, done in seconds
- 🔍 Detailed Scan — same ports, but actually identifies what software/version is running
- 🗂️ Full Port Scan — checks ALL 65,535 ports, finds stuff hiding in weird places

**Automatic risk grading**
Every scan gets a real A–F grade based on what's exposed. Found Telnet or an open database port? That's a hit to your score. SSH and HTTPS barely dent it. Built the whole scoring logic myself, port by port.

**Compare two scans, see what changed**
Pick two scans of the same target and get a real before/after report — new ports, closed ports, and whether your risk grade went up or down. The app won't even let you compare two unrelated scans (different host, different scan type) because that comparison wouldn't mean anything — caught that bug myself partway through and fixed it 😅

**A history you can actually search**
Filter by scan type, filter to "risky only," search by target. No endless scrolling.

**The fun part — a typewriter boot screen**
First thing you see is a fake terminal boot sequence before the dashboard loads. Pure vibes, but it makes the whole thing feel like a real security tool instead of just another CRUD app.

---

## Tech I used

**Frontend:** React + Vite + Tailwind CSS v4, Lucide icons, Axios
**Backend:** Node.js + Express + PostgreSQL, real `nmap` calls via `child_process`, `xml2js` for parsing

---

## Running it yourself

You'll need Node 18+, Postgres 14+, and `nmap` installed.

```bash
sudo apt update && sudo apt install nmap -y
```

**1. Database**
```bash
sudo -u postgres psql -c "CREATE DATABASE nmap_visual_dashboard;"
sudo -u postgres psql -d nmap_visual_dashboard -f backend/schema.sql
sudo -u postgres psql -d nmap_visual_dashboard -f backend/schema_002_risk.sql
sudo -u postgres psql -d nmap_visual_dashboard -f backend/schema_003_scan_type.sql
```

**2. Backend**
```bash
cd backend
cp .env.example .env   # add your own DB password here
npm install
npm run dev
```

**3. Frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
```

Open the URL it gives you, type `localhost` in the box, hit scan. 🎉

---

## How it's organized

```
nmap-visual-dashboard/
├── backend/
│   └── src/
│       ├── controllers/scanController.js   # runs nmap, scores risk, compares scans
│       ├── utils/
│       │   ├── nmapParser.js               # turns nmap's XML into clean JSON
│       │   ├── riskScorer.js               # my A-F scoring algorithm
│       │   ├── scanTypes.js                # the 3 scan modes
│       │   └── diffScans.js                # comparison logic
│       └── routes/scans.js
└── frontend/
    └── src/
        └── components/
            ├── ScanTypeSelect.jsx          # fully custom dropdown, built from scratch
            ├── ScanningModal.jsx           # honest loading bar (doesn't fake 100%)
            ├── ScanHistory.jsx             # search + filters + compare mode
            ├── ComparisonReport.jsx        # the before/after report
            └── BootScreen.jsx              # the terminal intro animation
```

## A few things I'm proud of

**The risk score starts at 100 and subtracts** for every risky thing it finds — felt more honest than building a score up from nothing, and it's how real security assessments actually think about it.

**You literally cannot compare two scans that don't make sense together** — different target or different scan type and the option just locks itself out, dimmed and unclickable. Took me a couple tries to get this right but I'm happy with how it turned out.

**The loading bar never lies.** Nmap doesn't give real progress updates, so instead of faking a smooth 0→100%, mine caps around 92% until the real result actually comes back, then snaps to 100% for real. Small detail but it matters to me.

---

## Made by

**Khelifi Hachem** — [@Artisolo-04](https://github.com/Artisolo-04)
Self-taught, still learning, having way too much fun doing it.

---

*From clay and cardboard as a kid, to scanning networks as a student — still building, just with different tools now.*
