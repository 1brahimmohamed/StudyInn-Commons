// Sample data for testing the application
// Copy the reservations array below to data/reservations.json to test with sample data

export const sampleReservations = [
  {
    "id": "res-1700000000000-abc123",
    "roomId": "room-1",
    "userName": "Alice Johnson",
    "userRoomNumber": "301",
    "startTime": "2024-12-01T09:00:00.000Z",
    "endTime": "2024-12-01T11:00:00.000Z",
    "allowSharing": true,
    "sharedWith": ["Bob Smith"],
    "createdAt": "2024-11-20T08:00:00.000Z"
  },
  {
    "id": "res-1700000100000-def456",
    "roomId": "room-2",
    "userName": "Charlie Brown",
    "userRoomNumber": "205",
    "startTime": "2024-12-01T14:00:00.000Z",
    "endTime": "2024-12-01T16:00:00.000Z",
    "allowSharing": false,
    "sharedWith": [],
    "createdAt": "2024-11-20T09:00:00.000Z"
  },
  {
    "id": "res-1700000200000-ghi789",
    "roomId": "room-3",
    "userName": "Diana Prince",
    "userRoomNumber": "412",
    "startTime": "2024-12-02T10:00:00.000Z",
    "endTime": "2024-12-02T12:00:00.000Z",
    "allowSharing": true,
    "sharedWith": ["Eve Adams", "Frank Miller"],
    "createdAt": "2024-11-20T10:00:00.000Z"
  },
  {
    "id": "res-1700000300000-jkl012",
    "roomId": "room-1",
    "userName": "George Wilson",
    "userRoomNumber": "108",
    "startTime": "2024-12-03T13:00:00.000Z",
    "endTime": "2024-12-03T15:00:00.000Z",
    "allowSharing": false,
    "sharedWith": [],
    "createdAt": "2024-11-20T11:00:00.000Z"
  },
  {
    "id": "res-1700000400000-mno345",
    "roomId": "room-2",
    "userName": "Hannah Lee",
    "userRoomNumber": "523",
    "startTime": "2024-12-04T16:00:00.000Z",
    "endTime": "2024-12-04T18:00:00.000Z",
    "allowSharing": true,
    "sharedWith": [],
    "createdAt": "2024-11-20T12:00:00.000Z"
  }
];

// To use this sample data:
// 1. Create the data directory if it doesn't exist: mkdir data
// 2. Create reservations.json: touch data/reservations.json
// 3. Copy the array above (without the export) and paste it into data/reservations.json
// 4. Make sure it's valid JSON format

// Example data/reservations.json format:
/*
[
  {
    "id": "res-1700000000000-abc123",
    "roomId": "room-1",
    "userName": "Alice Johnson",
    "userRoomNumber": "301",
    "startTime": "2024-12-01T09:00:00.000Z",
    "endTime": "2024-12-01T11:00:00.000Z",
    "allowSharing": true,
    "sharedWith": ["Bob Smith"],
    "createdAt": "2024-11-20T08:00:00.000Z"
  }
]
*/
