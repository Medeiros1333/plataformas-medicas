## 0. CABEÇALHO

**Código:** PREV-13 · **Especialidade:** Preventiva · **Tema:** Validade de testes diagnósticos · **Assunto:** Sensibilidade, especificidade e valor preditivo positivo — cálculo e interpretação · **Tier:** A · **Nº de questões históricas do INEP sobre o assunto:** 4 (2024.1-Q60, 2025.1-Q100, 2025.2-Q34, 2011.1-Q96) — banco completo das 16 edições extraídas (2011.1 a 2025.2); faltam apenas 2022.1 e 2026.1, cujos PDFs têm encoding corrompido · **Tempo estimado de estudo:** 90 min · **Pré-requisitos:** nenhum · **Data de geração:** 2026-07-29 · **Última atualização:** 2026-08-08

📋 **Nota de consolidação:** este módulo incorporou o código **PREV-41** (`tema` "Testes diagnósticos" no `modulos.json`), com questões de cálculo de VPP e sensibilidade — mesmo tema central já coberto por PREV-13. PREV-41 foi marcado como `"gerado"` apontando para este arquivo, sem `.md` próprio.

---

## 1. TEORIA

As medidas de validade de testes diagnósticos são um dos tópicos mais recorrentes de epidemiologia no Revalida — a banca testa a diferenciação precisa entre sensibilidade, especificidade, valores preditivos e razão de verossimilhança.

**As 4 medidas centrais de validade de um teste diagnóstico:**
- **Sensibilidade:** proporção de **verdadeiros positivos** entre todos os indivíduos que **realmente têm a doença** (VP / [VP+FN]). Responde à pergunta: "entre quem tem a doença, quantos o teste identifica corretamente?". Testes muito sensíveis são úteis para **rastreamento** (poucos falsos negativos).
- **Especificidade:** proporção de **verdadeiros negativos** entre todos os indivíduos que **realmente não têm a doença** (VN / [VN+FP]). Responde: "entre quem não tem a doença, quantos o teste identifica corretamente como negativos?". Testes muito específicos são úteis para **confirmação diagnóstica** (poucos falsos positivos).
- **Valor preditivo positivo (VPP):** proporção de indivíduos **realmente doentes** entre todos que tiveram resultado **positivo** no teste — depende da prevalência da doença na população testada.
- **Razão de verossimilhança (likelihood ratio):** combina sensibilidade e especificidade em uma única medida que expressa o quanto um resultado de teste (positivo ou negativo) muda a probabilidade pós-teste de doença em relação à probabilidade pré-teste.

⚠️ **PEGADINHA DO INEP central deste tema:** a pergunta "qual medida identifica a probabilidade de o teste detectar corretamente os 'verdadeiros positivos' entre os indivíduos **realmente portadores** da doença" descreve exatamente a definição de **sensibilidade** — não de razão de verossimilhança, confiabilidade ou especificidade. O erro mais comum é confundir sensibilidade (baseada em quem TEM a doença) com valor preditivo positivo (baseado em quem teve resultado POSITIVO) — são populações de referência diferentes no denominador.

**Regra mnemônica clássica:** **SN-N-OUT** (teste com alta **S**e**N**sibilidade, resultado **N**egativo, **exclui**/rules **OUT** a doença) e **SP-P-IN** (teste com alta e**SP**ecificidade, resultado **P**ositivo, confirma/rules **IN** a doença).

**Cálculo do VPP a partir de sensibilidade, especificidade e prevalência [CONSENSO] — habilidade cobrada com frequência:** o Revalida frequentemente pede o cálculo numérico do VPP, não apenas a definição conceitual. A forma mais direta é montar uma tabela 2x2 com uma população hipotética (ex.: 1.000 pessoas):
1. Doentes = população × prevalência; Não doentes = população − doentes.
2. Verdadeiros positivos (VP) = doentes × sensibilidade.
3. Falsos negativos (FN) = doentes − VP.
4. Verdadeiros negativos (VN) = não doentes × especificidade.
5. Falsos positivos (FP) = não doentes − VN.
6. **VPP = VP / (VP + FP)**.

⚠️ **PEGADINHA DO INEP no cálculo:** em populações de **baixa prevalência**, mesmo um teste com boa sensibilidade e especificidade moderada/razoável gera um número absoluto de falsos positivos proporcionalmente grande em relação aos verdadeiros positivos — resultando em **VPP baixo**, mesmo que sensibilidade e especificidade pareçam "boas" isoladamente. Este é o racional por trás de perguntas que pedem para reconhecer que "o número de falsos-positivos será elevado" diante de especificidade moderada (ex.: 65%) associada a baixa prevalência, mesmo com sensibilidade alta.

**Cálculo da sensibilidade a partir de uma tabela de verdadeiros positivos/negativos:** quando o enunciado já fornece, por exemplo, "dentre X pessoas com a doença, Y são verdadeiros positivos", a sensibilidade é simplesmente **Y/X** — não é necessário nenhum cálculo bayesiano adicional, apenas aplicar a definição (VP sobre o total de doentes).

### Referências
1. Fletcher RH, Fletcher SW — Epidemiologia Clínica: Elementos Essenciais.

---

## 2. PRÁTICA CLÍNICA REAL

**Como aparece na gestão de saúde pública real:** ao decidir a compra de kits diagnósticos para um programa de rastreamento (ex.: dengue, tuberculose, HIV), o gestor precisa entender qual medida de validade priorizar conforme o objetivo (rastreamento amplo vs. confirmação diagnóstica).

**Sequência prática de raciocínio:**
1. Definir o objetivo do teste: rastreamento (priorizar sensibilidade) ou confirmação (priorizar especificidade).
2. Considerar a prevalência da doença na população-alvo (afeta o VPP/VPN).
3. Escolher o teste com a medida de validade adequada ao objetivo.

**Erros que profissionais cometem de verdade:**
- Confundir sensibilidade com valor preditivo positivo (populações de referência diferentes).
- Ignorar o efeito da prevalência sobre o VPP/VPN ao interpretar um resultado de teste em populações diferentes.
- Escolher um teste pouco sensível para rastreamento em massa (aumentando falsos negativos).

**O que dizer à equipe de gestão:** explicar que a escolha do teste depende do objetivo — testes de rastreamento devem ser muito sensíveis (para não deixar passar casos verdadeiros), enquanto testes confirmatórios devem ser muito específicos (para não gerar falsos alarmes).

**ESTAÇÃO PRÁTICA (2ª etapa):**
- ✅ Diferenciar sensibilidade (baseada em quem tem a doença) de VPP (baseado em quem testou positivo).
- ✅ Escolher teste sensível para rastreamento, específico para confirmação.
- ✅ Considerar o efeito da prevalência sobre VPP/VPN.

---

## 3. QUESTÕES DO INEP (banco histórico)

📌 *Atualizado em 2026-09-30: este módulo cobre **todas as 16 edições já extraídas** do banco (2011.1–2025.2); gabaritos conferidos um a um contra os PDFs oficiais do INEP.*

📋 **Nota sobre item do banco não incluído no simulado (2011.1-Q96):** esta questão descrevia um cenário de compra emergencial de kits para detecção sorológica de dengue, perguntando sob que termo epidemiológico se procura a "probabilidade de identificar os pacientes 'verdadeiros positivos' entre os indivíduos realmente portadores de dengue" — descrição textual que corresponde exatamente à definição de **sensibilidade**. No entanto, o arquivo fonte apresentava dano de extração **severo**: o campo de alternativas está **vazio** (nenhuma das 5 opções foi recuperada de forma estruturada), restando apenas fragmentos soltos no próprio texto do enunciado ("Razão de verossimilhança de um resultado de teste", "Confiabilidade", "Especificidade"), sem uma quarta opção sequer identificável (a que corresponderia a "Sensibilidade", conceito que o próprio enunciado descreve). Diante da impossibilidade de reconstruir as 5 alternativas com segurança, esta questão foi **excluída do simulado interativo**. O `gabarito_oficial` registrado no arquivo fonte é "A", mas como não há certeza de que a alternativa A dessa questão específica corresponda a "Sensibilidade" (o mapeamento letra-conteúdo não pôde ser reconstruído), esta letra não deve ser tomada como confiável sem verificação contra o PDF original.

**O que a banca provavelmente estava testando (conceito, independente do gabarito não verificável):** reconhecimento de que a "probabilidade de identificar corretamente os verdadeiros positivos entre os indivíduos realmente portadores da doença" é a definição de **sensibilidade** — não de razão de verossimilhança, confiabilidade ou especificidade (que se referem a outras perguntas: especificidade se refere a verdadeiros negativos entre quem não tem a doença; razão de verossimilhança combina sensibilidade e especificidade em uma métrica de mudança de probabilidade pré/pós-teste).

---

**[INEP 2024 · Edição 1 · Questão 60]**

Um novo exame que detecta o DNA do Mycobacterium leprae em pacientes com suspeita de hanseníase está sendo testado. Ele demonstra capacidade de detectar 80% de pacientes com a doença e fornece resultado falso-positivo em 20% das pessoas sem a doença. Um médico de família e comunidade está utilizando esse exame em uma comunidade vulnerável na qual a prevalência de hanseníase é de 10%. Nesse caso, qual é a probabilidade de um resultado positivo ser de um indivíduo realmente doente?

A) 31%.
B) 97%.
C) 69%.
D) 80%.

**Gabarito oficial: A**

**Por que A está correta:** montando a tabela 2x2 para 1.000 pessoas — prevalência 10% → 100 doentes, 900 não doentes. Sensibilidade 80% → VP = 100×0,8 = 80. Especificidade = 100%−20% (taxa de falso-positivo) = 80% → VN = 900×0,8 = 720, FP = 900−720 = 180. **VPP = VP/(VP+FP) = 80/(80+180) = 80/260 ≈ 30,8% ≈ 31%.**

**Por que as demais estão erradas:**
- B) 97% seria um VPP esperado apenas em cenário de prevalência muito mais alta ou especificidade muito maior — não corresponde ao cálculo com os dados fornecidos.
- C) 69% não corresponde ao cálculo correto — possível erro de inverter sensibilidade/especificidade no cálculo.
- D) 80% é a sensibilidade do teste, não o VPP — troca clássica entre "capacidade de detectar doentes" (sensibilidade) e "probabilidade de quem testou positivo realmente ter a doença" (VPP), que são conceitos e cálculos diferentes.

**O que a banca estava testando:** aplicação prática do cálculo de VPP a partir de sensibilidade, taxa de falso-positivo (→ especificidade) e prevalência, evidenciando como a prevalência baixa reduz o VPP mesmo com sensibilidade razoável.

---

**[INEP 2025 · Edição 1 · Questão 100]**

Diante de um novo teste diagnóstico para hanseníase, que está sendo aplicado em uma unidade básica de saúde (UBS), o médico julga pertinente iniciar uma capacitação com sua equipe sobre a validade de testes diagnósticos, medidas de sensibilidade, especificidade e valores preditivos. Então, ele apresenta os seguintes dados a sua equipe: dentre 100 pessoas acometidas por hanseníase, 98 são verdadeiros positivos; e, dentre 100 pessoas não acometidas por hanseníase, 90 são verdadeiros negativos. A partir desses dados, é correto afirmar que o valor de sensibilidade do teste é de

⚠️ *Nota de extração: as alternativas do arquivo fonte vieram fundidas com fragmentos de outra questão (recusa terapêutica por motivos religiosos) — os valores numéricos das 4 alternativas permaneceram legíveis e foram organizados abaixo sem o texto espúrio.*

A) 90%.
B) 90,7%.
C) 97,8%.
D) 98%.

**Gabarito oficial: D**

**Por que D está correta:** sensibilidade = VP / total de doentes = 98/100 = **98%** — aplicação direta da definição, sem necessidade de cálculo bayesiano adicional, já que o enunciado fornece diretamente o número de verdadeiros positivos entre os doentes.

**Por que as demais estão erradas:**
- A) 90% corresponde à especificidade do teste (90 verdadeiros negativos entre 100 não doentes), não à sensibilidade — troca clássica entre as duas medidas.
- B) e C) Não correspondem a nenhum cálculo direto solicitado pelo enunciado com os dados fornecidos.

**O que a banca estava testando:** capacidade de aplicar a definição de sensibilidade (VP sobre total de doentes) diretamente a partir de dados numéricos simples, sem se confundir com a especificidade (dado também fornecido no mesmo enunciado, como distrator).

---

**[INEP 2025 · Edição 2 · Questão 34]**

Uma instituição de saúde está pesquisando um novo teste de triagem para hanseníase, com sensibilidade de 92% e especificidade de 65%, aplicado em uma população com baixa prevalência da doença. Nesse contexto, é correto afirmar que

A) quase todos os testes positivos indicarão verdadeiros casos de hanseníase, diante da elevada sensibilidade do teste.
B) o número de falsos-positivos será elevado, devido à baixa especificidade do teste e à baixa prevalência da doença.
C) o número de falsos-negativos será elevado, reduzindo a capacidade do teste em detectar casos reais.
D) a elevada sensibilidade do teste o torna ideal para a confirmação do diagnóstico de hanseníase.

**Gabarito oficial: B**

**Por que B está correta:** especificidade de 65% significa que **35% dos não doentes** terão resultado positivo. Numa população de **baixa prevalência**, os não doentes são a grande maioria — então os **falsos-positivos serão numerosos** e o VPP, baixo.

**Por que as demais estão erradas:**
- A) Confunde sensibilidade com **VPP**; com baixa prevalência e baixa especificidade, a maioria dos positivos será **falsa**.
- C) Sensibilidade alta (92%) → **poucos** falsos-negativos.
- D) Para **confirmar** diagnóstico, precisa-se de alta **especificidade**; testes muito sensíveis servem para **triagem/excluir** (SnNout).

⚠️ **PEGADINHA DO INEP:** **SnNout** (sensível + negativo → exclui) e **SpPin** (específico + positivo → confirma). Triagem = sensível; confirmação = específico.

**O que a banca estava testando:** efeito da especificidade e da prevalência sobre os falsos-positivos.

---

**[INEP 2011 · Edição 1 · Questão 96]**

A secretaria de saúde de um município está em processo de compra emergencial de kits para detecção sorológica de dengue. Conforme deliberação do Centro de Vigilância em Saúde do Estado, o município precisa de um exame que tenha elevada probabilidade de identificar os pacientes "verdadeiros positivos" entre os indivíduos realmente portadores de dengue. Na tomada de decisão para a compra desses kits, essa probabilidade deverá ser procurada sob que termo?

A) Razão de verossimilhança de um resultado de teste positivo.
B) Valor preditivo positivo.
C) Confiabilidade.
D) Sensibilidade.

**Gabarito oficial: D**

**Por que D está correta:** o enunciado define, palavra por palavra, a **SENSIBILIDADE** — "probabilidade de identificar os **verdadeiros positivos** ENTRE OS INDIVÍDUOS REALMENTE PORTADORES da doença".

⚠️ **A expressão que decide é "entre os indivíduos REALMENTE PORTADORES".** Ela estabelece o **denominador** do cálculo — e é o denominador que distingue todas as medidas de validade de um teste.

$$\text{Sensibilidade} = \frac{\text{Verdadeiros Positivos}}{\textbf{TODOS OS DOENTES}} = \frac{VP}{VP + FN}$$

A sensibilidade responde à pergunta: **"Entre quem TEM a doença, quantos o teste consegue detectar?"**

**A tabela 2×2 que organiza todo o tema:**

| | **DOENTE** | **NÃO DOENTE** |
|---|---|---|
| **Teste POSITIVO** | **VP** (verdadeiro positivo) | FP (falso positivo) |
| **Teste NEGATIVO** | FN (falso negativo) | **VN** (verdadeiro negativo) |

| Medida | Fórmula | Pergunta que responde | Denominador |
|---|---|---|---|
| **SENSIBILIDADE** | **VP / (VP + FN)** | entre os **doentes**, quantos o teste detecta? | **coluna dos doentes** ← o caso |
| **ESPECIFICIDADE** | VN / (VN + FP) | entre os **sadios**, quantos o teste exclui? | coluna dos sadios |
| **VPP** | VP / (VP + FP) | quem testou **positivo**, tem a doença? | **linha dos positivos** |
| **VPN** | VN / (VN + FN) | quem testou **negativo**, está livre? | linha dos negativos |

⚠️ **A diferença entre sensibilidade e VPP é a direção da pergunta** — e é exatamente o que separa a alternativa D da B:

| | Parte de | Chega a |
|---|---|---|
| **Sensibilidade** | **quem TEM a doença** | quantos o teste detecta |
| **VPP** | **quem TESTOU positivo** | quantos realmente têm |

O enunciado parte dos **"indivíduos realmente portadores"** → é **sensibilidade**.

**Por que sensibilidade é o que importa nesta compra.** A secretaria enfrenta uma situação **emergencial de dengue**. Nesse contexto, o objetivo é **não deixar escapar casos** — cada caso não detectado significa um paciente sem orientação de retorno (e, na dengue, o sinal de alarme surge justamente na defervescência), além de subnotificação que compromete a resposta de vigilância.

⚠️ **A regra prática, com as mnemônicas clássicas:**

| Prioridade | Escolha | Mnemônica |
|---|---|---|
| **Não perder casos** (triagem, rastreamento, doença grave e tratável) | **alta SENSIBILIDADE** | **SnNout** — teste *S*ensível, quando *N*egativo, afasta (*rules out*) |
| **Confirmar o diagnóstico** (evitar falso-positivo, tratamento tóxico ou estigmatizante) | **alta ESPECIFICIDADE** | **SpPin** — teste *Sp*ecífico, quando *P*ositivo, confirma (*rules in*) |

Em **surto de dengue**, prioriza-se **sensibilidade**.

⚠️ **Sensibilidade e especificidade NÃO dependem da prevalência** — são propriedades **intrínsecas** do teste, medidas contra um padrão-ouro. Já os **valores preditivos DEPENDEM da prevalência**:

| Prevalência | VPP | VPN |
|---|---|---|
| **alta** (epidemia) | **sobe** | desce |
| **baixa** (rastreamento populacional) | **desce** | sobe |

É por isso que a sensibilidade é o critério para **comprar** o kit (propriedade do produto), enquanto o VPP varia conforme **onde e quando** ele for usado.

**Por que as demais estão erradas:**

- **A) Razão de verossimilhança de um teste positivo (LR+).** É medida legítima e útil, mas responde a outra pergunta. Calcula-se como:

  $$LR+ = \frac{\text{Sensibilidade}}{1 - \text{Especificidade}}$$

  Ela expressa **quantas vezes mais provável** é um resultado positivo em quem tem a doença comparado a quem não tem — ou seja, o **quanto o teste modifica a probabilidade** pré-teste. É excelente para raciocínio clínico bayesiano à beira do leito, mas **combina** sensibilidade e especificidade; não é a "probabilidade de identificar verdadeiros positivos entre os doentes", que é a sensibilidade pura. (Como referência: LR+ > 10 modifica substancialmente a probabilidade; LR− < 0,1 praticamente afasta.)

- **B) Valor preditivo positivo.** É a distratora principal, e o erro está na **direção da pergunta**. O VPP parte de **quem já testou positivo** e pergunta quantos realmente têm a doença — denominador: **todos os positivos** (VP + FP). O enunciado parte de **quem tem a doença** — denominador: **todos os doentes**. Além disso, o VPP **varia com a prevalência**, o que o torna inadequado como especificação técnica para compra de insumo.

- **C) Confiabilidade.** Conceito de natureza **diferente** — refere-se à **REPRODUTIBILIDADE** do teste: a capacidade de produzir o **mesmo resultado** quando repetido nas mesmas condições (concordância intra e interobservador, medida por exemplo pelo **coeficiente kappa**). Confiabilidade é sobre **consistência**; sensibilidade é sobre **acurácia**.

  ⚠️ **São propriedades independentes:** um teste pode ser **altamente confiável e completamente inválido** — errar sempre, e errar igual. A analogia clássica é a balança descalibrada: marca sempre 5 kg a mais (confiável, mas inválida).

⚠️ **PEGADINHA DO INEP:** as quatro alternativas são conceitos **reais e corretos** de epidemiologia clínica. A questão se resolve identificando o **denominador** que o enunciado estabelece: "**entre os indivíduos realmente portadores**". Sempre que essa expressão (ou equivalente) aparecer, a resposta é **sensibilidade**.

**Um exemplo numérico para fixar.** Suponha 1.000 pessoas, 200 com dengue, e um teste com sensibilidade de 90% e especificidade de 95%:

| | **Doente (200)** | **Sadio (800)** | Total |
|---|---|---|---|
| **Positivo** | **VP = 180** | FP = 40 | 220 |
| **Negativo** | FN = 20 | **VN = 760** | 780 |

- **Sensibilidade** = 180/200 = **90%** — detecta 9 em cada 10 doentes
- **Especificidade** = 760/800 = **95%**
- **VPP** = 180/220 = **82%** — quem testou positivo tem 82% de chance de ter dengue
- **VPN** = 760/780 = **97%**

Se a prevalência caísse para 20 casos em 1.000 (fora de epidemia), com o **mesmo teste**, o VPP despencaria para cerca de **27%** — enquanto sensibilidade e especificidade permaneceriam em 90% e 95%. É a demonstração de que só as duas primeiras são propriedades do teste.

**O que a banca estava testando:** identificar a **sensibilidade** pela sua definição operacional — proporção de doentes corretamente detectados —, distinguindo-a do **valor preditivo positivo** pela direção da pergunta e do conceito de **confiabilidade**, que trata de reprodutibilidade e não de validade.

---

## 4. FLASHCARDS (Anki)

```
Qual medida de validade mede a proporção de verdadeiros positivos entre quem realmente tem a doença?	Sensibilidade	Revalida::Preventiva::ValidadeTestesDiagnosticos::Conceito
Qual medida de validade mede a proporção de verdadeiros negativos entre quem realmente não tem a doença?	Especificidade	Revalida::Preventiva::ValidadeTestesDiagnosticos::Conceito
Teste muito sensível é mais útil para rastreamento ou confirmação diagnóstica?	Rastreamento (poucos falsos negativos)	Revalida::Preventiva::ValidadeTestesDiagnosticos::Aplicacao
O que é SnNout e SpPin?	Sensibilidade alta + negativo exclui (rules out); Especificidade alta + positivo confirma (rules in)	Revalida::Preventiva::ValidadeTestesDiagnosticos::Mnemonico
Como calcular o VPP a partir de sensibilidade, especificidade e prevalência?	Montar tabela 2x2 (VP, FN, VN, FP a partir da prevalência) e calcular VPP = VP/(VP+FP)	Revalida::Preventiva::ValidadeTestesDiagnosticos::Calculo
Por que um teste com boa sensibilidade pode ter VPP baixo em população de baixa prevalência?	Especificidade moderada + baixa prevalência geram número absoluto elevado de falsos-positivos em relação aos verdadeiros positivos	Revalida::Preventiva::ValidadeTestesDiagnosticos::Calculo
Como calcular sensibilidade quando o enunciado já fornece VP e total de doentes?	Sensibilidade = VP / total de doentes (aplicação direta da definição)	Revalida::Preventiva::ValidadeTestesDiagnosticos::Calculo
```

---

## 5. RESUMO DE FIXAÇÃO (1 página)

🎯 **As 5 frases que resolvem a maioria das questões:**
1. Sensibilidade = VP entre quem TEM a doença.
2. Especificidade = VN entre quem NÃO TEM a doença.
3. VPP = VP entre quem testou POSITIVO (depende da prevalência).
4. Teste sensível → rastreamento; teste específico → confirmação.
5. Razão de verossimilhança combina sensibilidade e especificidade em uma métrica única.

📊 **Tabela-síntese**
| Medida | Denominador de referência |
|---|---|
| Sensibilidade | Quem tem a doença (VP+FN) |
| Especificidade | Quem não tem a doença (VN+FP) |
| VPP | Quem testou positivo (VP+FP) |
| VPN | Quem testou negativo (VN+FN) |

⚡ **Fluxograma textual:** definir objetivo do teste → rastreamento → priorizar sensibilidade → confirmação → priorizar especificidade → interpretar resultado considerando prevalência (afeta VPP/VPN).

🚫 **Os 3 erros mais comuns:** (1) confundir sensibilidade com VPP; (2) ignorar efeito da prevalência sobre VPP/VPN; (3) usar teste pouco sensível para rastreamento em massa.

🔗 **Conexões com outros módulos:** nenhum diretamente relacionado neste lote.

<!-- METADADOS -->
```json
{
  "codigo": "PREV-13",
  "especialidade": "Preventiva",
  "tema": "Validade de testes diagnósticos",
  "assunto": "Sensibilidade como medida de detecção de verdadeiros positivos",
  "tier": "A",
  "n_questoes": 4,
  "n_flashcards": 8,
  "tempo_estudo_min": 90,
  "prerequisitos": [],
  "relacionados": [],
  "data_geracao": "2026-07-29",
  "data_atualizacao": "2026-08-08",
  "codigos_mesclados": ["PREV-13", "PREV-41"],
  "itens_a_verificar": [
    "Questão 2011.1-Q96 excluída do simulado: campo de alternativas vazio no arquivo fonte (dano severo de extração), apenas fragmentos soltos recuperáveis. Gabarito 'A' registrado não pôde ser mapeado com confiança a nenhuma alternativa específica. Verificar contra PDF original na auditoria final.",
    "2025.1-Q100 (ex-PREV-41): alternativas reconstruídas a partir de fragmentos fundidos com outra questão — valores numéricos mantidos fiéis, mas não é transcrição literal de layout original",
    "2025.2-Q34 (ex-PREV-41): finais das alternativas B/C/D completados a partir de truncamento no arquivo fonte — não é transcrição literal 100% confirmada",
    "Confirmar se este módulo tem mais questões nas edições do banco ainda não classificadas e atualizar a seção 3 quando disponível"
  ]
}
```
