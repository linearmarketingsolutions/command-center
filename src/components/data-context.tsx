"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from "react";
import { format, isToday, isBefore, isAfter, addDays, isSameDay, parseISO } from "date-fns";
import { supabase } from "@/lib/supabase";

// === NEW TASK SYSTEM ===

export type TaskStatus = 'inbox' | 'next' | 'waiting' | 'done';
export type TaskProjectPersonal = 'non-business' | 'commit-internal' | 'lms-internal' | 'ai-edu' | 'finances';
export type TaskBusiness = 'personal' | 'lms' | 'commit';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  business: TaskBusiness;
  project?: TaskProjectPersonal;
  clientId?: string;
  waitingNote?: string;
  tags: string[];
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  business: "lms" | "commit";
  mrr: number;
  status: "active" | "paused" | "churned";
  notes?: string;
  lastContact?: string;
  email?: string;
  phone?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  location: string;
  business: "personal" | "lms" | "commit";
  notes?: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  business: "personal" | "lms" | "commit";
  category: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  business: "personal" | "lms" | "commit";
  clientId?: string;
  url?: string;
}

export interface TaskFilters {
  status: TaskStatus[];
  business: TaskBusiness[];
  project?: TaskProjectPersonal;
  clientId?: string;
  priority?: TaskPriority;
  dueDateRange?: 'today' | 'overdue' | 'next3days' | 'next7days' | 'future' | 'nodate';
  searchQuery?: string;
}

interface DataState {
  tasks: Task[];
  events: CalendarEvent[];
  clients: Client[];
  transactions: Transaction[];
  documents: Document[];
  metrics: {
    lms: { mrr: number; target: number; clients: number };
    commit: { mrr: number; target: number; clients: number };
    personal: { balance: number; income: number; expenses: number };
  };
}

interface DataContextType extends DataState {
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskToStatus: (id: string, status: TaskStatus) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByBusiness: (business: TaskBusiness) => Task[];
  getTasksByClient: (clientId: string) => Task[];
  getFilteredTasks: (filters: TaskFilters) => Task[];
  getTodayTasks: () => Task[];
  getOverdueTasks: () => Task[];
  getUpcomingTasks: (days: number) => Task[];
  getInboxTasks: () => Task[];
  getWaitingTasks: () => Task[];
  addClient: (client: Omit<Client, "id">) => string;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientsByBusiness: (business: "lms" | "commit") => Client[];
  getClientById: (id: string) => Client | undefined;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addDocument: (document: Omit<Document, "id">) => void;
  deleteDocument: (id: string) => void;
  updateMetric: (business: "lms" | "commit" | "personal", key: string, value: number) => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  resetAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const generateId = () => Math.random().toString(36).substr(2, 9);
const STORAGE_KEY = "command-center-data-v2";

function migrateTaskStatus(oldStatus: string): TaskStatus {
  switch (oldStatus) {
    case 'completed': return 'done';
    case 'in_progress': return 'next';
    case 'archived': return 'done';
    default: return 'inbox';
  }
}

const getDefaultData = (): DataState => ({
  tasks: [
    { 
      id: "1", 
      title: "Review Q1 marketing strategy", 
      description: "Analyze current performance and optimize", 
      status: "next", 
      priority: "high", 
      dueDate: format(new Date(), "yyyy-MM-dd"), 
      business: "lms",
      clientId: "1",
      tags: ["strategy", "q1"],
      createdAt: new Date().toISOString(),
    },
    { 
      id: "2", 
      title: "Juan Luna PT Session", 
      status: "next", 
      priority: "high", 
      dueDate: format(new Date(), "yyyy-MM-dd"), 
      business: "commit", 
      clientId: "3",
      tags: ["pt", "in-person"],
      createdAt: new Date().toISOString(),
    },
    { 
      id: "3", 
      title: "Research AI automation tools", 
      status: "waiting", 
      waitingNote: "Waiting for demo access from vendor",
      priority: "medium", 
      dueDate: format(addDays(new Date(), 2), "yyyy-MM-dd"), 
      business: "personal", 
      project: "ai-edu",
      tags: ["research"],
      createdAt: new Date().toISOString(),
    },
    { 
      id: "4", 
      title: "Update personal budget spreadsheet", 
      status: "inbox", 
      priority: "low", 
      business: "personal", 
      project: "finances",
      tags: [],
      createdAt: new Date().toISOString(),
    },
  ],
  events: [
    { id: "1", title: "Team Standup", date: format(new Date(), "yyyy-MM-dd"), time: "10:00 AM", duration: "30 min", type: "meeting", location: "Video Call", business: "lms" },
    { id: "2", title: "Juan Luna PT", date: format(new Date(), "yyyy-MM-dd"), time: "4:00 PM", duration: "1.5 hr", type: "pt", location: "Glendale Studio", business: "commit" },
  ],
  clients: [
    { id: "1", name: "Point 2 Point", company: "Point 2 Point", mrr: 3000, status: "active", business: "lms", lastContact: "2026-02-25", email: "contact@p2p.com", phone: "" },
    { id: "2", name: "ACX Technologies", company: "ACX Technologies", mrr: 2000, status: "active", business: "lms", lastContact: "2026-02-20", email: "", phone: "" },
    { id: "3", name: "Juan Luna", mrr: 800, status: "active", business: "commit", lastContact: "2026-02-26", email: "", phone: "" },
  ],
  transactions: [
    { id: "1", description: "P2P Payment", amount: 3000, date: "2026-02-01", type: "income", business: "lms", category: "client" },
    { id: "2", description: "Vercel Hosting", amount: -50, date: "2026-02-20", type: "expense", business: "lms", category: "software" },
  ],
  documents: [],
  metrics: {
    lms: { mrr: 5000, target: 10000, clients: 2 },
    commit: { mrr: 1980, target: 3500, clients: 5 },
    personal: { balance: 2500, income: 6980, expenses: 4200 },
  },
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const migratedTasks = (parsed.tasks || []).map((t: any) => ({
            ...t,
            status: t.status === 'pending' || t.status === 'in_progress' || t.status === 'completed' || t.status === 'archived' 
              ? migrateTaskStatus(t.status) 
              : t.status,
            createdAt: t.createdAt || new Date().toISOString(),
          }));
          return {
            tasks: migratedTasks,
            events: parsed.events || [],
            clients: parsed.clients || [],
            transactions: parsed.transactions || [],
            documents: parsed.documents || [],
            metrics: parsed.metrics || getDefaultData().metrics,
          };
        } catch (e) { console.error("Failed to parse saved data:", e); }
      }
    }
    return getDefaultData();
  });

  const { tasks, events, clients, transactions, documents, metrics } = data;

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setData((prev: DataState) => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setData((prev: DataState) => ({ 
      ...prev, 
      tasks: prev.tasks.map(t => {
        if (t.id !== id) return t;
        const updated = { ...t, ...updates };
        if (updates.status === 'done' && t.status !== 'done') {
          updated.completedAt = new Date().toISOString();
        }
        if (updates.status && updates.status !== 'done' && t.status === 'done') {
          updated.completedAt = undefined;
        }
        return updated;
      }) 
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData((prev: DataState) => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  }, []);

  const moveTaskToStatus = useCallback((id: string, status: TaskStatus) => {
    updateTask(id, { status });
  }, [updateTask]);

  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks.filter(t => t.status === status);
  }, [tasks]);

  const getTasksByBusiness = useCallback((business: TaskBusiness) => {
    return tasks.filter(t => t.business === business);
  }, [tasks]);

  const getTasksByClient = useCallback((clientId: string) => {
    return tasks.filter(t => t.clientId === clientId);
  }, [tasks]);

  const getTodayTasks = useCallback(() => {
    return tasks.filter(t => {
      if (!t.dueDate || t.status === 'done') return false;
      return isToday(parseISO(t.dueDate));
    });
  }, [tasks]);

  const getOverdueTasks = useCallback(() => {
    return tasks.filter(t => {
      if (!t.dueDate || t.status === 'done') return false;
      return isBefore(parseISO(t.dueDate), new Date()) && !isToday(parseISO(t.dueDate));
    });
  }, [tasks]);

  const getUpcomingTasks = useCallback((days: number) => {
    const cutoff = addDays(new Date(), days);
    return tasks.filter(t => {
      if (!t.dueDate || t.status === 'done') return false;
      const due = parseISO(t.dueDate);
      return (isAfter(due, new Date()) || isToday(due)) && !isAfter(due, cutoff);
    });
  }, [tasks]);

  const getInboxTasks = useCallback(() => {
    return tasks.filter(t => t.status === 'inbox');
  }, [tasks]);

  const getWaitingTasks = useCallback(() => {
    return tasks.filter(t => t.status === 'waiting');
  }, [tasks]);

  const getFilteredTasks = useCallback((filters: TaskFilters): Task[] => {
    return tasks.filter(t => {
      if (filters.status.length > 0 && !filters.status.includes(t.status)) return false;
      if (filters.business.length > 0 && !filters.business.includes(t.business)) return false;
      if (filters.project && t.business === 'personal' && t.project !== filters.project) return false;
      if (filters.clientId && t.clientId !== filters.clientId) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      
      if (filters.dueDateRange) {
        if (filters.dueDateRange === 'nodate') {
          if (t.dueDate) return false;
        } else if (filters.dueDateRange === 'today') {
          if (!t.dueDate || !isToday(parseISO(t.dueDate))) return false;
        } else if (filters.dueDateRange === 'overdue') {
          if (!t.dueDate) return false;
          if (!(isBefore(parseISO(t.dueDate), new Date()) && !isToday(parseISO(t.dueDate)))) return false;
        } else if (filters.dueDateRange === 'next3days') {
          const cutoff = addDays(new Date(), 3);
          if (!t.dueDate) return false;
          const due = parseISO(t.dueDate);
          if (!((isAfter(due, new Date()) || isToday(due)) && !isAfter(due, cutoff))) return false;
        } else if (filters.dueDateRange === 'next7days') {
          const cutoff = addDays(new Date(), 7);
          if (!t.dueDate) return false;
          const due = parseISO(t.dueDate);
          if (!((isAfter(due, new Date()) || isToday(due)) && !isAfter(due, cutoff))) return false;
        } else if (filters.dueDateRange === 'future') {
          const cutoff = addDays(new Date(), 7);
          if (!t.dueDate) return false;
          if (!isAfter(parseISO(t.dueDate), cutoff)) return false;
        }
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesDesc = t.description?.toLowerCase().includes(query);
        const matchesTags = t.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }
      
      return true;
    });
  }, [tasks]);

  const addClient = useCallback((client: Omit<Client, "id">): string => {
    const id = generateId();
    setData((prev: DataState) => ({ 
      ...prev, 
      clients: [...prev.clients, { ...client, id }] 
    }));
    return id;
  }, []);

  const updateClient = useCallback((id: string, updates: Partial<Client>) => {
    setData((prev: DataState) => ({ 
      ...prev, 
      clients: prev.clients.map(c => c.id === id ? { ...c, ...updates } : c) 
    }));
  }, []);

  const deleteClient = useCallback((id: string) => {
    setData((prev: DataState) => ({ 
      ...prev, 
      clients: prev.clients.filter(c => c.id !== id),
      tasks: prev.tasks.map(t => t.clientId === id ? { ...t, clientId: undefined } : t)
    }));
  }, []);

  const getClientsByBusiness = useCallback((business: "lms" | "commit") => {
    return clients.filter(c => c.business === business);
  }, [clients]);

  const getClientById = useCallback((id: string) => {
    return clients.find(c => c.id === id);
  }, [clients]);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id">) => {
    setData((prev: DataState) => ({ ...prev, events: [...prev.events, { ...event, id: generateId() }] }));
  }, []);
  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setData((prev: DataState) => ({ ...prev, events: prev.events.map(e => e.id === id ? { ...e, ...updates } : e) }));
  }, []);
  const deleteEvent = useCallback((id: string) => {
    setData((prev: DataState) => ({ ...prev, events: prev.events.filter(e => e.id !== id) }));
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, "id">) => {
    setData((prev: DataState) => ({ ...prev, transactions: [...prev.transactions, { ...transaction, id: generateId() }] }));
  }, []);
  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setData((prev: DataState) => ({ ...prev, transactions: prev.transactions.map(t => t.id === id ? { ...t, ...updates } : t) }));
  }, []);
  const deleteTransaction = useCallback((id: string) => {
    setData((prev: DataState) => ({ ...prev, transactions: prev.transactions.filter(t => t.id !== id) }));
  }, []);

  const addDocument = useCallback((document: Omit<Document, "id">) => {
    setData((prev: DataState) => ({ ...prev, documents: [...prev.documents, { ...document, id: generateId() }] }));
  }, []);
  const deleteDocument = useCallback((id: string) => {
    setData((prev: DataState) => ({ ...prev, documents: prev.documents.filter(d => d.id !== id) }));
  }, []);

  const updateMetric = useCallback((business: "lms" | "commit" | "personal", key: string, value: number) => {
    setData((prev: DataState) => ({
      ...prev,
      metrics: { ...prev.metrics, [business]: { ...prev.metrics[business], [key]: value } },
    }));
  }, []);

  const exportData = useCallback(() => JSON.stringify(data, null, 2), [data]);
  const importData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      setData({
        tasks: parsed.tasks || [],
        events: parsed.events || [],
        clients: parsed.clients || [],
        transactions: parsed.transactions || [],
        documents: parsed.documents || [],
        metrics: parsed.metrics || getDefaultData().metrics,
      });
      return true;
    } catch { return false; }
  }, []);
  const resetAllData = useCallback(() => {
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    setData(getDefaultData());
  }, []);

  const value = useMemo(() => ({
    tasks, addTask, updateTask, deleteTask, moveTaskToStatus,
    getTasksByStatus, getTasksByBusiness, getTasksByClient, getFilteredTasks,
    getTodayTasks, getOverdueTasks, getUpcomingTasks, getInboxTasks, getWaitingTasks,
    events, addEvent, updateEvent, deleteEvent,
    clients, addClient, updateClient, deleteClient, getClientsByBusiness, getClientById,
    transactions, addTransaction, updateTransaction, deleteTransaction,
    documents, addDocument, deleteDocument,
    metrics, updateMetric,
    exportData, importData, resetAllData,
  }), [
    tasks, addTask, updateTask, deleteTask, moveTaskToStatus,
    getTasksByStatus, getTasksByBusiness, getTasksByClient, getFilteredTasks,
    getTodayTasks, getOverdueTasks, getUpcomingTasks, getInboxTasks, getWaitingTasks,
    events, addEvent, updateEvent, deleteEvent,
    clients, addClient, updateClient, deleteClient, getClientsByBusiness, getClientById,
    transactions, addTransaction, updateTransaction, deleteTransaction,
    documents, addDocument, deleteDocument,
    metrics, updateMetric,
    exportData, importData, resetAllData,
  ]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error("useData must be used within a DataProvider");
  return context;
}
