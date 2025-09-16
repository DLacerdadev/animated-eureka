import { useKPIData } from "@/hooks/use-senior-api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, RotateCcw, Watch, Clock, TrendingUp, TrendingDown } from "lucide-react";
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

export function KPICards() {
  const { data: kpiData, isLoading, error } = useKPIData();

  if (isLoading) {
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

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Erro ao carregar dados: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!kpiData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Nenhum dado disponível</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Funcionários",
      value: formatNumber(kpiData.totalEmployees),
      icon: Users,
      trend: kpiData.trends.employees,
      color: "chart-1",
    },
    {
      title: "Turnover Mensal",
      value: formatPercentage(kpiData.monthlyTurnover),
      icon: RotateCcw,
      trend: kpiData.trends.turnover,
      color: "chart-3",
    },
    {
      title: "Absenteísmo",
      value: formatPercentage(kpiData.absenteeismRate),
      icon: Watch,
      trend: kpiData.trends.absenteeism,
      color: "chart-4",
    },
    {
      title: "Horas Extra",
      value: `${formatNumber(kpiData.overtimeHours)}h`,
      icon: Clock,
      trend: kpiData.trends.overtime,
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
