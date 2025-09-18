import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { seniorAPI } from "@/lib/senior-api";
import { SeniorAPIConfig, ConnectionStatus, KPIData, TurnoverData, SeniorAPIResponse } from "@/types/senior-api";

export function useConnectionStatus() {
  return useQuery({
    queryKey: ["/api/senior/connection"],
    queryFn: async (): Promise<ConnectionStatus> => {
      const response = await seniorAPI.testConnection();
      return {
        isConnected: response.success,
        lastSync: response.timestamp,
        error: response.error,
      };
    },
    refetchInterval: 30000, // Check connection every 30 seconds
  });
}

export function useEmployees() {
  return useQuery({
    queryKey: ["/api/senior/employees"],
    queryFn: async () => {
      const response = await seniorAPI.getEmployees();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch employees");
      }
      return response.data;
    },
  });
}

export function usePayrollData(period?: string) {
  return useQuery({
    queryKey: ["/api/senior/payroll", period],
    queryFn: async () => {
      const response = await seniorAPI.getPayrollData(period);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch payroll data");
      }
      return response.data;
    },
  });
}

export function useTurnoverData(period?: string) {
  return useQuery({
    queryKey: ["/api/senior/turnover", period],
    queryFn: async () => {
      const response = await seniorAPI.getTurnoverData(period);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch turnover data");
      }
      return response.data;
    },
  });
}

export function useAbsenteeismData(period?: string) {
  return useQuery({
    queryKey: ["/api/senior/absenteeism", period],
    queryFn: async () => {
      const response = await seniorAPI.getAbsenteeismData(period);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch absenteeism data");
      }
      return response.data;
    },
  });
}

export function useDemographicsData() {
  return useQuery({
    queryKey: ["/api/senior/demographics"],
    queryFn: async () => {
      const response = await seniorAPI.getDemographicsData();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch demographics data");
      }
      return response.data;
    },
  });
}

export function useOvertimeData(period?: string) {
  return useQuery({
    queryKey: ["/api/senior/overtime", period],
    queryFn: async () => {
      const response = await seniorAPI.getOvertimeData(period);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch overtime data");
      }
      return response.data;
    },
  });
}

export function useKPIData(): { data: KPIData | undefined; isLoading: boolean; error: Error | null } {
  const { data: employees, isLoading: employeesLoading } = useEmployees();
  const { data: turnover, isLoading: turnoverLoading } = useTurnoverData();
  const { data: absenteeism, isLoading: absenteeismLoading } = useAbsenteeismData();
  const { data: overtime, isLoading: overtimeLoading } = useOvertimeData();

  const isLoading = employeesLoading || turnoverLoading || absenteeismLoading || overtimeLoading;

  const kpiData: KPIData | undefined = employees && turnover && absenteeism && overtime ? {
    totalEmployees: employees.length || 0,
    monthlyTurnover: turnover[0]?.turnoverRate || 0,
    absenteeismRate: absenteeism[0]?.absenteeismRate || 0,
    overtimeHours: overtime.reduce((sum: number, item: any) => sum + (item.hours || 0), 0),
    trends: {
      employees: 5.2,
      turnover: -1.1,
      absenteeism: 0.3,
      overtime: 12.4,
    },
  } : undefined;

  return {
    data: kpiData,
    isLoading,
    error: null,
  };
}

export function useUpdateAPIConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: Partial<SeniorAPIConfig>) => {
      seniorAPI.updateConfig(config);
      // Test the connection with new config
      const response = await seniorAPI.testConnection();
      if (!response.success) {
        throw new Error(response.error || "Failed to connect with new configuration");
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate all Senior API queries to refetch with new config
      queryClient.invalidateQueries({ queryKey: ["/api/senior"] });
    },
  });
}

// Hook específico para dados do gráfico de turnover da Opus Consultoria Ltda
export function useTurnoverChart() {
  return useQuery({
    queryKey: ["/api/senior/turnover-chart"],
    queryFn: async (): Promise<TurnoverData> => {
      const response = await fetch('/api/senior/turnover-chart', {
        headers: {
          'x-api-key': 'OpusApiKey_2025!'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: SeniorAPIResponse<TurnoverData> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erro ao buscar dados de turnover');
      }
      
      return data.data!;
    },
    refetchInterval: 5 * 60 * 1000, // Atualiza a cada 5 minutos
    retry: 2,
    staleTime: 2 * 60 * 1000 // Considera dados frescos por 2 minutos
  });
}

// Hook específico para funcionários ativos da Opus Consultoria Ltda
export function useActiveEmployees(ano: number = 2025, mes: number = 9) {
  return useQuery({
    queryKey: ["/api/senior/active-employees", ano, mes],
    queryFn: async (): Promise<{funcionarios_ativos: number; fonte: string; empresa: number}> => {
      const url = `/api/senior/active-employees?ano=${ano}&mes=${mes}`;
      const response = await fetch(url, {
        headers: {
          'x-api-key': 'OpusApiKey_2025!'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: SeniorAPIResponse<{funcionarios_ativos: number; fonte: string; empresa: number}> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Erro ao buscar funcionários ativos');
      }
      
      return data.data!;
    },
    refetchInterval: 5 * 60 * 1000, // Atualiza a cada 5 minutos
    retry: 2,
    staleTime: 2 * 60 * 1000 // Considera dados frescos por 2 minutos
  });
}
