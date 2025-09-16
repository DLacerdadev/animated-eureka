import { SeniorAPIConfig, SeniorAPIResponse } from "@/types/senior-api";

class SeniorAPIClient {
  private config: SeniorAPIConfig;
  private accessToken: string | null = null;
  private tokenExpiration: Date | null = null;

  constructor() {
    this.config = {
      baseUrl: import.meta.env.VITE_SENIOR_API_URL || "https://api.senior.com.br",
      apiKey: import.meta.env.VITE_SENIOR_API_KEY || "OpusApiKey_2025!",
      clientId: import.meta.env.VITE_SENIOR_CLIENT_ID || "opus-dashboard",
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<SeniorAPIResponse<T>> {
    try {
      // Garante que está autenticado antes de fazer a requisição
      const authenticated = await this.authenticate();
      if (!authenticated) {
        throw new Error("Falha na autenticação");
      }

      const url = `${this.config.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.accessToken}`,
          "client_id": this.config.clientId || "opus-dashboard",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      };
    }
  }

  private async authenticate(): Promise<boolean> {
    try {
      // Se já temos um token válido, não precisa autenticar novamente
      if (this.accessToken && this.tokenExpiration && new Date() < this.tokenExpiration) {
        return true;
      }

      const response = await fetch(`${this.config.baseUrl}/platform/authentication/loginWithKey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: this.config.apiKey,
          secret: "opus-secret", // Pode precisar ser configurável
          tenant: "senior.com.br",
        }),
      });

      if (!response.ok) {
        console.error("Falha na autenticação:", response.status, response.statusText);
        return false;
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      // Token expira em 1 hora por padrão
      this.tokenExpiration = new Date(Date.now() + 3600000);
      
      return true;
    } catch (error) {
      console.error("Erro na autenticação:", error);
      return false;
    }
  }

  async testConnection(): Promise<SeniorAPIResponse<{ status: string }>> {
    // Primeiro testa a autenticação
    const authenticated = await this.authenticate();
    if (!authenticated) {
      return {
        success: false,
        error: "Falha na autenticação com API Senior",
        timestamp: new Date().toISOString(),
      };
    }

    // Testa um endpoint simples para verificar conectividade
    return this.makeRequest("/platform/user/listUsers", {
      method: "POST",
      body: JSON.stringify({
        pagination: {
          current: 0,
          size: 1
        }
      })
    });
  }

  async getEmployees(): Promise<SeniorAPIResponse<any[]>> {
    return this.makeRequest("/platform/user/listUsers", {
      method: "POST",
      body: JSON.stringify({
        pagination: {
          current: 0,
          size: 100
        }
      })
    });
  }

  async getPayrollData(period?: string): Promise<SeniorAPIResponse<any[]>> {
    const query = period ? `?period=${period}` : "";
    return this.makeRequest(`/platform/payroll/getPayrollData${query}`);
  }

  async getTurnoverData(period?: string): Promise<SeniorAPIResponse<any[]>> {
    const query = period ? `?period=${period}` : "";
    return this.makeRequest(`/platform/hr/getTurnoverData${query}`);
  }

  async getAbsenteeismData(period?: string): Promise<SeniorAPIResponse<any[]>> {
    const query = period ? `?period=${period}` : "";
    return this.makeRequest(`/platform/hr/getAbsenteeismData${query}`);
  }

  async getDemographicsData(): Promise<SeniorAPIResponse<any[]>> {
    return this.makeRequest("/platform/hr/getDemographicsData");
  }

  async getOvertimeData(period?: string): Promise<SeniorAPIResponse<any[]>> {
    const query = period ? `?period=${period}` : "";
    return this.makeRequest(`/platform/hr/getOvertimeData${query}`);
  }

  getConfig(): SeniorAPIConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<SeniorAPIConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export const seniorAPI = new SeniorAPIClient();
