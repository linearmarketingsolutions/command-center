"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DollarSign, PieChart, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBusinessContext } from "@/components/business-context";

const tabs = [
  { name: "Revenue", icon: PieChart, href: "/finances/revenue" },
  { name: "Accounting", icon: Calculator, href: "/finances/accounting" },
];

export default function FinancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { getBusinessColor } = useBusinessContext();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold flex items-center">
              <DollarSign className="w-5 h-5 mr-2" style={{ color: getBusinessColor() }} />
              Finances
            </h1>
            <nav className="flex items-center gap-1">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                const Icon = tab.icon;

                return (
                  <Link
                    key={tab.name}
                    href={tab.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                    style={{
                      backgroundColor: isActive ? getBusinessColor() + "20" : undefined,
                      borderColor: isActive ? getBusinessColor() : undefined,
                      borderWidth: isActive ? "1px" : undefined,
                    }}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    <span>{tab.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </div>
    </div>
  );
}
