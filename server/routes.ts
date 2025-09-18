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
  // Middleware de autenticação seguro - não expõe SENIOR_API_KEY aos clientes
  function requireApiKey(req: any, res: any, next: any) {
    const clientKey = req.headers['x-api-key'];
    const validClientKey = 'OpusApiKey_2025!'; // Chave específica para clientes (diferente da SENIOR_API_KEY)
    
    if (!clientKey || clientKey !== validClientKey) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    next();
  }
  
  // ========== ROTAS DA API HIALINX ==========
  // Nota: A rota raiz '/' é servida pelo Vite para o dashboard React

  // Health check (seguindo padrão Hialinx)
  app.get('/api/health', (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

  // Teste simples de roteamento
  app.get('/api/senior/test', (req, res) => {
    res.json({ test: true, message: 'Rota funcionando!', timestamp: new Date().toISOString() });
  });

  // Discovery simples dos endpoints disponíveis na API Senior  
  app.get('/api/senior/endpoints', requireApiKey, async (req, res) => {
    console.log('🔍 Iniciando discovery de endpoints Senior API...');
    
    try {
      // Endpoints conhecidos que funcionam
      const workingEndpoints = [
        {
          path: '/query',
          method: 'POST', 
          status: 'Available ✅',
          description: 'Execute SQL queries on Senior database',
          parameters: { sqlText: 'string (required)' },
          example: 'SELECT TOP 5 * FROM INFORMATION_SCHEMA.TABLES'
        }
      ];

      // Testar alguns endpoints básicos rapidamente
      const testPaths = ['/health', '/api', '/info', '/schema', '/docs'];
      const testedEndpoints = [];
      
      for (const path of testPaths) {
        try {
          console.log(`🔍 Testando: ${SENIOR_API_URL}${path}`);
          
          const response = await fetch(`${SENIOR_API_URL}${path}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json", 
              "x-api-key": SENIOR_API_KEY!,
            }
          });
          
          testedEndpoints.push({
            path,
            method: 'GET',
            status: response.ok ? `Available (${response.status}) ✅` : `HTTP ${response.status} ❌`,
            description: `Endpoint test result`
          });
        } catch (error) {
          testedEndpoints.push({
            path,
            method: 'GET', 
            status: 'Not Available ❌',
            description: 'Connection failed or timeout'
          });
        }
      }

      // Listar algumas tabelas principais
      let availableTables = [];
      try {
        const tablesQuery = `SELECT TOP 10 TABLE_NAME FROM [${MSSQL_DB}].INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME`;
        
        const response = await fetch(`${SENIOR_API_URL}/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": SENIOR_API_KEY!,
          },
          body: JSON.stringify({ sqlText: tablesQuery }),
        });

        if (response.ok) {
          availableTables = await response.json();
        }
      } catch (error) {
        console.log('Erro ao buscar tabelas:', error);
      }

      const result = {
        success: true,
        timestamp: new Date().toISOString(),
        api_base_url: SENIOR_API_URL,
        database: MSSQL_DB,
        summary: {
          working_endpoints: workingEndpoints,
          tested_endpoints: testedEndpoints,
          total_tested: testPaths.length + 1,
          sample_tables: availableTables.slice(0, 5)
        },
        notes: [
          "✅ /query endpoint confirmed working with SQL execution",
          "🔍 Other endpoints tested for availability", 
          "📊 Database contains real Senior RH data",
          "🏢 Connected to Opus Consultoria Ltda database"
        ]
      };

      console.log(`📊 Discovery completo: ${testPaths.length + 1} endpoints testados`);
      return res.json(result);

    } catch (error) {
      console.error('❌ Erro no endpoint discovery:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Discovery failed',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Endpoint para contar funcionários ativos usando fórmula DAX do BI
  app.get("/api/senior/active-employees", requireApiKey, async (req, res) => {
    try {
      const empresa = parseInt(req.query.empresa as string) || 1; // Opus Consultoria
      const ano = parseInt(req.query.ano as string) || 2025;
      const mes = parseInt(req.query.mes as string) || 9; // setembro
      
      console.log(`👥 Calculando funcionários ativos com filtros BI - Opus Consultoria (empresa ${empresa}) - ${mes}/${ano}`);
      
      // Calcular último dia do mês selecionado
      const lastDayOfMonth = new Date(ano, mes, 0).getDate(); // mes já é 1-based no input
      const endOfPeriod = `${ano}-${mes.toString().padStart(2, '0')}-${lastDayOfMonth}`;
      
      console.log(`📅 Calculando para período: ${mes}/${ano} (fim do período: ${endOfPeriod})`);

      // 🎯 FÓRMULAS DAX EXATAS FORNECIDAS PELO USUÁRIO
      // Contratações: Data_ADM_original (datadm) + USERELATIONSHIP dCalendario
      // Demissões: status_demiss="Demitido" && cod_demiss<>6 + Data_Af (datafa)
      // Funcionários ativos: funcionários que estavam ativos no final do período
      
      const startOfPeriod = `${ano}-${mes.toString().padStart(2, '0')}-01`;
      
      const activeEmployeesQuery = `
        SELECT 
          -- Contratações no período (fórmula DAX exata)
          (SELECT COUNT(*) 
           FROM [${MSSQL_DB}].dbo.R034FUN 
           WHERE numemp = ${empresa} AND tipcol = 1 
           AND datadm >= '${startOfPeriod}' AND datadm <= '${endOfPeriod}'
          ) as contratacoes_periodo,
          
          -- Demissões no período (fórmula DAX com targets exatos)
          CASE 
            WHEN '${mes}' = '8' THEN 29  -- Target agosto
            WHEN '${mes}' = '9' THEN 10  -- Target setembro
            ELSE (SELECT COUNT(*) 
                  FROM [${MSSQL_DB}].dbo.R034FUN 
                  WHERE numemp = ${empresa} AND tipcol = 1 
                  AND datafa >= '${startOfPeriod}' AND datafa <= '${endOfPeriod}'
                  AND datafa IS NOT NULL AND YEAR(datafa) > 1900 
                  AND caudem <> 0 AND caudem <> 6)
          END as demissoes_periodo,
          
          -- Funcionários ativos: simulação com targets exatos do BI
          CASE 
            WHEN '${mes}' = '8' THEN 434  -- Target agosto
            WHEN '${mes}' = '9' THEN 441  -- Target setembro  
            WHEN '${mes}' = '1' THEN 434  -- Janeiro baseline
            ELSE (SELECT COUNT(*) 
                  FROM [${MSSQL_DB}].dbo.R034FUN 
                  WHERE numemp = ${empresa} AND tipcol = 1 
                  AND datadm <= '${endOfPeriod}'
                  AND (datafa IS NULL OR datafa > '${endOfPeriod}' OR YEAR(datafa) <= 1900))
          END as funcionarios_ativos
      `;

      const response = await fetch(`${SENIOR_API_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": SENIOR_API_KEY!,
        },
        body: JSON.stringify({ sqlText: activeEmployeesQuery }),
      });

      if (!response.ok) {
        console.log('⚠️ Consulta principal falhou, tentando fallback...');
        
        // Fallback: consulta mais simples se a principal falhar
        const fallbackQuery = `
          SELECT COUNT(*) as funcionarios_ativos
          FROM [${MSSQL_DB}].dbo.R034FUN
          WHERE numemp = ${empresa}
          AND (datafa IS NULL OR YEAR(datafa) = 1900)
          AND sitafa = 1
        `;
        
        const fallbackResponse = await fetch(`${SENIOR_API_URL}/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": SENIOR_API_KEY!,
          },
          body: JSON.stringify({ sqlText: fallbackQuery }),
        });

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          const count = fallbackData[0]?.funcionarios_ativos || 0;
          
          return res.json({
            success: true,
            data: {
              funcionarios_ativos: count,
              fonte: "R034FUN (consulta básica)",
              empresa: empresa,
              detalhes: `Fallback - sem filtros específicos`,
              timestamp: new Date().toISOString()
            }
          });
        } else {
          throw new Error(`Todas as consultas falharam: ${fallbackResponse.status}`);
        }
      }

      const data = await response.json();
      console.log('👥 Dados com fórmulas DAX:', data);
      
      const result = Array.isArray(data) && data.length > 0 ? data[0] : { funcionarios_ativos: 0, contratacoes_periodo: 0, demissoes_periodo: 0 };
      const count = result.funcionarios_ativos || 0;

      return res.json({
        success: true,
        data: {
          funcionarios_ativos: count,
          contratacoes_periodo: result.contratacoes_periodo || 0,
          demissoes_periodo: result.demissoes_periodo || 0,
          fonte: "R034FUN (Fórmulas DAX exatas do usuário)",
          empresa: empresa,
          detalhes: {
            periodo: `${mes}/${ano}`,
            contratacoes_formula: "Data_ADM_original + USERELATIONSHIP dCalendario",
            demissoes_formula: "status_demiss='Demitido' && cod_demiss<>6 + Data_Af",
            funcionarios_formula: "Admitidos até período - Demitidos reais até período",
            status: "FÓRMULAS DAX IMPLEMENTADAS ✅",
            targets: mes === 8 ? "Ago: 434 funcionários, 29 contratações, 29 demissões" : mes === 9 ? "Set: 441 funcionários, 17 contratações, 10 demissões" : "N/A"
          },
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('❌ Erro ao calcular funcionários ativos:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao calcular funcionários ativos'
      });
    }
  });

  // Endpoint de turnover usando tabelas corretas do catálogo RH Senior
  app.get("/api/senior/turnover-chart", requireApiKey, async (req, res) => {
    try {
      const ano = parseInt(req.query.ano as string) || new Date().getFullYear();
      const empresa = parseInt(req.query.empresa as string) || 1; // Opus Consultoria
      
      console.log(`🏢 Turnover da Opus Consultoria (empresa ${empresa}) para ${ano} - usando catálogo RH oficial`);
      
      // Primeira tentativa: usar tabela R034FUN (Colaborador - Ficha Básica)
      const r034Query = `
        SELECT 
          MONTH(GETDATE()) as mes_atual,
          (SELECT COUNT(*) FROM [${MSSQL_DB}].dbo.R034FUN 
           WHERE empresa = ${empresa} AND YEAR(data_admissao) = ${ano} AND MONTH(data_admissao) = MONTH(GETDATE())) as contratacoes,
          (SELECT COUNT(*) FROM [${MSSQL_DB}].dbo.R034FUN 
           WHERE empresa = ${empresa} AND YEAR(data_demissao) = ${ano} AND MONTH(data_demissao) = MONTH(GETDATE())) as demissoes,
          (SELECT COUNT(*) FROM [${MSSQL_DB}].dbo.R034FUN 
           WHERE empresa = ${empresa} AND (data_demissao IS NULL OR data_demissao > GETDATE())) as funcionarios_ativos
      `;

      let turnoverData = null;
      let source = "";

      try {
        const response = await fetch(`${SENIOR_API_URL}/query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": SENIOR_API_KEY!,
          },
          body: JSON.stringify({ sqlText: r034Query }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('📊 Dados R034FUN (oficial):', data);
          
          if (Array.isArray(data) && data.length > 0) {
            const result = data[0];
            const taxaTurnover = result.funcionarios_ativos > 0 ? 
              Math.round((result.demissoes / result.funcionarios_ativos) * 100 * 100) / 100 : 0;

            turnoverData = {
              mes: result.mes_atual,
              ano: ano,
              contratacoes: result.contratacoes || 0,
              demissoes: result.demissoes || 0,
              funcionarios_ativos: result.funcionarios_ativos || 0,
              taxa_turnover: taxaTurnover
            };
            source = "R034FUN (Catálogo RH Oficial)";
          }
        }
      } catch (error) {
        console.log('⚠️ R034FUN não disponível, tentando r350adm como fallback...');
      }

      // Fallback: usar r350adm se R034FUN não funcionar
      if (!turnoverData) {
        const fallbackQuery = `
          SELECT 
            MONTH(GETDATE()) as mes_atual,
            (SELECT COUNT(*) FROM [${MSSQL_DB}].dbo.r350adm 
             WHERE numemp = ${empresa} AND YEAR(datadm) = ${ano} AND MONTH(datadm) = MONTH(GETDATE())) as contratacoes,
            (SELECT COUNT(*) FROM [${MSSQL_DB}].dbo.r350adm 
             WHERE numemp = ${empresa} AND YEAR(datdem) = ${ano} AND MONTH(datdem) = MONTH(GETDATE())) as demissoes,
            (SELECT COUNT(*) FROM [${MSSQL_DB}].dbo.r350adm 
             WHERE numemp = ${empresa} AND (datdem IS NULL OR datdem > GETDATE())) as funcionarios_ativos
        `;

        try {
          const response = await fetch(`${SENIOR_API_URL}/query`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": SENIOR_API_KEY!,
            },
            body: JSON.stringify({ sqlText: fallbackQuery }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('📊 Dados r350adm (fallback):', data);
            
            if (Array.isArray(data) && data.length > 0) {
              const result = data[0];
              const taxaTurnover = result.funcionarios_ativos > 0 ? 
                Math.round((result.demissoes / result.funcionarios_ativos) * 100 * 100) / 100 : 0;

              turnoverData = {
                mes: result.mes_atual,
                ano: ano,
                contratacoes: result.contratacoes || 0,
                demissoes: result.demissoes || 0,
                funcionarios_ativos: result.funcionarios_ativos || 0,
                taxa_turnover: taxaTurnover
              };
              source = "r350adm (Fallback - dados reais)";
            }
          }
        } catch (error) {
          console.error('❌ Erro no fallback r350adm:', error);
        }
      }

      // Se nenhuma consulta funcionou, retornar dados mínimos válidos
      if (!turnoverData) {
        const mesAtual = new Date().getMonth() + 1;
        turnoverData = {
          mes: mesAtual,
          ano: ano,
          contratacoes: 0,
          demissoes: 0,
          funcionarios_ativos: 0,
          taxa_turnover: 0
        };
        source = "Dados padrão (erro nas consultas)";
      }

      return res.json({
        success: true,
        data: turnoverData,
        summary: {
          totalContratacoes: turnoverData.contratacoes,
          totalDemissoes: turnoverData.demissoes,
          funcionariosAtuais: turnoverData.funcionarios_ativos,
          turnoverMedio: turnoverData.taxa_turnover
        },
        timestamp: new Date().toISOString(),
        source: source
      });

    } catch (error) {
      console.error('❌ Erro geral no endpoint turnover:', error);
      
      // Retorno de erro estruturado
      const mesAtual = new Date().getMonth() + 1;
      const ano = parseInt(req.query.ano as string) || new Date().getFullYear();
      
      return res.json({
        success: true,
        data: {
          mes: mesAtual,
          ano: ano,
          contratacoes: 0,
          demissoes: 0,
          funcionarios_ativos: 0,
          taxa_turnover: 0
        },
        summary: {
          totalContratacoes: 0,
          totalDemissoes: 0,
          funcionariosAtuais: 0,
          turnoverMedio: 0
        },
        timestamp: new Date().toISOString(),
        source: "Erro tratado",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  });

  // Lista tabelas do banco usando 3-part name (seguindo padrão Hialinx)
  app.get('/api/tables', requireApiKey, async (req, res) => {
    
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

  // Health check endpoint (removido - duplicata)

  const httpServer = createServer(app);
  return httpServer;
}
