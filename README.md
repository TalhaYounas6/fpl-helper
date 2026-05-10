# FPL Data Aggregator

An automated pipeline designed to solve the data collection problem in Fantasy Premier League. This tool eliminates the need for manual monitoring of press conferences by extracting player availability data and direct manager quotes using AI.

---

## Project Overview

In the lead-up to FPL deadlines, managers often spend hours watching press conferences or refreshing social media for injury updates. This application automates that process by scanning all 20 Premier League YouTube channels, processing the audio, and using LLMs to summarize player status.

The system updates every 4 hours to ensure the dashboard reflects the most recent briefings as soon as they are uploaded.

---

## Core Features

* **Automated YouTube Extraction**: Utilizes yt-dlp to monitor club channels and pull the latest pre-match briefings.
* **AI-Driven Analysis**: Uses Google Gemini to parse audio transcripts and categorize player status into Fit, Doubtful, or Out.
* **Direct Quote Extraction**: Provides the exact text spoken by the manager to give users full context beyond a simple status label.


---

## Technical Stack

### Frontend

* **React**: Component-based UI architecture.
* **Tailwind CSS**: Utility-first styling for a clean, scannable dashboard.

### Backend

* **Node.js / Express**: Core API and server logic.
* **Upstash Redis**: Used store analysis data.
* **yt-dlp / FFmpeg**: Video processing and audio extraction.
* **Google Gemini API**: Natural Language Processing for intent extraction and status categorization.
* **Assembly AI**: Audio to text.
* **Node-Cron**: Task scheduling for the 4-hour update cycle.


---

## Architecture

The application follows a sequential pipeline:

1. **Trigger**: Every 4 hours, a cron job initiates the update process.
2. **Scraping**: The system iterates through Premier League teams to find new press conference videos.
3. **Audio Processing**: Audio is extracted, limited in bitrate for efficiency, and sent to the Assembly AI API.
4. **AI Analysis**: Text from the press conference is sent to Gemini API to extract player availability information.

---
## Local Setup

The project is divided into two main directories: `/client` (Frontend) and `/server` (Backend). You will need to configure and run both for a full local environment.

### Prerequisites

* Node.js (v18 or higher)
* FFmpeg installed on your system
* A Redis instance (Local or Upstash)
* API keys for Google Gemini and AssemblyAI

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/TalhaYounas6/fpl-helper
cd fpl-helper

```


2. **Setup the Server:**
```bash
cd server
npm install

```


3. **Setup the Client:**

```bash
   cd ../client
   npm install

```

### Environment Configuration

You must create a `.env` file in both the client and server directories with the following variables:

**Server Environment Variables (`/server/.env`):**

```env
PORT=3000
GEMINI_API_KEY=your_gemini_key
REDIS_URL=your_redis_connection_url
ASSEMBLY_AI_API_KEY=your_assembly_ai_key

```

**Client Environment Variables (`/client/.env`):**

```env
VITE_BASE_URL=http://localhost:3000

```

### Running Locally

To start the application, you will need two terminal windows:

**Terminal 1 (Backend):**

```bash
cd server
npm start

```

**Terminal 2 (Frontend):**

```bash
cd client
npm run dev

```


