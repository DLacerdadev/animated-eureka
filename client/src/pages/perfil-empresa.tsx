import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, MapPin, Calendar, Briefcase, Sparkles, Award } from "lucide-react";

export default function PerfilEmpresa() {
  // Mock data - será substituído pela API
  const mockData = {
    empresa: {
      nome: "Opus Consultoria",
      cnpj: "12.345.678/0001-90",
      endereco: "São Paulo, SP",
      fundacao: "2015",
      funcionarios_total: 402,
      divisoes: 6,
      cargos_distintos: 48
    },
    divisoes: [
      { nome: "Operacional", funcionarios: 127, percentual: 31.6 },
      { nome: "Comercial", funcionarios: 89, percentual: 22.1 },
      { nome: "Atendimento", funcionarios: 64, percentual: 15.9 },
      { nome: "Técnica", funcionarios: 53, percentual: 13.2 },
      { nome: "Administração", funcionarios: 42, percentual: 10.4 },
      { nome: "Infraestrutura", funcionarios: 27, percentual: 6.7 }
    ],
    estatisticas: {
      idade_media: 34.2,
      tempo_empresa_medio: 3.8,
      taxa_retencao: 87.3,
      satisfacao: 8.2
    }
  };

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-purple-50 to-violet-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          Perfil da Empresa
        </h1>
        <p className="text-gray-600 font-medium max-w-2xl mx-auto">
          Visão completa do perfil organizacional e estrutura da {mockData.empresa.nome}
        </p>
      </motion.div>

      {/* Company Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-600" />
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 pb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{mockData.empresa.nome}</h2>
                  <p className="text-gray-600 font-medium">CNPJ: {mockData.empresa.cnpj}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-center lg:text-right">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{mockData.empresa.funcionarios_total}</p>
                  <p className="text-sm font-semibold text-gray-600">Funcionários</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-violet-600">{mockData.empresa.divisoes}</p>
                  <p className="text-sm font-semibold text-gray-600">Divisões</p>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                <MapPin className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-800">Localização</p>
                  <p className="text-sm text-gray-600">{mockData.empresa.endereco}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-violet-50 rounded-xl">
                <Calendar className="h-5 w-5 text-violet-600" />
                <div>
                  <p className="font-semibold text-gray-800">Fundada em</p>
                  <p className="text-sm text-gray-600">{mockData.empresa.fundacao}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-semibold text-gray-800">Cargos</p>
                  <p className="text-sm text-gray-600">{mockData.empresa.cargos_distintos} distintos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Idade Média */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600" />
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{mockData.estatisticas.idade_media}</p>
                <p className="text-xs font-semibold text-gray-600">anos</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Idade Média</h3>
            <p className="text-sm text-gray-600">Funcionários</p>
          </CardContent>
        </Card>

        {/* Tempo Médio na Empresa */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-emerald-500 to-green-600" />
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">{mockData.estatisticas.tempo_empresa_medio}</p>
                <p className="text-xs font-semibold text-gray-600">anos</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Tempo Médio</h3>
            <p className="text-sm text-gray-600">Na empresa</p>
          </CardContent>
        </Card>

        {/* Taxa de Retenção */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600" />
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-600">{mockData.estatisticas.taxa_retencao}%</p>
                <p className="text-xs font-semibold text-gray-600">retenção</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Taxa de Retenção</h3>
            <p className="text-sm text-gray-600">Anual</p>
          </CardContent>
        </Card>

        {/* Satisfação */}
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-2 bg-gradient-to-r from-rose-500 to-pink-600" />
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 pb-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-rose-600">{mockData.estatisticas.satisfacao}</p>
                <p className="text-xs font-semibold text-gray-600">/10</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Satisfação</h3>
            <p className="text-sm text-gray-600">Média geral</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Divisões */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Estrutura Organizacional */}
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-600" />
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-3">
              <Building2 className="h-5 w-5" />
              Estrutura Organizacional
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {mockData.divisoes.map((divisao, index) => (
                <div key={divisao.nome} className="flex items-center justify-between p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-purple-500' :
                      index === 1 ? 'bg-purple-400' :
                      index === 2 ? 'bg-purple-400' :
                      index === 3 ? 'bg-purple-300' :
                      index === 4 ? 'bg-purple-300' : 'bg-purple-200'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{divisao.nome}</p>
                      <p className="text-xs text-gray-600">{divisao.percentual}% do total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600">{divisao.funcionarios}</p>
                    <p className="text-xs text-gray-600">funcionários</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Análises Complementares */}
        <Card className="overflow-hidden shadow-lg border-0">
          <div className="h-2 bg-gradient-to-r from-teal-500 to-cyan-600" />
          <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-3">
              <Award className="h-5 w-5" />
              Análises Complementares
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
                <p className="text-teal-700 font-semibold text-lg">Análises Avançadas</p>
                <p className="text-sm text-teal-600 mt-2 font-medium">
                  Relatórios detalhados serão carregados via API Senior
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}