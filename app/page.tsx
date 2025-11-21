import { getRoomStatus } from "@/lib/actions";
import { ROOMS } from "@/lib/types";
import { RoomStatusCard } from "@/components/room-status-card";
import { BookingDialog } from "@/components/booking-dialog";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Calendar, Clock, Settings } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const statusResult = await getRoomStatus();
  const currentReservations = statusResult.success ? statusResult.data : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">StudyInn Commons</h1>
              <p className="text-sm text-muted-foreground">Common Room Booking</p>
            </div>
            <div className="flex gap-2">
              <ModeToggle />
              <Link href="/schedule">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Schedule</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Rooms Status</h2>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4" />
              Current availability
            </p>
          </div>
          <BookingDialog />
        </div>

        {/* Room Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ROOMS.map((room) => {
            const currentReservation = currentReservations?.find(
              (r) => r.roomId === room.id
            );
            return (
              <RoomStatusCard
                key={room.id}
                room={room}
                currentReservation={currentReservation}
              />
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold mb-2">How to use:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Check the current status of all common rooms above</li>
            <li>• Click &quot;New Reservation&quot; to book a room</li>
            <li>• View the schedule to see upcoming reservations</li>
            <li>• Enable &quot;Allow Sharing&quot; if you&apos;re okay with others joining</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
