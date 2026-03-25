#  SmartWeather — Full Stack AI Weather Intelligence

SmartWeather is a premium, full-stack weather intelligence platform that blends high-performance engineering with immersive visuals. It provides real-time weather data, AI-powered health/activity insights, and cinematic 4K drone tours, all wrapped in a stunning glassmorphism interface.

 **Live Demo:** [https://smart-weather-sigma.vercel.app/](https://smart-weather-sigma.vercel.app/)

---

##  Features

- **Real-time weather data** (OpenWeather API)
- **5-day forecast visualization**
- **AI-powered health & activity insights**
- **Dynamic weather-based animations**
- **Interactive map** with location visualization
- **Full CRUD weather history**
- **Data export** (JSON, CSV)
- **YouTube 4K location tours**

---

## 📸 Screenshots

<div align="center">
  <img src="./screenshots/q.jpg" alt="SmartWeather Dashboard" width="24%" />
  <img src="./screenshots/u.jpg" alt="SmartWeather Dashboard" width="24%" />
  <img src="./screenshots/w.jpg" alt="SmartWeather Dashboard" width="24%" />
  <img src="./screenshots/x.jpg" alt="SmartWeather Dashboard" width="24%" />
  <p><i>A premium glassmorphism interface with real-time weather, search history, and AI-powered insights.</i></p>
</div>

*(Tip: Search for 'London' to see the dynamic rain effects or 'Natal, BR' for clear skies!)*

---

##  Tech Stack

| Area | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS 4, Framer Motion |
| **Backend** | Strapi 5 (Headless CMS), SQLite |
| **AI Layer** | Hugging Face Inference API (Qwen 2.5-72B), YouTube Data API v3 |
| **Mapping** | React Leaflet (OpenStreetMap) |

---

##  Application Flow

The system orchestrates multiple APIs and a headless CMS to deliver a seamless experience:

```mermaid
graph TD
    A[User Search] --> B{OpenWeather API}
    B -->|Current Data| C[Frontend UI]
    B -->|Coordinates| D[YouTube Data API]
    B -->|Weather ID| E[Dynamic Animations]
    C -->|Auto-save| F[Strapi Backend CMS]
    F -->|Historical Data| G[Search History Page]
    B -->|Context| H[Hugging Face AI]
    H -->|Insights| C
    D -->|4K Drone Tour| C
```

1. **Search**: User inputs a city, zip code, or landmark.
2. **Intelligence**: System fetches weather then triggers AI for personalized health/activity insights.
3. **Immersive UI**: The background morphs based on the specific Weather ID, while YouTube fetches a cinematic tour.
4. **Persistence**: Every search is automatically saved to the Strapi backend for history and analysis.

---

##  Project Structure

```text
SmartWeather/
├── front/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Weather Cards, Map, History)
│   │   │   └── WeatherBackground/ # Canvas-based shader-like effects
│   │   ├── services/       # Modular API layer (Weather, AI, YouTube, Strapi)
│   │   ├── pages/          # Main application views
│   │   └── assets/         # Static resources & styles
│   └── public/             # Static assets
└── back/                   # Strapi 5 Headless CMS
    ├── src/
    │   ├── api/            # Content Types (Weather Records)
    │   └── ...
```

---

##  Dynamic Animations

One of the project's key differentiators is its **weather-reactive background system**. Instead of simple static images, we use a combination of **Framer Motion** and **CSS-based particle systems**:

- **Rain/Snow**: Utilizes dynamic React components that generate particles based on weather intensity.
- **Clouds**: Layered SVG/CSS animations that vary speed and opacity based on cloud coverage.
- **Clear/Sunny**: Vibrant gradient shifts and sun-glow effects.
- **Precision logic**: Mapping occurs via `weatherId` (e.g., 200-299 for Thunderstorms) to ensure exact visual parity with real-world conditions.

---

##  Engineering Highlights

- **Decoupled Full-Stack Architecture**: Clean separation between the React frontend and Strapi backend allows for independent scaling and maintenance.
- **AI-Driven Personalization**: Leveraging **Qwen 2.5-72B** to provide non-generic health warnings and clothing suggestions based on humidity, temperature, and wind.
- **Optimized Data Export**: Custom implementation for history export to **JSON** and **CSV** formats directly from the frontend.
- **CORS & Proxy Resilience**: Engineered robust API service layers to handle cross-origin requests and best-effort backend warmups.

---

##  Candidate Information
*   **Name:** Kayke Queiroz dos Santos
*   **Assessment:** AI Engineer Intern Technical Assessment
*   **Organization:** [PM Accelerator](https://www.linkedin.com/company/product-management-accelerator/)

---

##  Deployment Architecture

The application is architected for modern cloud deployment, ensuring high availability and separation of concerns:

- **Frontend:** Hosted on **Vercel**, leveraging edge functions for fast global delivery.
- **Backend:** Powered by **Strapi Cloud**, providing a robust headless CMS infrastructure.

---

##  Local Setup

1. **Install Dependencies**:
   ```bash
   cd front && npm install
   cd ../back && npm install
   ```
2. **Environment Variables**: 
   Create a `.env` file in the `front/` directory and add your API keys:
   ```env
   VITE_OPENWEATHER_API_KEY=your_openweather_key
   VITE_HUGGINGFACE_API_KEY=your_huggingface_key
   VITE_YOUTUBE_API_KEY=your_youtube_key
   VITE_STRAPI_URL=your_strapi_backend_url
   ```
3. **Run**:
   ```bash
   # Front
   npm run dev (in /front)
   # Back
   npm run develop (in /back)
   ```

---

## PM Accelerator Description
*Product Manager Accelerator is a premier community and program designed to help professionals transition into and accelerate their careers in product management and AI-engineering through hands-on experience and expert mentorship.*

---

