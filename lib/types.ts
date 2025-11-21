export interface Room {
  id: string;
  name: string;
  capacity: number;
}

export interface Reservation {
  id: string;
  roomId: string;
  userName: string;
  userRoomNumber: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  allowSharing: boolean;
  sharedWith?: string[]; // Array of names who joined
  createdAt: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export const ROOMS: Room[] = [
  { id: "room-1", name: "Common Room Ground Floor", capacity: 10 },
  { id: "room-2", name: "Common Room 3rd Floor", capacity: 8 },
  { id: "room-3", name: "Common Room 5th Floor", capacity: 12 },
];
