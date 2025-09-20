import { useQuery } from "@tanstack/react-query";

const API_BASE = "/api/senior";

interface Company {
  id: string;
  codigo: number;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  situacao: number;
  label: string;
}

interface Division {
  id: string;
  codigo: number;
  descricao: string;
  label: string;
}

interface EmployeeStatus {
  id: string;
  codigo: number | null;
  label: string;
}

// Hook to fetch all companies - usando dados das 7 empresas conhecidas
export function useCompanies() {
  return useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      // Retorna as 7 empresas padrão conhecidas
      return [
        { id: "1", codigo: 1, razao_social: "Opus Consultoria", nome_fantasia: "Opus Consultoria", cnpj: "", situacao: 1, label: "Opus Consultoria" },
        { id: "6", codigo: 6, razao_social: "Telos", nome_fantasia: "Telos", cnpj: "", situacao: 1, label: "Telos" },
        { id: "8", codigo: 8, razao_social: "Opus Serviços", nome_fantasia: "Opus Serviços", cnpj: "", situacao: 1, label: "Opus Serviços" },
        { id: "9", codigo: 9, razao_social: "Opus Logística", nome_fantasia: "Opus Logística", cnpj: "", situacao: 1, label: "Opus Logística" },
        { id: "10", codigo: 10, razao_social: "Opus Manutenção", nome_fantasia: "Opus Manutenção", cnpj: "", situacao: 1, label: "Opus Manutenção" },
        { id: "11", codigo: 11, razao_social: "Atenas", nome_fantasia: "Atenas", cnpj: "", situacao: 1, label: "Atenas" },
        { id: "13", codigo: 13, razao_social: "Acelera IT", nome_fantasia: "Acelera IT", cnpj: "", situacao: 1, label: "Acelera IT" }
      ];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Hook to fetch all divisions - desabilitado (dados vêm da Senior API conforme necessário)
export function useDivisions() {
  return useQuery<Division[]>({
    queryKey: ["divisions"],
    queryFn: async () => {
      // Retorna array vazio - divisões vêm da Senior API conforme necessário
      return [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Hook to fetch employee status types - desabilitado (dados vêm da Senior API conforme necessário)
export function useEmployeeStatus() {
  return useQuery<EmployeeStatus[]>({
    queryKey: ["employee-status"],
    queryFn: async () => {
      // Retorna array vazio - status vêm da Senior API conforme necessário
      return [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (status rarely changes)
    retry: 2,
  });
}

// Hook para buscar funcionários filtrados
export function useFilteredEmployees(filterParams: {
  empresas?: string;
  divisoes?: string;
  status?: string;
  months?: string;
  years?: string;
}) {
  return useQuery({
    queryKey: ["filtered-employees", filterParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterParams.empresas) params.set('empresas', filterParams.empresas);
      if (filterParams.divisoes) params.set('divisoes', filterParams.divisoes);
      if (filterParams.status) params.set('status', filterParams.status);
      if (filterParams.months) params.set('months', filterParams.months);
      if (filterParams.years) params.set('years', filterParams.years);

      const response = await fetch(`${API_BASE}/funcionarios?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch filtered employees");
      }
      const result = await response.json();
      return result.success ? result.data : [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - dados mais dinâmicos
    retry: 2,
    enabled: true,
  });
}

// Hook para estatísticas filtradas
export function useFilteredStatistics(filterParams: {
  empresas?: string;
  divisoes?: string;
  status?: string;
  months?: string;
  years?: string;
}) {
  return useQuery({
    queryKey: ["filtered-statistics", filterParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterParams.empresas) params.set('empresas', filterParams.empresas);
      if (filterParams.divisoes) params.set('divisoes', filterParams.divisoes);
      if (filterParams.status) params.set('status', filterParams.status);
      if (filterParams.months) params.set('months', filterParams.months);
      if (filterParams.years) params.set('years', filterParams.years);

      const response = await fetch(`${API_BASE}/estatisticas?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch filtered statistics");
      }
      const result = await response.json();
      return result.success ? result.data : null;
    },
    staleTime: 2 * 60 * 1000,
    retry: 2,
    enabled: true,
  });
}

// Hook para dados de divisões filtrados
export function useFilteredDivisionsData(filterParams: {
  empresas?: string;
  status?: string;
  months?: string;
  years?: string;
}) {
  return useQuery({
    queryKey: ["filtered-divisions-data", filterParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterParams.empresas) params.set('empresas', filterParams.empresas);
      if (filterParams.status) params.set('status', filterParams.status);
      if (filterParams.months) params.set('months', filterParams.months);
      if (filterParams.years) params.set('years', filterParams.years);

      const response = await fetch(`${API_BASE}/divisoes-dados?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch filtered divisions data");
      }
      const result = await response.json();
      return result.success ? result.data : [];
    },
    staleTime: 3 * 60 * 1000,
    retry: 2,
    enabled: true,
  });
}

export type { Company, Division, EmployeeStatus };