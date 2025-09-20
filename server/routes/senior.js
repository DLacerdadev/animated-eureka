import express from 'express';
import { neon } from '@neondatabase/serverless';
const router = express.Router();

// Connection configuration - using PostgreSQL database
const sql = neon(process.env.DATABASE_URL);

// Helper function to generate Senior API requests
function createSeniorApiRequest(service, method, parameters = {}) {
  return {
    serviceName: service,
    method: method,
    parameters: parameters
  };
}

// Logging helper
function logRequest(query, success = true, additionalInfo = {}) {
  const timestamp = new Date().toLocaleTimeString('pt-BR', { 
    hour12: false, 
    timeZone: 'America/Sao_Paulo' 
  });
  
  console.log(`${timestamp} [express] POST /api/senior/execute-query ${success ? '200' : '401'} in ${Math.random() * 10 | 0}ms :: query=${query}${Object.keys(additionalInfo).length > 0 ? ` :: ${Object.entries(additionalInfo).map(([k, v]) => `${k}=${v}`).join(' ')}` : ''}`);
}

// GET endpoint to analyze duplicates in r034fun
router.get('/analyze-duplicates', async (req, res) => {
  try {
    console.log('🔍 Analisando possíveis duplicações na tabela r034fun...');
    
    const SENIOR_API_URL = process.env.SENIOR_API_URL || "https://api-senior.tecnologiagrupoopus.com.br";
    const SENIOR_API_KEY = process.env.SENIOR_API_KEY;
    const MSSQL_DB = process.env.MSSQL_DB || "opus_hcm_221123";

    if (!SENIOR_API_KEY) {
      return res.status(401).json({
        success: false,
        error: 'API key não configurada'
      });
    }

    // Query para investigar duplicações nas 7 empresas com filtros 2025
    const duplicateAnalysisQuery = `
      -- ANÁLISE DE DUPLICAÇÕES E CONTAGENS
      SELECT 
        -- 1. Contagem SEM DISTINCT (total de registros)
        (SELECT COUNT(*) FROM [${MSSQL_DB}].dbo.r034fun 
         WHERE numemp IN (1,6,8,9,10,11,13) 
         AND TIPCOL IN (1,3,5) 
         AND YEAR(datadm) = 2025) as total_registros_brutos,
        
        -- 2. Contagem COM DISTINCT (funcionários únicos)
        (SELECT COUNT(DISTINCT CONCAT_WS('-', numemp, TIPCOL, numcad, numcpf)) 
         FROM [${MSSQL_DB}].dbo.r034fun 
         WHERE numemp IN (1,6,8,9,10,11,13) 
         AND TIPCOL IN (1,3,5) 
         AND YEAR(datadm) = 2025) as funcionarios_distintos,
         
        -- 3. Contagem apenas por CPF (possíveis duplicatas por CPF)
        (SELECT COUNT(DISTINCT numcpf) FROM [${MSSQL_DB}].dbo.r034fun 
         WHERE numemp IN (1,6,8,9,10,11,13) 
         AND TIPCOL IN (1,3,5) 
         AND YEAR(datadm) = 2025) as cpfs_distintos,
         
        -- 4. Contagem apenas por numcad (matrícula)
        (SELECT COUNT(DISTINCT numcad) FROM [${MSSQL_DB}].dbo.r034fun 
         WHERE numemp IN (1,6,8,9,10,11,13) 
         AND TIPCOL IN (1,3,5) 
         AND YEAR(datadm) = 2025) as matriculas_distintas,
         
        -- 5. Funcionários ativos COM DISTINCT (como na query atual)
        (SELECT COUNT(DISTINCT CONCAT_WS('-', numemp, TIPCOL, numcad, numcpf)) 
         FROM [${MSSQL_DB}].dbo.r034fun 
         WHERE numemp IN (1,6) 
         AND TIPCOL IN (1,3,5)
         AND (datafa IS NULL OR datafa = '1900-12-31 00:00:00' OR datafa >= DATEFROMPARTS(2025,1,1))) as ativos_distinct_atual,
         
        -- 6. Funcionários ativos SEM DISTINCT
        (SELECT COUNT(*) FROM [${MSSQL_DB}].dbo.r034fun 
         WHERE numemp IN (1,6) 
         AND TIPCOL IN (1,3,5)
         AND (datafa IS NULL OR datafa = '1900-12-31 00:00:00' OR datafa >= DATEFROMPARTS(2025,1,1))) as ativos_sem_distinct,
         
        -- 7. Quantidade de registros com mesmo CPF (detectar duplicatas)
        (SELECT COUNT(*) FROM (
           SELECT numcpf, COUNT(*) as qtd_registros
           FROM [${MSSQL_DB}].dbo.r034fun 
           WHERE numemp IN (1,6,8,9,10,11,13) 
           AND TIPCOL IN (1,3,5)
           GROUP BY numcpf
           HAVING COUNT(*) > 1
         ) duplicatas_cpf) as cpfs_com_multiplos_registros,
         
        -- 8. Funcionários com múltiplas empresas
        (SELECT COUNT(*) FROM (
           SELECT numcpf, COUNT(DISTINCT numemp) as qtd_empresas
           FROM [${MSSQL_DB}].dbo.r034fun 
           WHERE numemp IN (1,6,8,9,10,11,13) 
           AND TIPCOL IN (1,3,5)
           GROUP BY numcpf
           HAVING COUNT(DISTINCT numemp) > 1
         ) multiplas_empresas) as funcionarios_multiplas_empresas,
         
        -- 9. Registros históricos (múltiplas datas de admissão para mesmo CPF)
        (SELECT COUNT(*) FROM (
           SELECT numcpf, COUNT(DISTINCT datadm) as qtd_admissoes
           FROM [${MSSQL_DB}].dbo.r034fun 
           WHERE numemp IN (1,6,8,9,10,11,13) 
           AND TIPCOL IN (1,3,5)
           GROUP BY numcpf
           HAVING COUNT(DISTINCT datadm) > 1
         ) multiplas_admissoes) as funcionarios_multiplas_admissoes
    `;
    
    console.log('📝 Executando análise de duplicações:', duplicateAnalysisQuery);
    
    const response = await fetch(`${SENIOR_API_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": SENIOR_API_KEY
      },
      body: JSON.stringify({ sqlText: duplicateAnalysisQuery })
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API Senior: ${response.status}`);
    }
    
    const apiResult = await response.json();
    const analysis = apiResult?.[0] || {};
    
    console.log('📊 Resultado da análise de duplicações:', analysis);
    
    // Calcular diferenças
    const duplicateImpact = {
      registros_vs_distintos: (analysis.total_registros_brutos || 0) - (analysis.funcionarios_distintos || 0),
      ativos_inflacao: (analysis.ativos_sem_distinct || 0) - (analysis.ativos_distinct_atual || 0),
      cpf_vs_chave_composta: (analysis.cpfs_distintos || 0) - (analysis.funcionarios_distintos || 0),
      possivel_inflacao_pct: analysis.funcionarios_distintos > 0 ? 
        (((analysis.total_registros_brutos || 0) - (analysis.funcionarios_distintos || 0)) / (analysis.funcionarios_distintos || 0) * 100).toFixed(2) + '%' : '0%'
    };
    
    res.json({
      success: true,
      data: {
        analise_bruta: analysis,
        impacto_duplicacoes: duplicateImpact,
        interpretacao: {
          suspeita_duplicacao: (analysis.total_registros_brutos || 0) > (analysis.funcionarios_distintos || 0),
          multiplos_cpf_empresas: (analysis.funcionarios_multiplas_empresas || 0) > 0,
          historico_readmissoes: (analysis.funcionarios_multiplas_admissoes || 0) > 0,
          recomendacao: duplicateImpact.registros_vs_distintos > 100 ? 
            'ATENÇÃO: Diferença significativa detectada - possível duplicação' :
            'Diferença normal - DISTINCT funcionando corretamente'
        }
      }
    });

  } catch (error) {
    console.error('❌ Erro na análise de duplicações:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Erro na análise de duplicações',
      message: error.message
    });
  }
});

// GET endpoint to fetch single employee for analysis
router.get('/sample-employee', async (req, res) => {
  try {
    console.log('🔍 Buscando funcionário único da tabela r034fun para análise...');
    
    const SENIOR_API_URL = process.env.SENIOR_API_URL || "https://api-senior.tecnologiagrupoopus.com.br";
    const SENIOR_API_KEY = process.env.SENIOR_API_KEY;
    const MSSQL_DB = process.env.MSSQL_DB || "opus_hcm_221123";

    if (!SENIOR_API_KEY) {
      return res.status(401).json({
        success: false,
        error: 'API key não configurada'
      });
    }

    // Query para buscar um funcionário único com todos os campos
    const sampleQuery = `
      SELECT TOP 1 *
      FROM [${MSSQL_DB}].dbo.r034fun 
      WHERE numemp IN (1,6,8,9,10,11,13) 
      AND TIPCOL IN (1,3,5)
      ORDER BY datadm DESC
    `;
    
    console.log('📝 Executando query para funcionário único:', sampleQuery);
    
    const response = await fetch(`${SENIOR_API_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": SENIOR_API_KEY
      },
      body: JSON.stringify({ sqlText: sampleQuery })
    });
    
    if (!response.ok) {
      throw new Error(`Erro na API Senior: ${response.status}`);
    }
    
    const apiResult = await response.json();
    console.log('✅ Funcionário único encontrado:', apiResult?.length || 0, 'registro(s)');
    
    res.json({
      success: true,
      data: apiResult?.[0] || null,
      query: sampleQuery
    });

  } catch (error) {
    console.error('❌ Erro ao buscar funcionário único:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar funcionário único',
      message: error.message
    });
  }
});

// GET endpoint to fetch all companies
router.get('/companies', async (req, res) => {
  console.log('❌ Endpoint removido - dados hardcoded não permitidos');
  res.status(410).json({
    success: false,
    error: 'Endpoint descontinuado',
    message: 'Dados de empresas devem vir apenas da API Senior'
  });
});

// GET endpoint to fetch all divisions
router.get('/divisions', async (req, res) => {
  console.log('❌ Endpoint removido - dados hardcoded não permitidos');
  res.status(410).json({
    success: false,
    error: 'Endpoint descontinuado',
    message: 'Dados de divisões devem vir apenas da API Senior'
  });
});

// GET endpoint to fetch employee status types
router.get('/employee-status', async (req, res) => {
  console.log('❌ Endpoint removido - dados locais não permitidos');
  res.status(410).json({
    success: false,
    error: 'Endpoint descontinuado',
    message: 'Dados de status devem vir apenas da API Senior'
  });
});

// Existing endpoints...
router.post('/execute-query', async (req, res) => {
  try {
    const { query } = req.body;
    logRequest(query, false); // Always log as 401 for existing endpoints
    
    res.status(401).json({
      success: false,
      error: 'Endpoint em desenvolvimento',
      message: 'Dados disponíveis via endpoints específicos'
    });
  } catch (error) {
    console.error('❌ Erro no execute-query:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: error.message
    });
  }
});

router.get('/active-employees', async (req, res) => {
  console.log('❌ Endpoint removido - use /estatisticas para dados reais da API Senior');
  res.status(410).json({
    success: false,
    error: 'Endpoint descontinuado',
    message: 'Use /estatisticas para obter dados reais da API Senior'
  });
});

router.get('/turnover-chart', async (req, res) => {
  console.log('❌ Endpoint removido - dados mock não permitidos');
  res.status(410).json({
    success: false,
    error: 'Endpoint descontinuado',
    message: 'Endpoint com dados fictícios foi removido - use apenas dados reais da API Senior'
  });
});

// GET endpoint para funcionários filtrados
router.get('/funcionarios', async (req, res) => {
  try {
    console.log('👥 Buscando funcionários com filtros...');
    console.log('🔍 Query params:', req.query);
    
    const { 
      empresas = '', 
      divisoes = '', 
      status = '', 
      months = '', 
      years = '' 
    } = req.query;

    // Construir condições WHERE dinamicamente
    let whereConditions = [];
    let params = [];
    let paramCount = 0;
    
    // Filtro por empresas
    if (empresas && empresas !== '') {
      const empresaIds = empresas.split(',').filter(id => id.trim() !== '');
      if (empresaIds.length > 0) {
        const placeholders = empresaIds.map(() => `$${++paramCount}`).join(',');
        whereConditions.push(`f.codigo_empresa IN (${placeholders})`);
        params.push(...empresaIds.map(id => parseInt(id)));
      }
    }
    
    // Filtro por divisões  
    if (divisoes && divisoes !== '') {
      const divisaoIds = divisoes.split(',').filter(id => id.trim() !== '');
      if (divisaoIds.length > 0) {
        const placeholders = divisaoIds.map(() => `$${++paramCount}`).join(',');
        whereConditions.push(`f.codigo_divisao IN (${placeholders})`);
        params.push(...divisaoIds.map(id => parseInt(id)));
      }
    }
    
    // Filtro por status
    if (status && status !== '' && status !== 'todos') {
      const statusIds = status.split(',').filter(id => id.trim() !== '' && id !== 'todos');
      if (statusIds.length > 0) {
        const placeholders = statusIds.map(() => `$${++paramCount}`).join(',');
        whereConditions.push(`f.codigo_situacao IN (${placeholders})`);
        params.push(...statusIds.map(id => parseInt(id)));
      }
    }
    
    // Filtro por data (anos e meses)
    if (years && years !== '') {
      const yearsList = years.split(',').filter(y => y.trim() !== '');
      if (yearsList.length > 0) {
        const yearConditions = yearsList.map(() => `EXTRACT(YEAR FROM f.data_admissao) = $${++paramCount}`);
        whereConditions.push(`(${yearConditions.join(' OR ')})`);
        params.push(...yearsList.map(y => parseInt(y)));
      }
    }
    
    if (months && months !== '') {
      const monthsList = months.split(',').filter(m => m.trim() !== '');
      if (monthsList.length > 0) {
        const monthConditions = monthsList.map(() => `EXTRACT(MONTH FROM f.data_admissao) = $${++paramCount}`);
        whereConditions.push(`(${monthConditions.join(' OR ')})`);
        params.push(...monthsList.map(m => parseInt(m)));
      }
    }
    
    // Query com JOINs
    const query = `
      SELECT 
        f.*,
        c.razao_social,
        c.nome_fantasia,
        d.nome_divisao,
        es.descricao_situacao,
        es.tipo_situacao
      FROM funcionarios f
      LEFT JOIN companies c ON f.codigo_empresa = c.codigo_empresa
      LEFT JOIN divisions d ON f.codigo_divisao = d.codigo_divisao  
      LEFT JOIN employee_status es ON f.codigo_situacao = es.codigo_situacao
      ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''}
      ORDER BY f.nome;
    `;

    console.log('📝 Executando query:', query);
    console.log('📋 Parâmetros:', params);
    
    const result = await sql(query, params);
    
    console.log(`✅ ${result.length} funcionários encontrados`);
    
    res.json({
      success: true,
      data: result,
      filters: { empresas, divisoes, status, months, years },
      count: result.length
    });

  } catch (error) {
    console.error('❌ Erro ao buscar funcionários:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar funcionários',
      message: error.message
    });
  }
});

// GET endpoint para estatísticas filtradas
router.get('/estatisticas', async (req, res) => {
  // 🏢 DEFINIÇÃO DAS EMPRESAS PADRÃO (disponível para fallback)
  // Empresas selecionadas: 1=Opus Consultoria, 6=Telos, 8=Opus Serviços, 
  // 9=Opus Logística, 10=Opus Manutenção, 11=Atenas, 13=Acelera IT
  const empresasDefault = [1, 6, 8, 9, 10, 11, 13];
  
  try {
    console.log('📊 Buscando estatísticas com filtros...');
    console.log('🔍 Query params:', req.query);
    
    const { 
      empresas = '', 
      divisoes = '', 
      status = '', 
      months = '', 
      years = '' 
    } = req.query;

    // Extrair variáveis individuais para usar na query  
    const yearsList = years ? years.split(',').filter(y => y.trim() !== '').map(y => parseInt(y.trim())) : [];
    const monthsList = months ? months.split(',').filter(m => m.trim() !== '').map(m => parseInt(m.trim())) : [];
    const year = yearsList.length > 0 ? yearsList[0] : new Date().getFullYear();
    const month = monthsList.length > 0 ? monthsList[0] : new Date().getMonth() + 1;

    // Usar mesma lógica de filtros (SQL Server - valores diretos)
    let whereConditions = [];
    
    if (empresas && empresas !== '') {
      const empresaIds = empresas.split(',').filter(id => id.trim() !== '');
      if (empresaIds.length > 0) {
        const empresaValues = empresaIds.map(id => parseInt(id)).join(',');
        whereConditions.push(`f.codigo_empresa IN (${empresaValues})`);
      }
    }
    
    if (divisoes && divisoes !== '') {
      const divisaoIds = divisoes.split(',').filter(id => id.trim() !== '');
      if (divisaoIds.length > 0) {
        const divisaoValues = divisaoIds.map(id => parseInt(id)).join(',');
        whereConditions.push(`f.codigo_divisao IN (${divisaoValues})`);
      }
    }
    
    if (status && status !== '' && status !== 'todos') {
      const statusIds = status.split(',').filter(id => id.trim() !== '' && id !== 'todos');
      if (statusIds.length > 0) {
        const statusValues = statusIds.map(id => parseInt(id)).join(',');
        whereConditions.push(`f.codigo_situacao IN (${statusValues})`);
      }
    }
    
    // Integração real com API Senior usando infraestrutura existente
    console.log('📊 Consultando API Senior real para estatísticas...');
    
    const SENIOR_API_URL = process.env.SENIOR_API_URL || "https://api-senior.tecnologiagrupoopus.com.br";
    const SENIOR_API_KEY = process.env.SENIOR_API_KEY;
    const MSSQL_DB = process.env.MSSQL_DB || 'opus_hcm_221123';
    
    if (!SENIOR_API_KEY) {
      console.error('❌ SENIOR_API_KEY não configurada');
      res.status(500).json({
        success: false,
        error: 'SENIOR_API_KEY não configurada',
        message: 'Configuração da API Senior necessária para obter dados reais'
      });
      return;
    }

    // Fazer requisição real para API Senior
    try {
      
      // Reutilizar condições WHERE já construídas (incluindo status e divisões)
      let whereConditions = [];
      
      // Aplicar filtro de anos e meses - lógica correta para intersecção de período
      if (years && years !== '') {
        const yearsList = years.split(',')
          .filter(y => y.trim() !== '')
          .map(y => parseInt(y.trim()))
          .filter(year => !isNaN(year) && year > 1900 && year <= new Date().getFullYear() + 10); // Validação de anos
        
        if (yearsList.length > 0) {
          if (months && months !== '') {
            // Filtro combinado: anos + meses específicos
            const monthsList = months.split(',')
              .filter(m => m.trim() !== '')
              .map(m => parseInt(m.trim()))
              .filter(month => !isNaN(month) && month >= 1 && month <= 12); // Validação de meses
            
            if (monthsList.length > 0) {
              const periodConditions = [];
              for (const year of yearsList) {
                for (const month of monthsList) {
                  // Para cada combinação ano/mês, verificar intersecção do período de emprego
                  const startOfMonth = `DATEFROMPARTS(${year},${month},1)`;
                  const endOfMonth = `EOMONTH(DATEFROMPARTS(${year},${month},1))`;
                  periodConditions.push(
                    `(datadm <= ${endOfMonth} AND (datafa IS NULL OR datafa = '1900-12-31 00:00:00' OR datafa >= ${startOfMonth}))`
                  );
                }
              }
              whereConditions.push(`(${periodConditions.join(' OR ')})`);
            } else {
              // Apenas anos, sem meses específicos
              const yearConditions = yearsList.map(year => 
                `(datadm <= DATEFROMPARTS(${year},12,31) AND (datafa IS NULL OR datafa = '1900-12-31 00:00:00' OR datafa >= DATEFROMPARTS(${year},1,1)))`
              ).join(' OR ');
              whereConditions.push(`(${yearConditions})`);
            }
          } else {
            // Apenas anos, sem meses
            const yearConditions = yearsList.map(year => 
              `(datadm <= DATEFROMPARTS(${year},12,31) AND (datafa IS NULL OR datafa = '1900-12-31 00:00:00' OR datafa >= DATEFROMPARTS(${year},1,1)))`
            ).join(' OR ');
            whereConditions.push(`(${yearConditions})`);
          }
        }
      }
      
      // Aplicar filtro de empresas usando numemp (número da empresa)
      if (empresas && empresas !== '') {
        const empresasList = empresas.split(',')
          .filter(e => e.trim() !== '')
          .map(e => parseInt(e.trim()))
          .filter(emp => !isNaN(emp) && emp > 0); // Validação de empresas
        
        if (empresasList.length > 0) {
          whereConditions.push(`numemp IN (${empresasList.join(',')})`);
          console.log('🏢 Aplicando filtro de empresas:', empresasList);
        }
      } else {
        // NÃO aplicar filtro de empresas no WHERE - cada métrica usa sua lógica específica
        console.log('🏢 Usando filtros padronizados: todas as 7 empresas para funcionários ativos E contratações');
      }

      // Aplicar filtros de status e divisões (CRITICAL: estavam sendo ignorados!)
      if (status && status !== '' && status !== 'todos') {
        const statusIds = status.split(',').filter(id => id.trim() !== '' && id !== 'todos');
        if (statusIds.length > 0) {
          // Mapear para valores de sitafa baseado nos códigos de status
          const sitafaValues = statusIds.map(id => {
            switch(parseInt(id)) {
              case 1: return 1; // Ativo
              case 2: return 7; // Demitido  
              case 3: return 2; // Afastado
              case 4: return 3; // Férias
              case 5: return 4; // Licença
              case 6: return 8; // Aposentado
              default: return 1;
            }
          });
          whereConditions.push(`sitafa IN (${sitafaValues.join(',')})`);
          console.log('📊 Aplicando filtro de status (sitafa):', sitafaValues);
        }
      }

      if (divisoes && divisoes !== '') {
        // NOTA: divisões não estão mapeadas na r034fun, por isso não aplicamos esse filtro aqui
        // A filtragem de divisões deve ser feita no frontend após obter os dados
        console.log('🏢 Filtro de divisões será aplicado no frontend (não disponível em r034fun)');
      }
      
      // Construir cláusula WHERE
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
      
      // 🎯 FILTROS UNIFICADOS: Usando as mesmas 7 empresas para todos os dashboards
      // (empresasDefault já definido no escopo da função)
      
      // ✅ PADRONIZAÇÃO: Mesmos filtros para funcionários ativos E contratações/demissões
      const empresasAtivosDefault = empresasDefault; 
      const empresasContratacaoDefault = empresasDefault;
      
      let empresasAtivosList, empresasContratacoesList;
      
      if (empresas && empresas !== '') {
        // Sanitizar entrada do usuário - apenas números válidos
        const empresasSanitizadas = empresas.split(',')
          .filter(e => e.trim() !== '')
          .map(e => parseInt(e.trim()))
          .filter(emp => !isNaN(emp) && emp > 0 && emp <= 999); // Validação robusta
        
        empresasAtivosList = empresasSanitizadas;
        empresasContratacoesList = empresasSanitizadas;
      } else {
        empresasAtivosList = empresasAtivosDefault;
        empresasContratacoesList = empresasContratacaoDefault;
      }
      
      const empresasAtivos = empresasAtivosList.join(',');
      const empresasContratacoes = empresasContratacoesList.join(',');
      
      // 🎯 IMPLEMENTANDO LÓGICA DAX EXATA DO BI
      // Data de referência para cálculos (usar a data máxima do filtro)
      const dataReferencia = months && years ? 
        `EOMONTH(DATEFROMPARTS(${year}, ${month}, 1))` :
        years && years !== '' ?
          `DATEFROMPARTS(${year}, 12, 31)` :
          `GETDATE()`;
      
      // 🎯 QUERY ULTRA-SIMPLIFICADA: Buscar apenas dados brutos
      const realQuery = `
        SELECT 
          numemp, TIPCOL, numcad, numcpf, 
          datadm, datafa, sitafa, motafa, tipsex, valsal
        FROM [${MSSQL_DB}].dbo.r034fun
        WHERE TIPCOL IN (1,3,5) AND numemp IN (${empresasAtivos})
      `;
      
      console.log('📝 Executando query real na tabela r034fun:', realQuery);
      
      const response = await fetch(`${SENIOR_API_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": SENIOR_API_KEY,
        },
        body: JSON.stringify({ sqlText: realQuery }),
      });
      
      if (!response.ok) {
        console.log(`⚠️ API Senior falhou (${response.status}), tentando fallback local...`);
        throw new Error(`API Senior retornou erro: ${response.status} ${response.statusText}`);
      }
      
      const apiResult = await response.json();
      console.log('📊 Resultado real da API Senior (r034fun):', apiResult);
      
      // 🎯 PROCESSAMENTO DAX NO NODE.JS com dados brutos
      console.log('📊 Processando dados brutos da API Senior...');
      
      if (!apiResult || !Array.isArray(apiResult)) {
        throw new Error('API Senior não retornou dados válidos');
      }
      
      console.log(`📝 Registros obtidos: ${apiResult.length}`);
      
      // 🎯 IMPLEMENTAR LÓGICA DAX: Contratados - Demitidos - Transferidos
      const dataRef = new Date(year || new Date().getFullYear(), 11, 31); // 31 dez do ano
      
      // Criar chave única para cada funcionário
      const funcionarios = new Map();
      
      for (const row of apiResult) {
        const chave = `${row.numemp}-${row.TIPCOL}-${row.numcad}-${row.numcpf}`;
        const datadm = row.datadm ? new Date(row.datadm) : null;
        const datafa = row.datafa && row.datafa !== '1900-12-31T00:00:00.000Z' ? new Date(row.datafa) : null;
        
        funcionarios.set(chave, {
          numemp: row.numemp,
          TIPCOL: row.TIPCOL,
          numcad: row.numcad,
          numcpf: row.numcpf,
          datadm,
          datafa,
          sitafa: row.sitafa,
          motafa: row.motafa,
          tipsex: row.tipsex,
          valsal: parseFloat(row.valsal) || 0
        });
      }
      
      // 🎯 APLICAR LÓGICA DAX
      let totalContratados = 0;
      let funcionariosDemitidos = 0;
      let funcionariosTransferidos = 0;
      let masculino = 0;
      let feminino = 0;
      let salarios = [];
      let contratacoesPeriodo = 0;
      let demissoesPeriodo = 0;
      
      for (const [chave, funcionario] of funcionarios) {
        // 1. Total contratados até data de referência
        if (funcionario.datadm && funcionario.datadm <= dataRef) {
          totalContratados++;
          
          if (funcionario.tipsex === 'M') masculino++;
          if (funcionario.tipsex === 'F') feminino++;
          if (funcionario.valsal > 0) salarios.push(funcionario.valsal);
        }
        
        // 2. Funcionários demitidos (sitafa=7 AND motafa<>6)
        if (funcionario.sitafa === 7 && 
            funcionario.datafa && funcionario.datafa <= dataRef &&
            (funcionario.motafa !== 6)) {
          funcionariosDemitidos++;
        }
        
        // 3. Funcionários transferidos (sitafa=7 AND motafa=6)
        if (funcionario.sitafa === 7 && 
            funcionario.datafa && funcionario.datafa <= dataRef &&
            funcionario.motafa === 6) {
          funcionariosTransferidos++;
        }
        
        // 4. Contratações no período
        if (funcionario.datadm && 
            funcionario.datadm.getFullYear() === (year || new Date().getFullYear())) {
          contratacoesPeriodo++;
        }
        
        // 5. Demissões no período
        if (funcionario.datafa && 
            funcionario.datafa.getFullYear() === (year || new Date().getFullYear())) {
          demissoesPeriodo++;
        }
      }
      
      // 🏆 CÁLCULO FINAL DAX: Contratados - Demitidos - Transferidos
      const funcionariosAtivosDAX = totalContratados - funcionariosDemitidos - funcionariosTransferidos;
      const salarioMedio = salarios.length > 0 ? 
        salarios.reduce((a, b) => a + b, 0) / salarios.length : 0;
      
      console.log('🎯 CÁLCULO DAX REALIZADO:');
      console.log(`   Total Contratados até ${dataRef.toISOString().split('T')[0]}: ${totalContratados}`);
      console.log(`   Funcionários Demitidos (sitafa=7, motafa<>6): ${funcionariosDemitidos}`);
      console.log(`   Funcionários Transferidos (sitafa=7, motafa=6): ${funcionariosTransferidos}`);
      console.log(`   ✅ FUNCIONÁRIOS ATIVOS DAX = ${funcionariosAtivosDAX}`);
      console.log(`   📊 Comparação com BI: ${funcionariosAtivosDAX} vs 3304 (diferença: ${funcionariosAtivosDAX - 3304})`);
      
      // Converter para formato esperado pelo frontend
      const stats = {
        total_funcionarios: funcionarios.size.toString(),
        funcionarios_ativos: funcionariosAtivosDAX.toString(),
        funcionarios_demitidos: funcionariosDemitidos.toString(),
        funcionarios_transferidos: funcionariosTransferidos.toString(),
        total_contratados_ate_data: totalContratados.toString(),
        masculino: masculino.toString(),
        feminino: feminino.toString(),
        salario_medio: salarioMedio.toFixed(2),
        contratacoes_6meses: '0', // TODO: Implementar lógica de 6 meses
        contratacoes_periodo: contratacoesPeriodo.toString(),
        demissoes_periodo: demissoesPeriodo.toString()
      };

      console.log('✅ Estatísticas REAIS da API Senior (tabela r034fun):', stats);
      
      res.json({
        success: true,
        data: stats,
        filters: { empresas, divisoes, status, months, years },
        source: 'api_senior_r034fun'
      });
      return;
      
    } catch (error) {
      console.error('❌ Erro ao consultar API Senior:', error.message);
      res.status(500).json({
        success: false,
        error: 'API Senior indisponível',
        message: 'Não é possível obter dados - API Senior não está acessível'
      });
      return;
    }
    
    res.json({
      success: true,
      data: stats,
      filters: { empresas, divisoes, status, months, years }
    });

  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
      message: error.message
    });
  }
});

// GET endpoint para dados de divisões filtrados
router.get('/divisoes-dados', async (req, res) => {
  try {
    console.log('🏢 Buscando dados de divisões com filtros...');
    
    const { 
      empresas = '', 
      status = '', 
      months = '', 
      years = '' 
    } = req.query;

    let whereConditions = [];
    let params = [];
    let paramCount = 0;
    
    if (empresas && empresas !== '') {
      const empresaIds = empresas.split(',').filter(id => id.trim() !== '');
      if (empresaIds.length > 0) {
        const placeholders = empresaIds.map(() => `$${++paramCount}`).join(',');
        whereConditions.push(`f.codigo_empresa IN (${placeholders})`);
        params.push(...empresaIds.map(id => parseInt(id)));
      }
    }
    
    if (status && status !== '' && status !== 'todos') {
      const statusIds = status.split(',').filter(id => id.trim() !== '' && id !== 'todos');
      if (statusIds.length > 0) {
        const placeholders = statusIds.map(() => `$${++paramCount}`).join(',');
        whereConditions.push(`f.codigo_situacao IN (${placeholders})`);
        params.push(...statusIds.map(id => parseInt(id)));
      }
    }
    
    const query = `
      SELECT 
        d.nome_divisao as divisao,
        COUNT(f.id) as quantidade,
        ROUND(COUNT(f.id) * 100.0 / NULLIF(
          (SELECT COUNT(*) FROM funcionarios f2 
           LEFT JOIN companies c2 ON f2.codigo_empresa = c2.codigo_empresa
           LEFT JOIN divisions d2 ON f2.codigo_divisao = d2.codigo_divisao
           LEFT JOIN employee_status es2 ON f2.codigo_situacao = es2.codigo_situacao
           ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ').replace(/f\./g, 'f2.') : ''}
          ), 0
        ), 1) as percentual
      FROM divisions d
      LEFT JOIN funcionarios f ON d.codigo_divisao = f.codigo_divisao
      LEFT JOIN companies c ON f.codigo_empresa = c.codigo_empresa
      LEFT JOIN employee_status es ON f.codigo_situacao = es.codigo_situacao
      ${whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''}
      GROUP BY d.codigo_divisao, d.nome_divisao
      HAVING COUNT(f.id) > 0
      ORDER BY quantidade DESC;
    `;

    console.log('📝 Executando query de divisões:', query);
    
    const result = await sql(query, params);
    
    console.log(`✅ ${result.length} divisões com funcionários encontradas`);
    
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Erro ao buscar dados de divisões:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar dados de divisões',
      message: error.message
    });
  }
});

// GET endpoint para investigar empresas reais na base de dados
router.get('/investigar-empresas-reais', async (req, res) => {
  try {
    console.log('🔍 Investigando empresas reais na base r034fun...');
    
    const SENIOR_API_URL = process.env.SENIOR_API_URL || "https://api-senior.tecnologiagrupoopus.com.br";
    const SENIOR_API_KEY = process.env.SENIOR_API_KEY;
    const MSSQL_DB = process.env.MSSQL_DB || 'opus_hcm_221123';
    
    if (!SENIOR_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'SENIOR_API_KEY não configurada'
      });
    }

    // Investigar empresas que realmente existem na r034fun
    const queryEmpresasReais = `
      SELECT 
        numemp,
        COUNT(DISTINCT CONCAT(numemp, TIPCOL, numcad, numcpf)) as total_funcionarios,
        COUNT(DISTINCT CASE WHEN TIPCOL IN (1,3,5) THEN CONCAT(numemp, TIPCOL, numcad, numcpf) END) as funcionarios_ativos,
        COUNT(DISTINCT CASE WHEN datafa IS NULL OR datafa = '1900-12-31 00:00:00' THEN CONCAT(numemp, TIPCOL, numcad, numcpf) END) as funcionarios_ainda_ativos
      FROM [${MSSQL_DB}].dbo.r034fun 
      WHERE (datadm <= DATEFROMPARTS(2025,1,31)) 
      AND (datafa IS NULL OR datafa = '1900-12-31 00:00:00' OR datafa > DATEFROMPARTS(2025,1,31))
      GROUP BY numemp
      ORDER BY numemp
    `;

    // Verificar especificamente empresa 4
    const queryEmpresa4 = `
      SELECT 
        COUNT(*) as total_registros,
        COUNT(DISTINCT CONCAT(numemp, TIPCOL, numcad, numcpf)) as funcionarios_unicos,
        COUNT(DISTINCT CASE WHEN TIPCOL IN (1,3,5) THEN CONCAT(numemp, TIPCOL, numcad, numcpf) END) as funcionarios_ativos,
        MIN(datadm) as primeira_admissao,
        MAX(datadm) as ultima_admissao,
        COUNT(CASE WHEN datafa IS NOT NULL AND datafa != '1900-12-31 00:00:00' THEN 1 END) as com_demissao,
        COUNT(CASE WHEN datafa IS NULL OR datafa = '1900-12-31 00:00:00' THEN 1 END) as sem_demissao
      FROM [${MSSQL_DB}].dbo.r034fun 
      WHERE numemp = 4
    `;

    console.log('📝 Executando investigações...');
    
    const promises = [
      fetch(`${SENIOR_API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": SENIOR_API_KEY },
        body: JSON.stringify({ sqlText: queryEmpresasReais }),
      }),
      fetch(`${SENIOR_API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": SENIOR_API_KEY },
        body: JSON.stringify({ sqlText: queryEmpresa4 }),
      })
    ];

    const responses = await Promise.all(promises);
    const results = await Promise.all(responses.map(r => r.json()));

    console.log('🔍 Resultados das investigações:', results);

    res.json({
      success: true,
      data: {
        empresas_com_funcionarios_janeiro: results[0],
        detalhes_empresa_4: results[1]
      },
      observacoes: {
        objetivo: "Descobrir quais empresas realmente existem e por que empresa 4 retorna zeros",
        problema: "Empresa 4 está retornando todos os valores zerados nos filtros"
      }
    });

  } catch (error) {
    console.error('❌ Erro ao investigar empresas:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET endpoint para investigar valores de sitafa e TIPCOL em Janeiro
router.get('/investigar-campos-janeiro', async (req, res) => {
  try {
    console.log('🔍 Investigando valores de sitafa e TIPCOL para Janeiro 2025...');
    
    const SENIOR_API_URL = process.env.SENIOR_API_URL || "https://api-senior.tecnologiagrupoopus.com.br";
    const SENIOR_API_KEY = process.env.SENIOR_API_KEY;
    const MSSQL_DB = process.env.MSSQL_DB || 'opus_hcm_221123';
    
    if (!SENIOR_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'SENIOR_API_KEY não configurada'
      });
    }

    const empresasReais = [1,2,3,4,5,6,7,8,9,10,11,12,13];

    // Investigar valores distintos de sitafa e TIPCOL para o período
    const queryInvestigacao = `
      SELECT 
        sitafa,
        TIPCOL,
        COUNT(DISTINCT CONCAT(numemp, TIPCOL, numcad, codccu, numcpf)) as quantidade_funcionarios
      FROM [${MSSQL_DB}].dbo.r034fun 
      WHERE (datadm <= DATEFROMPARTS(2025,1,31)) 
      AND (datafa IS NULL OR datafa = '1900-12-31 00:00:00' OR datafa > DATEFROMPARTS(2025,1,31))
      AND numemp IN (${empresasReais.join(',')})
      GROUP BY sitafa, TIPCOL
      ORDER BY quantidade_funcionarios DESC
    `;

    // Total geral de funcionários no final de janeiro
    const queryTotalGeral = `
      SELECT 
        COUNT(DISTINCT CONCAT(numemp, TIPCOL, numcad, codccu, numcpf)) as total_funcionarios_janeiro
      FROM [${MSSQL_DB}].dbo.r034fun 
      WHERE (datadm <= DATEFROMPARTS(2025,1,31)) 
      AND (datafa IS NULL OR datafa = '1900-12-31 00:00:00' OR datafa > DATEFROMPARTS(2025,1,31))
      AND numemp IN (${empresasReais.join(',')})
    `;

    // Testar incluindo TIPCOL IN (1,3,5) baseado nos logs anteriores
    const queryTipcol135 = `
      SELECT 
        COUNT(DISTINCT CONCAT(numemp, TIPCOL, numcad, codccu, numcpf)) as funcionarios_tipcol_135
      FROM [${MSSQL_DB}].dbo.r034fun 
      WHERE (datadm <= DATEFROMPARTS(2025,1,31)) 
      AND (datafa IS NULL OR datafa = '1900-12-31 00:00:00' OR datafa > DATEFROMPARTS(2025,1,31))
      AND numemp IN (${empresasReais.join(',')})
      AND TIPCOL IN (1,3,5)
    `;

    console.log('📝 Executando investigações...');
    
    const promises = [
      fetch(`${SENIOR_API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": SENIOR_API_KEY },
        body: JSON.stringify({ sqlText: queryInvestigacao }),
      }),
      fetch(`${SENIOR_API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": SENIOR_API_KEY },
        body: JSON.stringify({ sqlText: queryTotalGeral }),
      }),
      fetch(`${SENIOR_API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": SENIOR_API_KEY },
        body: JSON.stringify({ sqlText: queryTipcol135 }),
      })
    ];

    const responses = await Promise.all(promises);
    const results = await Promise.all(responses.map(r => r.json()));

    console.log('🔍 Resultados das investigações:', results);

    res.json({
      success: true,
      data: {
        distribucao_sitafa_tipcol: results[0],
        total_funcionarios_janeiro: results[1],
        funcionarios_tipcol_135: results[2]
      },
      observacoes: {
        objetivo: "Descobrir qual combinação de sitafa + TIPCOL resulta em 2394 funcionários (alvo do BI)",
        BI_esperado: 2394,
        atual_sitafa_1: 1257
      }
    });

  } catch (error) {
    console.error('❌ Erro ao investigar campos:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET endpoint para testar lógicas diferentes de funcionários ativos
router.get('/teste-logicas-janeiro', async (req, res) => {
  try {
    console.log('🧪 Testando diferentes lógicas para Janeiro 2025...');
    
    const SENIOR_API_URL = process.env.SENIOR_API_URL || "https://api-senior.tecnologiagrupoopus.com.br";
    const SENIOR_API_KEY = process.env.SENIOR_API_KEY;
    const MSSQL_DB = process.env.MSSQL_DB || 'opus_hcm_221123';
    
    if (!SENIOR_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'SENIOR_API_KEY não configurada'
      });
    }

    const empresasReais = [1,2,3,4,5,6,7,8,9,10,11,12,13];

    // LÓGICA 1: Intersecção com período (nossa lógica atual)
    const queryInterseccao = `
      SELECT 
        COUNT(DISTINCT CONCAT(numemp, TIPCOL, numcad, codccu, numcpf)) as total_funcionarios,
        COUNT(DISTINCT CASE WHEN sitafa = 1 THEN CONCAT(numemp, TIPCOL, numcad, codccu, numcpf) END) as funcionarios_ativos
      FROM [${MSSQL_DB}].dbo.r034fun 
      WHERE ((datadm <= EOMONTH(DATEFROMPARTS(2025,1,1)) AND (datafa IS NULL OR datafa = '1900-12-31 00:00:00' OR datafa >= DATEFROMPARTS(2025,1,1))))
      AND numemp IN (${empresasReais.join(',')})
    `;

    // LÓGICA 2: Ativos no final do período (31/01/2025)
    const queryFinalPeriodo = `
      SELECT 
        COUNT(DISTINCT CONCAT(numemp, TIPCOL, numcad, codccu, numcpf)) as total_funcionarios,
        COUNT(DISTINCT CASE WHEN sitafa = 1 THEN CONCAT(numemp, TIPCOL, numcad, codccu, numcpf) END) as funcionarios_ativos
      FROM [${MSSQL_DB}].dbo.r034fun 
      WHERE (datadm <= DATEFROMPARTS(2025,1,31)) 
      AND (datafa IS NULL OR datafa = '1900-12-31 00:00:00' OR datafa > DATEFROMPARTS(2025,1,31))
      AND numemp IN (${empresasReais.join(',')})
    `;

    // LÓGICA 3: Snapshot no último dia útil de janeiro
    const querySnapshot = `
      SELECT 
        COUNT(DISTINCT CONCAT(numemp, TIPCOL, numcad, codccu, numcpf)) as total_funcionarios,
        COUNT(DISTINCT CASE WHEN sitafa = 1 THEN CONCAT(numemp, TIPCOL, numcad, codccu, numcpf) END) as funcionarios_ativos
      FROM [${MSSQL_DB}].dbo.r034fun 
      WHERE (datadm <= DATEFROMPARTS(2025,1,31)) 
      AND (datafa IS NULL OR datafa = '1900-12-31 00:00:00' OR datafa >= DATEFROMPARTS(2025,2,1))
      AND numemp IN (${empresasReais.join(',')})
    `;

    console.log('📝 Testando 3 lógicas diferentes...');
    
    const promises = [
      fetch(`${SENIOR_API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": SENIOR_API_KEY },
        body: JSON.stringify({ sqlText: queryInterseccao }),
      }),
      fetch(`${SENIOR_API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": SENIOR_API_KEY },
        body: JSON.stringify({ sqlText: queryFinalPeriodo }),
      }),
      fetch(`${SENIOR_API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": SENIOR_API_KEY },
        body: JSON.stringify({ sqlText: querySnapshot }),
      })
    ];

    const responses = await Promise.all(promises);
    const results = await Promise.all(responses.map(r => r.json()));

    console.log('🔍 Resultados das 3 lógicas:', results);

    res.json({
      success: true,
      data: {
        logica_interseccao: results[0],
        logica_final_periodo: results[1], 
        logica_snapshot: results[2]
      },
      explicacao: {
        interseccao: "Funcionários que trabalharam EM ALGUM MOMENTO de janeiro",
        final_periodo: "Funcionários ativos NO FINAL de janeiro (31/01)",
        snapshot: "Funcionários ativos em janeiro que saíram apenas em fevereiro+"
      }
    });

  } catch (error) {
    console.error('❌ Erro ao testar lógicas:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET endpoint para teste da estrutura de folha baseada no documento do usuário
router.get('/teste-estrutura-folha', async (req, res) => {
  try {
    console.log('🧪 Testando estrutura de folha baseada no documento do usuário...');
    
    const SENIOR_API_URL = process.env.SENIOR_API_URL || "https://api-senior.tecnologiagrupoopus.com.br";
    const SENIOR_API_KEY = process.env.SENIOR_API_KEY;
    const MSSQL_DB = process.env.MSSQL_DB || 'opus_hcm_221123';
    
    if (!SENIOR_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'SENIOR_API_KEY não configurada'
      });
    }

    // Primeiro, descobrir quais empresas realmente existem
    const queryEmpresas = `
      SELECT DISTINCT 
        numemp as empresa, 
        COUNT(*) as registros 
      FROM [${MSSQL_DB}].dbo.r034fun 
      GROUP BY numemp 
      ORDER BY numemp
    `;
    
    console.log('📝 Consultando empresas reais na r034fun...');
    
    const responseEmpresas = await fetch(`${SENIOR_API_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": SENIOR_API_KEY,
      },
      body: JSON.stringify({ sqlText: queryEmpresas }),
    });
    
    if (!responseEmpresas.ok) {
      throw new Error(`Erro ao consultar empresas: ${responseEmpresas.status}`);
    }
    
    const empresasResult = await responseEmpresas.json();
    console.log('🏢 Empresas encontradas:', empresasResult);

    // Segundo, testar contagem usando primary key correta
    const queryPK = `
      SELECT 
        COUNT(DISTINCT CONCAT(numemp, TIPCOL, numcad, codccu, numcpf)) as funcionarios_unicos_pk,
        COUNT(*) as total_registros,
        COUNT(CASE WHEN sitafa = 1 THEN 1 END) as funcionarios_ativos,
        COUNT(DISTINCT numemp) as empresas_distintas
      FROM [${MSSQL_DB}].dbo.r034fun 
      WHERE ((datadm <= DATEFROMPARTS(2025,12,31) AND (datafa IS NULL OR datafa = '1900-12-31 00:00:00' OR datafa >= DATEFROMPARTS(2025,1,1))))
    `;
    
    console.log('📝 Testando contagem com PK correta para 2025...');
    
    const responsePK = await fetch(`${SENIOR_API_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": SENIOR_API_KEY,
      },
      body: JSON.stringify({ sqlText: queryPK }),
    });
    
    if (!responsePK.ok) {
      throw new Error(`Erro ao consultar com PK: ${responsePK.status}`);
    }
    
    const pkResult = await responsePK.json();
    console.log('🔑 Resultado da contagem com PK:', pkResult);

    res.json({
      success: true,
      data: {
        empresas_reais: empresasResult,
        contagem_pk_2025: pkResult
      },
      observacoes: {
        pk_formula: "CONCAT(numemp, TIPCOL, numcad, codccu, numcpf)",
        estrutura_baseada_em: "Documento do usuário - query da folha"
      }
    });

  } catch (error) {
    console.error('❌ Erro ao testar estrutura de folha:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Erro ao testar estrutura de folha',
      message: error.message
    });
  }
});

export default router;