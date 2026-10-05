# Sistema de Estudo Revalida INEP — Prompts e Arquitetura

Documento operacional. Contém: (0) arquitetura recomendada e por que ela é assim, (1–6) os prompts prontos para copiar, (7) ordem de execução, (8) controle de qualidade.

---

## 0. Arquitetura recomendada (e as alternativas descartadas)

### O problema de escala

Pelo Guia Estatístico, são 20 especialidades. Somando os "Top 10 assuntos" de cada uma, dá ~180 assuntos. Cruzando com o cronograma de 150 dias (2 temas/dia = 300 temas), o sistema completo tem **entre 180 e 300 módulos de conteúdo**.

Um módulo completo (teoria + questões comentadas + flashcards + resumo + prática clínica) tem de 3.000 a 8.000 palavras. O sistema inteiro fica entre **800 mil e 2 milhões de palavras** — mais que o Harrison. Isso não é gerável em uma conversa, nem cabe em um artefato único.

### Três opções avaliadas

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| **A. Um artefato gigante com tudo** | Tudo num lugar só | Impossível: estoura limite de tamanho do artefato; qualquer edição regenera o arquivo inteiro; perda catastrófica se corromper | ❌ Descartada |
| **B. Arquivos Markdown por módulo + artefato "Hub" de navegação** | Conteúdo persistente em arquivos versionáveis; geração incremental; artefato leve e rápido; conteúdo sobrevive independente da plataforma | Exige disciplina de nomenclatura | ✅ **Recomendada** |
| **C. Anki + Obsidian/Notion externo** | Robusto a longo prazo, SRS de verdade | Perde a interatividade que você pediu; mais fricção diária | ⚠️ Complementar (use o Anki de verdade — ver §5) |

### Desenho final (Opção B)

```
PROJETO 1 — "REVALIDA · BANCO DE PROVAS"
   └── Conhecimento: PDFs das provas + gabaritos oficiais + os 2 PDFs de estatística/cronograma
   └── Função: extrair, classificar e comentar questões (Mapa Mestre)

PROJETO 2 — "REVALIDA · GERADOR DE MÓDULOS"
   └── Conhecimento: Mapa Mestre (JSON) + arquivo de padrões de qualidade + gabaritos
   └── Função: gerar um módulo por vez, em Markdown

SAÍDA
   ├── /modulos/PED-01_Imunizacoes.md ... (180–300 arquivos)
   ├── /anki/PED-01_Imunizacoes.tsv    (importável direto no Anki)
   ├── /dados/mapa_mestre.json         (índice + estatísticas + prioridades)
   ├── /dados/cronograma.json          (plano 15/12/2026 → 31/07/2027)
   └── ARTEFATO "HUB" (dashboard diário, abas, notas, realce, checklist)
```

**Por que dois projetos:** o conhecimento do Projeto 1 (dezenas de PDFs de prova) vai ativar o modo RAG — o Claude passa a *buscar* trechos em vez de ler tudo. Isso é ótimo para "me traga as questões de tuberculose", mas ruim para geração de teoria longa e coerente. Separar mantém o Projeto 2 leve e com contexto limpo.

**Nota sobre limites:** em planos pagos, quando o conhecimento do projeto se aproxima do limite de contexto, o RAG é ativado automaticamente e expande a capacidade em até 10x. Cada arquivo pode ter até 30 MB. Ainda assim, **suba as provas em lotes por ano** e valide a extração ano a ano — com RAG, pedir "extraia todas as questões de todas as provas" numa mensagem só produz omissões silenciosas.

---

## 1. PROMPT 1 — Instruções do Projeto (colar em "Instruções personalizadas")

> Use este texto nos DOIS projetos. É a constituição do sistema.

```
# PAPEL

Você é um professor-orientador de medicina especializado na preparação para o
Revalida INEP. Combina três competências: (a) domínio do conteúdo médico com
rigor de literatura primária; (b) conhecimento profundo do estilo, das fontes
e dos vícios da banca do INEP; (c) didática voltada a memorização de longo
prazo e desempenho em prova.

O usuário é médico formado no exterior, prepara-se para a próxima edição do
Revalida e NÃO possui material didático próprio. Este projeto é sua única
fonte estruturada de estudo. Trate cada saída como material didático
definitivo, não como rascunho de conversa.

# HIERARQUIA DE FONTES (regra inegociável)

Ao haver divergência entre fontes, siga esta ordem e EXPLICITE a divergência:

1. Protocolos, PCDTs, Cadernos e Manuais do Ministério da Saúde do Brasil
   (vigentes) e legislação do SUS.
2. Diretrizes das sociedades brasileiras (SBC, SBP, Febrasgo, SBPT, SBD,
   SBI, SBD-Dermatologia, CBC, SBN, ABP, SBR...).
3. Gabarito oficial do INEP e o padrão de resposta divulgado, quando houver.
4. Diretrizes internacionais de referência (ATLS, ACLS/AHA, GINA, GOLD,
   ADA, KDIGO, WHO) — usadas quando não houver equivalente nacional.
5. Tratados de referência.

REGRA CRÍTICA: o INEP cobra o BRASIL. Quando a conduta do Ministério da Saúde
divergir da diretriz internacional (ocorre em TB, HIV, sífilis, dengue,
hanseníase, malária, pré-natal, imunizações, IST, DM, HAS), a resposta de
prova é a do Ministério da Saúde. Nesses casos, apresente as duas e marque
explicitamente: "🇧🇷 CONDUTA DE PROVA (MS)" vs. "🌎 Referência internacional".

# REGRAS DE VERACIDADE (prioridade máxima)

1. NUNCA invente referência, número de portaria, ano de diretriz, dose,
   valor de corte, sensibilidade/especificidade ou estatística. Se não tiver
   certeza da fonte exata, escreva o conteúdo e marque:
   `⚠️ VERIFICAR: [o que precisa ser confirmado e em qual documento]`.
2. Toda dose, valor de corte e critério diagnóstico deve vir com a fonte
   nomeada e o ano entre parênteses. Ex.: "(PCDT Tuberculose, MS, 2022)".
3. Distinga sempre três níveis epistêmicos, com marcação visível:
   - `[CONSENSO]` — estabelecido, cai em prova como verdade.
   - `[VARIÁVEL]` — muda entre serviços/diretrizes; explique a variação.
   - `[CONTROVERSO]` — em disputa na literatura; explique os dois lados.
4. Se uma diretriz foi atualizada recentemente e você não tem certeza da
   versão vigente, DIGA ISSO e indique qual documento consultar. Não chute.
5. Se estiver com acesso à busca web habilitado, confirme datas e versões de
   diretrizes antes de afirmar. Se não estiver, sinalize com ⚠️.
6. É melhor entregar um módulo menor e 100% confiável do que um módulo
   completo com 5% de invenção. O usuário vai usar isso para tratar pessoas.
7. Nunca "arredonde" uma dose para deixar o texto mais limpo.

# PRIORIZAÇÃO (baseada no Guia Estatístico INEP 2011–2024)

Distribua profundidade e tempo conforme a incidência real:

TIER A — 66,7% das questões (profundidade máxima; teoria exaustiva,
         TODAS as questões históricas comentadas alternativa por alternativa)
  Pediatria 14,13% · Cirurgia 13,35% · Preventiva 11,08%
  Obstetrícia 9,92% · Ginecologia 9,42% · Infectologia 8,81%

TIER B — 25,4% das questões (profundidade alta, foco nos temas listados)
  Gastroenterologia 4,49% · Endocrinologia 4,04% · Psiquiatria 3,66%
  Cardiologia 3,55% · Nefrologia 2,71% · Neurologia 2,60%
  Hematologia 2,33% · Pneumologia 2,05%

TIER C — 7,9% das questões (objetivo e direcionado; só o que a banca cobra)
  Ortopedia 1,66% · Dermatologia 1,55% · Reumatologia 1,50%
  Hepatologia 1,22% · Otorrinolaringologia 1,11% · Oftalmologia 0,83%

Dentro de cada especialidade, respeite o peso dos TEMAS e a lista de
"Top assuntos mais cobrados" do Guia Estatístico anexo. Um assunto do Top 5
merece 3–5x mais espaço que um assunto de cauda.

# ESTRUTURA OBRIGATÓRIA DE TODO MÓDULO DE CONTEÚDO

Sempre exatamente estas 6 seções, nesta ordem, com estes cabeçalhos:

## 0. CABEÇALHO
Código do módulo · Especialidade · Tema · Assunto · Tier (A/B/C) ·
Nº de questões históricas do INEP sobre o assunto · Tempo estimado de estudo ·
Pré-requisitos (códigos de outros módulos) · Data de geração

## 1. TEORIA
Texto corrido didático (não bullet points soltos), com:
- Definição e relevância epidemiológica no Brasil
- Fisiopatologia no nível necessário para raciocinar, não para decorar
- CLASSIFICAÇÕES completas e tabeladas (a banca ama classificação)
- Quadro clínico com os sinais/sintomas discriminantes destacados
- Diagnóstico: exame por exame, com indicação, achado esperado e limitação
- Tratamento: esquema por esquema, com FÁRMACO, DOSE, VIA, INTERVALO, DURAÇÃO
- Complicações, seguimento, critérios de alta/encaminhamento
- Situações especiais (gestante, criança, idoso, renal crônico, imunossuprimido)
- Caixas 🇧🇷 quando a conduta MS divergir da internacional
- Caixa "⚠️ PEGADINHA DO INEP" sempre que houver armadilha clássica
- Ao final: REFERÊNCIAS numeradas, com documento, órgão e ano

## 2. PRÁTICA CLÍNICA REAL
Seção obrigatória, separada da teoria. Conteúdo:
- Como esse assunto aparece de fato no plantão/ambulatório/UBS
- FÁRMACOS EM ORDEM DE FREQUÊNCIA DE USO REAL (não alfabética, não da
  diretriz): tabela com nome comercial usual no Brasil, apresentação
  disponível na rede, dose habitual do adulto, dose pediátrica em mg/kg,
  ajuste renal/hepático, principal efeito adverso, principal interação
- Prescrição-modelo pronta (como se escreve no papel)
- Erros que médicos cometem de verdade nesse tema
- O que dizer ao paciente (comunicação, adesão, orientação de retorno)
- ESTAÇÃO PRÁTICA (2ª etapa do Revalida): checklist do que é pontuado —
  anamnese dirigida, exame físico, hipótese, conduta, comunicação

## 3. QUESTÕES DO INEP (banco histórico)
TODAS as questões do Revalida sobre este assunto, de 2011 até a edição mais
recente disponível no projeto. Para CADA questão:
- Identificação: [INEP ANO · Edição · Questão nº]
- Enunciado íntegro
- Gabarito oficial
- **Por que a alternativa correta está correta** (com o raciocínio clínico,
  não só a afirmação)
- **Por que CADA alternativa incorreta está incorreta** — uma a uma, sem pular
- "O que a banca estava testando aqui"
- Se a questão foi anulada, ou se o gabarito oficial contraria a evidência
  atual, marque `🔴 DIVERGÊNCIA` e explique.
NUNCA invente uma questão. Se não houver questão sobre o assunto no banco,
escreva: "Sem questões diretas no período 2011–[ano]. Assunto cobrado
indiretamente em: [listar]" ou "Assunto ainda não cobrado — risco de estreia".

## 4. FLASHCARDS (Anki)
Bloco de código único, TSV (separado por TAB), 3 campos por linha:
Frente <TAB> Verso <TAB> Tags
Regras:
- Entre 15 e 40 cards por módulo (Tier A no topo da faixa, Tier C na base)
- UM fato por card (princípio da mínima informação). Nada de "cite as 5..."
  — vira 5 cards.
- Frente sempre em forma de pergunta fechada e sem ambiguidade
- Verso curto: no máximo 2 linhas. Se não couber, o card está mal desenhado.
- Doses, cortes e classificações têm card próprio
- Cards de raciocínio clínico ("Paciente com X + Y. Conduta?") em ~30%
- Tags no formato: Revalida::Especialidade::Tema::Assunto
- NUNCA use TAB dentro do texto de um campo
- Cards com imagem: descreva em texto o que seria a imagem, marcado com [IMG]

## 5. RESUMO DE FIXAÇÃO (1 página)
Formato de revisão de 5 minutos:
- 🎯 As 5 frases que, se você souber, acerta a maioria das questões
- 📊 Tabela-síntese das classificações
- 💊 Doses essenciais (só as que caem)
- ⚡ Fluxograma de conduta em texto (diagnóstico → conduta → seguimento)
- 🚫 Os 3 erros mais comuns
- 🔗 Conexões com outros módulos (códigos)

# ESTILO

- Português do Brasil, terminologia médica brasileira.
- Trate o usuário como médico. Nada de explicar o que é taquicardia.
- Densidade alta, zero enchimento. Sem "é importante notar que", sem
  parágrafos de aquecimento, sem conclusão motivacional.
- Tabelas sempre que houver ≥3 itens comparáveis.
- Markdown limpo (o texto vai virar arquivo e alimentar um artefato).

# PROTOCOLO DE TRABALHO

- UM módulo por mensagem. Nunca comprima dois módulos numa resposta.
- Se o módulo não couber na resposta, entregue até a seção que couber,
  termine com `⏸️ CONTINUA — peça "continuar MÓDULO [código]"` e continue
  exatamente do ponto de parada na mensagem seguinte. Nunca resuma para caber.
- Nunca diga "e assim por diante", "entre outros", "etc." numa lista que
  deveria ser exaustiva.
- Ao final de cada módulo, liste em uma linha: `PRÓXIMO SUGERIDO: [código]`.
```

---

## 2. PROMPT 2 — Indexação (enviar depois de subir os PDFs das provas)

> Envie **uma vez por lote de provas** (ex.: um por ano, ou de 3 em 3 anos). Não peça tudo de uma vez.

```
Você tem no conhecimento do projeto: (a) as provas objetivas do Revalida INEP
dos anos [LISTAR ANOS DESTE LOTE] com seus gabaritos oficiais; (b) o Guia
Estatístico Revalida INEP 2011–2024 do Estratégia MED; (c) o cronograma de
150 dias (@dr.martinazzo).

TAREFA: construir o MAPA MESTRE deste lote. Não gere conteúdo teórico agora.

Trabalhe prova por prova, na ordem cronológica, e NÃO pule questões. Se uma
questão estiver ilegível ou faltando no PDF, registre-a como
"status": "ilegivel" em vez de omitir.

Para CADA questão, extraia:
{
  "id": "INEP2019-1-Q034",
  "ano": 2019,
  "edicao": 1,
  "numero": 34,
  "tipo": "objetiva" | "discursiva",
  "enunciado_resumo": "≤ 25 palavras, apenas para identificação",
  "gabarito_oficial": "C",
  "anulada": false,
  "especialidade_primaria": "Infectologia",
  "especialidade_secundaria": ["Pneumologia"],
  "tema": "Tuberculose",
  "assunto": "Tuberculose pulmonar - diagnóstico",
  "modulo_destino": "INF-01",
  "competencia": "diagnostico" | "tratamento" | "epidemiologia" |
                 "conduta_inicial" | "prevencao" | "etica_gestao",
  "dificuldade_estimada": 1-5,
  "status": "ok"
}

Use a taxonomia de especialidade/tema/assunto do Guia Estatístico anexo.
Não invente categorias novas sem necessidade; se precisar, marque com "*".

ENTREGÁVEIS (nesta ordem):

1. TABELA DE CONFERÊNCIA — uma linha por prova do lote:
   ano | edição | nº de questões no PDF | nº extraídas | nº ilegíveis
   (os números têm que fechar; se não fecharem, diga onde está a divergência)

2. JSON completo das questões do lote, em bloco de código.

3. CONTAGEM POR ESPECIALIDADE deste lote, comparada com a distribuição
   histórica do Guia Estatístico. Aponte desvios > 3 pontos percentuais.

4. LISTA DE MÓDULOS a gerar, com código, especialidade, tema, assunto,
   Tier (A/B/C), nº de questões acumuladas e prioridade (1 a 5).
   Códigos: PED-, CIR-, PREV-, OBS-, GIN-, INF-, GAS-, END-, PSI-, CAR-,
   NEF-, NEU-, HEM-, PNE-, ORT-, DER-, REU-, HEP-, OTO-, OFT-.

5. TENDÊNCIAS: assuntos que ganharam ou perderam peso ao longo dos anos;
   assuntos que apareceram pela primeira vez nos últimos 3 anos;
   assuntos "dormentes" (cobrados muito no início e sumidos) — esses são
   candidatos a retorno.

Ao final, diga quantas questões estão acumuladas no mapa e quais anos ainda
faltam ser processados.
```

Depois do último lote, envie:

```
Consolide todos os lotes em um único MAPA MESTRE final. Entregue:
(a) mapa_mestre.json com todas as questões;
(b) modulos.json com a lista definitiva de módulos, ordenada por prioridade;
(c) um relatório de 1 página: onde estão os 20% de conteúdo que valem 80%
    dos pontos, e quais módulos são obrigatórios vs. opcionais.
```

---

## 3. PROMPT 3 — Gerador de módulo (o cavalo de batalha; repetir 180–300×)

```
GERAR MÓDULO: [CÓDIGO] — [Especialidade] · [Tema] · [Assunto]
Tier: [A/B/C]
Questões históricas vinculadas: [colar os IDs do mapa mestre]

Siga integralmente a ESTRUTURA OBRIGATÓRIA DE MÓDULO das instruções do
projeto (seções 0 a 5), sem omitir nenhuma seção.

Reforços específicos para este módulo:
- Profundidade calibrada para Tier [A/B/C].
- Na seção 3, comente TODAS as questões listadas acima, alternativa por
  alternativa, sem exceção e sem resumir.
- Na seção 2, ordene os fármacos por frequência de uso real no Brasil.
- Marque com ⚠️ VERIFICAR tudo que você não puder ancorar em fonte nomeada.
- Ao final, gere também o bloco `<!-- METADADOS -->` em JSON com:
  {codigo, especialidade, tema, assunto, tier, n_questoes, n_flashcards,
   tempo_estudo_min, prerequisitos[], relacionados[], data_geracao,
   itens_a_verificar[]}

Formato de saída: um único arquivo Markdown completo, pronto para salvar
como [CÓDIGO]_[assunto-slug].md
```

**Dica de eficiência:** peça 1 módulo por mensagem, mas mantenha uma conversa por especialidade (ex.: um chat só de Pediatria). Assim o Claude mantém coerência interna e não repete conceitos já estabelecidos — e você pode dizer "não reexplique imunidade adaptativa, já está no PED-03".

---

## 4. PROMPT 4 — Cronograma personalizado (15/12/2026 → 31/07/2027)

```
Monte o CRONOGRAMA DEFINITIVO de estudo e revisão espaçada.

PARÂMETROS
- Início: 15/12/2026. Prova estimada: [DATA]. Fim do ciclo: 31/07/2027.
- Janela total: 229 dias (~33 semanas).
- Disponibilidade: [X] horas em dias úteis, [Y] horas em fins de semana.
- Dias intocáveis (plantão, viagem, folga): [listar]
- Base de módulos: modulos.json (Mapa Mestre).
- Base de sequência didática: cronograma de 150 dias anexo, ajustado às
  prioridades estatísticas do Guia (Tier A/B/C).

REGRAS DE CONSTRUÇÃO

1. Alocação de tempo por Tier: A ≈ 65% · B ≈ 26% · C ≈ 9% das horas totais.
2. Ciclo semanal padrão:
   - 5 dias de conteúdo novo (2 módulos/dia)
   - 1 dia de consolidação (revisões vencidas + questões erradas + simulado
     temático de 30 questões)
   - 1 dia leve (só Anki + resumos, ~40 min)
3. Revisão espaçada dos MÓDULOS (o Anki cuida dos cards; isto é para
   resumo + questões):
   R1 = D+1 (flashcards novos) · R2 = D+7 (resumo de fixação)
   R3 = D+21 (resumo + refazer as questões) · R4 = D+60 (só resumo)
   R5 = reta final (últimas 3 semanas, só Tier A + erros acumulados)
4. Nunca mais de 3 revisões agendadas por dia. Se estourar, empurre a
   revisão de menor Tier e registre o deslocamento.
5. Intercalação: nunca dois módulos da mesma especialidade no mesmo dia.
   Pareie sempre uma especialidade Tier A com uma B ou C — o efeito de
   prática intercalada melhora retenção e reduz fadiga.
6. Simulados completos (100 questões, prova antiga inteira, cronometrada):
   um a cada 3 semanas a partir da semana 6; semanal nas últimas 6 semanas.
   Reserve provas recentes (últimas 2 edições) para as 3 semanas finais.
7. Reta final (últimas 3 semanas): zero conteúdo novo. Só resumos, erros,
   flashcards vencidos e simulados.
8. Preveja 1 semana-tampão a cada 8 semanas para absorver atraso. Cronograma
   sem folga é cronograma que quebra na semana 3.

ENTREGÁVEIS
1. cronograma.json — array de objetos:
   {data, dia_n, semana, modulos_novos[], revisoes[], flashcards_estimados,
    simulado, carga_horaria_min, tipo_dia}
2. Visão macro por semana (tabela): semanas 1–33 com foco, especialidades e
   marcos.
3. Justificativa da ordenação em ≤ 15 linhas.
4. Plano de recuperação: o que fazer se atrasar 3 dias, 1 semana e 2 semanas.

Observação: hoje é [data atual]. Se houver meses entre hoje e 15/12/2026,
proponha separadamente um "plano de pré-temporada" para essa janela
(construção do banco de módulos, provas antigas em modo aberto, e nivelamento
das especialidades Tier A).
```

---

## 5. Anki — configuração recomendada

O artefato **não deve reimplementar SRS**. O Anki já é o melhor algoritmo disponível e sincroniza no celular. O artefato só te diz *quais decks* revisar; o Anki decide *quais cards*.

- **Importação:** arquivo `.tsv`, separador TAB, campos `Frente / Verso / Tags`, tipo de nota Basic. Marque "Permitir HTML nos campos".
- **Estrutura de decks:** um deck único `Revalida` com subdecks por especialidade. Filtragem por tag, não por deck — evita cards órfãos.
- **Configuração:** FSRS ativado; *desired retention* 0,90; novo limite diário 40–60 cards; máximo de revisões 250/dia.
- **Regra de ouro:** só entra no Anki o que já foi estudado no módulo. Card sem contexto prévio vira decoreba inútil.
- **Cards de imagem:** para radiologia, dermatologia e ECG, gere o card com `[IMG]` e cole a imagem manualmente depois. Nunca aceite descrição textual como substituto — reconhecimento visual é habilidade separada.

---

## 6. PROMPT 5 — Artefato "Hub" (dashboard diário)

```
Crie um artefato React (arquivo único) chamado "Revalida Hub".

DADOS
Receberá por props/estado inicial dois JSON: cronograma.json e modulos.json.
Inclua um botão "Importar dados" que aceite colar os JSON, e "Exportar
backup" que baixe todo o estado (progresso + notas + realces) em um arquivo.

PERSISTÊNCIA — LEIA COM ATENÇÃO
- NÃO use localStorage nem sessionStorage: não funcionam em artefatos do
  Claude.ai e o artefato quebra.
- Use a API window.storage:
  await window.storage.set('revalida:estado', JSON.stringify(estado))
  await window.storage.get('revalida:estado')
  Envolva TUDO em try/catch (chave inexistente lança erro, não retorna null).
- Agrupe o estado em POUCAS chaves (ex.: 'revalida:estado' e
  'revalida:notas') em vez de uma chave por módulo — há rate limit.
- Salve com debounce de ~800ms após edição, não a cada tecla.
- Exiba um indicador discreto de "salvo/salvando" e um botão de exportar
  JSON como rede de segurança.

TELA INICIAL — "HOJE" (a mais importante)
Card superior: Dia [N] de 229 · [data] · Semana [S] · barra de progresso geral.
Quatro blocos:
  1. 📘 ESTUDAR HOJE — módulos novos, com Tier, tempo estimado e botão
     "abrir" / "concluir".
  2. 🔁 REVISAR HOJE — módulos com revisão vencida (R1..R5), sinalizando
     atraso em âmbar/vermelho.
  3. 🎴 FLASHCARDS — quantos cards novos criar hoje, de quais módulos, e
     link/lembrete do deck do Anki.
  4. ✅ CHECKLIST DO DIA — lista de afazeres gerada automaticamente a partir
     dos três blocos, mais itens livres que eu possa adicionar.
Rodapé: streak de dias, % do edital coberto, saldo de atraso em dias.

NAVEGAÇÃO POR ABAS (topo, sempre visíveis)
  Hoje · Módulo · Cronograma · Questões · Estatísticas · Notas
Dentro de "Módulo", sub-abas fixas:
  Teoria · Prática clínica · Questões · Flashcards · Resumo
O estado da aba deve persistir ao trocar de módulo.

FUNCIONALIDADES
- Realce: selecionar texto e aplicar cor (amarelo/verde/vermelho/azul).
  Realces persistem por módulo e aparecem numa lista consolidada na aba Notas.
- Anotações: caixa lateral por módulo (Markdown simples) + anotação ancorada
  a um trecho realçado.
- Busca global (Ctrl+K) em títulos, conteúdo, notas e questões.
- Marcar módulo como: não iniciado / em andamento / concluído / precisa
  revisar. Cor no cronograma reflete o status.
- Registro de erros: marcar questão como "errei" → entra automaticamente
  numa fila "Caderno de Erros" revisitada semanalmente.
- Estatísticas: % concluído por especialidade vs. peso da especialidade na
  prova (gráfico de barras divergentes — mostra onde estou subinvestindo);
  acerto por especialidade; evolução semanal.
- Replanejamento: botão "atrasei X dias" que redistribui o cronograma
  restante sem apagar histórico.

DESIGN — fundo preto suave, alto conforto de leitura
  Fundo base      #0F1115
  Superfície      #171A21
  Superfície alta #1E222B
  Borda           #2A2F3A
  Texto principal #E6E8EB   (nunca #FFFFFF puro)
  Texto secundário#9AA3AF
  Acento          #4FD1C5 (teal)
  Atenção         #F6AD55   Erro #FC8181   Sucesso #68D391
  Tier A/B/C      #F6AD55 / #63B3ED / #A0AEC0
Tipografia: system-ui/Inter; corpo 16px; entrelinha 1,7; largura máxima de
texto 72ch (linha longa destrói leitura de teoria densa).
Cantos 10px, sombras sutis, transições ≤150ms. Nada de animação decorativa.
Responsivo: em telas <768px, abas viram menu inferior fixo.
Acessibilidade: contraste mínimo 4.5:1, navegação por teclado, foco visível.

REGRAS TÉCNICAS
- Sem <form>. Use onClick/onChange.
- Só classes core do Tailwind.
- Componentes puros, sem props obrigatórias, export default.
- O conteúdo dos módulos é injetado como dado, nunca hardcoded no componente.
```

**PROMPT 6 — Artefato de módulo (opcional):** se preferir um artefato por especialidade em vez de um hub único, use o mesmo prompt trocando a tela inicial por um índice da especialidade e carregando só os módulos daquele bloco. Recomendo começar com o Hub e só fatiar se ele ficar pesado.

---

## 7. Ordem de execução

| # | Passo | Onde | Saída |
|---|---|---|---|
| 1 | Criar Projeto 1 com Prompt 1 nas instruções | claude.ai | — |
| 2 | Subir os 2 PDFs de estatística/cronograma + provas do 1º lote | Projeto 1 | — |
| 3 | Rodar Prompt 2 por lote de anos | Projeto 1 | mapa_mestre parcial |
| 4 | Consolidar mapa mestre | Projeto 1 | `mapa_mestre.json`, `modulos.json` |
| 5 | Rodar Prompt 4 (cronograma) | Projeto 1 | `cronograma.json` |
| 6 | Criar Projeto 2 com Prompt 1 + mapa mestre no conhecimento | claude.ai | — |
| 7 | Rodar Prompt 3 em loop, na ordem de prioridade | Projeto 2 | `.md` + `.tsv` por módulo |
| 8 | Gerar o Hub com Prompt 5 | qualquer chat | artefato |
| 9 | Alimentar o Hub com os JSON e começar | — | — |

**Não gere os 300 módulos antes de começar a estudar.** Gere os 30 primeiros (todos Tier A), comece, e vá gerando com 2–3 semanas de antecedência. Você vai querer ajustar o formato depois do 5º módulo — e é muito melhor ajustar com 5 arquivos feitos do que com 300.

---

## 8. Controle de qualidade — o ponto mais frágil do sistema

Este é o risco real do plano: **um modelo de linguagem gerando o corpus teórico inteiro de medicina, sem fonte primária carregada, vai errar.** Não de forma aleatória e visível — de forma plausível e invisível. Doses ligeiramente erradas, um critério de classificação trocado, uma diretriz atribuída ao ano errado. É exatamente o tipo de erro que se fixa quando vira flashcard e é revisado 40 vezes.

Mitigações, em ordem de importância:

1. **Ancore no gabarito.** As questões do INEP com gabarito oficial são a única verdade *verificável* do sistema. Elas são o alicerce; a teoria é o andaime. Sempre que a teoria gerada contradisser um gabarito, a teoria está sob suspeita.
2. **Carregue fontes primárias no Projeto 2.** Os PCDTs e Cadernos do Ministério da Saúde são PDFs públicos e gratuitos. Suba os de maior peso — TB, HIV, sífilis/IST, dengue/arboviroses, hanseníase, pré-natal/parto, imunizações (PNI), hipertensão/diabetes na APS, saúde da criança. Isso sozinho cobre boa parte de Infectologia, Preventiva, Obstetrícia e Pediatria — ~44% da prova — com fonte real em vez de memória do modelo.
3. **Ative a busca web no projeto** para verificação de versões e datas de diretrizes.
4. **Trate os ⚠️ VERIFICAR como bloqueio.** Antes de transformar um módulo em flashcard, resolva todos. Um card errado custa meses.
5. **Nunca gere flashcard de dose sem fonte nomeada.** Doses são o item de maior risco e maior consequência clínica.
6. **Revisão cruzada:** para módulos Tier A, peça em um chat *novo e limpo*: "Revise este módulo procurando exclusivamente erros factuais, doses incorretas, classificações desatualizadas e referências inexistentes. Não elogie, não reescreva estilo. Liste apenas os erros." Modelo sem o contexto que gerou o texto encontra o que o gerador não vê.
7. **Você é anestesiologista e pesquisador** — a calibração final é sua. Em Cirurgia, Cardiologia, Farmacologia e Terapia Intensiva você vai detectar erro na hora. Em Ginecologia e Preventiva, provavelmente não. Redobre a checagem justamente onde você tem menos domínio, que é onde a estatística diz que estão os pontos.

---

## 9. Dois ajustes que valem a pena considerar

**Data de início.** O plano cobre 15/12/2026 a 31/07/2027, mas hoje é julho de 2026 — há quase 5 meses antes do início. Se a intenção não foi essa, ajuste o Prompt 4. Se foi, use a janela para construir o banco de módulos com calma: chegar em dezembro com 150 módulos prontos e verificados transforma o cronograma em execução pura, sem geração de conteúdo competindo com estudo.

**Segunda etapa (prática).** O Guia Estatístico e este sistema cobrem a prova objetiva. A 2ª etapa é OSCE, com estações e checklist de pontuação — habilidade diferente, que não se treina lendo. Por isso a seção 2 de cada módulo inclui o bloco "ESTAÇÃO PRÁTICA". Trate-o como conteúdo de primeira classe, não como apêndice.
