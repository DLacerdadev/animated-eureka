import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { TurnoverChart } from "@/components/dashboard/turnover-chart";
import { ChartLine, ChartPie, MoreHorizontal, UserPlus, UserX, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

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
    <div className="p-6 space-y-6">
      {/* Filtros de Período */}
      <Card data-testid="period-filters">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Período de Análise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Mês</label>
              <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                <SelectTrigger className="w-40" data-testid="select-month">
                  <SelectValue placeholder="Selecione o mês" />
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
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Ano</label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-32" data-testid="select-year">
                  <SelectValue placeholder="Selecione o ano" />
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
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <KPICards selectedMonth={selectedMonth} selectedYear={selectedYear} />
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Turnover Chart */}
        <TurnoverChart />
        
        {/* Demographics Chart */}
        <Card data-testid="chart-demographics">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Demografia por Faixa Etária</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartPie className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Gráfico Demográfico</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Dados serão carregados via API Senior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card data-testid="recent-activity">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3" data-testid={`activity-${activity.id}`}>
                  <div className={`w-8 h-8 bg-${activity.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
