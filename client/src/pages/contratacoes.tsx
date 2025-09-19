import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, TrendingUp, Calendar, Users, Sparkles, Building2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Contratacoes() {
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2025);

  // Mock data - será substituído pela API
  const mockData = {
    contratacoes_mes: 27,
    contratacoes_periodo: 189,
    meta_contratacoes: 35,
    crescimento_percentual: 12.5,
    principais_divisoes: [
      { nome: "Operacional", quantidade: 12 },
      { nome: "Comercial", quantidade: 8 },
      { nome: "Atendimento", quantidade: 4 }
    ]
  };

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-emerald-50 to-green-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            Contratações
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            Acompanhe as admissões e tendências de contratação da empresa
          </p>
        </div>

        {/* Período Selector */}
        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-lg">
          <Calendar className="h-5 w-5 text-emerald-600" />
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
        {/* Contratações do Mês */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-600" />
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">{mockData.contratacoes_mes}</p>
                <p className="text-xs font-semibold text-gray-600">Este Mês</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Contratações Mensais</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Meta: {mockData.meta_contratacoes}</span>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                {((mockData.contratacoes_mes / mockData.meta_contratacoes) * 100).toFixed(0)}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Contratações Acumuladas */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{mockData.contratacoes_periodo}</p>
                <p className="text-xs font-semibold text-gray-600">Acumulado</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Total {selectedYear}</h3>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-semibold">
                +{mockData.crescimento_percentual}% vs ano anterior
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Principal Divisão */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-600" />
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">{mockData.principais_divisoes[0].quantidade}</p>
                <p className="text-xs font-semibold text-gray-600">Contratações</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Top Divisão</h3>
            <p className="text-sm text-gray-600 font-semibold">{mockData.principais_divisoes[0].nome}</p>
          </CardContent>
        </Card>

        {/* Funcionários Ativos */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-teal-500 to-cyan-600" />
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-teal-600">402</p>
                <p className="text-xs font-semibold text-gray-600">Total Ativo</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Funcionários Ativos</h3>
            <p className="text-sm text-gray-600">Equipe atual</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts and Details - Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Contratações por Divisão */}
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-600" />
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-3">
              <Building2 className="h-5 w-5" />
              Contratações por Divisão
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockData.principais_divisoes.map((divisao, index) => (
                <div key={divisao.nome} className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index === 0 ? 'bg-emerald-500 text-white' :
                      index === 1 ? 'bg-emerald-400 text-white' : 'bg-emerald-300 text-emerald-800'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-700">{divisao.nome}</span>
                  </div>
                  <span className="text-lg font-bold text-emerald-600">{divisao.quantidade}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Evolução Temporal */}
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-3">
              <TrendingUp className="h-5 w-5" />
              Evolução das Contratações
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center border border-blue-100">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </motion.div>
                <p className="text-blue-700 font-semibold text-lg">Gráfico Temporal</p>
                <p className="text-sm text-blue-600 mt-2 font-medium">
                  Dados serão carregados via API Senior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}