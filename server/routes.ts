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

  // ========== HIALINX API INTEGRATION ==========
  // API para acessar o SQL Server da Hialinx seguindo o padrão fornecido
  const SENIOR_API_URL = process.env.SENIOR_API_URL || "https://api-senior.tecnologiagrupoopus.com.br";
  const SENIOR_API_KEY = process.env.SENIOR_API_KEY;
  const MSSQL_DB = process.env.MSSQL_DB || 'opus_hcm_221123'; // Nome do database
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  let isApiKeyValid = false;
  
  if (!SENIOR_API_KEY) {
    if (isDevelopment) {
      console.warn("⚠️  DEVELOPMENT: SENIOR_API_KEY não configurada - API Senior será simulada");
      console.warn("⚠️  Para testes reais, configure: SENIOR_API_KEY='sua_chave_real'");
      console.warn("⚠️  NUNCA hardcode chaves API no código!");
    } else {
      console.error("🚫 PRODUCTION: SENIOR_API_KEY é obrigatória!");
      console.error("🚫 Configure: SENIOR_API_KEY='sua_chave_real'");
      console.error("🚫 NUNCA hardcode chaves API no código!");
      process.exit(1);
    }
  } else if (SENIOR_API_KEY.includes('example') || SENIOR_API_KEY.includes('test') || SENIOR_API_KEY.length < 10) {
    if (isDevelopment) {
      console.warn("⚠️  DEVELOPMENT: API key inválida detectada - API Senior será simulada");
      console.warn("⚠️  Para testes reais, configure uma chave válida");
    } else {
      console.error("🚫 PRODUCTION: API key inválida ou de exemplo detectada!");
      process.exit(1);
    }
  } else {
    isApiKeyValid = true;
    console.log("✅ API key válida configurada");
  }

  // Middleware simples de API Key (seguindo padrão Hialinx)
  function requireApiKey(req: any, res: any, next: any) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== SENIOR_API_KEY) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    next();
  }
  
  // ========== ROTAS DA API HIALINX ==========
  // Nota: A rota raiz '/' é servida pelo Vite para o dashboard React

  // Health check (seguindo padrão Hialinx)
  app.get('/api/health', (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

  // Endpoint específico para dados do gráfico de turnover (sempre mock em desenvolvimento)
  app.get("/api/senior/turnover-chart", async (req, res) => {
    try {
      // Em desenvolvimento sempre retorna dados simulados
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const contratacoes = 5;
      const demissoes = 3;  
      const funcionarios_ativos = 148;
      
      // Aplicar fórmula: (Contratações + Demissões) / 2 / Funcionários Ativos * 100
      const taxa_turnover = ((contratacoes + demissoes) / 2) / funcionarios_ativos * 100;
      
      const turnoverData = {
        mes: currentMonth,
        ano: currentYear,
        contratacoes,
        demissoes,
        funcionarios_ativos,
        taxa_turnover: Number(taxa_turnover.toFixed(2))
      };
      
      res.json({ 
        success: true, 
        data: turnoverData,
        timestamp: new Date().toISOString(),
        mode: "development-mock"
      });
    } catch (error) {
      console.error('ERROR /api/senior/turnover-chart:', error);
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Erro ao buscar dados de turnover" 
      });
    }
  });

  // Lista tabelas do banco usando 3-part name (seguindo padrão Hialinx)
  app.get('/api/tables', requireApiKey, async (req, res) => {
    // Em desenvolvimento sem API key válida, retorna dados simulados
    if (!isApiKeyValid) {
      return res.json([
        { TABLE_SCHEMA: 'dbo', TABLE_NAME: 'r070nau' },
        { TABLE_SCHEMA: 'dbo', TABLE_NAME: 'r022pub' },
        { TABLE_SCHEMA: 'INFORMATION_SCHEMA', TABLE_NAME: 'TABLES' }
      ]);
    }
    
    try {
      const query = `
        SELECT TABLE_SCHEMA, TABLE_NAME
        FROM [${MSSQL_DB}].INFORMATION_SCHEMA.TABLES
        ORDER BY TABLE_SCHEMA, TABLE_NAME;
      `;
      
      const response = await fetch(`${SENIOR_API_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": SENIOR_API_KEY!,
        },
        body: JSON.stringify({ sqlText: query }),
      });

      if (response.ok) {
        const data = await response.json();
        res.json(data);
      } else {
        res.status(response.status).json({ 
          error: `HTTP ${response.status}: ${response.statusText}` 
        });
      }
    } catch (error) {
      console.error('DB ERROR /api/tables:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Erro ao buscar tabelas" });
    }
  });

  // Executa apenas SELECT com proteções (seguindo padrão Hialinx)
  app.post('/api/query', requireApiKey, async (req, res) => {
    try {
      let sqlText = String(req.body?.sqlText || '').trim();

      // Permitir apenas SELECT
      if (!/^select\b/i.test(sqlText)) {
        return res.status(400).json({ error: 'Somente SELECT é permitido.' });
      }
      
      // Bloquear comandos perigosos (seguindo padrão Hialinx)
      const dangerousCommands = /\b(INSERT|UPDATE|DELETE|MERGE|DROP|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE|GRANT|REVOKE|BACKUP)\b/i;
      if (dangerousCommands.test(sqlText)) {
        return res.status(400).json({ error: 'Apenas SELECT simples é permitido.' });
      }

      // Ajuda: se o usuário esquecer de prefixar INFORMATION_SCHEMA com o DB, corrigimos (seguindo padrão Hialinx)
      sqlText = sqlText.replace(
        /\bFROM\s+INFORMATION_SCHEMA\./ig,
        `FROM [${MSSQL_DB}].INFORMATION_SCHEMA.`
      );

      // Em desenvolvimento sem API key válida, retorna dados simulados
      if (!isApiKeyValid) {
        const mockData = getMockDataForDynamicQuery(sqlText);
        console.log(`🔍 QUERY SIMULADA: ${sqlText.substring(0, 100)}...`);
        return res.json(mockData);
      }

      // Auditoria de segurança
      console.log(`🔍 QUERY EXECUTADA: ${sqlText.substring(0, 100)}... em ${new Date().toISOString()}`);

      const response = await fetch(`${SENIOR_API_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": SENIOR_API_KEY!,
        },
        body: JSON.stringify({ sqlText }),
      });

      if (response.ok) {
        const data = await response.json();
        res.json(data);
      } else {
        res.status(response.status).json({ 
          error: `HTTP ${response.status}: ${response.statusText}` 
        });
      }
    } catch (error) {
      console.error('DB ERROR /api/query:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Erro ao executar query" });
    }
  });

  // Queries pré-definidas com colunas específicas (mantendo funcionalidade existente)
  const ALLOWED_QUERIES = {
    'list_tables': `SELECT TOP 20 TABLE_SCHEMA, TABLE_NAME FROM [${MSSQL_DB}].INFORMATION_SCHEMA.TABLES ORDER BY TABLE_SCHEMA, TABLE_NAME`,
    'employee_count': `SELECT COUNT(*) as total FROM [${MSSQL_DB}].dbo.r070nau WHERE sitafa = 1`,
    'employee_basic': `SELECT TOP 50 numcad, tipcol, sitafa FROM [${MSSQL_DB}].dbo.r070nau WHERE sitafa = 1`,
    'payroll_summary': `SELECT TOP 30 numcad, comrub, periodo FROM [${MSSQL_DB}].dbo.r022pub WHERE comrub IN (1, 2, 3)`,
    'demographics_basic': `SELECT sexo, COUNT(*) as count FROM [${MSSQL_DB}].dbo.r070nau WHERE sitafa = 1 GROUP BY sexo`,
    'turnover_opus_current_month': `
      SELECT 
        MONTH(GETDATE()) as mes,
        YEAR(GETDATE()) as ano,
        (
          SELECT COUNT(*) 
          FROM [${MSSQL_DB}].dbo.r070nau 
          WHERE YEAR(datadm) = YEAR(GETDATE()) 
            AND MONTH(datadm) = MONTH(GETDATE())
            AND nome_emp = 'Opus Consultoria Ltda'
        ) as contratacoes,
        (
          SELECT COUNT(*) 
          FROM [${MSSQL_DB}].dbo.r070nau r
          LEFT JOIN [${MSSQL_DB}].dbo.r035fun f ON r.numcad = f.numcad
          WHERE YEAR(r.datafa) = YEAR(GETDATE()) 
            AND MONTH(r.datafa) = MONTH(GETDATE())
            AND r.nome_emp = 'Opus Consultoria Ltda'
            AND ISNULL(f.causa_demiss, '') <> 'Transferência p/ Outra Empresa'
        ) as demissoes,
        (
          SELECT COUNT(*) 
          FROM [${MSSQL_DB}].dbo.r070nau 
          WHERE sitafa = 1 
            AND nome_emp = 'Opus Consultoria Ltda'
        ) as funcionarios_ativos
    `,
  } as const;
  
  // Controle de acesso por query (RBAC básico)
  const QUERY_PERMISSIONS = {
    'list_tables': ['admin', 'viewer'],
    'employee_count': ['admin', 'hr', 'viewer'],
    'employee_basic': ['admin', 'hr'], 
    'payroll_summary': ['admin'], // Só admin pode ver folha
    'demographics_basic': ['admin', 'hr', 'viewer'],
    'turnover_opus_current_month': ['admin', 'hr', 'viewer'], // Turnover é visível para todos
  } as const;
  
  type QueryId = keyof typeof ALLOWED_QUERIES;
  
  // Middleware de autenticação e segurança para endpoints Senior
  const authenticateSeniorAPI = (req: any, res: any, next: any) => {
    // Verifica autenticação
    if (!req.session?.user) {
      return res.status(401).json({ success: false, error: "Acesso não autorizado" });
    }
    
    // Proteção CSRF para requests POST
    if (req.method === 'POST') {
      const csrfToken = req.headers['x-csrf-token'];
      const sessionCsrf = req.session.csrfToken;
      
      if (!csrfToken || !sessionCsrf || csrfToken !== sessionCsrf) {
        console.warn(`🚫 CSRF: Token inválido para usuário ${req.session.user.id}`);
        return res.status(403).json({ success: false, error: "Token de segurança inválido" });
      }
    }
    
    next();
  };
  
  // Middleware para verificar permissões por query
  const checkQueryPermission = (req: any, res: any, next: any) => {
    const { queryId } = req.body;
    const userRole = req.session?.user?.role || 'viewer';
    
    if (!queryId || !QUERY_PERMISSIONS[queryId as keyof typeof QUERY_PERMISSIONS]) {
      return res.status(400).json({ success: false, error: "Query ID inválido" });
    }
    
    const allowedRoles = QUERY_PERMISSIONS[queryId as keyof typeof QUERY_PERMISSIONS];
    if (!allowedRoles.includes(userRole)) {
      console.warn(`🚫 RBAC: Usuário ${req.session.user.id} (${userRole}) tentou acessar query ${queryId}`);
      return res.status(403).json({ success: false, error: "Permissão insuficiente para esta consulta" });
    }
    
    next();
  };

  // Proxy para testar conexão (sem autenticação para health check)
  app.get("/api/senior/health", async (req, res) => {
    // Em desenvolvimento sem API key válida, retorna status simulado
    if (!isApiKeyValid) {
      return res.json({ 
        success: true, 
        data: { status: "OK", mode: "development-mock" }, 
        timestamp: new Date().toISOString() 
      });
    }
    
    try {
      const response = await fetch(`${SENIOR_API_URL}/health`, {
        method: "GET",
        headers: {
          "x-api-key": SENIOR_API_KEY!,
        },
      });

      if (response.ok) {
        const data = await response.json();
        res.json({ success: true, data, timestamp: new Date().toISOString() });
      } else {
        res.status(response.status).json({ 
          success: false, 
          error: `HTTP ${response.status}: ${response.statusText}` 
        });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Erro de conexão" 
      });
    }
  });

  // Proxy para listar tabelas (com autenticação)
  app.get("/api/senior/tables", authenticateSeniorAPI, async (req, res) => {
    // Em desenvolvimento sem API key válida, retorna dados simulados
    if (!isApiKeyValid) {
      return res.json({ 
        success: true, 
        data: [
          { table_name: "employees", description: "Employee data (mock)" },
          { table_name: "payroll", description: "Payroll data (mock)" },
          { table_name: "departments", description: "Department data (mock)" }
        ], 
        timestamp: new Date().toISOString(),
        mode: "development-mock"
      });
    }
    
    try {
      const response = await fetch(`${SENIOR_API_URL}/tables`, {
        method: "GET",
        headers: {
          "x-api-key": SENIOR_API_KEY!,
        },
      });

      if (response.ok) {
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = [];
        }
        res.json({ success: true, data: Array.isArray(data) ? data : [], timestamp: new Date().toISOString() });
      } else {
        res.status(response.status).json({ 
          success: false, 
          error: `HTTP ${response.status}: ${response.statusText}` 
        });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Erro ao buscar tabelas" 
      });
    }
  });

  // Listar queries disponíveis
  app.get("/api/senior/queries", authenticateSeniorAPI, (req, res) => {
    const availableQueries = Object.keys(ALLOWED_QUERIES).map(id => ({
      id,
      description: getQueryDescription(id as QueryId)
    }));
    res.json({ success: true, data: availableQueries });
  });
  
  // Executar query pré-definida por ID (SEGURO + RBAC)
  app.post("/api/senior/execute-query", authenticateSeniorAPI, checkQueryPermission, async (req, res) => {
    try {
      const { queryId } = req.body;
      
      if (!queryId || typeof queryId !== 'string') {
        return res.status(400).json({ success: false, error: "queryId é obrigatório" });
      }
      
      if (!(queryId in ALLOWED_QUERIES)) {
        return res.status(400).json({ 
          success: false, 
          error: `Query ID inválido. Disponíveis: ${Object.keys(ALLOWED_QUERIES).join(', ')}` 
        });
      }
      
      // Em desenvolvimento sem API key válida, retorna dados simulados
      if (!isApiKeyValid) {
        const mockData = getMockDataForQuery(queryId as QueryId);
        console.log(`🔍 AUDIT (MOCK): Query [${queryId}] simulada para desenvolvimento`);
        return res.json({ 
          success: true, 
          data: mockData, 
          queryId, 
          timestamp: new Date().toISOString(),
          mode: "development-mock"
        });
      }
      
      const sqlText = ALLOWED_QUERIES[queryId as QueryId];
      
      // Auditoria de segurança
      const userId = req.session?.user?.id || 'unknown';
      const userRole = req.session?.user?.role || 'viewer';
      console.log(`🔍 AUDIT: Query [${queryId}] executada por usuário ${userId} (${userRole}) em ${new Date().toISOString()}`);

      const response = await fetch(`${SENIOR_API_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": SENIOR_API_KEY!,
        },
        body: JSON.stringify({ sqlText }),
      });

      if (response.ok) {
        const data = await response.json();
        const normalizedData = Array.isArray(data) ? data : (data.rows || data.data || []);
        res.json({ success: true, data: normalizedData, queryId, timestamp: new Date().toISOString() });
      } else {
        res.status(response.status).json({ 
          success: false, 
          error: `HTTP ${response.status}: ${response.statusText}` 
        });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Erro ao executar query" 
      });
    }
  });
  
  function getMockDataForQuery(queryId: QueryId): any[] {
    const mockData = {
      'list_tables': [
        { TABLE_SCHEMA: 'dbo', TABLE_NAME: 'r070nau' },
        { TABLE_SCHEMA: 'dbo', TABLE_NAME: 'r022pub' },
        { TABLE_SCHEMA: 'INFORMATION_SCHEMA', TABLE_NAME: 'TABLES' }
      ],
      'employee_count': [{ total: 150 }],
      'employee_basic': [
        { numcad: '001', tipcol: 'CLT', sitafa: 1 },
        { numcad: '002', tipcol: 'CLT', sitafa: 1 },
        { numcad: '003', tipcol: 'CLT', sitafa: 1 }
      ],
      'payroll_summary': [
        { numcad: '001', comrub: 1, periodo: '2024-01' },
        { numcad: '002', comrub: 2, periodo: '2024-01' },
        { numcad: '003', comrub: 3, periodo: '2024-01' }
      ],
      'demographics_basic': [
        { sexo: 'M', count: 85 },
        { sexo: 'F', count: 65 }
      ],
      'turnover_opus_current_month': [{
        mes: new Date().getMonth() + 1,
        ano: new Date().getFullYear(),
        contratacoes: 3,
        demissoes: 2,
        funcionarios_ativos: 150
      }],
    };
    return mockData[queryId] || [];
  }

  // Mock data para consultas dinâmicas (seguindo padrão Hialinx)
  function getMockDataForDynamicQuery(sqlText: string): any[] {
    const upperSql = sqlText.toUpperCase();
    
    // Se é uma query sobre INFORMATION_SCHEMA.TABLES
    if (upperSql.includes('INFORMATION_SCHEMA.TABLES')) {
      return [
        { TABLE_SCHEMA: 'dbo', TABLE_NAME: 'r070nau', TABLE_TYPE: 'BASE TABLE' },
        { TABLE_SCHEMA: 'dbo', TABLE_NAME: 'r022pub', TABLE_TYPE: 'BASE TABLE' },
        { TABLE_SCHEMA: 'dbo', TABLE_NAME: 'r035fun', TABLE_TYPE: 'BASE TABLE' },
        { TABLE_SCHEMA: 'dbo', TABLE_NAME: 'r001tco', TABLE_TYPE: 'BASE TABLE' }
      ];
    }
    
    // Se é uma query sobre funcionários (r070nau)
    if (upperSql.includes('R070NAU')) {
      if (upperSql.includes('COUNT')) {
        return [{ total: 150 }];
      } else {
        return [
          { numcad: '001', tipcol: 'CLT', sitafa: 1, nomfun: 'João Silva' },
          { numcad: '002', tipcol: 'CLT', sitafa: 1, nomfun: 'Maria Santos' },
          { numcad: '003', tipcol: 'CLT', sitafa: 1, nomfun: 'Pedro Oliveira' }
        ];
      }
    }
    
    // Se é uma query sobre folha de pagamento (r022pub)
    if (upperSql.includes('R022PUB')) {
      return [
        { numcad: '001', comrub: 1, periodo: '2024-01', valcal: 5000.00 },
        { numcad: '002', comrub: 2, periodo: '2024-01', valcal: 4500.00 },
        { numcad: '003', comrub: 3, periodo: '2024-01', valcal: 6000.00 }
      ];
    }
    
    // Mock genérico
    return [
      { resultado: 'Mock data', query: sqlText.substring(0, 50) + '...', timestamp: new Date().toISOString() }
    ];
  }

  function getQueryDescription(queryId: QueryId): string {
    const descriptions = {
      'list_tables': 'Lista as tabelas disponíveis no banco',
      'employee_count': 'Conta total de funcionários',
      'employee_basic': 'Dados básicos de funcionários ativos',
      'payroll_summary': 'Resumo da folha de pagamento',
      'demographics_basic': 'Dados demográficos básicos',
      'turnover_opus_current_month': 'Dados de turnover do mês atual para Opus Consultoria Ltda',
    };
    return descriptions[queryId] || 'Descrição não disponível';
  }

  // Endpoints de autenticação básica para desenvolvimento  
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    
    // Autenticação simples para desenvolvimento (melhorar em produção)
    if (username && password) {
      const role = username === 'admin' ? 'admin' : username === 'hr' ? 'hr' : 'viewer';
      
      req.session.user = {
        id: username,
        role,
        loginTime: new Date().toISOString()
      };
      
      // Gera token CSRF
      req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
      
      console.log(`🔑 LOGIN: Usuário ${username} (${role}) autenticado`);
      res.json({ 
        success: true, 
        user: { id: username, role },
        csrfToken: req.session.csrfToken
      });
    } else {
      res.status(401).json({ success: false, error: "Credenciais inválidas" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    const userId = req.session?.user?.id;
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ success: false, error: "Erro ao fazer logout" });
      } else {
        console.log(`🔒 LOGOUT: Usuário ${userId} desconectado`);
        res.json({ success: true });
      }
    });
  });
  
  app.get("/api/auth/status", (req, res) => {
    if (req.session?.user) {
      res.json({ 
        authenticated: true, 
        user: req.session.user,
        csrfToken: req.session.csrfToken
      });
    } else {
      res.json({ authenticated: false });
    }
  });
  
  app.get("/api/auth/csrf", (req, res) => {
    if (!req.session.csrfToken) {
      req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
    }
    res.json({ csrfToken: req.session.csrfToken });
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
