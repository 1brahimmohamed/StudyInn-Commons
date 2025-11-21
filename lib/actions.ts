"use server";

import { revalidatePath } from "next/cache";
import {
  addReservation,
  deleteReservation,
  getReservations,
  isRoomAvailable,
  updateReservation,
  getCurrentRoomStatus,
  getReservationsByDateRange,
} from "@/lib/db";
import { reservationSchema } from "@/lib/validations";
import { Reservation } from "@/lib/types";

export async function createReservation(formData: FormData) {
  try {
    const data = {
      roomId: formData.get("roomId") as string,
      userName: formData.get("userName") as string,
      userRoomNumber: formData.get("userRoomNumber") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      allowSharing: formData.get("allowSharing") === "true",
    };

    const validated = reservationSchema.parse(data);

    // Convert datetime-local format to ISO string
    const startTime = new Date(validated.startTime).toISOString();
    const endTime = new Date(validated.endTime).toISOString();

    // Check if room is available
    const available = await isRoomAvailable(
      validated.roomId,
      new Date(startTime),
      new Date(endTime)
    );

    if (!available) {
      return {
        success: false,
        error: "This room is already booked for the selected time slot",
      };
    }

    const reservation = await addReservation({
      roomId: validated.roomId,
      userName: validated.userName,
      userRoomNumber: validated.userRoomNumber,
      startTime,
      endTime,
      allowSharing: validated.allowSharing,
      sharedWith: [],
    });

    revalidatePath("/");
    return { success: true, data: reservation };
  } catch (error: unknown) {
    console.error("Reservation creation error:", error);
    
    // Zod validation error
    if (error && typeof error === "object" && "errors" in error) {
      const zodError = error as { errors: Array<{ message: string }> };
      const errorMessage = zodError.errors[0]?.message || "Invalid form data";
      return { success: false, error: errorMessage };
    }
    
    // Generic error with message
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Failed to create reservation" };
  }
}

export async function getAllReservations() {
  try {
    const reservations = await getReservations();
    return { success: true, data: reservations };
  } catch {
    return { success: false, error: "Failed to fetch reservations" };
  }
}

export async function removeReservation(id: string) {
  try {
    const success = await deleteReservation(id);
    if (!success) {
      return { success: false, error: "Reservation not found" };
    }
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete reservation" };
  }
}

export async function modifyReservation(
  id: string,
  updates: Partial<Omit<Reservation, "id" | "createdAt">>
) {
  try {
    const reservation = await updateReservation(id, updates);
    if (!reservation) {
      return { success: false, error: "Reservation not found" };
    }
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, data: reservation };
  } catch {
    return { success: false, error: "Failed to update reservation" };
  }
}

export async function getRoomStatus() {
  try {
    const currentReservations = await getCurrentRoomStatus();
    return { success: true, data: currentReservations };
  } catch {
    return { success: false, error: "Failed to fetch room status" };
  }
}

export async function getReservationsForDateRange(
  startDate: string,
  endDate: string
) {
  try {
    const reservations = await getReservationsByDateRange(
      new Date(startDate),
      new Date(endDate)
    );
    return { success: true, data: reservations };
  } catch {
    return { success: false, error: "Failed to fetch reservations" };
  }
}
