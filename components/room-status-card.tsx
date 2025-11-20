import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reservation, Room } from "@/lib/types";
import { format } from "date-fns";
import { Clock, Users } from "lucide-react";

interface RoomStatusCardProps {
  room: Room;
  currentReservation?: Reservation;
}

export function RoomStatusCard({ room, currentReservation }: RoomStatusCardProps) {
  const isOccupied = !!currentReservation;

  return (
    <Card className="w-full transition-all hover:shadow-lg">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{room.name}</CardTitle>
          <Badge
            variant={isOccupied ? "destructive" : "default"}
            className={isOccupied ? "bg-red-500" : "bg-green-500"}
          >
            {isOccupied ? "Occupied" : "Available"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isOccupied && currentReservation ? (
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium text-sm">{currentReservation.userName}</p>
                <p className="text-xs text-muted-foreground">
                  Room {currentReservation.userRoomNumber}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm">
                  {format(new Date(currentReservation.startTime), "HH:mm")} -{" "}
                  {format(new Date(currentReservation.endTime), "HH:mm")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(currentReservation.startTime), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            {currentReservation.allowSharing && (
              <Badge variant="outline" className="w-fit text-xs border-blue-500 text-blue-700 bg-blue-50">
                Allows Sharing
              </Badge>
            )}

            {currentReservation.sharedWith && currentReservation.sharedWith.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-1">Shared with:</p>
                <div className="flex flex-wrap gap-1">
                  {currentReservation.sharedWith.map((name, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              This room is currently available
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Capacity: {room.capacity} people
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
