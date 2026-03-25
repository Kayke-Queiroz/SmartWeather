#  SmartWeather — Full Stack AI Engineer Assessment

SmartWeather is a premium, full-stack weather intelligence platform. It provides real-time weather data, dynamic glassmorphism animations, AI-powered health/activity insights, and immersive 4K drone tours of searched locations.

** Live Demo:** [https://smart-weather-sigma.vercel.app/](https://smart-weather-sigma.vercel.app/)

---

##  Candidate Information
*   **Name:** Kayke Queiroz dos Santos
*   **Assessment:** AI Engineer Intern Technical Assessment
*   **Organization:** [PM Accelerator](https://www.linkedin.com/company/product-management-accelerator/)

---

##  Architecture & Infrastructure

The project follows a modern decoupled architecture:

###  Frontend (Vercel)
*   **Framework:** React 19 + Vite (TypeScript)
*   **Styling:** Tailwind CSS 4 + Framer Motion (Glassmorphism design)
*   **Mapping:** React Leaflet (Interactive OpenStreetMap)
*   **State & API:** Axios + modular service layer for clean API management.

###  Backend (Strapi Cloud)
*   **Headless CMS:** Strapi 5 (latest stable version)
*   **Database:** SQLite (efficient for the assessment scope)
*   **Deployment:** Strapi Cloud for high-availability RESTful API.
*   **Features:** Full CRUD operations for weather records and search history.

###  Integrated AI & External APIs
1.  **OpenWeather API:** Real-time metrics and 5-day forecasts.
2.  **Hugging Face Inference API (Qwen 2.5-72B):** Generates specialized AI insights (Clothing, Activity, Safety Warnings).
3.  **YouTube Data API v3:** Fetches cinematic 4K drone tours based on location name.
4.  **Geolocation API:** Seamless "Current Location" weather retrieval.

---

##  Features (Assessment Requirements)

### Tech Assessment #1 (Frontend)
*   **Omni-Search:** Support for Cities, Zip Codes, GPS, and Landmarks.
*   **Responsive UI:** Seamless experience across desktop, tablet, and mobile.
*   **Rich Visuals:** Dynamic background animations that react to specific weather IDs (Rain, Snow, Thunderstorm, Clear).
*   **Error Management:** Graceful handling of invalid locations or API timeouts.

### Tech Assessment #2 (Backend - CRUD)
*   **CREATE:** Save location, date ranges, and weather snapshots to the cloud.
*   **READ:** Real-time retrieval of search history with shared access.
*   **UPDATE:** Ability to rename/alias locations in the database.
*   **DELETE:** Full control to remove historical records.
*   **DATA EXPORT:** One-click export of history to **JSON** or **CSV**.

---

##  Local Setup

### 1. Prerequisites
*   Node.js v20+
*   NPM or Yarn

### 2. Environment Variables
Create a `front/.env` file with your credentials:
```env
VITE_OPENWEATHER_API_KEY=xxx
VITE_HUGGINGFACE_API_KEY=xxx
VITE_YOUTUBE_API_KEY=xxx
VITE_STRAPI_URL=https://attractive-crown-bc8583a2b3.strapiapp.com
```

### 3. Installation
```bash
# Backend setup (optional if using live Cloud URL)
cd back
npm install
npm run develop

# Frontend setup
cd front
npm install
npm run dev
```

---

##  PM Accelerator Description
*Product Manager Accelerator is a premier community and program designed to help professionals transition into and accelerate their careers in product management and AI-engineering through hands-on experience and expert mentorship.*

---

