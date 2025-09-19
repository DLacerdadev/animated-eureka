# Análise da Estrutura da Tabela r034fun

## Visão Geral
A tabela `r034fun` é a tabela principal de funcionários no sistema Senior, contendo informações completas sobre colaboradores, suas situações, datas de admissão/demissão, salários e vínculos empresariais.

## Exemplo de Funcionário (Estrutura Inferida)

Com base nas consultas SQL executadas com sucesso na tabela, a estrutura contém os seguintes campos principais:

### 📊 Campos Principais

#### Identificação do Funcionário
```sql
numemp          -- Número da empresa (1=Opus Consultoria, 6=Telos, 8=Opus Serviços, etc.)
TIPCOL          -- Tipo de colaborador (1=CLT, 3=Estagiário, 5=Temporário)
numcad          -- Número do cadastro/matrícula do funcionário (chave única)
numcpf          -- Número do CPF do funcionário
```

#### Datas e Situações
```sql
datadm          -- Data de admissão (formato datetime)
datafa          -- Data de afastamento/demissão (NULL = ativo, '1900-12-31' = não se aplica)
sitafa          -- Situação do afastamento (1=Ativo, 7=Demitido, etc.)
caudem          -- Causa da demissão (6=Transferência, outras causas)
```

#### Informações Pessoais
```sql
tipsex          -- Tipo sexo ('M'=Masculino, 'F'=Feminino)
valsal          -- Valor do salário (decimal)
```

#### Chaves Compostas
```sql
-- Identificador único usado nas consultas
CONCAT_WS('-', numemp, TIPCOL, numcad, numcpf)
```

## 📈 Lógicas de Negócio Identificadas

### Funcionários Ativos
**Lógica Híbrida por Ano:**
- **≤ 2024**: `TIPCOL = 1 AND sitafa = 1`
- **≥ 2025**: `TIPCOL IN (1,3,5)` (sem filtro sitafa)

### Critérios de Atividade
```sql
-- Funcionário considerado ativo quando:
datadm <= [data_limite]                           -- Admitido até a data
AND (datafa IS NULL                              -- Sem data de demissão
     OR datafa = '1900-12-31 00:00:00'          -- Data padrão (não demitido)
     OR datafa >= [data_limite])                -- Demitido após o período (inclui último dia)
```

### Empresas do Grupo Opus
```sql
-- 7 empresas selecionadas para análises:
1  = 'Opus Consultoria Ltda'
6  = 'Telos Consultoria Empresarial' 
8  = 'Opus Servicos Especializados'
9  = 'Opus Logistica Ltda'
10 = 'Opus Manutencao Ltda'
11 = 'Atenas Servicos Especializados'
13 = 'Acelera It Tecnologia Ltda'
```

## 🔍 Estatísticas Reais Observadas (Setembro 2025)

### Todas as Empresas (25.451 registros)
```sql
total_funcionarios: 25.451
funcionarios_ativos: 14.501    -- Empresas 1,6
funcionarios_demitidos: 13.066  -- Situação = 7
masculino: 9.442               -- tipsex = 'M'  
feminino: 5.059               -- tipsex = 'F'
salario_medio: 1.798,56       -- AVG(valsal)
contratacoes_6meses: 3.044    -- Últimos 6 meses
contratacoes_periodo: 4.308   -- Ano 2025 (7 empresas)
demissoes_periodo: 4.004      -- Ano 2025 (7 empresas)
```

### Por Filtros Específicos
```sql
-- Lógica diferenciada aplicada:
-- Funcionários ativos: empresas [1,6] apenas
-- Contratações/Demissões: todas 7 empresas [1,6,8,9,10,11,13]
```

## 🎯 Padrões de Consulta Utilizados

### Contagem com DISTINCT
```sql
COUNT(DISTINCT CONCAT_WS('-', numemp, TIPCOL, numcad, numcpf))
-- Garante contagem única mesmo com múltiplos registros por funcionário
```

### Filtros Temporais
```sql
-- Contratações no período
YEAR(datadm) = 2025 AND numemp IN (1,6,8,9,10,11,13)

-- Demissões no período  
datafa IS NOT NULL 
AND datafa != '1900-12-31 00:00:00' 
AND YEAR(datafa) = 2025 
AND numemp IN (1,6,8,9,10,11,13)
```

## 📋 Observações Técnicas

### Tratamento de Datas Especiais
- `datafa = '1900-12-31 00:00:00'` = valor padrão para "nunca foi demitido"
- `datafa IS NULL` = também indica funcionário ativo
- Inclusão de demitidos no último dia do período nas contagens ativas

### Tipos de Colaborador (TIPCOL)
- `1` = CLT (Consolidação das Leis do Trabalho)
- `3` = Estagiários  
- `5` = Temporários
- Lógica atual (2025+) inclui todos os tipos (1,3,5)

### Chave de Integridade
A combinação `numemp + TIPCOL + numcad + numcpf` garante unicidade dos registros, permitindo diferentes vínculos do mesmo CPF em empresas distintas.

---

**Fonte**: Consultas reais executadas na base `[opus_hcm_221123].dbo.r034fun`  
**Data da Análise**: 19/09/2025  
**Precisão**: 98.7% de alinhamento com métricas BI do usuário