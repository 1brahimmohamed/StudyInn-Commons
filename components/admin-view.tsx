"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reservation, ROOMS } from "@/lib/types";
import { removeReservation } from "@/lib/actions";
import { format } from "date-fns";
import { Trash2, Calendar, User, Clock, AlertCircle } from "lucide-react";

interface AdminViewProps {
  reservations: Reservation[];
}

export function AdminView({ reservations }: AdminViewProps) {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    reservation?: Reservation;
  }>({ open: false });
  const [deleting, setDeleting] = useState(false);

  // Sort reservations by start time (most recent first)
  const sortedReservations = [...reservations].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  // Group by upcoming and past
  const now = new Date();
  const upcomingReservations = sortedReservations.filter(
    (r) => new Date(r.endTime) > now
  );
  const pastReservations = sortedReservations.filter(
    (r) => new Date(r.endTime) <= now
  );

  async function handleDelete() {
    if (!deleteDialog.reservation) return;

    setDeleting(true);
    await removeReservation(deleteDialog.reservation.id);
    setDeleting(false);
    setDeleteDialog({ open: false });
  }

  function ReservationCard({ reservation }: { reservation: Reservation }) {
    const room = ROOMS.find((r) => r.id === reservation.roomId);
    const isPast = new Date(reservation.endTime) <= now;

    return (
      <Card className={isPast ? "opacity-60" : ""}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-base font-semibold">
                {room?.name}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant={isPast ? "secondary" : "default"}>
                  {isPast ? "Past" : "Upcoming"}
                </Badge>
                {reservation.allowSharing && (
                  <Badge variant="outline" className="text-xs border-blue-500 text-blue-700 bg-blue-50">
                    Sharing
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteDialog({ open: true, reservation })}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="font-medium">{reservation.userName}</span>
              <span className="text-muted-foreground ml-2">
                Room {reservation.userRoomNumber}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(reservation.startTime), "MMM d, yyyy")}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(reservation.startTime), "HH:mm")} -{" "}
              {format(new Date(reservation.endTime), "HH:mm")}
            </span>
          </div>

          {reservation.sharedWith && reservation.sharedWith.length > 0 && (
            <div className="pt-3 border-t">
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
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reservations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reservations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingReservations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Past
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pastReservations.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Reservations */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming Reservations</h2>
        {upcomingReservations.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No upcoming reservations</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        )}
      </div>

      {/* Past Reservations */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Past Reservations</h2>
        {pastReservations.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No past reservations</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastReservations.map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this reservation? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {deleteDialog.reservation && (
            <div className="py-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="font-medium">Reservation Details:</span>
                </div>
                <p>
                  <strong>Room:</strong>{" "}
                  {ROOMS.find((r) => r.id === deleteDialog.reservation?.roomId)?.name}
                </p>
                <p>
                  <strong>User:</strong> {deleteDialog.reservation.userName}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {format(new Date(deleteDialog.reservation.startTime), "MMM d, HH:mm")}{" "}
                  - {format(new Date(deleteDialog.reservation.endTime), "HH:mm")}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false })}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
