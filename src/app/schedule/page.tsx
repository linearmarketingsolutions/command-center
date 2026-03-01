"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Calendar, Plus } from "lucide-react";
import { useData, CalendarEvent } from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { AddEventForm } from "@/components/add-event-form";
import { DataExport } from "@/components/data-export";
import { MonthlyView, WeeklyView, DailyView, CalendarHeader, useGoogleCalendarEvents, GoogleCalendarEvent } from "@/components/calendar-views";
import { addMonths, startOfMonth, endOfMonth } from "date-fns";

export default function SchedulePage() {
  const { events, addEvent, deleteEvent } = useData();
  const { business, getBusinessColor } = useBusinessContext();
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | GoogleCalendarEvent | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch Google Calendar events
  const { googleEvents, loading: googleLoading } = useGoogleCalendarEvents(
    business === "personal" ? "fitblake12" : 
    business === "lms" ? "linear" : "commit",
    useMemo(() => startOfMonth(new Date()), []),
    useMemo(() => endOfMonth(addMonths(new Date(), 1)), []),
    true
  );

  // Filter events by business context
  const filteredEvents = business === "personal" 
    ? events 
    : events.filter(e => e.business === business);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowAddForm(true);
  };

  const handleEventClick = (event: CalendarEvent | GoogleCalendarEvent) => {
    setSelectedEvent(event);
    // Could open edit modal here
  };

  const handleAddEvent = () => {
    setShowAddForm(true);
    setSelectedDate(new Date());
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Delete this event?')) {
      deleteEvent(eventId);
      setSelectedEvent(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" style={{ color: getBusinessColor() }} />
          Schedule
        </h2>
        <div className="flex items-center gap-2">
          <DataExport />
          <AddEventForm />
        </div>
      </div>

      {/* Loading indicator for Google Calendar */}
      {googleLoading && (
        <div className="text-sm text-gray-400 text-center py-2">
          Syncing Google Calendar...
        </div>
      )}

      {/* Calendar View */}
      <div className="space-y-6">
        <CalendarHeader view={view} setView={setView} onAddEvent={handleAddEvent} />
        
        {view === "month" && (
          <MonthlyView 
            internalEvents={filteredEvents} 
            googleEvents={googleEvents}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
        
        {view === "week" && (
          <WeeklyView 
            internalEvents={filteredEvents} 
            googleEvents={googleEvents}
            onEventClick={handleEventClick}
          />
        )}
        
        {view === "day" && (
          <DailyView 
            internalEvents={filteredEvents} 
            googleEvents={googleEvents}
            onEventClick={handleEventClick}
          />
        )}
      </div>

      {/* Add Event Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a22] border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {selectedEvent ? 'Edit Event' : 'Add Event'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedEvent(null);
                  setSelectedDate(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <AddEventForm 
              onClose={() => {
                setShowAddForm(false);
                setSelectedEvent(null);
                setSelectedDate(null);
              }}
            />
            
            {selectedEvent && 'id' in selectedEvent && (
              <button
                onClick={() => handleDeleteEvent((selectedEvent as CalendarEvent).id)}
                className="mt-4 w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors"
              >
                Delete Event
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
