import { SeniorAPIConfig, SeniorAPIResponse } from "@/types/senior-api";

class SeniorAPIClient {
  private config: SeniorAPIConfig;

  constructor() {
    // Agora usa o backend local como proxy para proteger a API key
    this.config = {
      baseUrl: "", // Usa endpoints locais
      apiKey: "", // Não mais necessário no frontend
      clientId: "opus-dashboard",
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<SeniorAPIResponse<T>> {
    try {
      // Usa endpoints locais (backend proxy)
      const url = endpoint;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      
      // O backend sempre retorna { success, data, timestamp }
      if (result.success) {
        return {
          success: true,
          data: result.data,
          timestamp: result.timestamp,
        };
      } else {
        return {
          success: false,
          error: result.error || "Erro na API",
          timestamp: new Date().toISOString(),
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      };
    }
  }

  async testConnection(): Promise<SeniorAPIResponse<{ status: string }>> {
    return this.makeRequest("/api/senior/health");
  }

  async getEmployees(): Promise<SeniorAPIResponse<any[]>> {
    return this.makeRequest("/api/senior/execute-query", {
      method: "POST",
      body: JSON.stringify({
        queryId: "employee_basic"
      })
    });
  }

  async getPayrollData(period?: string): Promise<SeniorAPIResponse<any[]>> {
    return this.makeRequest("/api/senior/execute-query", {
      method: "POST",
      body: JSON.stringify({
        queryId: "payroll_summary"
      })
    });
  }

  async getTurnoverData(period?: string): Promise<SeniorAPIResponse<any[]>> {
    return this.makeRequest("/api/senior/execute-query", {
      method: "POST",
      body: JSON.stringify({
        queryId: "employee_count"
      })
    });
  }

  async getAbsenteeismData(period?: string): Promise<SeniorAPIResponse<any[]>> {
    return this.makeRequest("/api/senior/execute-query", {
      method: "POST",
      body: JSON.stringify({
        queryId: "employee_basic"
      })
    });
  }

  async getDemographicsData(): Promise<SeniorAPIResponse<any[]>> {
    return this.makeRequest("/api/senior/execute-query", {
      method: "POST",
      body: JSON.stringify({
        queryId: "demographics_basic"
      })
    });
  }

  async getOvertimeData(period?: string): Promise<SeniorAPIResponse<any[]>> {
    return this.makeRequest("/api/senior/execute-query", {
      method: "POST",
      body: JSON.stringify({
        queryId: "employee_basic"
      })
    });
  }

  async getTables(): Promise<SeniorAPIResponse<any[]>> {
    return this.makeRequest("/api/senior/tables");
  }
  
  async getAvailableQueries(): Promise<SeniorAPIResponse<any[]>> {
    return this.makeRequest("/api/senior/queries");
  }

  async executeQuery(queryId: string): Promise<SeniorAPIResponse<any[]>> {
    return this.makeRequest("/api/senior/execute-query", {
      method: "POST",
      body: JSON.stringify({ queryId })
    });
  }

  getConfig(): SeniorAPIConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<SeniorAPIConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export const seniorAPI = new SeniorAPIClient();
