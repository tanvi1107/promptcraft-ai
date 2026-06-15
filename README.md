# AI Prompt Enhancer SaaS

A production-ready SaaS application that transforms rough, ambiguous user prompts into highly optimized, detailed, and structured prompts using Google's Gemini 2.5 Flash model. Designed with a premium dark/light glassmorphic UI.

## Features

- **Prompt Enhancement**: Converts rough prompts into structured prompts using custom instructions per category and enhancement level.
- **Three Enhancement Levels**:
  - **Basic**: Fixes grammar, clarifies core intent, and adds minimal structure.
  - **Professional**: Adds explicit context, role-playing guidelines, constraints, and structured outputs.
  - **Expert**: Incorporates step-by-step thinking instructions, edge-case handling, customizable variables, and advanced persona models.
- **Eight Categories**: Coding, UI/UX, Marketing, Content Writing, Business, Startup Ideas, Image Generation, and Resume Building.
- **Prompt History**: Saved locally inside the browser (`localStorage`) with full-text search, reload capability, and item deletion.
- **Interactive Sidebar**: Toggleable layout to access prompt history on the fly.
- **Visual Copy-to-Clipboard**: Quick copy button with interactive toast notifications.
- **Dark/Light Mode**: Full responsive design that dynamically updates HSL color variables and backdrop blur filters.

## Project Structure

```
├── backend/                  # Node.js + Express API
│   ├── controllers/          # API Controllers
│   ├── routes/               # Express Routes
│   ├── server.js             # Server entrypoint
│   └── package.json          # Node dependencies
├── frontend/                 # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/       # Reusable UI widgets
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API fetch services
│   │   ├── App.tsx           # Dashboard parent component
│   │   ├── index.css         # Styling system & Tailwind rules
│   │   └── main.tsx          # App entrypoint
│   ├── tailwind.config.js    # Tailwind configuration
│   └── package.json          # React dependencies
├── package.json              # Monorepo scripts
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- NPM (v9.0.0 or higher)
- A Google Gemini API Key

### Installation

1. Clone or copy the project to your local environment.
2. From the root directory, install all dependencies (root, backend, frontend) by running:
   ```bash
   npm run setup
   ```

### Configuration

1. In the `backend` directory, create a `.env` file:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_api_key_here
   ```

### Running Locally

To run both the backend server and the frontend client concurrently, run:
```bash
npm run dev
```

- Backend server: `http://localhost:5000`
- Frontend application: `http://localhost:5173`

---

## Deployment Instructions

### Frontend (Vercel)

The React frontend is optimized for deployment on Vercel:

1. Install the Vercel CLI or connect your GitHub repository to Vercel.
2. Set up the project configuration on Vercel:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-backend.onrender.com`). If not set, it defaults to `http://localhost:5000`.

### Backend (Render)

The Express backend can be easily deployed to Render:

1. Create a new Web Service on Render.
2. Connect your repository.
3. Configure the following details:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add the following Environment Variables under the Environment tab:
   - `PORT`: `5000` (or leave it to Render's default dynamic port)
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: Your production Google Gemini API key.
