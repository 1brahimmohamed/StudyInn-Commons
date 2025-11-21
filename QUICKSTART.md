# Quick Start Guide

## Important: Node.js Version

⚠️ **Before running the app, ensure you have Node.js >= 20.9.0 installed.**

Check your version:
```bash
node --version
```

If you need to upgrade:
- Download from [nodejs.org](https://nodejs.org/)
- Or use [nvm](https://github.com/nvm-sh/nvm): `nvm install 20.9.0 && nvm use 20.9.0`

## Running the Application

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start the development server**:
   ```bash
   pnpm dev
   ```

3. **Open your browser**:
   Go to [http://localhost:3000](http://localhost:3000)

## First Steps

1. **Create your first reservation**:
   - Click "New Reservation" on the home page
   - Select a room
   - Enter your name and room number
   - Choose start and end times
   - Optionally enable "Allow Sharing"
   - Click "Book Room"

2. **View the schedule**:
   - Click "Schedule" in the header
   - Switch between Calendar and Day views
   - Click dates to see reservations

## Features Overview

### Main Page
- Shows real-time status of all 3 common rooms
- Green badge = Available
- Red badge = Occupied (shows who, when, and contact info)

### Schedule Page
- **Calendar View**: Visual calendar with marked reservation dates
- **Day View**: Detailed list for selected day

### Booking Form
- Room selection dropdown
- Name and room number fields
- Date/time pickers
- Sharing checkbox

## Data Storage

Reservations are stored in MongoDB

## Customization

### Change Room Names/Capacity
Edit `lib/types.ts`:
```typescript
export const ROOMS: Room[] = [
  { id: "room-1", name: "Study Room Ground Floor", capacity: 15 },
  { id: "room-2", name: "Study Room 3rd Floor", capacity: 10 },
  { id: "room-3", name: "Study Room 4th Floor", capacity: 20 },
];
```

### Add More Rooms
Just add more objects to the ROOMS array above!