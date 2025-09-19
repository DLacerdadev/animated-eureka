import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChartLine, Loader2, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useTurnoverChart } from "@/hooks/use-senior-api";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TurnoverChartProps {
  selectedMonth?: number;
  selectedYear?: number;
  selectedEmpresa?: string;
  filterParams?: {
    months: string;
    years: string;
    empresas: string;
    status: string;
    divisoes: string;
  };
}

export function TurnoverChart({ selectedMonth = 9, selectedYear = 2025, selectedEmpresa = "1", filterParams }: TurnoverChartProps) {
  // Use filterParams if available, otherwise fall back to individual params
  const month = filterParams ? parseInt(filterParams.months.split(',')[0]) || selectedMonth : selectedMonth;
  const year = filterParams ? parseInt(filterParams.years.split(',')[0]) || selectedYear : selectedYear;
  
  const { data: turnoverData, isLoading, error } = useTurnoverChart(year, month);

  // Se não há dados ou está carregando, mostrar estado de loading ou erro
  if (isLoading) {
    return (
      <Card className="overflow-hidden shadow-lg border-0" data-testid="chart-turnover">
        <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500" />
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <ChartLine className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-gray-800">Turnover do Mês</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-white/50">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl flex items-center justify-center border border-orange-100">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Loader2 className="h-6 w-6 text-white" />
              </motion.div>
              <p className="text-gray-700 font-semibold">Carregando dados de turnover...</p>
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
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0" data-testid="chart-turnover">
      <div className="h-2 bg-gradient-to-r from-orange-500 to-red-500" />
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <ChartLine className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">Turnover - Opus Consultoria</CardTitle>
            <p className="text-sm text-gray-600 font-medium capitalize">
              {monthName} {turnoverData.ano}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="hover:bg-white/50">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {/* Métricas principais */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                {turnoverData.taxa_turnover}%
              </p>
            </div>
            <p className="text-xs font-semibold text-gray-600">Taxa de Turnover</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {turnoverData.funcionarios_ativos}
              </p>
            </div>
            <p className="text-xs font-semibold text-gray-600">Funcionários Ativos</p>
          </motion.div>
        </div>

        {/* Gráfico de barras */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-48 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.6} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-xs"
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  color: '#334155',
                  fontSize: '14px',
                  fontWeight: 500
                }}
                cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                <Cell fill="url(#greenGradient)" />
                <Cell fill="url(#redGradient)" />
              </Bar>
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Informações adicionais */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 pt-4 border-t border-gray-200"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" />
              <div>
                <span className="text-sm font-semibold text-gray-700">Contratações</span>
                <p className="text-lg font-bold text-emerald-600">{turnoverData.contratacoes}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-100">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-rose-500 rounded-full" />
              <div>
                <span className="text-sm font-semibold text-gray-700">Demissões</span>
                <p className="text-lg font-bold text-red-600">{turnoverData.demissoes}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}