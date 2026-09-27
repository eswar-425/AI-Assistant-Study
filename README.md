# AI Study Assistant — Smart Quiz & Flashcards 📚

An AI-powered web application that transforms unstructured study notes and topics into comprehensive summaries, key takeaway points, active-recall flashcards, and interactive multiple-choice practice quizzes with automated mistake tracking and targeted retesting.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Architecture & Tech Stack](#-architecture--tech-stack)
3. [Setup & Installation](#-setup--installation)
4. [Usage Guide](#-usage-guide)
5. [AI-Usage Note & Prompt Engineering](#-ai-usage-note--prompt-engineering)
6. [System Limitations](#-system-limitations)
7. [Time Spent](#-time-spent)
8. [Project Structure](#-project-structure)
9. [Interview Explanation Guide](#-interview-explanation-guide)

---

## 🌟 Project Overview

The **AI Study Assistant** is built for students and lifelong learners who want to study smarter rather than harder. Instead of manually creating flashcards or quiz questions, users simply provide a topic or paste lecture notes. The backend communicates securely with the **Google Gemini API (`gemini-2.5-flash`)** to produce a validated, structured study package stored directly in **MongoDB Atlas**.

### Key Highlights
- **Relevant Summaries & Key Takeaways**: High-yield concepts formatted for fast review.
- **10 Active-Recall Flashcards**: Question & answer flip cards with progress tracking.
- **10 Practice MCQ Questions**: Deeply relevant 4-option questions with detailed answer explanations.
- **Targeted Mistake Retests**: Isolates missed questions so learners can retest until mastery.
- **Persistent Tab State**: Switching between study tabs preserves quiz question index and flashcard position without resetting.
- **Global Dark/Light Theme**: Built using React Context API with persistent `localStorage` preference.
- **Strictly Zero CSS Animations**: Clean, static, distraction-free styling that is easy to write and explain in technical interviews.

---

## 🏗️ Architecture & Tech Stack

```text
+-----------------------------------------------------------+
|                   React Frontend (Vite)                   |
|  - Topic/Notes Input (Validation & Sample Chips)          |
|  - Summary & Key Points Viewer                            |
|  - 10 Flashcard Active Recall Engine                      |
|  - 10 MCQ Practice Quiz & Answer Evaluation               |
|  - Mistake Tracking & Targeted Retest Runner              |
|  - Global ThemeContext (Dark/Light Mode)                  |
+-----------------------------+-----------------------------+
                              |
                              | HTTP / JSON (Proxy /api)
                              v
+-----------------------------------------------------------+
|                  Node.js + Express Backend                |
|  - Request Validation & Sanitization                      |
|  - Structured Gemini 2.5 Prompt Construction              |
|  - JSON Parsing & Markdown Fence Stripping                |
|  - Output Schema & 4-Option MCQ Validation                |
|  - MongoDB Atlas Session Persistence (Mongoose)           |
|  - Centralized Error Handling Middleware                  |
+--------------------+---------------------+----------------+
                     |                     |
                     v                     v
+----------------------------+   +--------------------------+
|     Google Gemini API      |   |      MongoDB Atlas       |
|    (gemini-2.5-flash)      |   |  (StudySession Cluster)  |
+----------------------------+   +--------------------------+
```

### Technology Stack
- **Frontend**: React 18, Vite, JavaScript (ES6+), Vanilla CSS (Custom Design System, Zero Animations), React Context API.
- **Backend**: Node.js, Express.js, Mongoose (MongoDB Atlas), `@google/generative-ai` SDK, `dotenv`, `cors`.
- **AI Model**: Google Gemini 2.5 Flash (`gemini-2.5-flash`).
- **Database**: MongoDB Atlas cloud cluster.

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js**: Version `18.0.0` or higher installed (`node -v`).
- **npm**: Version `9.0.0` or higher (`npm -v`).
- **Google Gemini API Key**: Free key from [Google AI Studio](https://aistudio.google.com/).
- **MongoDB URI** *(Optional)*: MongoDB Atlas connection string or local MongoDB instance.

---

### Step 1: Clone or Navigate to the Project
```bash
cd "AI Study Assistant"
```

### Step 2: Install All Dependencies
Run the standard install command (auto-installs root, server, and client dependencies via postinstall):
```bash
npm install
```
*(Or manually run: `npm run install-all`)*

---

### Step 3: Configure Environment Variables
Create or verify the configuration in `server/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai-study-assistant?retryWrites=true&w=majority
```

*(Note: The server also auto-syncs with root `.env`. If no MongoDB URI is supplied, it gracefully runs in in-memory session mode without crashing.)*

---

### Step 4: Run the Application
Start both the Express backend server and the Vite React frontend concurrently:
```bash
npm start
```
*(Or `npm run dev`)*

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 📖 Usage Guide

```text
1. Enter Topic / Notes
   └── Type a topic (e.g., "Operating System CPU Scheduling") or click a quick chip.
2. Generate Material
   └── Click "Generate Study Material". AI generates 10 flashcards, 10 MCQs, summary, and key points.
3. Review Summary & Key Points
   └── Read the high-yield overview and numbered takeaways.
4. Practice Active Recall Flashcards
   └── Navigate through 10 flashcards, mentally recall the concept, and click "Show Answer".
5. Take the 10-Question Practice Quiz
   └── Select an option for each question. Click "Submit Answer" to get immediate feedback and detailed explanation.
6. Review Score & Performance
   └── View total score and accuracy percentage.
7. Retest Missed Questions
   └── If any questions were missed, click "Retest Wrong Answers" to enter targeted retest mode until mastery.
8. Toggle Theme
   └── Click the Sun/Moon button in the top navbar to toggle between Dark and Light mode.
```

---

## 🤖 AI-Usage Note & Prompt Engineering

### How Gemini is Integrated
1. **Server-Side Security**: The Gemini API key is stored strictly on the backend via environment variables and is never exposed to the client.
2. **Structured JSON Output**: The backend constructs a strict prompt enforcing a JSON schema:
   - Topic Summary (2-3 paragraphs)
   - Key Points (6-8 takeaways)
   - Flashcards (Exactly 10 items with question & answer)
   - Practice Quiz (Exactly 10 items, each with 4 distinct options, correct answer, and explanation)
3. **Response Parsing & Normalization**: `server/utils/responseParser.js` extracts pure JSON from the raw model response, safely stripping markdown fences (` ```json `) and trailing tokens.
4. **Schema Validation**: `server/validators/studyValidator.js` validates all data types, option counts, and answer correctness before returning the payload to the frontend.
5. **Model Fallback Chain**: Tries `gemini-2.5-flash`, `gemini-flash-latest`, `gemini-2.5-pro`, and `gemini-pro-latest` in order of availability.

---

## ⚠️ System Limitations

1. **Session-Based Client Progress**: The initial release tracks quiz score and viewed flashcards for the active study session in the browser. Persistent user accounts with login/passwords are out of scope for v1.
2. **Database Scope**: Saves generated study sessions and quiz scores to MongoDB. Future versions can add user auth and long-term retention analytics.
3. **API Rate Limits**: Dependent on the Google Gemini API quota assigned to the user's API key.
4. **Internet Dependency**: Live AI generation requires active internet access to reach the Gemini API endpoint.

---

## ⏱️ Time Spent

Total development effort was structured into modular phases:

| Phase | Description | Time Spent |
| :--- | :--- | :--- |
| **Phase 1: Architecture & Setup** | Project setup, SRS review, Express backend scaffolding, Vite React initialization | ~45 mins |
| **Phase 2: Backend API & AI Integration** | Prompt engineering, Gemini 2.5 Flash client, response parser, schema validators | ~1 hr 30 mins |
| **Phase 3: Database Integration** | Mongoose schemas, MongoDB Atlas connection, session persistence, history API | ~45 mins |
| **Phase 4: Frontend Components** | Summary, KeyPoints, Flashcards engine, Quiz master, Retest runner, Session tracker | ~2 hrs |
| **Phase 5: State & Tab Persistence** | Persistent tab mounting in DOM to prevent quiz resets, state synchronization | ~45 mins |
| **Phase 6: ThemeContext & Dark Mode** | React Context API implementation, persistent `localStorage`, dark theme CSS tokens | ~45 mins |
| **Phase 7: Vector Icons & Styling** | Realistic SVG icon library, platform color matching, zero-animation CSS verification | ~45 mins |
| **Phase 8: Testing & Documentation** | End-to-end API testing, model response validation, comprehensive README creation | ~45 mins |
| **Total** | **Full End-to-End Implementation** | **~8 Hours** |

---

## 📁 Project Structure

```text
AI Study Assistant/
├── package.json                   # Root concurrently script (`npm run dev`, `npm run install-all`)
├── README.md                      # Comprehensive project guide & interview notes
├── spec.md                        # Software Requirements Specification (SRS)
├── .gitignore                     # Git ignore rules for node_modules and .env
│
├── server/                        # Backend (Node.js + Express)
│   ├── package.json
│   ├── server.js                  # Entry point with CORS, JSON parser, and routes
│   ├── .env                       # Environment variables (PORT, GEMINI_API_KEY, MONGODB_URI)
│   ├── .env.example               # Example template
│   ├── config/
│   │   └── db.js                  # Mongoose connection to MongoDB Atlas
│   ├── models/
│   │   └── StudySession.js        # Mongoose schema for study sessions & quiz scores
│   ├── controllers/
│   │   └── studyController.js     # Orchestrates generation, saving, and history retrieval
│   ├── routes/
│   │   └── studyRoutes.js         # POST /api/study/generate, GET /api/study/history
│   ├── services/
│   │   └── geminiService.js       # Gemini 2.5 Flash client & structured prompt builder
│   ├── validators/
│   │   └── studyValidator.js      # Input validation & strict AI JSON schema validation
│   ├── utils/
│   │   └── responseParser.js      # Strips markdown fences & parses JSON safely
│   └── middleware/
│       └── errorHandler.js        # Centralized HTTP error handler
│
└── client/                        # Frontend (React + Vite)
    ├── package.json
    ├── vite.config.js             # Vite configuration with API proxy to port 5000
    ├── index.html                 # HTML shell with metadata & favicon
    ├── src/
    │   ├── main.jsx               # React DOM entry wrapped in ThemeProvider
    │   ├── App.jsx                # Main layout, view switching & innovative footer
    │   ├── index.css              # Custom design system with Light/Dark theme (Zero Animations)
    │   ├── context/
    │   │   └── ThemeContext.jsx   # Global Theme State Management via Context API
    │   ├── hooks/
    │   │   └── useStudy.js        # Custom hook for study state & API requests
    │   ├── services/
    │   │   └── studyApi.js        # Fetch API service layer
    │   ├── pages/
    │   │   ├── Home.jsx           # Landing page with topic/notes input
    │   │   └── Study.jsx          # Tabbed study hub (Summary, Flashcards, Quiz, Progress)
    │   └── components/
    │       ├── Icons.jsx          # Lightweight, realistic SVG vector icons
    │       ├── Navbar.jsx         # Navigation header with Dark/Light theme toggle
    │       ├── StudyInput.jsx     # Topic/notes input form with quick suggestion chips
    │       ├── Summary.jsx        # AI-generated topic summary
    │       ├── KeyPoints.jsx      # High-yield bullet takeaways
    │       ├── Flashcards.jsx     # 10 Active-recall flashcards with Prev/Next
    │       ├── Quiz.jsx           # Quiz master controller (Question -> Result -> Retest)
    │       ├── QuizQuestion.jsx   # Individual MCQ with normalized option evaluation & explanations
    │       ├── QuizResult.jsx     # Performance summary, accuracy % & retest trigger
    │       ├── Retest.jsx         # Targeted retest runner for missed questions
    │       ├── ProgressTracker.jsx# Visual session progress indicator
    │       ├── Loading.jsx        # Simple loading state card
    │       └── ErrorMessage.jsx   # Error state card with retry button
```

---

## 💡 Interview Explanation Guide

If asked by an interviewer to explain the codebase or write parts of it on a whiteboard:

1. **How is Dark Theme implemented?**
   - We used the **React Context API** in `ThemeContext.jsx` with `createContext()`, `ThemeProvider`, and `useTheme()`.
   - The theme is stored in `localStorage` and toggled using `document.documentElement.setAttribute('data-theme', theme)`.
   - In `index.css`, we use CSS custom properties (`:root` for light and `:root[data-theme="dark"]` for dark) so the entire UI updates automatically without re-rendering every style rule.

2. **How does the client communicate with the backend?**
   - The React frontend calls `studyApi.generateStudyMaterial(topic, notes)` using standard `fetch('/api/study/generate', { method: 'POST' })`.
   - The Vite dev server proxies all `/api` requests to Express on port `5000`.

3. **Why did tab switching previously reset the quiz, and how was it fixed?**
   - Initially, conditional rendering (`{activeTab === 'quiz' && <Quiz />}`) unmounted the component, resetting its internal `useState(0)`.
   - We fixed this by keeping all tab panels mounted in the DOM and toggling their visibility with `style={{ display: activeTab === '...' ? 'block' : 'none' }}`, completely preserving quiz index, selected options, and flashcard positions.

4. **How are Gemini responses validated?**
   - We instruct Gemini to return strictly JSON.
   - `responseParser.js` strips any accidental markdown code fences (` ```json `).
   - `studyValidator.js` validates that `title` is a string, `summary` is a string, `keyPoints` is an array of strings, `flashcards` contains 10 `{question, answer}` pairs, and `quiz` contains 10 items with 4 distinct options and matching correct answers.
