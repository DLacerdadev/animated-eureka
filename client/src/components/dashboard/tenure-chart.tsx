import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Clock, Loader2, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TenureData {
  faixa: string;
  quantidade: number;
  percentual: number;
}

interface TenureChartProps {
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

// Mock data baseado na imagem - será substituído por dados reais da API
const mockTenureData: TenureData[] = [
  { faixa: "Até 6 meses", quantidade: 68, percentual: 16.9 },
  { faixa: "6 meses a 1 ano", quantidade: 54, percentual: 13.4 },
  { faixa: "1 a 2 anos", quantidade: 58, percentual: 14.4 },
  { faixa: "2 a 5 anos", quantidade: 98, percentual: 24.4 },
  { faixa: "5 a 10 anos", quantidade: 87, percentual: 21.6 },
  { faixa: "Mais de 10 anos", quantidade: 37, percentual: 9.2 }
];

export function TenureChart({ selectedMonth = 9, selectedYear = 2025, selectedEmpresa = "1", filterParams }: TenureChartProps) {
  // Use filterParams if available, otherwise fall back to individual params
  const month = filterParams ? parseInt(filterParams.months.split(',')[0]) || selectedMonth : selectedMonth;
  const year = filterParams ? parseInt(filterParams.years.split(',')[0]) || selectedYear : selectedYear;
  
  // TODO: Implementar hook real useTenureData(year, month, selectedEmpresa)
  const isLoading = false;
  const error = null;
  const tenureData = mockTenureData;

  if (isLoading) {
    return (
      <Card className="overflow-hidden shadow-lg border-0" data-testid="chart-tenure">
        <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500" />
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-gray-800">Funcionários por Tempo de Empresa</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl flex items-center justify-center border border-green-100">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Loader2 className="h-6 w-6 text-white" />
              </motion.div>
              <p className="text-gray-700 font-semibold">Carregando dados de tempo de empresa...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden shadow-lg border-0" data-testid="chart-tenure">
        <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500" />
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-gray-800">Funcionários por Tempo de Empresa</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-700 font-semibold">Erro ao carregar dados</p>
              <p className="text-sm text-red-600 mt-1">Dados serão carregados via API Senior</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0" data-testid="chart-tenure">
      <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500" />
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-teal-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">Funcionários por Tempo de Empresa</CardTitle>
            <p className="text-sm text-gray-600 font-medium">
              {selectedMonth}/{selectedYear} - Opus Consultoria
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="hover:bg-white/50">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {/* Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-64 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tenureData} layout="horizontal" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.6} />
              <XAxis 
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis 
                type="category"
                dataKey="faixa"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                width={90}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  fontSize: '14px',
                  fontWeight: 500
                }}
                cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }}
                formatter={(value: number, name: string, props: any) => [
                  `${value} funcionários (${props.payload.percentual}%)`,
                  'Quantidade'
                ]}
                labelFormatter={(label) => `Tempo: ${label}`}
              />
              <Bar dataKey="quantidade" radius={[0, 8, 8, 0]} fill="url(#tenureGradient)">
                <defs>
                  <linearGradient id="tenureGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Summary Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 grid grid-cols-3 gap-4"
        >
          <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
            <p className="text-lg font-bold text-green-600">
              {tenureData.filter(item => item.faixa.includes("6 meses") || item.faixa.includes("Até")).reduce((acc, curr) => acc + curr.quantidade, 0)}
            </p>
            <p className="text-xs font-semibold text-gray-600">Novos (≤1 ano)</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-lg font-bold text-blue-600">
              {tenureData.filter(item => item.faixa.includes("2 a 5") || item.faixa.includes("1 a 2")).reduce((acc, curr) => acc + curr.quantidade, 0)}
            </p>
            <p className="text-xs font-semibold text-gray-600">Experientes (1-5 anos)</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-100">
            <p className="text-lg font-bold text-purple-600">
              {tenureData.filter(item => item.faixa.includes("5 a 10") || item.faixa.includes("Mais de 10")).reduce((acc, curr) => acc + curr.quantidade, 0)}
            </p>
            <p className="text-xs font-semibold text-gray-600">Veteranos (≥5 anos)</p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}