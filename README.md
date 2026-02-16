# EventFlow - Event RSVP Platform

A modern, client-side platform to create events, manage invitations, and track RSVPs. Organizers can view a dashboard with real-time attendance statistics and a visual breakdown of responses.

## Features

- 📅 Create and manage events
- 📧 Generate AI-powered email invitations using Google Gemini
- 📊 Real-time RSVP dashboard with analytics
- 🎨 Dark mode support with theme toggle
- 📱 Fully responsive design
- 🔐 Client-side data persistence

## Prerequisites

- Node.js 16+
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` and set your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Production Build

```bash
npm run build
```

## Deployment on Vercel

This app is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy automatically on every push!
