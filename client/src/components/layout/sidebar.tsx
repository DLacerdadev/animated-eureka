import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  ChartPie, 
  TrendingUp, 
  Users, 
  UserPlus,
  UserX, 
  RotateCcw, 
  Calendar, 
  Clock, 
  CalendarX, 
  Building2, 
  DollarSign,
  X,
  Sparkles,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import opusLogo from "@/assets/opus-logo.png";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { icon: BarChart3, label: "Geral", href: "/", section: "geral", color: "from-blue-500 to-indigo-600" },
  { icon: UserPlus, label: "Contratações", href: "/contratacoes", section: "contratacoes", color: "from-emerald-500 to-green-600" },
  { icon: UserX, label: "Desligamentos", href: "/desligamentos", section: "desligamentos", color: "from-red-500 to-rose-600" },
  { icon: TrendingUp, label: "Turnover", href: "/turnover", section: "turnover", color: "from-orange-500 to-amber-600" },
  { icon: DollarSign, label: "Folha", href: "/folha", section: "folha", color: "from-yellow-500 to-orange-600" },
  { icon: Calendar, label: "Absenteísmo", href: "/absenteismo", section: "absenteismo", color: "from-pink-500 to-rose-600" },
  { icon: CalendarX, label: "Ausências", href: "/ausencias", section: "ausencias", color: "from-cyan-500 to-blue-600" },
  { icon: Clock, label: "Horas Extras", href: "/horas-extras", section: "horas-extras", color: "from-teal-500 to-cyan-600" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}
      
      {/* Sidebar */}
      <motion.div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 transition-transform duration-500 ease-out md:relative md:translate-x-0",
          "md:block", // Always visible on desktop
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0" // Hide on mobile only
        )}
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : window.innerWidth >= 768 ? 0 : -320 }} // Always show on desktop
        transition={{ duration: 0.4, ease: "easeInOut" }}
        data-testid="sidebar"
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 shadow-2xl">
          {/* Logo/Header */}
          <div className="relative p-8 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-600/50">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-700/30 to-slate-600/30" />
            <div className="relative flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img src={opusLogo} alt="Opus Logo" className="w-full h-full object-contain brightness-0 invert" />
                  </div>
                  <p className="text-sm text-slate-400 font-medium text-center">Dashboard RH Senior</p>
                </div>
              </motion.div>
              <button 
                onClick={onClose}
                className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
                data-testid="button-close-sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto" data-testid="nav-menu">
            <div className="space-y-2">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <motion.div
                    key={item.section}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center space-x-4 px-4 py-4 text-base rounded-2xl transition-all duration-300 relative overflow-hidden",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                          : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                      )}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          onClose();
                        }
                      }}
                      data-testid={`nav-link-${item.section}`}
                    >
                      {/* Background gradient on hover */}
                      <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                        !isActive && `bg-gradient-to-r ${item.color} opacity-10`
                      )} />
                      
                      {/* Icon */}
                      <div className={cn(
                        "relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300",
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "text-slate-400 group-hover:text-white group-hover:bg-white/10"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      {/* Label */}
                      <span className="relative font-semibold">{item.label}</span>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute right-3 w-2 h-2 bg-white rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </nav>
          
          {/* User Profile */}
          <motion.div 
            className="p-6 bg-gradient-to-r from-slate-800 to-slate-700 border-t border-slate-600/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center space-x-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-600/30">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-white truncate">Opus Consultoria</p>
                <p className="text-sm text-slate-400 truncate font-medium">Sistema RH Senior</p>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
