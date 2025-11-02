# 🎙️ Speech Master (Frontend)

Frontend for **Speech Master**, an AI-powered learning platform that helps **trainees** improve pronunciation, comprehension, and communication while enabling **trainers** to manage quizzes, modules, and student performance.  

---

## 🌐 Live App
👉 [https://speechmaster.netlify.app](https://speechmaster.netlify.app)

> ⚡ For local development:  
> - Frontend runs on `http://localhost:5173`  
> - Backend runs on `http://localhost:5000`  

---

## 📂 GitHub Repositories
- **Frontend**: [https://github.com/KarlAngeloFlores/frontend-speech-master.git](https://github.com/KarlAngeloFlores/frontend-speech-master.git)  
- **Backend**: [https://github.com/KarlAngeloFlores/backend-speech-master.git](https://github.com/KarlAngeloFlores/backend-speech-master.git)  

---

## 🛠️ Tech Stack
- **React (Vite)** ⚡  
- **TailwindCSS** 🎨 (utility-first styling)  
- **Lucide React** (icons)  
- **Framer Motion** (animations)  
- **Recharts** (charts & analytics)  
- **Axios** (API requests)  
- **React Router DOM** (navigation)  
- **SweetAlert2** (custom alerts/modals)  
- **Web Speech API** (speech recognition & synthesis)  

---

## 🚀 Features

### 👨‍🏫 Trainer
- Dashboard with analytics  
- Manage quizzes/activities (Create, View Results, Delete)  
- Manage trainees (Approve, View Performance, Delete)  
- Upload and manage learning materials (PDF/Word)  

### 🧑‍🎓 Trainee
- Answer quizzes/activities (Shoot the Word, Pronounce It Fast)  
- View quiz results and performance  
- Word dictionary with definitions & adjustable speech speed (Web Speech API) (Dictionary API)
- Script practice via OpenAI-generated scripts (mic-based practice)  
- Access and view available modules from trainers  

---

## ⚙️ Installation & Setup (Local Development)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/KarlAngeloFlores/frontend-speech-master.git
cd frontend-speech-master
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
```bash
# Backend API URL
VITE_API_URL=your_backend_api_url
VITE_SOCKET_URL=your_socket_url
```

### 4️⃣ Run Development Server
```bash
npm run dev
```
- Frontend will run on http://localhost:5173