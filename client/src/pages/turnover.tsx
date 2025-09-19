import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, TrendingUp, TrendingDown, Calendar, Target, Sparkles } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TurnoverChart } from "@/components/dashboard/turnover-chart";

export default function Turnover() {
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2025);

  // Mock data - será substituído pela API
  const mockData = {
    taxa_turnover: 8.2,
    contratacoes: 27,
    desligamentos: 17,
    funcionarios_ativos: 402,
    meta_turnover: 6.5,
    turnover_positivo: 6.7,
    turnover_negativo: 4.2
  };

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-orange-50 to-amber-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-white" />
            </div>
            Turnover
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            Análise completa da rotatividade de pessoal da empresa
          </p>
        </div>

        {/* Período Selector */}
        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-lg">
          <Calendar className="h-5 w-5 text-orange-600" />
          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
            <SelectTrigger className="w-32 border-0 bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({length: 12}, (_, i) => i + 1).map((month) => (
                <SelectItem key={month} value={month.toString()}>
                  {month.toString().padStart(2, '0')}/{selectedYear}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-24 border-0 bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Taxa de Turnover Geral */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-600" />
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">{mockData.taxa_turnover}%</p>
                <p className="text-xs font-semibold text-gray-600">Taxa Geral</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Turnover Total</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Meta: {mockData.meta_turnover}%</span>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
                {mockData.taxa_turnover > mockData.meta_turnover ? 'ACIMA' : 'OK'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Turnover Positivo */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-600" />
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">{mockData.turnover_positivo}%</p>
                <p className="text-xs font-semibold text-gray-600">Admissões</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Turnover Positivo</h3>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-sm text-emerald-600 font-semibold">
                {mockData.contratacoes} contratações
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Turnover Negativo */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-red-500 to-rose-600" />
          <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{mockData.turnover_negativo}%</p>
                <p className="text-xs font-semibold text-gray-600">Desligamentos</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Turnover Negativo</h3>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600 font-semibold">
                {mockData.desligamentos} desligamentos
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Meta vs Realizado */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">
                  {((mockData.taxa_turnover / mockData.meta_turnover) * 100).toFixed(0)}%
                </p>
                <p className="text-xs font-semibold text-gray-600">vs Meta</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Performance</h3>
            <p className="text-sm text-gray-600">Meta: {mockData.meta_turnover}%</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Turnover Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <TurnoverChart 
          selectedMonth={selectedMonth} 
          selectedYear={selectedYear}
          selectedEmpresa="1"
        />
      </motion.div>

      {/* Analysis Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Análise de Tendências */}
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-600" />
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-3">
              <TrendingUp className="h-5 w-5" />
              Análise de Tendências
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="font-semibold text-emerald-800">Turnover Positivo Saudável</span>
                </div>
                <p className="text-sm text-emerald-700">
                  Taxa de admissões ({mockData.turnover_positivo}%) indica crescimento controlado da equipe.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="font-semibold text-orange-800">Taxa Acima da Meta</span>
                </div>
                <p className="text-sm text-orange-700">
                  Turnover geral ({mockData.taxa_turnover}%) está {(mockData.taxa_turnover - mockData.meta_turnover).toFixed(1)}% acima da meta.
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold text-blue-800">Saldo Líquido</span>
                </div>
                <p className="text-sm text-blue-700">
                  Saldo positivo de +{mockData.contratacoes - mockData.desligamentos} funcionários no período.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes da Movimentação */}
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="h-2 bg-gradient-to-r from-teal-500 to-cyan-600" />
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-3">
              <RotateCcw className="h-5 w-5" />
              Detalhes da Movimentação
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl flex items-center justify-center border border-teal-100">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </motion.div>
                <p className="text-teal-700 font-semibold text-lg">Gráfico de Movimentação</p>
                <p className="text-sm text-teal-600 mt-2 font-medium">
                  Dados detalhados serão carregados via API Senior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}