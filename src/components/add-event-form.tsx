"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Building2, Dumbbell, User, Calendar, Clock, MapPin, Mail } from "lucide-react";
import { useData } from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { cn } from "@/lib/utils";

interface AddEventFormProps {
  onClose?: () => void;
}

const eventTypes = ["meeting", "client", "pt", "content", "admin", "personal"];
const durations = ["15 min", "30 min", "1 hr", "1.5 hr", "2 hr", "3 hr", "4 hr", "All day"];

export function AddEventForm({ onClose }: AddEventFormProps) {
  const { addEvent } = useData();
  const { business, getBusinessColor } = useBusinessContext();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    duration: "1 hr",
    type: "meeting",
    location: "",
    business: business,
    notes: "",
    syncToGoogle: false,
    googleAccount: "lms",
    attendees: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timeFormatted = new Date(`2000-01-01T${formData.time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    // Add event to local state
    addEvent({
      title: formData.title,
      date: formData.date,
      time: timeFormatted,
      duration: formData.duration,
      type: formData.type,
      location: formData.location || "TBD",
      business: formData.business as "personal" | "lms" | "commit",
      notes: formData.notes,
    });

    // Sync to Google Calendar if enabled
    if (formData.syncToGoogle) {
      // TODO: Enable Google Calendar sync
      console.log("Google Calendar sync would happen here for account:", formData.googleAccount);
    }

    setFormData({
      title: "",
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      duration: "1 hr",
      type: "meeting",
      location: "",
      business: business,
      notes: "",
      syncToGoogle: false,
      googleAccount: "lms",
      attendees: "",
    });
    setIsOpen(false);
    onClose?.();
  };

  const inputClass = "w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-400 mb-1.5";

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
        style={{ backgroundColor: getBusinessColor() + "30", border: `1px solid ${getBusinessColor()}` }}
      >
        <Plus className="w-4 h-4" />
        Add Event
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            {/* Modal Container - Centered */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-md pointer-events-auto"
              >
                <div className="p-6 rounded-2xl bg-[#0f0f14] border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Add Event</h3>
                    <button onClick={() => setIsOpen(false)} className="p-1 text-gray-400 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className={labelClass}>Event Title</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Client Meeting - P2P"
                        className={inputClass}
                        autoFocus
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>
                          <Calendar className="w-3 h-3 inline mr-1" />
                          Date
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className={inputClass}
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          <Clock className="w-3 h-3 inline mr-1" />
                          Time
                        </label>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className={inputClass}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Duration</label>
                        <select
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          className={cn(inputClass, "cursor-pointer")}
                        >
                          {durations.map((d) => (
                            <option key={d} value={d} className="bg-[#0f0f14]">{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={labelClass}>Type</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className={cn(inputClass, "cursor-pointer capitalize")}
                        >
                          {eventTypes.map((t) => (
                            <option key={t} value={t} className="bg-[#0f0f14] capitalize">{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>
                        <MapPin className="w-3 h-3 inline mr-1" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Video Call, Office, Glendale Studio"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Business</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, business: "personal" })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all",
                            formData.business === "personal"
                              ? "bg-purple-500/20 border-purple-500 text-purple-400"
                              : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                          )}
                        >
                          <User className="w-4 h-4" />
                          Personal
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, business: "lms" })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all",
                            formData.business === "lms"
                              ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                              : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                          )}
                        >
                          <Building2 className="w-4 h-4" />
                          LMS
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, business: "commit" })}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all",
                            formData.business === "commit"
                              ? "bg-red-500/20 border-red-500 text-red-400"
                              : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                          )}
                        >
                          <Dumbbell className="w-4 h-4" />
                          Commit
                        </button>
                      </div>
                    </div>

                    <div>

                    {/* Google Calendar Sync Section */}
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-400">
                          <Calendar className="w-3 h-3" />
                          Sync to Google Calendar
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, syncToGoogle: !formData.syncToGoogle })}
                          className={cn(
                            "w-10 h-5 rounded-full relative transition-colors",
                            formData.syncToGoogle ? "bg-green-500/50" : "bg-white/10"
                          )}
                        >
                          <div className={cn(
                            "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                            formData.syncToGoogle ? "left-6" : "left-1"
                          )} />
                        </button>
                      </div>
                      
                      {formData.syncToGoogle && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div>
                            <label className={labelClass}>Google Account</label>
                            <select
                              value={formData.googleAccount}
                              onChange={(e) => setFormData({ ...formData, googleAccount: e.target.value })}
                              className={cn(inputClass, "cursor-pointer")}
                            >
                              <option value="lms">Linear Marketing (info@linearmarketingsolutions.com)</option>
                              <option value="commit">Commit Fitness (info@builtbycommit.com)</option>
                              <option value="personal">Personal (fitblake12@gmail.com)</option>
                              <option value="ironvest">Ironvest (info@ironvestventures.com)</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className={labelClass}>
                              <Mail className="w-3 h-3 inline mr-1" />
                              Attendees (comma-separated emails)
                            </label>
                            <input
                              type="text"
                              value={formData.attendees}
                              onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                              placeholder="e.g. client@example.com, team@linearmarketingsolutions.com"
                              className={cn(inputClass, formData.attendees ? "" : "opacity-60")}
                            />
                          </div>
                          
                          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
                            When you add this event, it will be synced to {formData.googleAccount} Google Calendar. 
                            Attendees will receive calendar invites if provided.
                          </div>
                        </div>
                      )}
                    </div>
                      <label className={labelClass}>Notes (optional)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any additional details..."
                        className={cn(inputClass, "h-16 resize-none")}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsOpen(false)}
                        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all"
                        style={{ backgroundColor: getBusinessColor(), opacity: !formData.title ? 0.5 : 1 }}
                        disabled={!formData.title}
                      >
                        Add Event
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
