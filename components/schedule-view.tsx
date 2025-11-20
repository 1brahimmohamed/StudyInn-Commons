"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Reservation } from "@/lib/types";
import { DayView } from "./day-view";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, List } from "lucide-react";

interface ScheduleViewProps {
  reservations: Reservation[];
}

export function ScheduleView({ reservations }: ScheduleViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "day">("calendar");

  // Check if a date has reservations
  const hasReservations = (date: Date) => {
    return reservations.some((r) => isSameDay(new Date(r.startTime), date));
  };

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex justify-center gap-2">
        <Button
          variant={viewMode === "calendar" ? "default" : "outline"}
          onClick={() => setViewMode("calendar")}
          size="sm"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Calendar
        </Button>
        <Button
          variant={viewMode === "day" ? "default" : "outline"}
          onClick={() => setViewMode("day")}
          size="sm"
        >
          <List className="mr-2 h-4 w-4" />
          Day View
        </Button>
      </div>

      {viewMode === "calendar" ? (
        <Card className="p-6">
          <div className="flex flex-col items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                hasReservation: (date) => hasReservations(date),
              }}
              modifiersStyles={{
                hasReservation: {
                  fontWeight: "bold",
                  textDecoration: "underline",
                },
              }}
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Click a date to view reservations
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Dates with reservations are underlined
              </p>
            </div>
          </div>

          {/* Selected Date Reservations */}
          {selectedDate && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </h3>
              <DayView reservations={reservations} selectedDate={selectedDate} />
            </div>
          )}
        </Card>
      ) : (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
              className="mt-2"
            >
              Today
            </Button>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() - 1);
                  setSelectedDate(newDate);
                }}
              >
                Previous Day
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(newDate.getDate() + 1);
                  setSelectedDate(newDate);
                }}
              >
                Next Day
              </Button>
            </div>
          </div>
          <DayView reservations={reservations} selectedDate={selectedDate} />
        </div>
      )}
    </div>
  );
}
