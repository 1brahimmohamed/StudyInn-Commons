"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROOMS } from "@/lib/types";
import { createReservation } from "@/lib/actions";
import { Plus, CheckCircle2 } from "lucide-react";
import { format, addMinutes, roundToNearestMinutes } from "date-fns";
import { toast } from "sonner";

export function BookingDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allowSharing, setAllowSharing] = useState(false);

  // Set default times to current time rounded to nearest 15 min and +1 hour
  const now = roundToNearestMinutes(new Date(), { nearestTo: 15 });
  const defaultStart = format(now, "yyyy-MM-dd'T'HH:mm");
  const defaultEnd = format(addMinutes(now, 60), "yyyy-MM-dd'T'HH:mm");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("allowSharing", allowSharing.toString());

    const result = await createReservation(formData);

    if (result.success) {
      toast.success("Booking Confirmed!", {
        description: "Your reservation has been created successfully.",
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
      setOpen(false);
      // Reset form
      (e.target as HTMLFormElement).reset();
      setAllowSharing(false);
    } else {
      const errorMessage = result.error || "Unable to complete booking";
      setError(
        errorMessage.includes("already booked")
          ? "This room is unavailable for the selected time. Please choose another time or room."
          : errorMessage.includes("End time")
          ? "End time must be after start time. Please adjust your booking times."
          : "Unable to complete your booking. Please try again."
      );
    }

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Book a Common Room</DialogTitle>
            <DialogDescription>
              Reserve a room for your study session or meeting.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="roomId">Room</Label>
              <Select name="roomId" required>
                <SelectTrigger id="roomId">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {ROOMS.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name} (Capacity: {room.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="userName">Your Name</Label>
              <Input
                id="userName"
                name="userName"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="userRoomNumber">Your Room Number</Label>
              <Input
                id="userRoomNumber"
                name="userRoomNumber"
                placeholder="e.g., 301"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  defaultValue={defaultStart}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  defaultValue={defaultEnd}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allowSharing"
                checked={allowSharing}
                onChange={(e) => setAllowSharing(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="allowSharing" className="text-sm font-normal cursor-pointer">
                Allow others to share this room with me
              </Label>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Booking..." : "Book Room"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
