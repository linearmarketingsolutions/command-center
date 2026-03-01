"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Users,
  Circle,
} from "lucide-react";
import { fetchGoogleCalendarEvents, GoogleCalendarEvent as GoogleEvent } from "@/lib/calendar-sync";
import { CalendarEvent } from "@/components/data-context";
import { cn } from "@/lib/utils";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  parseISO,
} from "date-fns";

export type { GoogleEvent as GoogleCalendarEvent };

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const businessColors = {
  personal: "#8b5cf6",
  lms: "#00d4ff", 
  commit: "#e94560",
  ironvest: "#10b981",
};

const typeIcons: Record<string, string> = {
  meeting: "💼",
  client: "🤝",
  pt: "💪",
  content: "🎬",
  admin: "📝",
  personal: "🏠",
  other: "📅",
};

interface CalendarViewProps {
  internalEvents: CalendarEvent[];
  googleEvents?: GoogleEvent[];
  onSyncEvent?: (event: CalendarEvent, googleEventId: string) => void;
  onSyncDelete?: (googleEventId: string) => void;
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent | GoogleEvent) => void;
}

// Helper to format time in 12-hour format
const formatTime12h = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

// Convert Google Calendar event to internal CalendarEvent
const googleEventToCalendarEvent = (googleEvent: GoogleEvent): CalendarEvent => {
  const startDate = googleEvent.start.dateTime || googleEvent.start.date;
  const start = startDate ? parseISO(startDate) : new Date();
  
  let business: "personal" | "lms" | "commit" = "personal";
  const summary = googleEvent.summary.toLowerCase();
  if (summary.includes("lms") || summary.includes("linear")) business = "lms";
  else if (summary.includes("commit") || summary.includes("pt") || summary.includes("training")) business = "commit";
  
  return {
    id: googleEvent.id,
    title: googleEvent.summary,
    date: format(start, "yyyy-MM-dd"),
    time: format(start, "h:mm a"),
    duration: "1 hr",
    type: "meeting",
    location: googleEvent.location || "",
    business,
    notes: googleEvent.description,
  };
};

// Generate time slots for day/week view (12-hour format, 30 min intervals)
const generateTimeSlots = (startHour = 6, endHour = 21) => {
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    
    slots.push({
      time: `${String(hour).padStart(2, "0")}:00`,
      display: `${displayHour}:00 ${ampm}`,
      hour,
      minute: 0,
    });
    
    slots.push({
      time: `${String(hour).padStart(2, "0")}:30`,
      display: `${displayHour}:30 ${ampm}`,
      hour,
      minute: 30,
    });
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Monthly View Component
export function MonthlyView({ 
  internalEvents, 
  googleEvents = [],
  onDateClick,
  onEventClick 
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthName = format(currentDate, "MMMM yyyy");
  
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const allEvents = useMemo(() => {
    const googleConverted = googleEvents.map(googleEventToCalendarEvent);
    return [...internalEvents, ...googleConverted];
  }, [internalEvents, googleEvents]);

  const getDayEvents = (date: Date): CalendarEvent[] => {
    return allEvents.filter(e => isSameDay(parseISO(e.date), date));
  };

  const handleDateClick = (date: Date) => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{monthName}</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={goToToday}
            className="px-3 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            Today
          </button>
          <button onClick={prevMonth} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm text-gray-500 py-2 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, i) => {
          const dayEvents = getDayEvents(day);
          const todayFlag = isToday(day);
          const currentMonthFlag = isSameMonth(day, currentDate);

          return (
            <div
              key={i}
              onClick={() => handleDateClick(day)}
              className={cn(
                "aspect-square rounded-lg p-2 border transition-all min-h-[80px] cursor-pointer hover:border-white/30",
                !currentMonthFlag && "opacity-50",
                todayFlag
                  ? "bg-white/10 border-2"
                  : "bg-white/5 border-white/10"
              )}
              style={{ borderColor: todayFlag ? businessColors.lms : undefined }}
            >
              <div className="flex items-center justify-between mb-1">
                <span 
                  className={cn(
                    "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                    todayFlag ? "font-bold text-white" : ""
                  )}
                  style={todayFlag ? { backgroundColor: businessColors.lms } : {}}
                >
                  {format(day, "d")}
                </span>
              </div>
              
              {dayEvents.length > 0 && (
                <div className="flex flex-col gap-1">
                  {dayEvents.slice(0, 4).map((e, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        if (onEventClick) onEventClick(e);
                      }}
                      className="flex items-center gap-1.5 text-xs truncate px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Circle 
                        className="w-2 h-2 flex-shrink-0" 
                        style={{ fill: businessColors[e.business], stroke: businessColors[e.business] }}
                      />
                      <span className="truncate">{e.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 4 && (
                    <span className="text-[8px] text-gray-500 pl-1">+{dayEvents.length - 4} more</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Weekly View Component
export function WeeklyView({ 
  internalEvents, 
  googleEvents = [],
  onEventClick 
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const weekLabel = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;

  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const allEvents = useMemo(() => {
    const googleConverted = googleEvents.map(googleEventToCalendarEvent);
    return [...internalEvents, ...googleConverted];
  }, [internalEvents, googleEvents]);

  const getDayEvents = (date: Date): CalendarEvent[] => {
    return allEvents.filter(e => isSameDay(parseISO(e.date), date));
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#0f0f14] z-20 py-2">
        <h3 className="text-lg font-semibold">{weekLabel}</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={goToToday}
            className="px-3 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            Today
          </button>
          <button onClick={prevWeek} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextWeek} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-2 mb-2 sticky top-14 bg-[#0f0f14] z-10 py-2">
        <div className="text-center text-sm text-gray-500 font-medium w-20">Time</div>
        {weekDates.map((day, i) => {
          const todayFlag = isToday(day);
          return (
            <div 
              key={i}
              className={cn(
                "text-center text-sm font-medium py-2",
                todayFlag ? "text-white" : "text-gray-500"
              )}
            >
              <div>{format(day, "EEE")}</div>
              <div 
                className={cn(
                  "text-xs inline-block w-7 h-7 leading-7 rounded-full mt-1",
                  todayFlag ? "text-white" : ""
                )}
                style={todayFlag ? { backgroundColor: businessColors.lms } : {}}
              >
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative overflow-y-auto max-h-[800px]">
        <div className="space-y-0.5 min-h-[1280px]">
          {timeSlots.map((slot, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-8 gap-2 min-h-[40px]">
              <div className="text-right pr-4 py-1 text-xs text-gray-500 font-mono flex-shrink-0">
                {slot.display}
              </div>

              {weekDates.map((day, dayIndex) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const dayEvents = getDayEvents(day);
                
                const eventsAtTime = dayEvents.filter(e => {
                  const eventTime = e.time.replace(/[AP]M/, "").trim();
                  const [eventHours, eventMinutes] = eventTime.split(":").map(Number);
                  const adjustedHours = e.time.includes("PM") && eventHours !== 12 ? eventHours + 12 : 
                                       e.time.includes("AM") && eventHours === 12 ? 0 : eventHours;
                  return adjustedHours === slot.hour && eventMinutes === slot.minute;
                });

                return (
                  <div 
                    key={dayIndex} 
                    className="relative bg-white/5 rounded border border-white/5 hover:border-white/20 transition-colors"
                  >
                    {eventsAtTime.map((event, eventIndex) => (
                      <div 
                        key={eventIndex}
                        onClick={() => {
                          if (onEventClick) onEventClick(event);
                        }}
                        className="absolute left-1 right-1 px-2 py-1.5 rounded-lg text-xs text-white cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
                        style={{ 
                          backgroundColor: businessColors[event.business],
                          top: "2px",
                          bottom: "2px",
                          zIndex: 10,
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-[10px] opacity-90">{event.time}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Daily View Component
export function DailyView({ 
  internalEvents, 
  googleEvents = [],
  onEventClick 
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const dayLabel = format(currentDate, "EEEE, MMMM d, yyyy");

  const prevDay = () => setCurrentDate(subDays(currentDate, 1));
  const nextDay = () => setCurrentDate(addDays(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const allEvents = useMemo(() => {
    const googleConverted = googleEvents.map(googleEventToCalendarEvent);
    return [...internalEvents, ...googleConverted];
  }, [internalEvents, googleEvents]);

  const dayEvents = useMemo(() => {
    return allEvents.filter(e => isSameDay(parseISO(e.date), currentDate));
  }, [allEvents, currentDate]);

  const todayFlag = isToday(currentDate);

  const getCurrentTimePosition = () => {
    const startHour = 6;
    const totalMinutes = (currentTime.getHours() - startHour) * 60 + currentTime.getMinutes();
    return (totalMinutes / 30) * 40;
  };

  const getEventsForSlot = (slot: typeof timeSlots[0]) => {
    return dayEvents.filter(e => {
      const eventTime = e.time.replace(/[AP]M/, "").trim();
      const [eventHours, eventMinutes] = eventTime.split(":").map(Number);
      const adjustedHours = e.time.includes("PM") && eventHours !== 12 ? eventHours + 12 : 
                           e.time.includes("AM") && eventHours === 12 ? 0 : eventHours;
      return adjustedHours === slot.hour && eventMinutes === slot.minute;
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-[#0f0f14] z-20 py-2">
        <h3 className="text-lg font-semibold">
          {dayLabel}
        </h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={goToToday}
            className="px-3 py-1.5 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            Today
          </button>
          <button onClick={prevDay} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextDay} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-y-auto max-h-[800px]">
        <div className="space-y-0.5 min-h-[1280px] relative">
          {todayFlag && (
            <div 
              className="absolute left-0 right-0 border-t-2 border-red-500 z-30 pointer-events-none"
              style={{ top: `${getCurrentTimePosition()}px` }}
            >
              <div className="absolute -left-2 -top-1.5 w-3 h-3 bg-red-500 rounded-full" />
            </div>
          )}

          {timeSlots.map((slot, rowIndex) => {
            const slotEvents = getEventsForSlot(slot);
            
            return (
              <div key={rowIndex} className="grid grid-cols-1 gap-2 min-h-[40px]">
                <div className="flex items-start gap-4">
                  <div className="text-right pr-4 py-1 text-xs text-gray-500 font-mono flex-shrink-0 w-24">
                    {slot.display}
                  </div>

                  <div className="flex-1 relative">
                    {slotEvents.map((event, eventIndex) => (
                      <div 
                        key={eventIndex}
                        onClick={() => {
                          if (onEventClick) onEventClick(event);
                        }}
                        className="mb-2 px-4 py-3 rounded-xl text-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: businessColors[event.business] }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="text-xl">{typeIcons[event.type] || "📅"}</div>
                            <div>
                              <div className="font-semibold">{event.time}</div>
                              <div className="font-medium text-sm">{event.title}</div>
                            </div>
                          </div>
                          <div className="text-xs opacity-80 flex items-center gap-3">
                            {event.duration && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {event.duration}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                        {event.notes && (
                          <div className="mt-2 text-xs opacity-90 pt-2 border-t border-white/20">
                            {event.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CalendarHeader({ 
  view, 
  setView,
  onAddEvent 
}: { 
  view: "month" | "week" | "day";
  setView: (v: "month" | "week" | "day") => void;
  onAddEvent?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-white" />
          Schedule
        </h2>
        
        <div className="flex bg-white/5 rounded-lg p-1">
          {(["month", "week", "day"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                view === v 
                  ? "bg-white/20 text-white shadow-sm" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {onAddEvent && (
        <button
          onClick={onAddEvent}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      )}
    </div>
  );
}

export function useGoogleCalendarEvents(
  account: string,
  startDate: Date,
  endDate: Date,
  enabled: boolean = true
) {
  const [googleEvents, setGoogleEvents] = useState<GoogleEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const startStr = format(startDate, "yyyy-MM-dd");
        const endStr = format(endDate, "yyyy-MM-dd");
        const events = await fetchGoogleCalendarEvents(account, startStr, endStr);
        setGoogleEvents(events);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [account, startDate, endDate, enabled]);

  return { googleEvents, loading, error };
}
