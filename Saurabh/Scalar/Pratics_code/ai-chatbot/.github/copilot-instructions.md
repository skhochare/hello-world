# AI Coding Agent Instructions for ai-chatbot

## Architecture Overview
This is a full-stack AI chatbot application with weather query capabilities:
- **Frontend**: React app (client/) using Tailwind CSS for styling
- **Backend**: Node.js/Express server (server/) with ES modules
- **API Integration**: OpenWeatherMap for weather data

## Key Components
- `client/src/App.js`: Main chat interface with message state management
- `server/server.js`: Express server handling chat requests and weather API calls
- Helper functions: `extractCity()`, `isWeatherQuery()`, `getWeather()`

## Data Flow
1. User inputs message in React UI
2. POST to `/api/chat` with `{message: input}`
3. Server parses message for weather intent and city
4. Fetches weather from OpenWeatherMap API
5. Returns `{reply: weather_info}` or fallback message

## Development Workflow
- **Start server**: `cd server && node server.js` (add "start": "node server.js" to server/package.json)
- **Start client**: `cd client && npm start` (runs on http://localhost:3000)
- **Environment**: Create `server/.env` with `WEATHER_API_KEY=your_key` and `PORT=5000`

## Coding Patterns
- Use Tailwind utility classes for styling (e.g., `bg-blue-500 text-white px-4 py-2`)
- Server uses async/await for API calls
- Message parsing with regex: `/weather|temperature|temp|forecast/i` for intent, `/in ([a-zA-Z\s]+)/i` for city
- Error handling: Check API response `data.cod !== 200`

## Dependencies
- Client: React 19, Tailwind CSS
- Server: Express 5, node-fetch, cors, body-parser, dotenv

## Notes
- Root-level React app (`src/`) appears unused - focus on `client/` for frontend
- Server route `/api/chat` may need implementation if missing
- Weather API requires free API key from openweathermap.org