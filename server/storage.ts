import { 
  type User, 
  type InsertUser, 
  type ApiConnection,
  type InsertApiConnection,
  type Employee,
  type InsertEmployee,
  type PayrollData,
  type InsertPayrollData,
  type TurnoverData,
  type InsertTurnoverData,
  type AbsenteeismData,
  type InsertAbsenteeismData
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // API Connection methods
  getApiConnections(): Promise<ApiConnection[]>;
  getApiConnection(id: string): Promise<ApiConnection | undefined>;
  createApiConnection(connection: InsertApiConnection): Promise<ApiConnection>;
  updateApiConnection(id: string, connection: Partial<ApiConnection>): Promise<ApiConnection | undefined>;
  deleteApiConnection(id: string): Promise<boolean>;

  // Employee methods
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployeeBySeniorId(seniorId: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee | undefined>;

  // Payroll methods
  getPayrollData(filters?: { employeeId?: string; period?: string }): Promise<PayrollData[]>;
  createPayrollData(payroll: InsertPayrollData): Promise<PayrollData>;

  // Turnover methods
  getTurnoverData(filters?: { period?: string; department?: string }): Promise<TurnoverData[]>;
  createTurnoverData(turnover: InsertTurnoverData): Promise<TurnoverData>;

  // Absenteeism methods
  getAbsenteeismData(filters?: { employeeId?: string; period?: string }): Promise<AbsenteeismData[]>;
  createAbsenteeismData(absenteeism: InsertAbsenteeismData): Promise<AbsenteeismData>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private apiConnections: Map<string, ApiConnection>;
  private employees: Map<string, Employee>;
  private payrollData: Map<string, PayrollData>;
  private turnoverData: Map<string, TurnoverData>;
  private absenteeismData: Map<string, AbsenteeismData>;

  constructor() {
    this.users = new Map();
    this.apiConnections = new Map();
    this.employees = new Map();
    this.payrollData = new Map();
    this.turnoverData = new Map();
    this.absenteeismData = new Map();

    // Initialize with default Senior API connection
    this.initializeDefaultConnection();
  }

  private async initializeDefaultConnection() {
    const defaultConnection: ApiConnection = {
      id: randomUUID(),
      name: "Senior API - Opus",
      url: "https://api-senior.tecnologiagrupoopus.com.br",
      apiKey: "OpusApiKey_2025!",
      isActive: true,
      lastSync: null,
      createdAt: new Date(),
    };
    this.apiConnections.set(defaultConnection.id, defaultConnection);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // API Connection methods
  async getApiConnections(): Promise<ApiConnection[]> {
    return Array.from(this.apiConnections.values());
  }

  async getApiConnection(id: string): Promise<ApiConnection | undefined> {
    return this.apiConnections.get(id);
  }

  async createApiConnection(insertConnection: InsertApiConnection): Promise<ApiConnection> {
    const id = randomUUID();
    const connection: ApiConnection = {
      ...insertConnection,
      id,
      createdAt: new Date(),
      lastSync: null,
      isActive: insertConnection.isActive ?? true,
    };
    this.apiConnections.set(id, connection);
    return connection;
  }

  async updateApiConnection(id: string, update: Partial<ApiConnection>): Promise<ApiConnection | undefined> {
    const existing = this.apiConnections.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...update };
    this.apiConnections.set(id, updated);
    return updated;
  }

  async deleteApiConnection(id: string): Promise<boolean> {
    return this.apiConnections.delete(id);
  }

  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeBySeniorId(seniorId: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(
      (employee) => employee.seniorId === seniorId,
    );
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = randomUUID();
    const employee: Employee = {
      ...insertEmployee,
      id,
      lastSync: new Date(),
      isActive: insertEmployee.isActive ?? true,
      seniorId: insertEmployee.seniorId ?? null,
      email: insertEmployee.email ?? null,
      department: insertEmployee.department ?? null,
      position: insertEmployee.position ?? null,
      hireDate: insertEmployee.hireDate ?? null,
      salary: insertEmployee.salary ?? null,
    };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: string, update: Partial<Employee>): Promise<Employee | undefined> {
    const existing = this.employees.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...update, lastSync: new Date() };
    this.employees.set(id, updated);
    return updated;
  }

  // Payroll methods
  async getPayrollData(filters?: { employeeId?: string; period?: string }): Promise<PayrollData[]> {
    let data = Array.from(this.payrollData.values());
    
    if (filters?.employeeId) {
      data = data.filter(p => p.employeeId === filters.employeeId);
    }
    if (filters?.period) {
      data = data.filter(p => p.period === filters.period);
    }
    
    return data;
  }

  async createPayrollData(insertPayroll: InsertPayrollData): Promise<PayrollData> {
    const id = randomUUID();
    const payroll: PayrollData = {
      ...insertPayroll,
      id,
      lastSync: new Date(),
      employeeId: insertPayroll.employeeId ?? null,
      grossSalary: insertPayroll.grossSalary ?? null,
      netSalary: insertPayroll.netSalary ?? null,
      deductions: insertPayroll.deductions ?? null,
      bonuses: insertPayroll.bonuses ?? null,
      overtimeHours: insertPayroll.overtimeHours ?? null,
    };
    this.payrollData.set(id, payroll);
    return payroll;
  }

  // Turnover methods
  async getTurnoverData(filters?: { period?: string; department?: string }): Promise<TurnoverData[]> {
    let data = Array.from(this.turnoverData.values());
    
    if (filters?.period) {
      data = data.filter(t => t.period === filters.period);
    }
    if (filters?.department) {
      data = data.filter(t => t.department === filters.department);
    }
    
    return data;
  }

  async createTurnoverData(insertTurnover: InsertTurnoverData): Promise<TurnoverData> {
    const id = randomUUID();
    const turnover: TurnoverData = {
      ...insertTurnover,
      id,
      lastSync: new Date(),
      department: insertTurnover.department ?? null,
      hires: insertTurnover.hires ?? 0,
      terminations: insertTurnover.terminations ?? 0,
      totalEmployees: insertTurnover.totalEmployees ?? null,
      turnoverRate: insertTurnover.turnoverRate ?? null,
    };
    this.turnoverData.set(id, turnover);
    return turnover;
  }

  // Absenteeism methods
  async getAbsenteeismData(filters?: { employeeId?: string; period?: string }): Promise<AbsenteeismData[]> {
    let data = Array.from(this.absenteeismData.values());
    
    if (filters?.employeeId) {
      data = data.filter(a => a.employeeId === filters.employeeId);
    }
    if (filters?.period) {
      data = data.filter(a => a.period === filters.period);
    }
    
    return data;
  }

  async createAbsenteeismData(insertAbsenteeism: InsertAbsenteeismData): Promise<AbsenteeismData> {
    const id = randomUUID();
    const absenteeism: AbsenteeismData = {
      ...insertAbsenteeism,
      id,
      lastSync: new Date(),
      employeeId: insertAbsenteeism.employeeId ?? null,
      absenceDays: insertAbsenteeism.absenceDays ?? null,
      totalWorkDays: insertAbsenteeism.totalWorkDays ?? null,
      absenteeismRate: insertAbsenteeism.absenteeismRate ?? null,
    };
    this.absenteeismData.set(id, absenteeism);
    return absenteeism;
  }
}

export const storage = new MemStorage();
