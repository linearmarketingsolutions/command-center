"use client";

import { motion } from "framer-motion";
import { 
  Calculator, 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  Building2,
  Dumbbell,
  User,
  AlertCircle,
  CheckCircle2,
  Trash2
} from "lucide-react";
import { useData, Transaction } from "@/components/data-context";
import { useBusinessContext } from "@/components/business-context";
import { AddTransactionForm } from "@/components/add-transaction-form";
import { DataExport } from "@/components/data-export";
import { useState } from "react";
import { cn } from "@/lib/utils";

const accounts = {
  personal: {
    name: "Personal",
    color: "#8b5cf6",
    icon: User,
    accounts: [
      { name: "Chase Checking", balance: 1200, type: "checking" },
      { name: "Savings", balance: 800, type: "savings" },
    ],
  },
  lms: {
    name: "Linear Marketing Solutions",
    color: "#00d4ff",
    icon: Building2,
    accounts: [
      { name: "Business Checking", balance: 5000, type: "checking" },
      { name: "Business Savings", balance: 2500, type: "savings" },
    ],
  },
  commit: {
    name: "Commit Fitness",
    color: "#e94560",
    icon: Dumbbell,
    accounts: [
      { name: "Business Checking", balance: 2200, type: "checking" },
      { name: "Equipment Fund", balance: 1000, type: "savings" },
    ],
  },
};

const alerts = [
  { type: "warning", message: "Trainerize $250/mo - consider replacement", business: "commit" },
  { type: "success", message: "P2P payment received on time", business: "lms" },
  { type: "warning", message: "Q1 taxes due in 30 days", business: "all" },
];

const categoryColors: Record<string, string> = {
  client: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  software: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  hosting: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  ads: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  contractor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  equipment: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  rent: "bg-red-500/20 text-red-400 border-red-500/30",
  utilities: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  meals: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  travel: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  other: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default function AccountingPage() {
  const { transactions, deleteTransaction, metrics } = useData();
  const { business, getBusinessColor } = useBusinessContext();
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);

  // Filter transactions by business context
  const filteredTransactions = business === "personal" 
    ? transactions 
    : transactions.filter(t => t.business === business);

  // Calculate metrics from real transactions
  const getBusinessTransactions = (b: string) => transactions.filter(t => t.business === b);
  const getIncome = (txs: Transaction[]) => txs.filter(t => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
  const getExpenses = (txs: Transaction[]) => txs.filter(t => t.type === "expense").reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const lmsTxs = getBusinessTransactions("lms");
  const commitTxs = getBusinessTransactions("commit");
  const personalTxs = getBusinessTransactions("personal");

  const lmsIncome = getIncome(lmsTxs);
  const lmsExpenses = getExpenses(lmsTxs);
  const commitIncome = getIncome(commitTxs);
  const commitExpenses = getExpenses(commitTxs);
  const personalIncome = getIncome(personalTxs);
  const personalExpenses = getExpenses(personalTxs);

  const showAll = business === "personal";
  const currentBusinesses = showAll ? ["lms", "commit", "personal"] : [business];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Accounting</h2>
        <div className="flex items-center gap-2">
          <DataExport />
          <AddTransactionForm />
        </div>
      </div>

      {/* Alerts */}
      {alerts.map((alert, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={cn(
            "flex items-center gap-3 p-4 rounded-xl border",
            alert.type === "warning" 
              ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" 
              : "bg-green-500/10 border-green-500/30 text-green-400"
          )}
        >
          {alert.type === "warning" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span className="text-sm">{alert.message}</span>
          {alert.business !== "all" && (
            <span className="ml-auto text-xs uppercase tracking-wider opacity-60">{alert.business}</span>
          )}
        </motion.div>
      ))}

      {/* Business Accounts */}
      {currentBusinesses.map((key, index) => {
        const data = accounts[key as keyof typeof accounts];
        const Icon = data.icon;
        
        const txs = key === "lms" ? lmsTxs : key === "commit" ? commitTxs : personalTxs;
        const income = key === "lms" ? lmsIncome : key === "commit" ? commitIncome : personalIncome;
        const expenses = key === "lms" ? lmsExpenses : key === "commit" ? commitExpenses : personalExpenses;
        const netIncome = income - expenses;
        const balance = data.accounts.reduce((acc, a) => acc + a.balance, 0);

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl" style={{ backgroundColor: data.color + "20" }}>
                  <Icon className="w-6 h-6" style={{ color: data.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{data.name}</h3>
                  <p className="text-sm text-gray-400">Accounting Overview</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Total Balance</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400">Monthly Income</p>
                <p className="text-xl font-bold text-green-500">+${income.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400">Monthly Expenses</p>
                <p className="text-xl font-bold text-red-500">-${expenses.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-gray-400">Net Income</p>
                <p className={cn("text-xl font-bold", netIncome >= 0 ? "text-green-500" : "text-red-500")}>
                  {netIncome >= 0 ? "+" : ""}${netIncome.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Accounts */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Accounts</h4>
              <div className="space-y-2">
                {data.accounts.map((account) => (
                  <div key={account.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{account.name}</span>
                      <span className="text-xs text-gray-500 uppercase">{account.type}</span>
                    </div>
                    <span className="font-medium">${account.balance.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Recent Transactions</h4>
              <div className="space-y-2">
                {txs.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">No transactions yet</p>
                ) : (
                  txs.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg group">
                      <div className="flex items-center gap-3">
                        {transaction.type === "income" ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <div>
                          <span className="text-sm">{transaction.description}</span>
                          <span className={cn("ml-2 text-xs px-1.5 py-0.5 rounded border", categoryColors[transaction.category] || categoryColors.other)}>
                            {transaction.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <span className={cn("font-medium", transaction.type === "income" ? "text-green-500" : "text-red-500")}>
                            {transaction.type === "income" ? "+" : "-"}${Math.abs(transaction.amount).toLocaleString()}
                          </span>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                        <button 
                          onClick={() => deleteTransaction(transaction.id)}
                          className="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Combined Summary (only in Personal context) */}
      {showAll && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-gradient-to-r from-[#00d4ff]/10 via-[#8b5cf6]/10 to-[#e94560]/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Combined Financial Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400">Total Balance</p>
              <p className="text-2xl font-bold">
                ${Object.values(accounts).reduce((acc, a) => acc + a.accounts.reduce((sum, ac) => sum + ac.balance, 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400">Total Monthly Income</p>
              <p className="text-2xl font-bold text-green-500">
                +${(lmsIncome + commitIncome + personalIncome).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400">Total Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-500">
                -${(lmsExpenses + commitExpenses + personalExpenses).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-sm text-gray-400">Combined Net</p>
              <p className="text-2xl font-bold text-green-500">
                +${(lmsIncome + commitIncome + personalIncome - lmsExpenses - commitExpenses - personalExpenses).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
