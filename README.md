# StudyIn Reserve - Common Room Booking System

A modern, mobile-first web application for managing common room reservations in your dorm. Built with Next.js, TypeScript, shadcn/ui, and Tailwind CSS.

## Features

### 🏠 Main Dashboard
- **Real-time Room Status**: View current availability of all 3 common rooms
- **Live Occupancy Info**: See who's using each room, their contact info, and reservation duration
- **Quick Booking**: One-click access to the booking form

### 📅 Schedule View
- **Calendar View**: Interactive calendar showing all reservations with visual indicators
- **Day View**: Detailed list of reservations for any selected day
- **Easy Navigation**: Quick date switching and filtering

### 📝 Booking System
- **Simple Form**: Select room, enter name and room number
- **Flexible Timing**: Choose any start and end time
- **Sharing Option**: Allow others to share your reserved room
- **Conflict Prevention**: Automatic validation to prevent double bookings

### 👨‍💼 Admin Panel
- **Complete Overview**: View all past and upcoming reservations
- **Statistics**: Quick stats on total, upcoming, and past reservations
- **Reservation Management**: Delete reservations with confirmation
- **Organized Display**: Separate views for upcoming and past reservations

### 📱 Mobile Optimized
- Responsive design that works perfectly on mobile devices
- Touch-friendly interface
- Optimized layouts for small screens

## Tech Stack

- **Framework**: Next.js 16 (with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Validation**: Zod
- **Backend**: Next.js Server Actions (no separate backend needed!)

## Prerequisites

- Node.js >= 20.9.0
- pnpm (recommended) or npm

## Getting Started

First, install the dependencies:

```bash
pnpm install
# or
npm install
```

Then, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
studyin-reserve/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── schedule/
│   │   └── page.tsx          # Schedule view
│   ├── admin/
│   │   └── page.tsx          # Admin panel
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── room-status-card.tsx  # Room status display
│   ├── booking-dialog.tsx    # Booking form
│   ├── schedule-view.tsx     # Calendar/day view switcher
│   ├── day-view.tsx          # Day view component
│   └── admin-view.tsx        # Admin interface
├── lib/
│   ├── types.ts              # TypeScript types
│   ├── validations.ts        # Zod schemas
│   ├── db.ts                 # Data storage utilities
│   ├── actions.ts            # Server Actions
│   └── utils.ts              # Utility functions
└── data/
    └── reservations.json     # Reservation data (auto-created)
```

## Data Storage

The application uses a simple JSON file-based storage system (`data/reservations.json`). This is perfect for a small dorm application and can easily be migrated to a database (like PostgreSQL, MongoDB, or Supabase) if needed.

## Room Configuration

The 3 common rooms are defined in `lib/types.ts`:

```typescript
export const ROOMS: Room[] = [
  { id: "room-1", name: "Common Room 1", capacity: 10 },
  { id: "room-2", name: "Common Room 2", capacity: 8 },
  { id: "room-3", name: "Common Room 3", capacity: 12 },
];
```

You can modify room names, capacities, or add more rooms by editing this array.

## Usage Guide

### For Students
1. **Check Room Availability**: Visit the home page to see which rooms are currently free
2. **Make a Reservation**: Click "New Reservation", fill out the form, and submit
3. **View Schedule**: Check the schedule page to see when rooms are available
4. **Allow Sharing**: Enable the sharing option if you're okay with others using the room

### For Admins
1. **Access Admin Panel**: Click the "Admin" button in the header
2. **View All Reservations**: See upcoming and past reservations
3. **Delete Reservations**: Remove any reservation by clicking the trash icon

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Deploy!

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Built with ❤️ for student convenience
