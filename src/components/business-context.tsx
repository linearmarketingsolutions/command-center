"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Business = "personal" | "lms" | "commit";

interface BusinessContextType {
  business: Business;
  setBusiness: (business: Business) => void;
  getBusinessColor: () => string;
  getBusinessName: () => string;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [business, setBusiness] = useState<Business>("lms");

  const getBusinessColor = () => {
    switch (business) {
      case "personal":
        return "#8b5cf6"; // Purple
      case "lms":
        return "#00d4ff"; // Cyan
      case "commit":
        return "#e94560"; // Red/Pink
      default:
        return "#00d4ff";
    }
  };

  const getBusinessName = () => {
    switch (business) {
      case "personal":
        return "Personal";
      case "lms":
        return "Linear Marketing Solutions";
      case "commit":
        return "Commit Fitness";
      default:
        return "Command Center";
    }
  };

  return (
    <BusinessContext.Provider value={{ business, setBusiness, getBusinessColor, getBusinessName }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusinessContext() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusinessContext must be used within a BusinessProvider");
  }
  return context;
}
