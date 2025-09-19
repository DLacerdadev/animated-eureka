import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserX, TrendingDown, Calendar, AlertTriangle, Sparkles, Building2 } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Desligamentos() {
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear] = useState(2025);

  // Mock data - será substituído pela API
  const mockData = {
    desligamentos_mes: 17,
    desligamentos_periodo: 134,
    taxa_turnover_negativo: 4.2,
    principais_motivos: [
      { motivo: "Demissão sem justa causa", quantidade: 8 },
      { motivo: "Pedido de demissão", quantidade: 6 },
      { motivo: "Final de contrato", quantidade: 3 }
    ]
  };

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-red-50 to-rose-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
              <UserX className="h-5 w-5 text-white" />
            </div>
            Desligamentos
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            Monitore os desligamentos e analise as tendências de rotatividade
          </p>
        </div>

        {/* Período Selector */}
        <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-lg">
          <Calendar className="h-5 w-5 text-red-600" />
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
        {/* Desligamentos do Mês */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-red-500 to-rose-600" />
          <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                <UserX className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{mockData.desligamentos_mes}</p>
                <p className="text-xs font-semibold text-gray-600">Este Mês</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Desligamentos Mensais</h3>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600 font-semibold">4.2% do quadro</span>
            </div>
          </CardContent>
        </Card>

        {/* Desligamentos Acumulados */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-600" />
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">{mockData.desligamentos_periodo}</p>
                <p className="text-xs font-semibold text-gray-600">Acumulado</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Total {selectedYear}</h3>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-orange-600 font-semibold">
                -{mockData.taxa_turnover_negativo}% taxa mensal
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Principal Motivo */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-600" />
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">{mockData.principais_motivos[0].quantidade}</p>
                <p className="text-xs font-semibold text-gray-600">Principal</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Top Motivo</h3>
            <p className="text-xs text-gray-600 font-semibold">{mockData.principais_motivos[0].motivo}</p>
          </CardContent>
        </Card>

        {/* Impacto no Quadro */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-gray-500 to-slate-600" />
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-600">385</p>
                <p className="text-xs font-semibold text-gray-600">Restantes</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Após Desligamentos</h3>
            <p className="text-sm text-gray-600">Funcionários ativos</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts and Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Motivos de Desligamento */}
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="h-2 bg-gradient-to-r from-red-500 to-rose-600" />
          <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5" />
              Motivos de Desligamento
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockData.principais_motivos.map((motivo, index) => (
                <div key={motivo.motivo} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index === 0 ? 'bg-red-500 text-white' :
                      index === 1 ? 'bg-red-400 text-white' : 'bg-red-300 text-red-800'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">{motivo.motivo}</span>
                  </div>
                  <span className="text-lg font-bold text-red-600">{motivo.quantidade}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Evolução dos Desligamentos */}
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-600" />
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-3">
              <TrendingDown className="h-5 w-5" />
              Evolução dos Desligamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl flex items-center justify-center border border-orange-100">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </motion.div>
                <p className="text-orange-700 font-semibold text-lg">Gráfico Temporal</p>
                <p className="text-sm text-orange-600 mt-2 font-medium">
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