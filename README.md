# The Super App - Frontend Challenge

A premium, highly interactive dashboard web application built from scratch to showcase modern state management, live API integrations, browser persistence, and responsive UI design. Bootstrapped with **Next.js 14/15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Zustand**.

---

## 🌟 Key Features

### 1. Authentication & Registration (Page 1)
- Responsive split-screen layout displaying a neon-themed concert DJ deck visual banner.
- Form fields capturing **Name**, **Username**, **Email**, and **Mobile** with full validation.
- Real-time inline validation errors and disabled state controls.
- Automatic registration check: logs user data in browser storage.

### 2. Category Onboarding (Page 2)
- Interactive grid of 9 entertainment category cards styled exactly to Figma specifications (Action, Drama, Romance, Thriller, Western, Horror, Fantasy, Music, Fiction).
- Gatekeeping logic: Enforces a **minimum of 3 categories** to unlock transition buttons.
- Category pills display on the left side with individual deletion controls.

### 3. The Super Dashboard (Page 3 & 4)
- **User Profile Card:** Displays the user registration details, custom avatar, and tags for chosen categories.
- **Weather Widget:** Keyless weather integration fetching live temperature, pressure, wind speed, and humidity for New Delhi (via Open-Meteo) and mapping standard weather codes to corresponding Lucide icons.
- **Clock:** A live-updating digital date-time clock in a pink header bar.
- **Notes Widget:** A yellow notepad card automatically persisting notes in the browser's `localStorage` via Zustand middleware.
- **News Feed Widget:** Vertical card with news image, title, and body. Cycles through 5 high-quality news articles automatically **every 2 seconds** with smooth opacity transitions.
- **Interactive Timer Widget:**
  - Hours, minutes, and seconds adjustments with up/down arrows.
  - Custom circular SVG progress ring visualizing remaining countdown percentage.
  - A coral red Start/Pause toggle button.
  - Web-native synth alarm sound generated via the **Web Audio API** (does not depend on downloading/loading external audio files!).

### 4. Entertainment Discovery (Page 5)
- Displays horizontal grids of movies categorized by the user's selected onboarding choices.
- Animated hover states with scale-zoom transitions.
- **Details Pop-up Modal:** Click on a movie poster card to view a custom details card with IMDb rating, full plot, actors, director, writer, and language details.

---

## 🛠️ Architecture & Tech Stack

- **Framework:** Next.js (App Router, static compilation)
- **Language:** TypeScript
- **State Management:** Zustand (configured with local storage persistence middleware)
- **Styling:** Tailwind CSS (configured with custom Figma brand colors)
- **Icons:** Lucide React

---

## 🔌 API Guidelines & Fallbacks

To ensure a seamless evaluation experience, the application utilizes a dual API-data layer:

1. **Weather:** Fetched from keyless **Open-Meteo API** coordinates, with a mock data backup.
2. **Movies:** If an OMDB API key is provided, the app will query real movie listings. If no key is set, it falls back to a curated local movie database (`src/data/movieCatalog.ts`) containing exact metadata matching the categories.
3. **News:** Auto-rotates local, high-quality, pre-compiled news stories (avoiding rate-limiting or CORS issues in the browser).

### Adding API Keys
To run the project with live APIs and Supabase, create a `.env.local` file in the root directory:
```env
# (Optional) To use live OMDb API instead of local catalog
NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key_here

# (Required) Supabase integration details
NEXT_PUBLIC_SUPABASE_URL=https://jtxgunqyzswzzqatdjko.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_tbZFmyzt-Nt8oKzN5TYKDA_sa-RFRJS
```

---

## 🗄️ Database Schema & RLS Setup (Supabase)

To initialize the database table and enable proper read/write permissions for user registration, selected categories, and notes, execute the following SQL script inside the **SQL Editor** on your Supabase dashboard:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  agreed_to_share BOOLEAN NOT NULL DEFAULT FALSE,
  selected_categories TEXT[] DEFAULT '{}',
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public read access (Login & validation check)
CREATE POLICY "Allow public read access" ON users 
  FOR SELECT TO anon, authenticated USING (true);

-- Allow public inserts (User registration)
CREATE POLICY "Allow public insert access" ON users 
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow public updates (Syncing categories and notes)
CREATE POLICY "Allow public update access" ON users 
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
```

---

## 🚀 Running the App Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. Build & Compile for Production
```bash
npm run build
npm run start
```
