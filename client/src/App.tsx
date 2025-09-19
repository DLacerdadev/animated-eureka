import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import Dashboard from "@/pages/dashboard";
import APIConfig from "@/pages/api-config";
import Contratacoes from "@/pages/contratacoes";
import Desligamentos from "@/pages/desligamentos";
import Turnover from "@/pages/turnover";
import PerfilEmpresa from "@/pages/perfil-empresa";
import { ModulePlaceholder } from "@/components/modules/module-placeholder";
import NotFound from "@/pages/not-found";

const pageConfig = {
  "/": { title: "Visão Geral", subtitle: "Dashboard de RH - Senior Integration" },
  "/contratacoes": { title: "Contratações", subtitle: "Análise de Admissões e Contratações" },
  "/desligamentos": { title: "Desligamentos", subtitle: "Controle de Desligamentos" },
  "/turnover": { title: "Turnover", subtitle: "Análise de Rotatividade" },
  "/perfil-empresa": { title: "Perfil Empresa", subtitle: "Informações e Estrutura da Empresa" },
  "/folha": { title: "Folha de Pagamento", subtitle: "Gestão de Folha e Benefícios" },
  "/absenteismo": { title: "Absenteísmo", subtitle: "Controle de Ausências" },
  "/ausencias": { title: "Ausências", subtitle: "Controle de Faltas e Licenças" },
  "/horas-extras": { title: "Horas Extras", subtitle: "Gestão de Horas Extras" },
  "/api-config": { title: "Configuração da API", subtitle: "Configurações de Integração Senior" },
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/api-config" component={APIConfig} />
      
      {/* Implemented pages */}
      <Route path="/contratacoes" component={Contratacoes} />
      <Route path="/desligamentos" component={Desligamentos} />
      <Route path="/turnover" component={Turnover} />
      <Route path="/perfil-empresa" component={PerfilEmpresa} />
      
      {/* Module placeholders */}
      <Route path="/folha">
        <ModulePlaceholder title="Módulo Folha em Desenvolvimento" />
      </Route>
      <Route path="/absenteismo">
        <ModulePlaceholder title="Módulo Absenteísmo em Desenvolvimento" />
      </Route>
      <Route path="/ausencias">
        <ModulePlaceholder title="Módulo Ausências em Desenvolvimento" />
      </Route>
      <Route path="/horas-extras">
        <ModulePlaceholder title="Módulo Horas Extras em Desenvolvimento" />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const config = pageConfig[location as keyof typeof pageConfig] || pageConfig["/"];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={config.title}
          subtitle={config.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto">
          <Router />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Layout />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
