export interface SeniorAPIConfig {
  baseUrl: string;
  apiKey: string;
  clientId?: string;
}

export interface SeniorAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface EmployeeData {
  id: string;
  name: string;
  email?: string;
  department: string;
  position: string;
  hireDate: string;
  salary?: number;
  isActive: boolean;
}

export interface PayrollData {
  employeeId: string;
  period: string;
  grossSalary: number;
  netSalary: number;
  deductions: Record<string, number>;
  bonuses: Record<string, number>;
  overtimeHours: number;
}

export interface TurnoverMetrics {
  period: string;
  department?: string;
  hires: number;
  terminations: number;
  totalEmployees: number;
  turnoverRate: number;
}

export interface AbsenteeismMetrics {
  employeeId: string;
  period: string;
  absenceDays: number;
  totalWorkDays: number;
  absenteeismRate: number;
}

export interface KPIData {
  totalEmployees: number;
  monthlyTurnover: number;
  absenteeismRate: number;
  overtimeHours: number;
  trends: {
    employees: number;
    turnover: number;
    absenteeism: number;
    overtime: number;
  };
}

export interface ConnectionStatus {
  isConnected: boolean;
  lastSync?: string;
  error?: string;
}
