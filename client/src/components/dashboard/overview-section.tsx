import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { TurnoverChart } from "@/components/dashboard/turnover-chart";
import { ChartLine, ChartPie, MoreHorizontal, UserPlus, UserX, Clock, Calendar, Filter, Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const recentActivities = [
  {
    id: 1,
    type: "hire",
    icon: UserPlus,
    title: "João Silva foi contratado para o cargo de Analista de Sistemas",
    time: "há 2 horas",
    color: "chart-1",
  },
  {
    id: 2,
    type: "termination",
    icon: UserX,
    title: "Maria Santos solicitou desligamento",
    time: "há 4 horas",
    color: "chart-5",
  },
  {
    id: 3,
    type: "report",
    icon: Clock,
    title: "Relatório de Horas Extra gerado",
    time: "há 1 dia",
    color: "chart-3",
  },
];

export function OverviewSection() {
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // Setembro
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  const years = [2023, 2024, 2025];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200/80 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-blue-500" />
                Dashboard RH
              </h1>
              <p className="text-gray-600 mt-1 font-medium">Visão em tempo real dos seus indicadores de recursos humanos</p>
            </motion.div>
          </div>
          
          {/* Período Filters */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-200/50"
            data-testid="period-filters"
          >
            <div className="flex items-center gap-2 text-blue-700">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-semibold">Filtros:</span>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-blue-700">Mês</label>
                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger className="w-36 h-8 bg-white border-blue-200 text-sm" data-testid="select-month">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-blue-700">Ano</label>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-24 h-8 bg-white border-blue-200 text-sm" data-testid="select-year">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-6 space-y-8">

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <KPICards selectedMonth={selectedMonth} selectedYear={selectedYear} />
        </motion.div>
      
        {/* Charts Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Turnover Chart */}
          <TurnoverChart />
          
          {/* Demographics Chart */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0" data-testid="chart-demographics">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <ChartPie className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">Demografia por Faixa Etária</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="hover:bg-white/50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center border border-purple-100">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <ChartPie className="h-8 w-8 text-white" />
                  </motion.div>
                  <p className="text-gray-700 font-semibold text-lg">Gráfico Demográfico</p>
                  <p className="text-sm text-gray-500 mt-2 font-medium">
                    Dados serão carregados via API Senior
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0" data-testid="recent-activity">
            <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500" />
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-800">Atividades Recentes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  const colorMap = {
                    "chart-1": "from-blue-500 to-blue-600",
                    "chart-5": "from-red-500 to-red-600", 
                    "chart-3": "from-yellow-500 to-yellow-600"
                  };
                  
                  return (
                    <motion.div 
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-white hover:to-gray-50 border border-gray-100 hover:border-gray-200 transition-all duration-200"
                      data-testid={`activity-${activity.id}`}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md",
                        `bg-gradient-to-r ${colorMap[activity.color as keyof typeof colorMap]}`
                      )}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-relaxed">{activity.title}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
