import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChartLine, Loader2, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useTurnoverChart } from "@/hooks/use-senior-api";

export function TurnoverChart() {
  const { data: turnoverData, isLoading, error } = useTurnoverChart();

  // Se não há dados ou está carregando, mostrar estado de loading ou erro
  if (isLoading) {
    return (
      <Card data-testid="chart-turnover">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Turnover do Mês</CardTitle>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-spin" />
              <p className="text-muted-foreground">Carregando dados de turnover...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card data-testid="chart-turnover">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Turnover do Mês</CardTitle>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <p className="text-muted-foreground">Erro ao carregar dados</p>
              <p className="text-xs text-destructive mt-1">{error.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!turnoverData) {
    return (
      <Card data-testid="chart-turnover">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Turnover do Mês</CardTitle>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartLine className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Nenhum dado disponível</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Preparar dados para o gráfico de barras
  const chartData = [
    { 
      name: 'Contratações', 
      value: turnoverData.contratacoes,
      color: 'hsl(var(--chart-1))'
    },
    { 
      name: 'Demissões', 
      value: turnoverData.demissoes,
      color: 'hsl(var(--chart-5))'
    }
  ];

  const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(
    new Date(turnoverData.ano, turnoverData.mes - 1)
  );

  return (
    <Card data-testid="chart-turnover">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Turnover - Opus Consultoria</CardTitle>
          <p className="text-sm text-muted-foreground capitalize">
            {monthName} {turnoverData.ano}
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {/* Métricas principais */}
        <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{turnoverData.taxa_turnover}%</p>
            <p className="text-xs text-muted-foreground">Taxa de Turnover</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">{turnoverData.funcionarios_ativos}</p>
            <p className="text-xs text-muted-foreground">Funcionários Ativos</p>
          </div>
        </div>

        {/* Gráfico de barras */}
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'calc(var(--radius) - 2px)',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Informações adicionais */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-1))' }} />
              <span className="text-muted-foreground">Contratações:</span>
              <span className="font-medium">{turnoverData.contratacoes}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--chart-5))' }} />
              <span className="text-muted-foreground">Demissões:</span>
              <span className="font-medium">{turnoverData.demissoes}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}