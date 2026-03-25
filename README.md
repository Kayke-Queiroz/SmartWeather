# SmartWeather 🌤️

> **AI Engineer Intern Assessment** — Candidate: **Kayke Queiroz dos Santos**

A full-stack weather application with real-time conditions, AI-powered insights, dynamic weather animations, interactive maps, and YouTube location videos — backed by a cloud database with full CRUD and data export.

---

## 🌐 Live Demo

**Frontend (Vercel):** https://smart-weather-sigma.vercel.app
**Backend API (Strapi Cloud):** https://attractive-crown-bc8583a2b3.strapiapp.com

---

## ✨ Features

### Frontend (Tech Assessment #1)
- 🔍 **Search** by city name, zip code, GPS coordinates, or landmarks
- 📍 **Current Location** detection via browser Geolocation API
- 🌡️ **Current Weather** — temperature, feels like, humidity, wind speed, rain chance
- 📅 **5-Day Forecast** with optional date range filter
- 🤖 **AI Insights** via Hugging Face (Qwen 2.5-72B) — clothing tips, activity suggestions, safety warnings
- 🗺️ **Interactive Map** via React Leaflet — click anywhere to search that location
- 🎬 **YouTube Videos** — cinematic drone tours of the searched city
- 🌩️ **Dynamic Backgrounds** — animated weather effects (rain, snow, storm, fog, clear...)
- ❌ **Error Handling** — graceful messages for invalid cities or API failures
- 📱 **Fully Responsive** — desktop, tablet, and mobile

### Backend (Tech Assessment #2)
- 💾 **Database** — SQLite (local) / Strapi Cloud (production) via Strapi 5 Headless CMS
- ✅ **Full CRUD** — Create, Read, Update, Delete weather search records
- 🗓️ **Date Range** input with validation (start must precede end)
- 📤 **Export to JSON** and **CSV** directly from the browser
- 🔗 **RESTful API** — Strapi auto-generates REST endpoints for `weather-record`

---

## 🏗️ Architecture

```
SmartWeather/
├── front/                  # React 19 + Vite (deployed on Vercel)
│   └── src/
│       ├── components/     # UI components (CurrentWeather, ForecastList, WeatherMap, etc.)
│       ├── pages/          # Home page (main app logic)
│       └── services/       # API layer
│           ├── api.ts          → OpenWeather API
│           ├── strapiApi.ts    → Strapi REST (CRUD)
│           ├── aiApi.ts        → Hugging Face AI
│           └── youtubeApi.ts   → YouTube Data API v3
│
└── back/                   # Strapi 5 Headless CMS (deployed on Strapi Cloud)
    └── src/api/
        └── weather-record/ # Content type with schema, routes, controller, service
```

**Data flow:** User searches → OpenWeather API → weather displayed → Strapi saves record → HuggingFace generates AI insight → YouTube fetches location video.

---

## 🔑 APIs Used

| API | Purpose |
|---|---|
| [OpenWeather](https://openweathermap.org/api) | Current weather + 5-day forecast |
| [Hugging Face](https://huggingface.co/inference-api) | AI-generated weather insights |
| [YouTube Data API v3](https://developers.google.com/youtube/v3) | Location cinematic videos |
| [Strapi 5](https://strapi.io) | Backend CMS / REST API / database |
| [React Leaflet / OpenStreetMap](https://leafletjs.com) | Interactive map |

---

## ☁️ Deployment

The app uses a two-service cloud architecture:

| Layer | Platform | Notes |
|---|---|---|
| Frontend | **Vercel** | Auto-deploys from `main` branch |
| Backend | **Strapi Cloud** | Connected to the same GitHub repo (`/back`) |

### Environment Variables

**Vercel (frontend):**
```env
VITE_OPENWEATHER_API_KEY=your_key
VITE_HUGGINGFACE_API_KEY=your_key
VITE_YOUTUBE_API_KEY=your_key
VITE_STRAPI_URL=https://attractive-crown-bc8583a2b3.strapiapp.com
```

**Strapi Cloud (backend):** Configured in the Strapi Cloud dashboard — same secrets as the local `.env`.

> **Important:** After deploying the backend, go to Strapi Admin → **Settings → Roles → Public** and enable `find`, `findOne`, `create`, `update`, `delete` for the `weather-record` content type.

---

## 🚀 Running Locally

### Prerequisites
- Node.js v20+
- npm

### 1. Clone
```bash
git clone https://github.com/Kayke-Queiroz/SmartWeather.git
cd SmartWeather
```

### 2. Backend (Strapi)
```bash
cd back
npm install
npm run develop
```
Strapi admin panel: http://localhost:1337/admin

### 3. Frontend (React)
```bash
cd front
npm install
```

Create `front/.env`:
```env
VITE_OPENWEATHER_API_KEY=your_openweather_key
VITE_HUGGINGFACE_API_KEY=your_huggingface_key
VITE_YOUTUBE_API_KEY=your_youtube_key
VITE_STRAPI_URL=http://localhost:1337
```

```bash
npm run dev
```
App runs at: http://localhost:5173

---

## 🧑‍💻 About

Built by **Kayke Queiroz dos Santos** as part of the **Product Manager Accelerator** AI Engineer Intern Technical Assessment.

**Product Manager Accelerator** — A premier community and program designed to help professionals transition into and accelerate their careers in product management and AI-engineering through hands-on experience and expert mentorship.

🔗 [PM Accelerator on LinkedIn](https://www.linkedin.com/company/product-manager-accelerator/)
