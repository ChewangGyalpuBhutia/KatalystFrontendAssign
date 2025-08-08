# My React App (Google Calendar MCP Frontend)

This is a modern, responsive React (Vite + TypeScript) frontend for visualizing Google Calendar meetings using a backend powered by Composio's Model Context Protocol (MCP).

## Features
- Beautiful, Streamlit-inspired UI
- Login screen (mock auth)
- Fetch and display upcoming and past meetings
- AI-powered meeting summaries (Gemini API)
- Responsive and mobile-friendly

## Setup

1. **Install dependencies:**
  ```sh
  pnpm install
  ```
2. **Set up environment variables:**
  - Copy `.env.example` to `.env` and add your Gemini API key as `VITE_GEMINI_API_KEY`.
  - Set your backend API URL if needed.

3. **Run locally:**
  ```sh
  pnpm dev
  ```
  The app will run on `http://localhost:5173` by default.

4. **Deploy to Vercel:**
  - Push your code to GitHub.
  - Import the project in [Vercel](https://vercel.com/).
  - Set environment variables in the Vercel dashboard.
  - Deploy!

## Notes
- Make sure your backend is deployed and accessible from the frontend.
- Update API URLs in your code if deploying both frontend and backend to Vercel.
- See `src/components/Meetings.tsx` for UI and API integration details.

---

**Made with ❤️ for the Katalyst AI assignment.**
