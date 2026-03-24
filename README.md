# SmartWeather

SmartWeather is a full-stack weather application that provides real-time weather data, dynamic animations based on current conditions, AI-powered weather advice, and related YouTube videos (like drone tours or cinematic travel videos) for the searched location.

## Technologies Used

### Frontend (`/front`)
* **React 19** with **Vite**
* **Tailwind CSS 4** for styling
* **Framer Motion** for smooth animations
* **React Leaflet** for interactive maps
* **Axios** for API requests
* **Hugging Face Inference API** client

### Backend (`/back`)
* **Strapi 5** (Headless CMS)
* **Better SQLite 3** for the database

## External APIs

The frontend relies on the following external APIs. You must obtain API keys for each to run the application fully:

1. **OpenWeather API**: Used to fetch current weather data and forecasts.
2. **Hugging Face API**: Used to generate AI-powered warnings and advice based on the weather conditions.
3. **YouTube Data API (v3)**: Used to fetch location-specific YouTube videos.

## Getting Started

### Prerequisites
* **Node.js**: v20 or higher recommended.
* **npm** or **yarn**

### Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd SmartWeather
   ```

2. **Backend Setup** (`/back`):
   Navigate to the backend directory, install dependencies, and start the development server:
   ```bash
   cd back
   npm install
   npm run develop
   ```
   The Strapi admin panel will be available at `http://localhost:1337/admin`. At first run, you may need to set up an admin user.

3. **Frontend Setup** (`/front`):
   Open a new terminal, navigate to the frontend directory, and install dependencies:
   ```bash
   cd front
   npm install
   ```

   **Environment Variables:**
   Create a `.env` file in the `front/` directory based on the `.env.example` (if available), and add your personal API keys:
   ```env
   VITE_OPENWEATHER_API_KEY=your_open_weather_api_key_here
   VITE_HUGGINGFACE_API_KEY=your_hugging_face_api_key_here
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

4. **Running the Application**:
   Start the frontend development server:
   ```bash
   npm run dev
   ```
   The React web app will be available at `http://localhost:5173`.
