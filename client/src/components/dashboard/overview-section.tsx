import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { TurnoverChart } from "@/components/dashboard/turnover-chart";
import { GenderChart } from "@/components/dashboard/gender-chart";
import { TenureChart } from "@/components/dashboard/tenure-chart";
import { DivisionChart } from "@/components/dashboard/division-chart";
import { ChartLine, ChartPie, MoreHorizontal, UserPlus, UserX, Clock, Calendar, Filter, Sparkles, Activity, Building, Users, UserCheck, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCompanies, useDivisions, useEmployeeStatus } from "@/hooks/use-filter-data";
import type { MultiSelectOption } from "@/components/ui/multi-select";

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
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]); // Start empty = show all
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedDivisao, setSelectedDivisao] = useState<string[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string[]>([]);
  
  // Fetch real data
  const { data: companies, isLoading: loadingCompanies } = useCompanies();
  const { data: divisions, isLoading: loadingDivisions } = useDivisions();
  const { data: employeeStatus, isLoading: loadingStatus } = useEmployeeStatus();

  // IDs das 7 empresas padrão (conforme backend)
  const empresasPadrao = ['1', '6', '8', '9', '10', '11', '13'];
  
  // Inicializar selectedEmpresa com todas as 7 empresas quando os dados carregarem
  useEffect(() => {
    if (companies && companies.length > 0 && selectedEmpresa.length === 0) {
      const empresasDisponiveis = companies
        .filter(company => empresasPadrao.includes(company.id))
        .map(company => company.id);
      
      if (empresasDisponiveis.length > 0) {
        setSelectedEmpresa(empresasDisponiveis);
      }
    }
  }, [companies, selectedEmpresa.length]);
  
  // Função para verificar se está usando todas as empresas padrão
  const isUsingAllCompanies = () => {
    if (!companies) return false;
    const empresasDisponiveis = companies
      .filter(company => empresasPadrao.includes(company.id))
      .map(company => company.id);
    return empresasDisponiveis.length === selectedEmpresa.length &&
           empresasDisponiveis.every(id => selectedEmpresa.includes(id));
  };

  // Multi-select options
  const monthOptions: MultiSelectOption[] = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  const yearOptions: MultiSelectOption[] = [
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];
  
  // Convert API data to MultiSelect options
  const statusOptions: MultiSelectOption[] = employeeStatus?.map(status => ({
    value: status.id,
    label: status.label
  })) || [];
  
  const divisaoOptions: MultiSelectOption[] = divisions?.map(division => ({
    value: division.id,
    label: division.label,
    icon: Building
  })) || [];
  
  const empresaOptions: MultiSelectOption[] = companies?.map(company => ({
    value: company.id,
    label: company.label,
    icon: Building
  })) || [];

  
  // No default selections - user must choose what to filter by
  
  // Create filter query params for API - only include when values differ from defaults
  const filterParams: {
    months: string;
    years: string;
    empresas: string;
    status: string;
    divisoes: string;
  } = {
    months: '',
    years: '',
    empresas: '',
    status: '',
    divisoes: ''
  };
  
  if (selectedMonths.length > 0) {
    filterParams.months = selectedMonths.join(',');
  }
  if (selectedYears.length > 0) {
    filterParams.years = selectedYears.join(',');
  }
  // Só enviar empresas se for diferente do padrão de todas as 7 empresas
  if (selectedEmpresa.length > 0 && !isUsingAllCompanies()) {
    filterParams.empresas = selectedEmpresa.join(',');
  }
  if (selectedStatus.length > 0 && !selectedStatus.includes('todos')) {
    filterParams.status = selectedStatus.join(',');
  }
  if (selectedDivisao.length > 0) {
    filterParams.divisoes = selectedDivisao.join(',');
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200/80 p-6">
        <div className="flex flex-col gap-6">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 w-full"
            data-testid="advanced-filters"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Filter className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Filtros Avançados</h3>
                    <p className="text-sm text-gray-600">Seleção múltipla para análise personalizada</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedStatus([]);
                    setSelectedDivisao([]);
                    setSelectedMonths([]);
                    setSelectedYears([]);
                    
                    // Resetar empresas para as 7 padrão
                    if (companies) {
                      const empresasDisponiveis = companies
                        .filter(company => empresasPadrao.includes(company.id))
                        .map(company => company.id);
                      setSelectedEmpresa(empresasDisponiveis);
                    }
                  }}
                  className="text-gray-600 hover:text-gray-900 w-fit"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              </div>
              
              {/* Business Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Funcionário */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-gray-600" />
                    <label className="text-sm font-semibold text-gray-800">Status</label>
                    {loadingStatus && <Loader2 className="h-3 w-3 animate-spin text-slate-500" />}
                  </div>
                  <MultiSelect
                    options={statusOptions}
                    selected={selectedStatus}
                    onChange={setSelectedStatus}
                    placeholder="Selecionar status..."
                    className="w-full h-10"
                    disabled={loadingStatus}
                  />
                </div>
                
                {/* Divisão */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-600" />
                    <label className="text-sm font-semibold text-gray-800">Divisão</label>
                    {loadingDivisions && <Loader2 className="h-3 w-3 animate-spin text-slate-500" />}
                  </div>
                  <MultiSelect
                    options={divisaoOptions}
                    selected={selectedDivisao}
                    onChange={setSelectedDivisao}
                    placeholder="Selecionar divisões..."
                    className="w-full h-10"
                    disabled={loadingDivisions}
                  />
                </div>
                
                {/* Empresa */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-600" />
                      <label className="text-sm font-semibold text-gray-800">Empresa</label>
                      {loadingCompanies && <Loader2 className="h-3 w-3 animate-spin text-slate-500" />}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isUsingAllCompanies() 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {isUsingAllCompanies() 
                        ? `Todas (${selectedEmpresa.length})` 
                        : `${selectedEmpresa.length} selecionada(s)`}
                    </div>
                  </div>
                  <MultiSelect
                    options={empresaOptions}
                    selected={selectedEmpresa}
                    onChange={setSelectedEmpresa}
                    placeholder="Selecionar empresas..."
                    className="w-full h-10"
                    disabled={loadingCompanies}
                    maxSelected={7}
                  />
                  {isUsingAllCompanies() && (
                    <p className="text-xs text-gray-500 mt-1">
                      ✓ Usando todas as empresas padrão para relatórios completos
                    </p>
                  )}
                </div>
              </div>
              
              {/* Period Selection Row */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">Período de Análise</h4>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Year Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-800">Anos:</label>
                    <MultiSelect
                      options={yearOptions}
                      selected={selectedYears}
                      onChange={setSelectedYears}
                      placeholder="Selecionar anos..."
                      className="w-full h-10"
                      maxSelected={3}
                    />
                  </div>
                  
                  {/* Month Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-800">Meses:</label>
                    <MultiSelect
                      options={monthOptions}
                      selected={selectedMonths}
                      onChange={setSelectedMonths}
                      placeholder="Selecionar meses..."
                      className="w-full h-10"
                      maxSelected={6}
                    />
                  </div>
                </div>
              </div>
              
              {/* Applied Filters Summary */}
              {(selectedStatus.length > 0 || selectedDivisao.length > 0 || selectedEmpresa.length > 1 || selectedMonths.length > 1 || selectedYears.length > 1) && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Filter className="h-3 w-3 text-slate-600" />
                    <span className="text-xs font-semibold text-slate-700">Filtros Aplicados:</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    {selectedStatus.length > 0 && <span>Status: {selectedStatus.length} • </span>}
                    {selectedDivisao.length > 0 && <span>Divisões: {selectedDivisao.length} • </span>}
                    {selectedEmpresa.length > 1 && <span>Empresas: {selectedEmpresa.length} • </span>}
                    {selectedMonths.length > 1 && <span>Meses: {selectedMonths.length} • </span>}
                    {selectedYears.length > 1 && <span>Anos: {selectedYears.length}</span>}
                  </div>
                </div>
              )}
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
          <KPICards 
            filterParams={filterParams}
          />
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
            filterParams={filterParams}
          />
          
          {/* Gender Demographics Chart */}
          <GenderChart 
            filterParams={filterParams}
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
            filterParams={filterParams}
          />
          
          {/* Division Chart */}
          <DivisionChart 
            filterParams={filterParams}
          />
        </motion.div>
      
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
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
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r", colorMap[activity.color as keyof typeof colorMap] || "from-gray-500 to-gray-600")}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 leading-tight">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 font-medium">
                          {activity.time}
                        </p>
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