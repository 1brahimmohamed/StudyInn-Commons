# Application Architecture

## Overview

StudyIn Commons is a full-stack Next.js application that uses Server Actions instead of traditional REST APIs.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser/Client                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │   Schedule   │  │    Admin     │      │
│  │   (/)        │  │ (/schedule)  │  │  (/admin)    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                  │
│  ┌────────────────────────▼──────────────────────────┐      │
│  │           React Components (Client)               │      │
│  │  • RoomStatusCard    • DayView                    │      │
│  │  • BookingDialog     • ScheduleView               │      │
│  │  • AdminView         • Calendar                   │      │
│  └────────────────────────┬──────────────────────────┘      │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
              Server Actions (Next.js)
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                       Server Side                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │           Server Actions (lib/actions.ts)          │     │
│  │  • createReservation()                             │     │
│  │  • getAllReservations()                            │     │
│  │  • removeReservation()                             │     │
│  │  • getRoomStatus()                                 │     │
│  │  • getReservationsForDateRange()                   │     │
│  └────────────────────┬───────────────────────────────┘     │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────┐     │
│  │         Data Layer (lib/db.ts)                     │     │
│  │  • getReservations()                               │     │
│  │  • addReservation()                                │     │
│  │  • updateReservation()                             │     │
│  │  • deleteReservation()                             │     │
│  │  • isRoomAvailable()                               │     │
│  └────────────────────┬───────────────────────────────┘     │
│                       │                                      │
│  ┌────────────────────▼───────────────────────────────┐     │
│  │         Storage (data/reservations.json)           │     │
│  │  [                                                 │     │
│  │    {                                               │     │
│  │      "id": "res-123",                              │     │
│  │      "roomId": "room-1",                           │     │
│  │      "userName": "John Doe",                       │     │
│  │      "startTime": "2024-01-01T10:00:00",          │     │
│  │      ...                                           │     │
│  │    }                                               │     │
│  │  ]                                                 │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### Creating a Reservation

```
User fills form → BookingDialog (Client)
                      ↓
                FormData created
                      ↓
          createReservation() Server Action
                      ↓
              Validation (Zod)
                      ↓
         isRoomAvailable() check
                      ↓
           addReservation() (db.ts)
                      ↓
        Write to reservations.json
                      ↓
           revalidatePath("/")
                      ↓
         Page refreshes with new data
```

### Viewing Room Status

```
Page loads → Server Component
                 ↓
      getRoomStatus() Server Action
                 ↓
      getCurrentRoomStatus() (db.ts)
                 ↓
    Read from reservations.json
                 ↓
         Filter by current time
                 ↓
    Render RoomStatusCard components
```

## File Structure Explained

```
studyin-reserve/
│
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page (Server Component)
│   ├── schedule/page.tsx         # Schedule page
│   ├── admin/page.tsx            # Admin page
│   ├── layout.tsx                # Root layout with metadata
│   └── globals.css               # Global styles & CSS variables
│
├── components/                   # React Components
│   ├── ui/                       # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── room-status-card.tsx      # Display room availability
│   ├── booking-dialog.tsx        # Booking form modal
│   ├── schedule-view.tsx         # Calendar/Day view switcher
│   ├── day-view.tsx              # Day reservations list
│   └── admin-view.tsx            # Admin management interface
│
├── lib/                          # Core logic
│   ├── types.ts                  # TypeScript interfaces
│   │   └── Room, Reservation, ROOMS constant
│   │
│   ├── validations.ts            # Zod schemas for form validation
│   │
│   ├── db.ts                     # Data access layer
│   │   └── CRUD operations for reservations
│   │
│   ├── actions.ts                # Server Actions
│   │   └── API layer called from client
│   │
│   └── utils.ts                  # Utility functions (cn, etc.)
│
└── data/                         # Data storage
    └── reservations.json         # JSON database (auto-created)
```

## Key Technologies

### Frontend
- **React 19**: UI library
- **Next.js 16**: Framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **shadcn/ui**: Component library
- **Lucide React**: Icons
- **date-fns**: Date manipulation

### Backend
- **Next.js Server Actions**: API layer
- **Zod**: Runtime validation
- **Node.js fs/promises**: File system operations

## Why Server Actions?

Instead of creating separate API routes (`/api/reservations`), we use Server Actions:

**Benefits:**
1. ✅ Type-safe end-to-end
2. ✅ No API routes needed
3. ✅ Automatic serialization
4. ✅ Built-in security
5. ✅ Simpler code
6. ✅ Better performance

**Example:**
```typescript
// Traditional API route approach:
const response = await fetch('/api/reservations', {
  method: 'POST',
  body: JSON.stringify(data)
});

// Server Actions approach:
const result = await createReservation(formData);
```

## Scaling Considerations

### Current Setup (Good for <100 users)
- JSON file storage
- No authentication
- In-memory processing

### Future Enhancements (For >100 users)
1. **Database Migration**
   - Replace `lib/db.ts` with database client
   - Keep same function signatures
   - PostgreSQL, MongoDB, or Supabase

2. **Authentication**
   - Add NextAuth.js
   - User roles (student, admin)
   - Protected routes

3. **Real-time Updates**
   - Add WebSocket/Server-Sent Events
   - Live room status updates

4. **Caching**
   - Redis for frequently accessed data
   - Reduce database queries

5. **Rate Limiting**
   - Prevent spam bookings
   - Upstash Rate Limit

## Development Workflow

```
1. Design Feature
   ↓
2. Create Types (lib/types.ts)
   ↓
3. Add Validation (lib/validations.ts)
   ↓
4. Implement DB Function (lib/db.ts)
   ↓
5. Create Server Action (lib/actions.ts)
   ↓
6. Build UI Component (components/)
   ↓
7. Create/Update Page (app/)
   ↓
8. Test & Iterate
```

## Security Considerations

### Current Implementation
- ✅ Zod validation on all inputs
- ✅ Server-side data validation
- ✅ No direct file system access from client
- ✅ Automatic Next.js CSRF protection

### Recommended Additions
- 🔲 Rate limiting
- 🔲 User authentication
- 🔲 Admin authorization
- 🔲 Input sanitization
- 🔲 Audit logging
- 🔲 Environment-based configs

## Performance Optimizations

1. **Server Components**: Most pages are Server Components (no client JS)
2. **Automatic Code Splitting**: Next.js splits code automatically
3. **Image Optimization**: Use `next/image` for any images
4. **Font Optimization**: Using `next/font` for Geist fonts
5. **Caching**: Next.js automatic caching with revalidation

## Mobile Optimization

- Responsive grid layouts (`md:grid-cols-2 lg:grid-cols-3`)
- Touch-friendly button sizes
- Mobile-first media queries
- Optimized font sizes for readability
- Sticky headers for navigation
- Compact mobile navigation

---

Need more details on any section? Check the inline code comments!
