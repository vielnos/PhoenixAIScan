# 🔥 PhoenixAIScan

**Pre-Execution AI Code Risk Scanner**

PhoenixAIScan helps developers **scan AI-generated code before executing it**.  
It detects destructive operations, highlights risky lines, and explains threats in plain English — so you don't run code blindly and regret it later.

> **Scan before you burn.**

---

## 🚀 Why PhoenixAIScan?

With the rise of *vibe coding*, developers often:
- Copy-paste AI-generated code  
- Run it without full review  
- Accidentally delete files, drop databases, or expose systems  

PhoenixAIScan acts as a **security checkpoint before execution**.

---

## ✨ Features

- 🔍 Scan pasted code or uploaded files  
- 🤖 Automatic language detection  
- 🎯 Line-level risk detection  
- 🔥 Visual highlighting of dangerous code  
- 📊 Risk score and grouped risk summary  
- 🗣️ Plain-English explanations  
- ⚡ Fast, lightweight, dependency-free UI  

---

## 🧪 Supported Languages

- 🐍 **Python**  
- 🐚 **Bash / Shell**  
- 🟨 **JavaScript (Node.js)**  
- 🗄️ **SQL**  

---

## 🚨 Detected Risk Categories

- 🔴 **Destructive File Operations**  
  `rm -rf`, `shutil.rmtree`, `os.remove`
  
- 🔴 **Database Destruction**  
  `DROP TABLE`, `TRUNCATE`, `DELETE` without `WHERE`
  
- 🔴 **System-Level Commands**  
  `sudo`, `exec`, `child_process`
  
- 🔴 **Permission Misuse**  
  `chmod 777`, unsafe ownership changes
  
- 🔴 **Execution & Backdoor Risks**

---

## 🖥️ Tech Stack

### Frontend
- HTML, CSS, Vanilla JavaScript  
- Dark security-themed UI  
- No heavy editors (fast & scalable)  

### Backend
- Python (FastAPI)  
- Rule-based scanning engine  
- Language auto-detection  
- REST API  

---

## 📂 Project Structure

```
PhoenixAIScan/
├── backend/
│   ├── main.py
│   ├── scanner/
│   │   ├── rules.py
│   │   ├── scanner.py
│   │   └── risk_engine.py
│   ├── utils/
│   │   └── language_detect.py
│   └── venv/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## ▶️ Run Locally

### 1️⃣ Backend

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload
```

**Backend runs at:** `http://127.0.0.1:8000`  
**API documentation:** `http://127.0.0.1:8000/docs`

### 2️⃣ Frontend

Open `index.html` using:
- VS Code Live Server
- Or any local HTTP server

---

## 🧠 Example

### Input

```python
import shutil
shutil.rmtree("/home/user")
```

### Output

- 🔴 **Risk Level:** CRITICAL
- 📍 Risky line highlighted
- 🧠 **Explanation:** Deletes entire directory permanently

---

## 🛣️ Roadmap

- 🔐 Advanced detection (reverse shells, API keys, persistence)
- 📄 Export scan reports (PDF / JSON)
- 🌐 Public deployment
- 🧪 More language support
- 🧠 ML-assisted risk reasoning

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

If you find this useful:
- ⭐ Star the repository
- 🐞 Report issues
- 💡 Suggest improvements

---

🔥 **PhoenixAIScan** — because blind execution burns.