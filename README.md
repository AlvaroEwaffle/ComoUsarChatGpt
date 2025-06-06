# ComoUsarChatGPT

A full-stack project to help professionals create and launch their service proposals, enhanced with AI. Includes a backend (Node.js/Express), and a modern frontend (React + TypeScript + Tailwind CSS).

## Features
- Personalized value proposition generator
- AI-powered service enhancement suggestions
- Payment integration with MercadoPago
- Responsive, mobile-friendly UI

## Project Structure
- `backend/` — Node.js/Express API, OpenAI integration, MercadoPago payments
- `frontend/` — React app, user flows, payment UI

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Backend Setup
```sh
cd backend
cp .env.example .env # Add your API keys and config
npm install
npm run dev
```

### Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

### Environment Variables
- **Never commit your `.env` files!**
- Add your OpenAI and MercadoPago keys to `backend/.env` (see `.env.example`)

## Usage
1. Go to the frontend app in your browser (usually http://localhost:5173)
2. Fill out your service details
3. Preview your AI-powered proposal
4. Unlock the full proposal with secure payment

## Security
- Sensitive files like `.env` are excluded via `.gitignore`
- If you accidentally commit secrets, use `git filter-repo` to remove them from history

## License
MIT 