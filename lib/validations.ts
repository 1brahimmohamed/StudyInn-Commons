import { z } from "zod";

export const reservationSchema = z.object({
  roomId: z.string().min(1, "Please select a room"),
  userName: z.string().min(2, "Name must be at least 2 characters"),
  userRoomNumber: z.string().min(1, "Room number is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  allowSharing: z.boolean().default(false),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return !isNaN(start.getTime()) && !isNaN(end.getTime());
}, {
  message: "Invalid date format",
  path: ["startTime"],
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export type ReservationInput = z.infer<typeof reservationSchema>;
