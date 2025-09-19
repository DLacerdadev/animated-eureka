import { useKPIData, useActiveEmployees } from "@/hooks/use-senior-api";
import { useFilteredStatistics } from "@/hooks/use-filter-data";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserPlus, UserMinus, Clock, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('pt-BR').format(num);
};

const formatPercentage = (num: number) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'percent', 
    minimumFractionDigits: 1,
    maximumFractionDigits: 1 
  }).format(num / 100);
};

interface KPICardsProps {
  selectedMonth?: number;
  selectedYear?: number;
  filterParams?: {
    months: string;
    years: string;
    empresas: string;
    status: string;
    divisoes: string;
  };
}

export function KPICards({ selectedMonth = 9, selectedYear = 2025, filterParams }: KPICardsProps) {
  const { data: kpiData, isLoading, error } = useKPIData();
  // Build query conditionally - only include when values are selected
  const queryParams: Record<string, string> = {};
  
  if (filterParams?.empresas) queryParams.empresas = filterParams.empresas;
  if (filterParams?.divisoes) queryParams.divisoes = filterParams.divisoes;
  if (filterParams?.status) queryParams.status = filterParams.status;
  if (filterParams?.months) queryParams.months = filterParams.months;
  if (filterParams?.years) queryParams.years = filterParams.years;
  
  const { data: activeEmployees, isLoading: employeesLoading, error: employeesError } = useActiveEmployees(queryParams);
  
  // Use real filtered statistics
  const { data: filteredStats, isLoading: statsLoading, error: statsError } = useFilteredStatistics(queryParams);

  if (isLoading || employeesLoading || statsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="w-10 h-10 rounded-lg" />
              </div>
              <Skeleton className="h-3 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (employeesError || statsError) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Erro ao carregar dados: {(employeesError || statsError)?.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use filtered statistics if available, otherwise fall back to original data
  const stats = filteredStats || {
    total_funcionarios: 0,
    funcionarios_ativos: 0,
    funcionarios_demitidos: 0,
    demissoes_periodo: 0,
    masculino: 0,
    feminino: 0,
    salario_medio: 0,
    contratacoes_6meses: 0,
    contratacoes_periodo: 0
  };

  // Use dados reais de funcionários filtrados
  const totalEmployees = stats.funcionarios_ativos || 0;
  const hires = stats.contratacoes_periodo || 0; // CORRIGIDO: usar contratacoes_periodo ao invés de 6meses
  const terminations = stats.demissoes_periodo || 0; // CORRIGIDO: usar demissoes_periodo ao invés de funcionarios_demitidos
  const avgSalary = stats.salario_medio || 0;

  // Verificar se há filtros aplicados
  const hasFilters = filterParams && (
    filterParams.empresas || 
    filterParams.divisoes || 
    filterParams.status || 
    filterParams.months || 
    filterParams.years
  );

  const kpis = [
    {
      title: "Total Funcionários",
      value: formatNumber(totalEmployees),
      subtitle: hasFilters 
        ? `Dados filtrados: ${formatNumber(totalEmployees)} funcionários`
        : `${formatNumber(totalEmployees)} funcionários ativos`,
      icon: Users,
      trend: kpiData?.trends.employees || 5.2,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-gradient-to-r from-blue-50 to-blue-100",
      iconBg: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Contratações",
      value: formatNumber(hires),
      subtitle: hasFilters
        ? `Filtrado: ${formatNumber(hires)} contratações`
        : `Total do período: ${formatNumber(hires)} admissões`,
      icon: UserPlus,
      trend: hires > 0 ? 100 : 0,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-gradient-to-r from-emerald-50 to-emerald-100",
      iconBg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    },
    {
      title: "Desligamentos",
      value: formatNumber(terminations),
      subtitle: hasFilters
        ? `Filtrado: ${formatNumber(terminations)} demissões`
        : `Total demitidos: ${formatNumber(terminations)}`,
      icon: UserMinus,
      trend: terminations > 0 ? -100 : 0,
      color: "from-red-500 to-red-600",
      bgColor: "bg-gradient-to-r from-red-50 to-red-100",
      iconBg: "bg-gradient-to-r from-red-500 to-red-600",
    },
    {
      title: "Salário Médio",
      value: `R$ ${formatNumber(avgSalary)}`,
      subtitle: hasFilters
        ? `Média salarial filtrada`
        : `Média salarial geral`,
      icon: Clock,
      trend: kpiData?.trends.overtime || 12.4,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-gradient-to-r from-purple-50 to-purple-100",
      iconBg: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        const isPositive = kpi.trend > 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group" data-testid={`kpi-card-${index}`}>
              <div className={cn("h-2", kpi.iconBg)} />
              <CardContent className={cn("p-6 relative", kpi.bgColor)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-semibold text-gray-700">
                        {kpi.title}
                      </p>
                      {totalEmployees > 400 && index === 0 && (
                        <Sparkles className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2" data-testid={`kpi-value-${index}`}>
                      {kpi.value}
                    </p>
                    {kpi.subtitle && (
                      <p className="text-xs text-gray-600 font-medium">
                        {kpi.subtitle}
                      </p>
                    )}
                  </div>
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
                    kpi.iconBg
                  )}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                  <div className={cn(
                    "flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                    isPositive 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-red-100 text-red-700"
                  )}>
                    <TrendIcon className="w-3 h-3 mr-1" />
                    <span data-testid={`kpi-trend-${index}`}>
                      {Math.abs(kpi.trend).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    vs mês anterior
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
