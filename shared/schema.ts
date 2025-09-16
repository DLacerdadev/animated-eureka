import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const apiConnections = pgTable("api_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull(),
  apiKey: text("api_key").notNull(),
  isActive: boolean("is_active").default(true),
  lastSync: timestamp("last_sync"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seniorId: text("senior_id").unique(),
  name: text("name").notNull(),
  email: text("email"),
  department: text("department"),
  position: text("position"),
  hireDate: timestamp("hire_date"),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  lastSync: timestamp("last_sync"),
});

export const payrollData = pgTable("payroll_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id),
  period: text("period").notNull(),
  grossSalary: decimal("gross_salary", { precision: 10, scale: 2 }),
  netSalary: decimal("net_salary", { precision: 10, scale: 2 }),
  deductions: json("deductions"),
  bonuses: json("bonuses"),
  overtimeHours: decimal("overtime_hours", { precision: 5, scale: 2 }),
  lastSync: timestamp("last_sync"),
});

export const turnoverData = pgTable("turnover_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  period: text("period").notNull(),
  department: text("department"),
  hires: integer("hires").default(0),
  terminations: integer("terminations").default(0),
  totalEmployees: integer("total_employees"),
  turnoverRate: decimal("turnover_rate", { precision: 5, scale: 2 }),
  lastSync: timestamp("last_sync"),
});

export const absenteeismData = pgTable("absenteeism_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => employees.id),
  period: text("period").notNull(),
  absenceDays: decimal("absence_days", { precision: 5, scale: 2 }),
  totalWorkDays: decimal("total_work_days", { precision: 5, scale: 2 }),
  absenteeismRate: decimal("absenteeism_rate", { precision: 5, scale: 2 }),
  lastSync: timestamp("last_sync"),
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertApiConnectionSchema = createInsertSchema(apiConnections).omit({
  id: true,
  createdAt: true,
  lastSync: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  lastSync: true,
});

export const insertPayrollDataSchema = createInsertSchema(payrollData).omit({
  id: true,
  lastSync: true,
});

export const insertTurnoverDataSchema = createInsertSchema(turnoverData).omit({
  id: true,
  lastSync: true,
});

export const insertAbsenteeismDataSchema = createInsertSchema(absenteeismData).omit({
  id: true,
  lastSync: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ApiConnection = typeof apiConnections.$inferSelect;
export type InsertApiConnection = z.infer<typeof insertApiConnectionSchema>;

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type PayrollData = typeof payrollData.$inferSelect;
export type InsertPayrollData = z.infer<typeof insertPayrollDataSchema>;

export type TurnoverData = typeof turnoverData.$inferSelect;
export type InsertTurnoverData = z.infer<typeof insertTurnoverDataSchema>;

export type AbsenteeismData = typeof absenteeismData.$inferSelect;
export type InsertAbsenteeismData = z.infer<typeof insertAbsenteeismDataSchema>;
