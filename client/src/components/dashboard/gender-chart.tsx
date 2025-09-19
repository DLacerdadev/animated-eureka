import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Users, Loader2, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFilteredStatistics } from "@/hooks/use-filter-data";

interface GenderData {
  sexo: string;
  quantidade: number;
  percentual: number;
}

interface GenderChartProps {
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

// Mock data - será substituído por dados reais da API
const mockGenderData: GenderData[] = [
  { sexo: "Masculino", quantidade: 248, percentual: 61.7 },
  { sexo: "Feminino", quantidade: 154, percentual: 38.3 }
];

const COLORS = {
  'Masculino': '#3B82F6', // Blue
  'Feminino': '#EC4899'   // Pink
};

export function GenderChart({ selectedMonth = 9, selectedYear = 2025, selectedEmpresa = "1", filterParams }: GenderChartProps) {
  // Use filterParams if available, otherwise fall back to individual params
  const month = filterParams?.months ? parseInt(filterParams.months.split(',')[0]) || selectedMonth : selectedMonth;
  const year = filterParams?.years ? parseInt(filterParams.years.split(',')[0]) || selectedYear : selectedYear;
  
  // Use real filtered statistics for gender data - build query conditionally
  const queryParams: Record<string, string> = {};
  
  if (filterParams?.empresas) queryParams.empresas = filterParams.empresas;
  if (filterParams?.divisoes) queryParams.divisoes = filterParams.divisoes;
  if (filterParams?.status) queryParams.status = filterParams.status;
  if (filterParams?.months) queryParams.months = filterParams.months;
  if (filterParams?.years) queryParams.years = filterParams.years;
  
  const { data: stats, isLoading, error } = useFilteredStatistics(queryParams);
  
  // Calculate gender data from real statistics
  const totalEmployees = (stats?.masculino || 0) + (stats?.feminino || 0);
  const realGenderData: GenderData[] = totalEmployees > 0 ? [
    {
      sexo: "Masculino",
      quantidade: stats?.masculino || 0,
      percentual: parseFloat(((stats?.masculino || 0) / totalEmployees * 100).toFixed(1))
    },
    {
      sexo: "Feminino",
      quantidade: stats?.feminino || 0,
      percentual: parseFloat(((stats?.feminino || 0) / totalEmployees * 100).toFixed(1))
    }
  ] : mockGenderData;
  
  // Use real data if available, otherwise fall back to mock
  const genderData = realGenderData;

  if (isLoading) {
    return (
      <Card className="overflow-hidden shadow-lg border-0" data-testid="chart-gender">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-pink-500" />
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-gray-800">Funcionários por Sexo</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-white/50">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 bg-gradient-to-br from-blue-50 to-pink-50 rounded-2xl flex items-center justify-center border border-blue-100">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Loader2 className="h-6 w-6 text-white" />
              </motion.div>
              <p className="text-gray-700 font-semibold">Carregando dados demográficos...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden shadow-lg border-0" data-testid="chart-gender">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-pink-500" />
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-gray-800">Funcionários por Sexo</CardTitle>
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
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0" data-testid="chart-gender">
      <div className="h-2 bg-gradient-to-r from-blue-500 to-pink-500" />
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-pink-50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-800">Funcionários por Sexo</CardTitle>
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="h-64 relative"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="quantidade"
                nameKey="sexo"
              >
                {genderData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.sexo as keyof typeof COLORS]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  fontSize: '14px',
                  fontWeight: 500
                }}
                formatter={(value: number, name: string, props: any) => [
                  `${value} funcionários (${props.payload.percentual}%)`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Central Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">
                {genderData.reduce((acc, curr) => acc + curr.quantidade, 0)}
              </p>
              <p className="text-sm font-semibold text-gray-600">Total</p>
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-8 mt-6"
        >
          {genderData.map((item) => (
            <div key={item.sexo} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[item.sexo as keyof typeof COLORS] }}
              />
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700">{item.sexo}</p>
                <p className="text-lg font-bold" style={{ color: COLORS[item.sexo as keyof typeof COLORS] }}>
                  {item.quantidade}
                </p>
                <p className="text-xs text-gray-500">{item.percentual}%</p>
              </div>
            </div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}