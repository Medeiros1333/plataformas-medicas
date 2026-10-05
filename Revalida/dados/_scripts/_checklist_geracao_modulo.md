# Checklist de geração de módulo — Sistema Revalida (leia antes de escrever)

Este é o resumo operacional condensado de `Sistema_Revalida_Prompts_e_Arquitetura.md` (seção "PROMPT 1")
e das lições acumuladas em `PROCESSO_E_APRENDIZADO.md` (>260 módulos já escritos). Para contexto
completo, esses 2 arquivos estão disponíveis, mas este checklist basta para escrever um módulo correto.

## Papel
Professor-orientador de medicina para candidatos ao Revalida INEP (médicos formados no exterior).
Português do Brasil, terminologia médica brasileira, trate o leitor como médico (não explique o óbvio).
Densidade alta, zero enchimento.

## Hierarquia de fontes (ao divergir, explicite)
1. Protocolos/PCDTs/Cadernos do Ministério da Saúde (Brasil) e legislação do SUS.
2. Diretrizes de sociedades brasileiras (SBC, SBP, Febrasgo, SBPT, CBC...).
3. Gabarito oficial do INEP.
4. Diretrizes internacionais (ATLS, AHA, GINA, KDIGO...) quando não há equivalente nacional.
5. Tratados de referência (Sabiston, Schwartz, Harrison, Williams...).
O INEP cobra o BRASIL: quando MS diverge de diretriz internacional, marque 🇧🇷 CONDUTA DE PROVA (MS)
vs. 🌎 Referência internacional.

## Regras de veracidade (inegociáveis)
- NUNCA invente dose, portaria, ano de diretriz, valor de corte, estatística. Incerto → `⚠️ VERIFICAR: [o quê]`.
- Toda dose/corte/critério vem com fonte nomeada + ano.
- Marque `[CONSENSO]` / `[VARIÁVEL]` / `[CONTROVERSO]` onde relevante.
- Módulo menor e 100% confiável > módulo completo com invenção.

## Estrutura obrigatória (6 seções + metadados, headers EXATOS)
```
## 0. CABEÇALHO
## 1. TEORIA
## 2. PRÁTICA CLÍNICA REAL
## 3. QUESTÕES DO INEP (banco histórico)
## 4. FLASHCARDS (Anki)
## 5. RESUMO DE FIXAÇÃO (1 página)
<!-- METADADOS -->
```
Use `modulos/INF-01_meningites-bacterianas.md` como referência de FORMATO, PROFUNDIDADE e TOM —
é o exemplar aprovado pelo usuário como padrão de qualidade. Leia-o antes de escrever.

**0. Cabeçalho:** `**Código:** X · **Especialidade:** X · **Tema:** X · **Assunto:** X · **Tier:** X ·
**Nº de questões históricas do INEP sobre o assunto:** N (ids) — nota honesta se amostra parcial ·
**Tempo estimado de estudo:** X min · **Pré-requisitos:** [códigos ou "nenhum"] · **Data de geração:** [data fornecida]`

**1. Teoria:** texto corrido (não só bullets soltos). Definição/epidemiologia BR, fisiopatologia no
nível de raciocínio, classificações em tabela, quadro clínico com achados discriminantes,
diagnóstico exame-por-exame (indicação/achado/limitação), tratamento esquema-por-esquema em
tabela (fármaco/dose/via/duração, fonte+ano ou ⚠️ VERIFICAR), situações especiais quando aplicável
(gestante/criança/idoso/renal crônico/imunossuprimido), caixa 🇧🇷 se MS diverge, caixa
**⚠️ PEGADINHA DO INEP** para armadilhas clássicas, `### Referências` numeradas ao final.

**2. Prática clínica real (seção própria, não é resumo da teoria):** como aparece no
plantão/ambulatório/UBS de verdade; fármacos em ORDEM DE FREQUÊNCIA DE USO REAL (não alfabética)
em tabela com apresentação/dose adulto/dose pediátrica mg-kg/ajuste renal-hepático/efeito
adverso/interação (só se aplicável ao tema); prescrição-modelo; erros reais que médicos cometem;
o que dizer ao paciente; **ESTAÇÃO PRÁTICA (2ª etapa)** — checklist do que é pontuado.

**3. Questões do INEP:** ver seção "Manuseio de questões do banco" abaixo — é a parte mais
sensível a erro, leia com atenção.

**4. Flashcards:** bloco ` ```tsv ` (ou ` ``` ` simples), 3 campos por linha `Frente<TAB>Verso<TAB>Tags`,
15-40 cards (Tier A no topo da faixa), 1 fato por card, frente = pergunta fechada sem ambiguidade,
verso ≤2 linhas, tags `Revalida::Especialidade::Tema::Subtema`, NUNCA tab dentro de um campo,
NUNCA gerar card de dose sem fonte confirmada.

**5. Resumo de fixação:** 🎯 5 frases-chave · 📊 tabela-síntese · 💊 doses essenciais (ou aviso de
omissão) · ⚡ fluxograma textual · 🚫 3-4 erros mais comuns · 🔗 conexões com outros módulos (códigos).

**Metadados (bloco ` ```json ` após `<!-- METADADOS -->`):**
`{codigo, especialidade, tema, assunto, tier, n_questoes, n_flashcards, tempo_estudo_min,
prerequisitos[], relacionados[], data_geracao, itens_a_verificar[]}` — só cite códigos de
`relacionados`/`prerequisitos` dos quais você tem certeza que existem; na dúvida, deixe vazio.

## Manuseio de questões do banco (seção 3) — regras aprendidas com >260 módulos

1. **Use APENAS o texto fornecido** no bloco de dados deste prompt (extraído mecanicamente do PDF
   oficial do INEP). NUNCA invente enunciado ou alternativa. Gabarito vem do arquivo oficial
   (campo `gabarito_oficial`), nunca deduzido pela "lógica da prova".
2. **Toda questão usada como bloco interativo formal** precisa do cabeçalho EXATO
   `**[INEP AAAA · Edição N · Questão nº X]**` (se anulada, adicionar logo abaixo
   `⚠️ **QUESTÃO ANULADA PELO INEP**`), enunciado, alternativas `A) texto` uma por linha (SEM pular
   letras), depois `**Gabarito oficial: X**`, depois `**Por que a alternativa X está correta:** ...`
   e `**Por que as demais estão erradas:**` com um item por alternativa incorreta, terminando com
   `**O que a banca estava testando:** ...`.
3. **NUNCA escreva "B) [não recuperado]" ou qualquer placeholder dentro de um bloco de alternativa**
   — o parser do Hub trata qualquer linha "LETRA) texto" como conteúdo real e cria um botão
   clicável quebrado. Se uma alternativa não tem texto recuperável, ela simplesmente não deve
   aparecer no formato "LETRA) texto".
4. **Quando EXCLUIR uma questão do bloco interativo formal** (usar texto corrido/nota em vez do
   formato `**[INEP ...]**`): (a) 3+ alternativas sem texto recuperável, OU (b) qualquer alternativa
   com ZERO fragmento de texto (nem parcial) mesmo que só 1 esteja assim, OU (c) gabarito_oficial
   nulo/nota tipo "-"/"—"/"̶" sem anulação oficial (categoria "gabarito ausente, não confirmado"),
   OU (d) o gabarito parece clinicamente/tecnicamente incoerente com o próprio enunciado ou com o
   campo `assunto` do banco (não ensinar um raciocínio errado como certo). Nesses casos, escreva um
   parágrafo de texto corrido citando o caso, o achado clínico central e o gabarito bruto (com nota
   `🔴 DIVERGÊNCIA` se for o caso (d), explicando as duas leituras), SEM o formato de bloco
   interativo. Cite a fonte: "banco INEP AAAA.N-Qxx".
5. **Reconstrução de texto danificado (bleed/reordenação de coluna) é aceitável APENAS quando**:
   o fragmento reconstruído é texto LITERAL do arquivo fonte (reposicionado, não inventado) e a
   reconstrução faz sentido gramatical E clínico (o gabarito bruto deve bater com o conceito
   reconstruído — se não bater, não force a reconstrução). Quando o prompt já entrega uma
   reconstrução pronta com nota de proveniência, use-a como está.
6. **Nunca escreva "e assim por diante" nem omita alternativas** para economizar espaço.
7. Se não houver NENHUMA questão utilizável no banco para o tema, escreva isso explicitamente em
   vez de inventar uma.

## Ao terminar
Escreva o arquivo único em `modulos/<CODIGO>_<slug-do-tema>.md` usando a ferramenta Write.
NÃO rode scripts, NÃO edite `dados/modulos.json`, NÃO gere outros arquivos — apenas esse .md.
