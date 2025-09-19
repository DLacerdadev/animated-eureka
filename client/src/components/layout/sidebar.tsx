import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  ChartPie, 
  TrendingUp, 
  Users, 
  DollarSign, 
  UserX, 
  RotateCcw, 
  Watch, 
  Clock, 
  CalendarX, 
  File, 
  Handshake, 
  Filter, 
  Settings,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  {
    title: "Dashboard",
    items: [
      { icon: TrendingUp, label: "Visão Geral", href: "/", section: "overview" },
    ],
  },
  {
    title: "Módulos",
    items: [
      { icon: DollarSign, label: "Folha", href: "/folha", section: "folha" },
      { icon: Users, label: "Pessoas", href: "/pessoas", section: "pessoas" },
      { icon: ChartPie, label: "Demografia", href: "/demografia", section: "demografia" },
      { icon: UserX, label: "Desligamentos", href: "/desligamentos", section: "desligamentos" },
      { icon: RotateCcw, label: "Turnover", href: "/turnover", section: "turnover" },
      { icon: Watch, label: "Absenteísmo", href: "/absenteismo", section: "absenteismo" },
      { icon: Clock, label: "Hora Extra", href: "/hora-extra", section: "hora-extra" },
      { icon: CalendarX, label: "Ausência", href: "/ausencia", section: "ausencia" },
      { icon: File, label: "eDag", href: "/edag", section: "edag" },
      { icon: Handshake, label: "CCT", href: "/cct", section: "cct" },
    ],
  },
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
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        data-testid="sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <ChartPie className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">Opus Dashboard</h1>
                <p className="text-xs text-muted-foreground">Senior Integration</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="md:hidden p-2 text-muted-foreground hover:text-sidebar-foreground"
              data-testid="button-close-sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto" data-testid="nav-menu">
            {navigationItems.map((group) => (
              <div key={group.title} className="mb-4">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.href;
                    
                    return (
                      <Link
                        key={item.section}
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            onClose();
                          }
                        }}
                        data-testid={`nav-link-${item.section}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
          
          {/* User Profile */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Admin</p>
                <p className="text-xs text-muted-foreground truncate">admin@opus.com.br</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
