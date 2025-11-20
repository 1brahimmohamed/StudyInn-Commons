"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reservation, ROOMS } from "@/lib/types";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, User, Clock } from "lucide-react";

interface DayViewProps {
  reservations: Reservation[];
  selectedDate: Date;
}

export function DayView({ reservations, selectedDate }: DayViewProps) {
  const dayReservations = reservations.filter((r) =>
    isSameDay(new Date(r.startTime), selectedDate)
  );

  // Sort by start time
  const sorted = [...dayReservations].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  if (sorted.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No reservations for {format(selectedDate, "MMMM d, yyyy")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sorted.map((reservation) => {
        const room = ROOMS.find((r) => r.id === reservation.roomId);
        return (
          <Card key={reservation.id} className="w-full">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold">
                    {room?.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(reservation.startTime), "HH:mm")} -{" "}
                      {format(new Date(reservation.endTime), "HH:mm")}
                    </span>
                  </div>
                </div>
                {reservation.allowSharing && (
                  <Badge variant="outline" className="text-xs border-blue-500 text-blue-700 bg-blue-50">
                    Sharing Allowed
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{reservation.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    Room {reservation.userRoomNumber}
                  </p>
                </div>
              </div>
              {reservation.sharedWith && reservation.sharedWith.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Shared with:</p>
                  <div className="flex flex-wrap gap-1">
                    {reservation.sharedWith.map((name, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
