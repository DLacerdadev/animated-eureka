import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Building2, Loader2, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFilteredDivisionsData } from "@/hooks/use-filter-data";

interface DivisionData {
  divisao: string;
  quantidade: number;
  percentual: number;
}

interface DivisionChartProps {
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
const mockDivisionData: DivisionData[] = [
  { divisao: "Administração", quantidade: 42, percentual: 10.4 },
  { divisao: "Operacional", quantidade: 127, percentual: 31.6 },
  { divisao: "Comercial", quantidade: 89, percentual: 22.1 },
  { divisao: "Atendimento", quantidade: 64, percentual: 15.9 },
  { divisao: "Técnica", quantidade: 53, percentual: 13.2 },
  { divisao: "Infraestrutura", quantidade: 27, percentual: 6.7 }
];

export function DivisionChart({ selectedMonth = 9, selectedYear = 2025, selectedEmpresa = "1", filterParams }: DivisionChartProps) {
  // Use filterParams if available, otherwise fall back to individual params
  const month = filterParams ? parseInt(filterParams.months.split(',')[0]) || selectedMonth : selectedMonth;
  const year = filterParams ? parseInt(filterParams.years.split(',')[0]) || selectedYear : selectedYear;
  
  // Use real filtered divisions data
  const queryParams = filterParams ? {
    empresas: filterParams.empresas,
    status: filterParams.status,
    months: filterParams.months,
    years: filterParams.years
  } : {
    empresas: selectedEmpresa,
    status: "1",
    months: month.toString(),
    years: year.toString()
  };
  
  const { data: realDivisionData, isLoading, error } = useFilteredDivisionsData(queryParams);
  
  // Use real data if available, otherwise fall back to mock
  const divisionData = realDivisionData && realDivisionData.length > 0 ? realDivisionData : mockDivisionData;

  if (isLoading) {
    return (
      <Card className="overflow-hidden shadow-lg border-0" data-testid="chart-division">
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-gray-800">Funcionários por Divisão</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center border border-indigo-100">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Loader2 className="h-6 w-6 text-white" />
              </motion.div>
              <p className="text-gray-700 font-semibold">Carregando dados por divisão...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden shadow-lg border-0" data-testid="chart-division">
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-gray-800">Funcionários por Divisão</CardTitle>
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

  const sortedData = [...divisionData].sort((a, b) => b.quantidade - a.quantidade);

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0" data-testid="chart-division">
      <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">Funcionários por Divisão</CardTitle>
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
          className="h-80 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border border-gray-100"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={sortedData} 
              margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.6} />
              <XAxis 
                dataKey="divisao"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                angle={-30}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
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
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                formatter={(value: number, name: string, props: any) => [
                  `${value} funcionários (${props.payload.percentual}%)`,
                  'Quantidade'
                ]}
                labelFormatter={(label) => `Divisão: ${label}`}
              />
              <Bar dataKey="quantidade" radius={[8, 8, 0, 0]} fill="url(#divisionGradient)">
                <defs>
                  <linearGradient id="divisionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Divisions Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-700">Top 3 Divisões</h4>
            <p className="text-xs text-gray-500">
              {sortedData.reduce((acc, curr) => acc + curr.quantidade, 0)} total
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {sortedData.slice(0, 3).map((division, index) => (
              <div key={division.divisao} className="text-center p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center justify-center mb-2">
                  <span className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                    index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                  )}>
                    {index + 1}
                  </span>
                </div>
                <p className="text-lg font-bold text-indigo-600">{division.quantidade}</p>
                <p className="text-xs font-semibold text-gray-600 truncate" title={division.divisao}>
                  {division.divisao}
                </p>
                <p className="text-xs text-gray-500">{division.percentual}%</p>
              </div>
            ))}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}