# 🔥 PhoenixAIScan

**Scan before you burn.**

PhoenixAIScan is a **pre-execution AI code risk scanner** designed to protect developers from running **dangerous or destructive AI-generated code** without understanding its impact.

In the era of *vibe coding*, PhoenixAIScan acts as a **security checkpoint between AI output and execution**.

---

## 🚩 Problem Statement

With the rapid adoption of AI-assisted coding:

- Developers often **copy–paste AI-generated code**
- Code is executed **without review**
- This can lead to:
  - Accidental file deletion
  - Database wipes
  - System-level damage
  - Credential leaks
  - Remote code execution

Existing tools focus on **syntax and style**, not **real-world execution risk**.

---

## 💡 Solution

PhoenixAIScan scans code **before execution** and:

- Detects destructive operations
- Highlights risky lines
- Explains risks in **plain English**
- Assigns a clear **risk score & severity**
- Works for both **pasted code and uploaded files**

> The goal is not to block execution —  
> the goal is to **make danger obvious before damage happens**.

---

## ✨ Key Features

### 🔍 Code Input
- Paste AI-generated code
- Upload files: `.py`, `.js`, `.sql`, `.sh`

### 🤖 Automatic Language Detection
- Works for pasted code and files
- Robust detection for:
  - Python
  - SQL
  - Bash / Shell
  - JavaScript / Node.js

### 🚨 Risk Detection (Rule-Based)
PhoenixAIScan detects **real execution risks**, not just bad style.

#### 🔴 Critical Risks
- Destructive file operations  
- Database destruction  
- Remote code execution  
- System-level command execution  

#### 🟠 High Risks
- Credential / API key exposure  
- Permission & ownership abuse  

#### 🟡 Medium Risks
- Persistence mechanisms (cron jobs, startup scripts)

### 🎯 Line-Level Highlighting
- Dangerous lines highlighted in red/orange
- Auto-scrolls to first critical issue

### 📊 Risk Scoring
- Score from **0–10**
- Severity levels:
  - SAFE
  - MEDIUM
  - HIGH
  - CRITICAL

### 🧠 Human-Readable Explanations
Example:
> "This line deletes an entire directory and all its contents permanently."

### ⚡ Fast & Lightweight
- Static analysis only
- No code execution
- No data stored

---

## 🧪 Supported Languages

| Language | Status |
|--------|--------|
| Python | ✅ |
| SQL | ✅ |
| Bash / Shell | ✅ |
| JavaScript (Node.js) | ✅ |

Detection works for:
- Short snippets
- Long files
- Mixed casing
- Paste or upload

---

## 🏗️ Architecture

### Frontend (Public)
- HTML, CSS, Vanilla JavaScript
- Dark security-themed UI
- Deployed on **GitHub Pages**

### Backend (Private)
- Python + FastAPI
- Rule-based static analysis engine
- Language detection heuristics
- Deployed on **Render**

### Security Design
- Backend source code kept **private**
- Frontend communicates via REST API only
- No code is executed on the server

---

## 📂 Project Structure

```
PhoenixAIScan/
├── index.html
├── style.css
├── script.js
└── README.md
```

```
PhoenixAIScan-backend/ (private)
├── main.py
├── scanner/
│   ├── rules.py
│   ├── scanner.py
│   └── risk_engine.py
├── utils/
│   └── language_detect.py
└── requirements.txt
```

---

## ▶️ Run Locally

### 1️⃣ Backend

```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

**Backend runs at:**
```
http://127.0.0.1:8000
```

**API docs:**
```
http://127.0.0.1:8000/docs
```

### 2️⃣ Frontend

Open `index.html` using:
- VS Code Live Server
- or any local HTTP server

---

## 🧠 Example

### Input

```python
import shutil
shutil.rmtree("/home/user/data")
```

### Output

- 🔴 **Risk Level:** CRITICAL
- 📍 Risky line highlighted
- 🧠 **Explanation:** Deletes directory permanently

---

## ⚙️ Handling Real-World Issues

### ✅ Paste vs File Consistency
- Language detection works for both pasted code and file uploads
- SQL queries like `TRUNCATE TABLE` are reliably detected

### ✅ Cold Start Handling
- Backend hosted on free tier may sleep after inactivity
- Frontend shows:
  - "Waking up backend… first scan may take up to 60 seconds"
- Requests timeout safely with retry guidance

### ✅ Race Condition Protection
- Scan button locking
- Request versioning
- UI reset before every scan
- Deterministic results

---

## 🛣️ Roadmap

- Credential masking suggestions
- Reverse shell detection expansion
- Export scan reports (PDF / JSON)
- More language support
- ML-assisted contextual risk reasoning

---

## 👨‍💻 Author

**Aayush Pandey**  
Security-focused developer exploring AI safety, automation, and application security.

---

## ⚠️ Disclaimer

PhoenixAIScan is a pre-execution risk scanner, not a replacement for full security audits.

Always review code manually before running it in production environments.

---

## ⭐ Support the Project

If you find PhoenixAIScan useful:

- ⭐ Star the repository
- 🐞 Report issues
- 💡 Suggest improvements

---

🔥 **PhoenixAIScan** — because blind execution burns.