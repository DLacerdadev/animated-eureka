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

// Hook to fetch all companies
export function useCompanies() {
  return useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/companies`);
      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }
      const result = await response.json();
      return result.success ? result.data : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Hook to fetch all divisions
export function useDivisions() {
  return useQuery<Division[]>({
    queryKey: ["divisions"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/divisions`);
      if (!response.ok) {
        throw new Error("Failed to fetch divisions");
      }
      const result = await response.json();
      return result.success ? result.data : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Hook to fetch employee status types
export function useEmployeeStatus() {
  return useQuery<EmployeeStatus[]>({
    queryKey: ["employee-status"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/employee-status`);
      if (!response.ok) {
        throw new Error("Failed to fetch employee status");
      }
      const result = await response.json();
      return result.success ? result.data : [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes (status rarely changes)
    retry: 2,
  });
}

export type { Company, Division, EmployeeStatus };