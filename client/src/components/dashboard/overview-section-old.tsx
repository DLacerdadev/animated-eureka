import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { TurnoverChart } from "@/components/dashboard/turnover-chart";
import { GenderChart } from "@/components/dashboard/gender-chart";
import { TenureChart } from "@/components/dashboard/tenure-chart";
import { DivisionChart } from "@/components/dashboard/division-chart";
import { ChartLine, ChartPie, MoreHorizontal, UserPlus, UserX, Clock, Calendar, Filter, Sparkles, Activity, Building, Users, UserCheck } from "lucide-react";
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
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");
  const [selectedDivisao, setSelectedDivisao] = useState<string>("todos");
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("1"); // Opus Consultoria

  const months = [
    { value: 1, label: "jan", fullLabel: "Janeiro" },
    { value: 2, label: "fev", fullLabel: "Fevereiro" },
    { value: 3, label: "mar", fullLabel: "Março" },
    { value: 4, label: "abr", fullLabel: "Abril" },
    { value: 5, label: "mai", fullLabel: "Maio" },
    { value: 6, label: "jun", fullLabel: "Junho" },
    { value: 7, label: "jul", fullLabel: "Julho" },
    { value: 8, label: "ago", fullLabel: "Agosto" },
    { value: 9, label: "set", fullLabel: "Setembro" },
    { value: 10, label: "out", fullLabel: "Outubro" },
    { value: 11, label: "nov", fullLabel: "Novembro" },
    { value: 12, label: "dez", fullLabel: "Dezembro" },
  ];

  const years = [2023, 2024, 2025];
  
  const statusOptions = [
    { value: "todos", label: "Todos" },
    { value: "ativo", label: "Ativo" },
    { value: "inativo", label: "Inativo" },
    { value: "afastado", label: "Afastado" },
  ];
  
  const divisaoOptions = [
    { value: "todos", label: "Todos" },
    { value: "administracao", label: "Administração" },
    { value: "comercial", label: "Comercial" },
    { value: "operacional", label: "Operacional" },
    { value: "financeiro", label: "Financeiro" },
    { value: "rh", label: "Recursos Humanos" },
  ];
  
  const empresaOptions = [
    { value: "1", label: "Opus Consultoria Ltda" },
    { value: "2", label: "Opus Serviços" },
    { value: "3", label: "Opus Tech" },
  ];

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
          
          {/* Advanced Filters */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg border border-gray-200/50 p-6"
            data-testid="advanced-filters"
          >
            {/* First Row - Status and Business Filters */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Filtros Avançados</h3>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {/* Status Funcionário */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-gray-600" />
                    <label className="text-sm font-semibold text-gray-700">Status Funcionário</label>
                  </div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-44 h-10 bg-white border-gray-300 text-sm shadow-sm hover:border-blue-400 transition-colors" data-testid="select-status">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Divisão */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-600" />
                    <label className="text-sm font-semibold text-gray-700">Divisão</label>
                  </div>
                  <Select value={selectedDivisao} onValueChange={setSelectedDivisao}>
                    <SelectTrigger className="w-48 h-10 bg-white border-gray-300 text-sm shadow-sm hover:border-blue-400 transition-colors" data-testid="select-divisao">
                      <SelectValue placeholder="Divisão" />
                    </SelectTrigger>
                    <SelectContent>
                      {divisaoOptions.map((divisao) => (
                        <SelectItem key={divisao.value} value={divisao.value}>
                          {divisao.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Empresa */}
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <label className="text-sm font-semibold text-gray-700">Empresa</label>
                  </div>
                  <Select value={selectedEmpresa} onValueChange={setSelectedEmpresa}>
                    <SelectTrigger className="w-52 h-10 bg-white border-gray-300 text-sm shadow-sm hover:border-blue-400 transition-colors" data-testid="select-empresa">
                      <SelectValue placeholder="Empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {empresaOptions.map((empresa) => (
                        <SelectItem key={empresa.value} value={empresa.value}>
                          {empresa.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Second Row - Date Filters */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Período de Análise</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                {/* Year Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Ano:</span>
                  <div className="flex gap-1">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={cn(
                          "px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200",
                          selectedYear === year
                            ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-200"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Month Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Mês:</span>
                  <div className="flex gap-1 flex-wrap">
                    {months.map((month) => (
                      <button
                        key={month.value}
                        onClick={() => setSelectedMonth(month.value)}
                        className={cn(
                          "px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 min-w-[44px]",
                          selectedMonth === month.value
                            ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-200"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        )}
                        title={month.fullLabel}
                      >
                        {month.label}
                      </button>
                    ))}
                  </div>
                </div>
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
      
        {/* Charts Grid - Main Charts Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Turnover Chart */}
          <TurnoverChart 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear} 
            selectedEmpresa={selectedEmpresa}
          />
          
          {/* Gender Demographics Chart */}
          <GenderChart 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear} 
            selectedEmpresa={selectedEmpresa}
          />
        </motion.div>
        
        {/* Charts Grid - Second Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Tenure Chart */}
          <TenureChart 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear} 
            selectedEmpresa={selectedEmpresa}
          />
          
          {/* Division Chart */}
          <DivisionChart 
            selectedMonth={selectedMonth} 
            selectedYear={selectedYear} 
            selectedEmpresa={selectedEmpresa}
          />
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
