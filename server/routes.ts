import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertApiConnectionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Connection endpoints
  app.get("/api/connections", async (req, res) => {
    try {
      const connections = await storage.getApiConnections();
      res.json(connections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch API connections" });
    }
  });

  app.post("/api/connections", async (req, res) => {
    try {
      const validation = insertApiConnectionSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid connection data", details: validation.error.errors });
      }

      const connection = await storage.createApiConnection(validation.data);
      res.status(201).json(connection);
    } catch (error) {
      res.status(500).json({ error: "Failed to create API connection" });
    }
  });

  app.put("/api/connections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await storage.updateApiConnection(id, req.body);
      
      if (!connection) {
        return res.status(404).json({ error: "Connection not found" });
      }
      
      res.json(connection);
    } catch (error) {
      res.status(500).json({ error: "Failed to update API connection" });
    }
  });

  app.delete("/api/connections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteApiConnection(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Connection not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete API connection" });
    }
  });

  // Employee endpoints
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await storage.getEmployee(id);
      
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  // Payroll endpoints
  app.get("/api/payroll", async (req, res) => {
    try {
      const { employeeId, period } = req.query;
      const filters: any = {};
      
      if (employeeId) filters.employeeId = employeeId as string;
      if (period) filters.period = period as string;
      
      const payrollData = await storage.getPayrollData(filters);
      res.json(payrollData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payroll data" });
    }
  });

  // Turnover endpoints
  app.get("/api/turnover", async (req, res) => {
    try {
      const { period, department } = req.query;
      const filters: any = {};
      
      if (period) filters.period = period as string;
      if (department) filters.department = department as string;
      
      const turnoverData = await storage.getTurnoverData(filters);
      res.json(turnoverData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch turnover data" });
    }
  });

  // Absenteeism endpoints
  app.get("/api/absenteeism", async (req, res) => {
    try {
      const { employeeId, period } = req.query;
      const filters: any = {};
      
      if (employeeId) filters.employeeId = employeeId as string;
      if (period) filters.period = period as string;
      
      const absenteeismData = await storage.getAbsenteeismData(filters);
      res.json(absenteeismData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch absenteeism data" });
    }
  });

  // Senior API proxy endpoints for testing connectivity
  app.post("/api/senior/test-connection", async (req, res) => {
    try {
      const { baseUrl, apiKey, clientId } = req.body;
      
      console.log(`Testando conexão com: ${baseUrl}/api/health`);
      console.log(`API Key: ${apiKey?.substring(0, 10)}...`);
      
      // Testa vários formatos de autenticação para encontrar o correto
      const authHeaders = [
        { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        { "X-API-Key": apiKey, "Content-Type": "application/json" },
        { "Authorization": `ApiKey ${apiKey}`, "Content-Type": "application/json" },
        { "opus-api-key": apiKey, "Content-Type": "application/json" },
      ];

      for (let i = 0; i < authHeaders.length; i++) {
        try {
          console.log(`Tentativa ${i + 1} com headers:`, Object.keys(authHeaders[i]));
          
          const response = await fetch(`${baseUrl}/api/health`, {
            method: "GET",
            headers: {
              ...authHeaders[i],
              ...(clientId && { "X-Client-ID": clientId }),
            },
          });

          const responseText = await response.text();
          console.log(`Status: ${response.status}, Response:`, responseText);

          if (response.ok) {
            res.json({ 
              success: true, 
              message: "Conexão bem-sucedida", 
              data: responseText ? JSON.parse(responseText) : null,
              authMethod: i + 1
            });
            return;
          }
        } catch (error) {
          console.log(`Erro na tentativa ${i + 1}:`, error);
        }
      }

      res.status(500).json({ 
        success: false, 
        error: "Todas as tentativas de autenticação falharam" 
      });
    } catch (error) {
      console.error("Erro geral:", error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
