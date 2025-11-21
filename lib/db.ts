import { Reservation } from "./types";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = process.env.DATABASE_NAME || "studyin-reserve";
const COLLECTION_NAME = "reservations";

// MongoDB document type
interface ReservationDocument extends Omit<Reservation, "id"> {
  _id?: ObjectId;
  id?: string;
}

// Get database connection
async function getDatabase() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

// Read reservations from MongoDB
export async function getReservations(): Promise<Reservation[]> {
  try {
    const db = await getDatabase();
    const reservations = await db
      .collection<ReservationDocument>(COLLECTION_NAME)
      .find({})
      .toArray();
    
    // Convert _id to string id for compatibility
    return reservations.map((res) => ({
      ...res,
      id: res.id || res._id?.toString() || "",
    }));
  } catch (error) {
    console.error("Error reading reservations:", error);
    return [];
  }
}

// Write/Update is handled by individual functions below
// No need for saveReservations helper with MongoDB

// Get reservations for a specific room
export async function getReservationsByRoom(roomId: string): Promise<Reservation[]> {
  try {
    const db = await getDatabase();
    const reservations = await db
      .collection<ReservationDocument>(COLLECTION_NAME)
      .find({ roomId })
      .toArray();
    
    return reservations.map((res) => ({
      ...res,
      id: res.id || res._id?.toString() || "",
    }));
  } catch (error) {
    console.error("Error fetching reservations by room:", error);
    return [];
  }
}

// Get reservations for a specific date range
export async function getReservationsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<Reservation[]> {
  try {
    const db = await getDatabase();
    const reservations = await db
      .collection<ReservationDocument>(COLLECTION_NAME)
      .find({
        startTime: { $lt: endDate.toISOString() },
        endTime: { $gt: startDate.toISOString() },
      })
      .toArray();
    
    return reservations.map((res) => ({
      ...res,
      id: res.id || res._id?.toString() || "",
    }));
  } catch (error) {
    console.error("Error fetching reservations by date range:", error);
    return [];
  }
}

// Check if a room is available for a time slot
export async function isRoomAvailable(
  roomId: string,
  startTime: Date,
  endTime: Date,
  excludeId?: string
): Promise<boolean> {
  try {
    const db = await getDatabase();
    const query: Record<string, unknown> = {
      roomId,
      startTime: { $lt: endTime.toISOString() },
      endTime: { $gt: startTime.toISOString() },
    };
    
    if (excludeId) {
      query.id = { $ne: excludeId };
    }
    
    const conflicts = await db
      .collection<ReservationDocument>(COLLECTION_NAME)
      .countDocuments(query);
    
    return conflicts === 0;
  } catch (error) {
    console.error("Error checking room availability:", error);
    return false;
  }
}

// Add a new reservation
export async function addReservation(
  reservation: Omit<Reservation, "id" | "createdAt">
): Promise<Reservation> {
  try {
    const db = await getDatabase();
    const newReservation: ReservationDocument = {
      ...reservation,
      id: `res-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      createdAt: new Date().toISOString(),
    };
    
    await db.collection<ReservationDocument>(COLLECTION_NAME).insertOne(newReservation);
    
    return {
      ...newReservation,
      id: newReservation.id || newReservation._id?.toString() || "",
    };
  } catch (error) {
    console.error("Error adding reservation:", error);
    throw new Error("Failed to add reservation");
  }
}

// Update a reservation
export async function updateReservation(
  id: string,
  updates: Partial<Omit<Reservation, "id" | "createdAt">>
): Promise<Reservation | null> {
  try {
    const db = await getDatabase();
    const result = await db
      .collection<ReservationDocument>(COLLECTION_NAME)
      .findOneAndUpdate(
        { id },
        { $set: updates },
        { returnDocument: "after" }
      );
    
    if (!result) return null;
    
    return {
      ...result,
      id: result.id || result._id?.toString() || "",
    };
  } catch (error) {
    console.error("Error updating reservation:", error);
    return null;
  }
}

// Delete a reservation
export async function deleteReservation(id: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const result = await db
      .collection<ReservationDocument>(COLLECTION_NAME)
      .deleteOne({ id });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return false;
  }
}

// Get current status of all rooms
export async function getCurrentRoomStatus() {
  const now = new Date();
  const reservations = await getReservations();
  
  return reservations.filter((r) => {
    const start = new Date(r.startTime);
    const end = new Date(r.endTime);
    return start <= now && end > now;
  });
}
