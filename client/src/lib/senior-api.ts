import { SeniorAPIConfig, SeniorAPIResponse } from "@/types/senior-api";

class SeniorAPIClient {
  private config: SeniorAPIConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.VITE_SENIOR_API_URL || "https://api-senior.tecnologiagrupoopus.com.br",
      apiKey: process.env.VITE_SENIOR_API_KEY || "OpusApiKey_2025!",
      clientId: process.env.VITE_SENIOR_CLIENT_ID || "opus-dashboard",
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<SeniorAPIResponse<T>> {
    try {
      const url = `${this.config.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.config.apiKey}`,
          "X-Client-ID": this.config.clientId || "",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      };
    }
  }

  async testConnection(): Promise<SeniorAPIResponse<{ status: string }>> {
    return this.makeRequest("/platform/user/health");
  }

  async getEmployees(): Promise<SeniorAPIResponse<any[]>> {
    return this.makeRequest("/platform/user/getEmployees");
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
