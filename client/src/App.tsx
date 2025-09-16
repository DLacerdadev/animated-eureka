import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import Dashboard from "@/pages/dashboard";
import APIConfig from "@/pages/api-config";
import { ModulePlaceholder } from "@/components/modules/module-placeholder";
import NotFound from "@/pages/not-found";

const pageConfig = {
  "/": { title: "Visão Geral", subtitle: "Dashboard de RH - Senior Integration" },
  "/folha": { title: "Folha de Pagamento", subtitle: "Gestão de Folha e Benefícios" },
  "/pessoas": { title: "Gestão de Pessoas", subtitle: "Cadastro e Informações de Funcionários" },
  "/demografia": { title: "Demografia", subtitle: "Análise Demográfica da Empresa" },
  "/desligamentos": { title: "Desligamentos", subtitle: "Controle de Desligamentos" },
  "/turnover": { title: "Turnover", subtitle: "Análise de Rotatividade" },
  "/absenteismo": { title: "Absenteísmo", subtitle: "Controle de Ausências" },
  "/hora-extra": { title: "Horas Extra", subtitle: "Gestão de Horas Extras" },
  "/ausencia": { title: "Ausências", subtitle: "Controle de Faltas e Licenças" },
  "/edag": { title: "eDag", subtitle: "Documentos Eletrônicos" },
  "/cct": { title: "CCT", subtitle: "Convenção Coletiva de Trabalho" },
  "/filtros": { title: "Filtros e Parâmetros", subtitle: "Configuração de Filtros" },
  "/api-config": { title: "Configuração da API", subtitle: "Configurações de Integração Senior" },
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/api-config" component={APIConfig} />
      
      {/* Module placeholders */}
      <Route path="/folha">
        <ModulePlaceholder title="Módulo Folha em Desenvolvimento" />
      </Route>
      <Route path="/pessoas">
        <ModulePlaceholder title="Módulo Pessoas em Desenvolvimento" />
      </Route>
      <Route path="/demografia">
        <ModulePlaceholder title="Módulo Demografia em Desenvolvimento" />
      </Route>
      <Route path="/desligamentos">
        <ModulePlaceholder title="Módulo Desligamentos em Desenvolvimento" />
      </Route>
      <Route path="/turnover">
        <ModulePlaceholder title="Módulo Turnover em Desenvolvimento" />
      </Route>
      <Route path="/absenteismo">
        <ModulePlaceholder title="Módulo Absenteísmo em Desenvolvimento" />
      </Route>
      <Route path="/hora-extra">
        <ModulePlaceholder title="Módulo Hora Extra em Desenvolvimento" />
      </Route>
      <Route path="/ausencia">
        <ModulePlaceholder title="Módulo Ausência em Desenvolvimento" />
      </Route>
      <Route path="/edag">
        <ModulePlaceholder title="Módulo eDag em Desenvolvimento" />
      </Route>
      <Route path="/cct">
        <ModulePlaceholder title="Módulo CCT em Desenvolvimento" />
      </Route>
      <Route path="/filtros">
        <ModulePlaceholder title="Módulo Filtros em Desenvolvimento" />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentPath = window.location.pathname as keyof typeof pageConfig;
  const config = pageConfig[currentPath] || pageConfig["/"];

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
