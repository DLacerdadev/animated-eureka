import { useKPIData, useActiveEmployees } from "@/hooks/use-senior-api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserPlus, UserMinus, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

export function KPICards({ selectedMonth = 9, selectedYear = 2025 }: KPICardsProps) {
  const { data: kpiData, isLoading, error } = useKPIData();
  const { data: activeEmployees, isLoading: employeesLoading, error: employeesError } = useActiveEmployees(selectedYear, selectedMonth);

  if (isLoading || employeesLoading) {
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

  if (employeesError) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Erro ao carregar funcionários ativos: {employeesError.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use dados reais de funcionários ativos e movimentações do período
  const totalEmployees = activeEmployees?.funcionarios_ativos || 0;
  const hires = activeEmployees?.contratacoes_periodo || 0;
  const terminations = activeEmployees?.demissoes_periodo || 0;

  const kpis = [
    {
      title: "Total Funcionários",
      value: formatNumber(totalEmployees),
      subtitle: activeEmployees?.fonte ? `Fonte: ${activeEmployees.fonte.includes('R034FUN') ? 'R034FUN' : 'r350adm'}` : '',
      icon: Users,
      trend: kpiData?.trends.employees || 5.2,
      color: "chart-1",
    },
    {
      title: "Contratações",
      value: formatNumber(hires),
      subtitle: `Período: ${selectedMonth}/${selectedYear}`,
      icon: UserPlus,
      trend: hires > 0 ? 100 : 0,
      color: "chart-2",
    },
    {
      title: "Desligamentos",
      value: formatNumber(terminations),
      subtitle: `Período: ${selectedMonth}/${selectedYear}`,
      icon: UserMinus,
      trend: terminations > 0 ? -100 : 0,
      color: "chart-5",
    },
    {
      title: "Horas Extra",
      value: kpiData ? `${formatNumber(kpiData.overtimeHours)}h` : "0h",
      subtitle: "Dados em integração",
      icon: Clock,
      trend: kpiData?.trends.overtime || 12.4,
      color: "chart-5",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        const isPositive = kpi.trend > 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} data-testid={`kpi-card-${index}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground" data-testid={`kpi-value-${index}`}>
                    {kpi.value}
                  </p>
                  {kpi.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {kpi.subtitle}
                    </p>
                  )}
                </div>
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  `bg-${kpi.color}`
                )}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className={cn(
                "text-xs mt-2 flex items-center",
                isPositive ? "text-chart-2" : "text-destructive"
              )}>
                <TrendIcon className="w-3 h-3 mr-1" />
                <span data-testid={`kpi-trend-${index}`}>
                  {Math.abs(kpi.trend).toFixed(1)}% vs mês anterior
                </span>
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
