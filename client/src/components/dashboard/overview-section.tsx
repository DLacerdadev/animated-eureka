import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KPICards } from "@/components/dashboard/kpi-cards";
import { ChartLine, ChartPie, MoreHorizontal, UserPlus, UserX, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <KPICards />
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Turnover Chart */}
        <Card data-testid="chart-turnover">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Turnover por Mês</CardTitle>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartLine className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Gráfico de Turnover</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Dados serão carregados via API Senior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
