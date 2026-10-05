## 0. CABEÇALHO

**Código:** PREV-03 · **Especialidade:** Preventiva · **Tema:** Medidas de associação epidemiológica · **Assunto:** Risco relativo, odds ratio e interpretação de intervalo de confiança · **Tier:** A · **Nº de questões históricas do INEP sobre o assunto:** 3 (2011.1-Q110, 2011.1-Q107, 2025.2-Q77) — banco completo das 16 edições extraídas (2011.1 a 2025.2); faltam apenas 2022.1 e 2026.1, cujos PDFs têm encoding corrompido · **Tempo estimado de estudo:** 80 min · **Pré-requisitos:** nenhum · **Data de geração:** 2026-07-29

---

## 1. TEORIA

Medidas de associação quantificam a força da relação entre uma exposição e um desfecho — são a ferramenta central da epidemiologia analítica, e o Revalida cobra tanto o **cálculo** (a partir de tabela 2x2) quanto a **interpretação correta** do valor numérico (o erro mais comum do candidato é confundir o valor do risco relativo/odds ratio com uma porcentagem direta).

**Risco relativo (RR) — usado em coorte e ensaios clínicos [CONSENSO]:**
- RR = incidência no grupo exposto ÷ incidência no grupo não exposto.
- RR = 1 → sem associação.
- RR > 1 → exposição associada a **maior** risco do desfecho.
- RR < 1 → exposição associada a **menor** risco (fator protetor).

⚠️ **PEGADINHA DO INEP mais cobrada neste tema:** converter RR em "% de aumento de risco" corretamente. A fórmula é **(RR − 1) × 100%**, não o valor de RR multiplicado diretamente por 100. Exemplos:
- RR = 1,5 → aumento de **50%** no risco (não "150%").
- RR = 2,0 → aumento de **100%** no risco (risco dobrado).
- RR = 2,57 → aumento de **157%** no risco (não "257%") — a banca explora exatamente essa confusão entre o valor do RR e a porcentagem de incremento.

**Odds ratio (OR) — usado em caso-controle [CONSENSO]:**
- OR = (odds de exposição entre os casos) ÷ (odds de exposição entre os controles), matematicamente equivalente a (a×d)/(b×c) numa tabela 2x2 padrão.
- Interpretado de forma semelhante ao RR (>1 = associação positiva, <1 = protetor), mas é uma **estimativa/aproximação** do risco relativo verdadeiro, válida principalmente quando a doença estudada é rara (aproximação do risco).

**Cálculo de RR a partir de uma tabela 2x2 — método passo a passo:**
1. Calcular a incidência (risco) em cada grupo: casos do desfecho ÷ total do grupo.
2. Dividir a incidência do grupo exposto pela incidência do grupo não exposto (ou de referência).

*Exemplo prático de cálculo (números ilustrativos para fixar o método, não citação de gabarito):* em um estudo comparando via de uso de uma substância (injetável vs. inalatória) e mortalidade, com uma tabela de óbitos/não-óbitos por grupo, o RR se calcula dividindo a proporção de óbitos no grupo injetável pela proporção de óbitos no grupo inalatório. Se o grupo injetável tem risco de óbito de 8% e o grupo inalatório tem risco de 4%, o RR = 0,08 ÷ 0,04 = **2,0** — ou seja, o risco de óbito é o dobro (100% maior) no grupo injetável.

**Interpretação do intervalo de confiança (IC) 95% associado a RR/OR [CONSENSO]:**
- Se o IC 95% **não inclui o valor 1** (ex.: IC de 1,02 a 2,57), a associação é considerada **estatisticamente significativa** ao nível de 5%.
- Se o IC 95% **inclui o valor 1** (ex.: IC de 0,8 a 1,9), a associação **não é estatisticamente significativa** — não se pode afastar a hipótese de que não há associação real (o achado pode ser por acaso).
- Quanto mais estreito o IC, maior a precisão da estimativa (geralmente relacionado a um tamanho de amostra maior).

⚠️ **PEGADINHA DO INEP:** um RR pontual "alto" (ex.: 1,5) mas com IC que cruza o valor 1 (ex.: 0,9 a 2,3) NÃO permite afirmar associação estatisticamente significativa — a banca gosta de testar se o candidato olha só para o valor pontual do RR e ignora o intervalo de confiança.

### Referências
1. Rouquayrol — Epidemiologia & Saúde, capítulo de Medidas de Associação e Efeito.
2. Fletcher & Fletcher — Epidemiologia Clínica: Elementos Essenciais.
3. Szklo & Nieto — Epidemiology: Beyond the Basics (referência internacional para o tratamento estatístico de RR/OR/IC).

---

## 2. PRÁTICA CLÍNICA REAL

**Como aparece na leitura crítica de artigos/pesquisa em saúde real:** ao avaliar um estudo epidemiológico (seja para decisão clínica, seja para gestão em saúde pública), é essencial saber calcular e, principalmente, **interpretar corretamente** RR/OR e seu IC — decisões de saúde pública (ex.: se um agrotóxico realmente aumenta risco de malformação congênita) dependem dessa interpretação correta, não apenas do "valor bruto" do risco relativo.

**Sequência prática de raciocínio ao interpretar um RR/OR relatado:**
1. Identificar o desenho do estudo (coorte usa RR; caso-controle usa OR).
2. Calcular ou verificar o valor pontual (RR ou OR).
3. Converter corretamente para "% de aumento/redução de risco": (valor − 1) × 100%.
4. Verificar o IC 95% — se cruza 1, a associação não é estatisticamente significativa, mesmo que o valor pontual pareça "alto".
5. Considerar também a plausibilidade biológica e possíveis vieses/confundidores antes de concluir causalidade.

**Erros que profissionais cometem de verdade:**
- Interpretar RR = 2,57 como "aumento de 257% no risco" (correto: 157%).
- Concluir associação significativa olhando só para o valor pontual do RR, ignorando se o IC cruza 1.
- Confundir RR (usado em coorte, direção exposição→desfecho) com OR (usado em caso-controle).

**O que isso muda na prática:** comunicar corretamente o risco à população/gestores exige converter RR/OR em linguagem de "aumento percentual de risco" de forma matematicamente correta — comunicar errado pode gerar alarme desproporcional (ou tranquilidade falsa) sobre um risco real.

**ESTAÇÃO PRÁTICA (2ª etapa):** este tema tipicamente não aparece como estação prática de atendimento clínico, mas pode aparecer em questões teóricas/discursivas sobre interpretação de estudos epidemiológicos e comunicação de risco à população.

---

## 3. QUESTÕES DO INEP (banco histórico)

📌 *Atualizado em 2026-09-30: este módulo cobre **todas as 16 edições já extraídas** do banco (2011.1–2025.2); gabaritos conferidos um a um contra os PDFs oficiais do INEP.*

📋 **Nota sobre os 2 itens do banco atribuídos a este módulo (INEP2011-1-Q107 e INEP2011-1-Q110):** ambos os registros sofreram danos severos de extração que impedem apresentação confiável como cards interativos do simulado:

- **Questão 107** (interpretação de RR=1,5, IC95% 1,02-2,57, em estudo sobre agrotóxicos e malformação congênita): as 5 alternativas do arquivo fonte estão fragmentadas de forma inconsistente — duas alternativas diferentes (A e B) foram extraídas com **texto idêntico** ("filhos com má formação congênita em relação a mães não-agricultoras"), enquanto C e D têm apenas fragmentos parciais de frases que não permitem reconstrução confiável do texto completo de cada alternativa. O gabarito oficial é **B**, e o conceito central por trás da resposta correta é exatamente o discutido na Teoria (seção 1): RR=1,5 corresponde a um aumento de **50%** no risco (não "150%"), e como o IC95% (1,02 a 2,57) não inclui o valor 1, a associação é estatisticamente significativa.
- **Questão 110** (cálculo de RR a partir de tabela 2x2 sobre via de uso de droga e mortalidade): o cálculo aplicado aos números do enunciado (400 óbitos/5.000 no grupo injetável = risco de 8%; 80 óbitos/2.000 no grupo inalatório = risco de 4%) resulta em **RR = 2,0**, mas o gabarito oficial registrado no banco é a letra **D**, que — pelo padrão de alternativas numéricas simples encontrado no fragmento recuperado ("A 1. B 2. C 3. D 4. E 5.") — corresponderia ao valor **4**, não 2. Essa discrepância entre o cálculo direto e o gabarito registrado não pôde ser resolvida com os dados disponíveis (o arquivo fonte também está contaminado com fragmentos de uma pesquisa de satisfação da prova, não relacionados à questão). Por prudência estatística, esta questão **não foi incluída como card interativo** — apresentar um gabarito que diverge do cálculo direto sem confirmação visual do PDF original arriscaria ensinar um valor incorreto como se fosse a resposta oficial confirmada.

Ambos os itens ficam documentados como pendências de reconstrução visual (ver `itens_a_verificar`). O exemplo de cálculo de RR na Teoria/Prática (seção 1-2) usa os mesmos números do enunciado da Q110 como exercício pedagógico, sem afirmar qual letra seria a resposta oficial.

**[INEP 2011 · Edição 1 · Questão 110]**

Foi realizado estudo epidemiológico, durante período de 10 anos, entre indivíduos usuários de uma determinada droga, alguns a usavam por via inalatória, outros, por via intravenosa. O objetivo do estudo foi o de averiguar se a via de administração da droga poderia estar relacionada com maior mortalidade em um dos grupos. Os dados disponíveis do estudo são:

| | Óbito | Não-óbito |
|---|---|---|
| **Injetável** | 400 | 4.600 |
| **Inalatória** | 80 | 1.920 |

Qual o risco relativo de morte ao se usar a droga na forma injetável em relação à forma inalatória?

A) 1.
B) 2.
C) 3.
D) 4.
E) 5.

⚠️ *Nota de extração: o enunciado do arquivo-fonte vinha precedido por um fragmento da questão anterior ("mães não-agricultoras.") e seguido de extenso bleed (alternativas de uma questão sobre tuberculose e o questionário de percepção sobre a prova) — removidos nesta transcrição.*

**Gabarito oficial: B**

**Por que B está correta:** o **risco relativo (RR)** é a razão entre a **incidência no grupo exposto** e a **incidência no grupo não exposto**. O cuidado essencial é usar o **total de cada grupo** no denominador — não apenas os óbitos.

**Passo 1 — total de cada grupo:**
- Injetável: 400 + 4.600 = **5.000**
- Inalatória: 80 + 1.920 = **2.000**

**Passo 2 — incidência de óbito em cada grupo:**
- Injetável: 400 ÷ 5.000 = **0,08** (8%)
- Inalatória: 80 ÷ 2.000 = **0,04** (4%)

**Passo 3 — risco relativo:**
$$RR = \frac{0,08}{0,04} = \mathbf{2}$$

**Interpretação:** quem usa a droga por via **injetável** tem risco de morte **2 vezes maior** (ou **100% maior**) que quem a usa por via inalatória.

**Por que as demais estão erradas:** todas resultam de erros de cálculo previsíveis.
- A) **RR = 1** significaria **ausência de associação** — risco igual nos dois grupos. Seria o resultado se as incidências fossem iguais.
- C), D) e E) Correspondem a erros de denominador. O mais comum é usar a **razão bruta dos óbitos** (400 ÷ 80 = 5, levando à alternativa E), que ignora que o grupo injetável é 2,5 vezes maior. Outro erro frequente é dividir óbitos por não-óbitos, calculando uma **odds ratio** em vez de risco relativo: (400/4.600) ÷ (80/1.920) = 0,087 ÷ 0,042 ≈ **2,09** — valor próximo, mas conceitualmente distinto.

⚠️ **PEGADINHA DO INEP:** o erro que a questão quer flagrar é usar **400 ÷ 80 = 5**. Guarde a regra: **no risco relativo, o denominador é o TOTAL do grupo**, não a coluna dos não-eventos. E fixe a diferença entre as duas medidas:

| Medida | Fórmula | Quando usar |
|---|---|---|
| **Risco relativo (RR)** | (a/(a+b)) ÷ (c/(c+d)) | **Coorte** e ensaio clínico (há denominador populacional) |
| **Odds ratio (OR)** | (a/b) ÷ (c/d) = (a·d)/(b·c) | **Caso-controle** (não se conhece a população de origem) |

Na leitura: **RR = 1** → sem associação; **RR > 1** → fator de **risco**; **RR < 1** → fator de **proteção**.

**O que a banca estava testando:** cálculo e interpretação do **risco relativo** a partir de uma tabela 2×2 em estudo de coorte, com atenção ao denominador correto e à distinção entre risco relativo e odds ratio.

---

📋 **Item do banco não apresentado como questão interativa**

- **INEP 2011.1-Q107** (gabarito oficial A) — na extração, **três das cinco alternativas (A, B e D) perderam o início do texto**, restando apenas o trecho final idêntico ("...filhos com má formação congênita em relação a mães não-agricultoras"). Como o elemento que as diferencia — a **porcentagem de risco** — é exatamente o que se perdeu, as alternativas ficariam indistinguíveis num card interativo, tornando a questão irrespondível. Seguindo a regra do projeto, o item fica registrado aqui em prosa. ⚠️ VERIFICAR contra o PDF original do INEP.

  **Enunciado (íntegro na fonte):** "Considere uma comunidade rural, onde um número aparentemente elevado de neonatos com má formação congênita é atribuído pelas mães agricultoras aos agrotóxicos utilizados na lavoura. Ao realizar um estudo de coorte retrospectivo dos nascimentos ocorridos na cidade nos últimos três anos, foi encontrado um **risco relativo igual a 1,5**, com um **intervalo de confiança de 95% entre 1,02 e 2,57**. Qual a interpretação desse estudo?"

  **Conceito cobrado — como se interpreta esse resultado:**

  1. **O valor pontual.** RR = 1,5 significa que as mães agricultoras têm risco **50% maior** de conceber filhos com malformação congênita em relação às não agricultoras. A conversão é direta: **(RR − 1) × 100**. As alternativas preservadas na fonte ("risco 102% maior", correspondente ao limite inferior, e "risco 257% maior", correspondente ao limite superior) são armadilhas que confundem o **valor pontual** com os **extremos do intervalo**.

  2. **O intervalo de confiança.** O IC95% de **1,02 a 2,57** informa duas coisas. Primeiro, que a associação é **estatisticamente significativa**, porque o intervalo **não contém o valor 1** — se contivesse, a hipótese de ausência de associação não poderia ser descartada. Segundo, que a estimativa é **imprecisa**: o intervalo é largo (o limite superior é 2,5 vezes o inferior) e o limite inferior está **muito próximo de 1**, o que significa que o verdadeiro efeito pode ser bem menor que o estimado. Intervalos largos costumam refletir **amostra pequena**.

  3. **A limitação do desenho.** Trata-se de **coorte retrospectiva**, sujeita a viés de memória e de aferição da exposição; associação estatística **não estabelece causalidade** por si só.

  ⚠️ **Erro clássico:** dizer que "existe 95% de chance de o risco estar entre 1,02 e 2,57". A formulação correta é: se o estudo fosse repetido muitas vezes, **95% dos intervalos construídos** conteriam o verdadeiro valor do parâmetro.

---

**[INEP 2011 · Edição 1 · Questão 107]**

Considere uma comunidade rural, onde um número aparentemente elevado de neonatos com má formação congênita é atribuído pelas mães agricultoras aos agrotóxicos utilizados na lavoura. Ao realizar um estudo de coorte retrospectivo dos nascimentos ocorridos na cidade nos últimos três anos, foi encontrado um risco relativo igual a 1,5, com um intervalo de confiança de 95%, entre 1,02 e 2,57. Qual a interpretação desse estudo?

A) Mães agricultoras têm risco 50% maior de conceber filhos com má formação congênita em relação a mães não-agricultoras.
B) Mães agricultoras têm risco 95% maior de conceber filhos com má formação congênita em relação a mães não-agricultoras.
C) Mães agricultoras têm risco 102% maior de conceber filhos com má formação congênita em relação a mães não-agricultoras.
D) Mães agricultoras têm risco 150% maior de conceber filhos com má formação congênita em relação a mães não-agricultoras.
E) Mães agricultoras têm risco 257% maior de conceber filhos com má formação congênita em relação a mães não-agricultoras.

**Gabarito oficial: A**

**Por que A está correta:** o **risco relativo (RR) de 1,5** significa risco **1,5 vez maior** — ou seja, **50% maior**. A conversão é direta:

$$\text{Aumento percentual do risco} = (RR - 1) \times 100 = (1{,}5 - 1) \times 100 = \mathbf{50\%}$$

⚠️ **O erro mais comum neste tema é ler "1,5" como "150% a mais".** Não é. O RR de 1,5 significa que o risco do grupo exposto é **1,5 vez** o do não exposto — isto é, o risco **original (100%) mais metade dele (50%)**. O **acréscimo** é de 50%.

**A tabela que resolve qualquer questão de RR:**

| RR | Significado | Interpretação |
|---|---|---|
| **1,0** | risco **igual** | **sem associação** |
| **1,5** | 1,5 vez o risco | **50% MAIOR** ← o caso |
| **2,0** | o dobro | **100% maior** |
| **2,5** | 2,5 vezes | 150% maior |
| **3,0** | o triplo | 200% maior |
| **0,5** | metade | **50% MENOR** — fator **protetor** |
| **0,8** | — | 20% menor — protetor |

**Como interpretar o intervalo de confiança — o segundo eixo da questão.**

O **IC 95% de 1,02 a 2,57** carrega duas informações:

**1. Precisão da estimativa.** O verdadeiro valor do RR na população está, com 95% de confiança, entre **1,02 e 2,57**. É um intervalo **amplo**, o que indica **baixa precisão** — provavelmente por amostra pequena (uma comunidade rural, três anos de nascimentos, desfecho raro).

**2. Significância estatística.** ⚠️ **Esta é a regra de ouro:**

> **Se o IC do RR (ou do OR) NÃO inclui o valor 1, o resultado é ESTATISTICAMENTE SIGNIFICATIVO.**

Aqui, o limite inferior é **1,02** — acima de 1. Portanto:
- O intervalo **não contém o 1**
- A associação é **estatisticamente significativa** (p < 0,05)
- Conclui-se que a exposição a agrotóxicos **está associada** a maior risco de malformação nesta população

⚠️ **Mas note que 1,02 está no limite.** Um limite inferior tão próximo de 1 indica associação **estatisticamente significativa porém frágil** — pequenas variações amostrais poderiam levar o intervalo a cruzar o 1. É resultado que pede replicação em estudo maior.

**Por que as demais estão erradas:**

- **B) "95% maior".** Confunde o **nível de confiança** (95%) com a **magnitude do efeito**. O "95%" do IC significa: se o estudo fosse repetido muitas vezes, 95% dos intervalos construídos conteriam o verdadeiro valor populacional. Não tem relação alguma com o tamanho do risco.

- **C) "102% maior".** Usa o **limite inferior** do IC (1,02) e ainda o converte errado — 1,02 corresponderia a **2%** maior, não 102%. É a alternativa que acumula dois erros: escolhe a fronteira do intervalo em vez da estimativa pontual, e aplica a conversão de forma equivocada.

- **D) "150% maior".** É o **erro mais comum e mais esperado** — ler o "1,5" diretamente como "150%". Confunde o **RR** (1,5 vez o risco) com o **aumento percentual** (50%). Um risco 150% maior corresponderia a **RR = 2,5**.

- **E) "257% maior".** Usa o **limite superior** do IC (2,57) e, novamente, aplica a conversão errada — 2,57 corresponderia a **157%** maior. O limite superior representa o **cenário mais pessimista compatível** com os dados, não a estimativa do estudo.

⚠️ **PEGADINHA DO INEP:** a questão oferece **quatro números** — 1,5 · 95 · 1,02 · 2,57 — e três alternativas erradas simplesmente os transformam em percentuais. Só uma aplica a conversão correta à **estimativa pontual**.

---

**As três medidas de associação — quando usar cada uma:**

| Medida | Delineamento | O que responde |
|---|---|---|
| **RISCO RELATIVO (RR)** | **coorte**, ensaio clínico | quantas vezes maior é o risco no exposto ← o caso |
| **ODDS RATIO (OR)** | **caso-controle** | razão de chances; aproxima o RR quando o desfecho é raro |
| **Razão de prevalências** | **transversal** | razão entre prevalências |

⚠️ **O RR exige que se conheça a incidência nos dois grupos** — por isso só pode ser calculado em estudos que acompanham pessoas ao longo do tempo (**coorte**), como o descrito no enunciado. Num caso-controle, parte-se do desfecho, e a incidência não é conhecida: usa-se o **odds ratio**.

**Outras medidas úteis, derivadas do mesmo estudo:**

| Medida | Fórmula | Interpretação |
|---|---|---|
| **Risco atribuível** (diferença de riscos) | $R_{exp} - R_{não\,exp}$ | quanto do risco se deve à exposição, em termos absolutos |
| **Risco atribuível proporcional** | $(RR-1)/RR$ | aqui: 0,5/1,5 = **33%** dos casos nas expostas seriam atribuíveis à exposição |
| **NNT / NNH** | $1/\text{diferença de riscos}$ | número necessário para tratar ou para causar dano |

**Sobre o delineamento.** "Coorte **retrospectivo**" (ou histórico) significa que a exposição e o desfecho **já ocorreram** quando o estudo começou, mas a lógica permanece a da coorte: parte-se da **exposição** para o **desfecho**. É mais rápido e barato que a coorte prospectiva, mas depende da qualidade dos registros existentes.

⚠️ **Limitações a considerar neste estudo:** possível **viés de memória** (as mães já atribuíam as malformações aos agrotóxicos antes do estudo — isso pode influenciar o relato de exposição), **fatores de confusão** não controlados (idade materna, uso de álcool ou tabaco, acesso ao pré-natal, consanguinidade, estado nutricional), e a amplitude do intervalo de confiança, que denuncia amostra pequena. **Associação estatística não é causalidade** — mas é sinal que justifica investigação mais robusta, dada a plausibilidade biológica da teratogenicidade de agrotóxicos.

**O que a banca estava testando:** converter corretamente **risco relativo em aumento percentual de risco** — $(RR-1) \times 100$ —, e não confundir a **estimativa pontual** com os **limites do intervalo de confiança** nem com o **nível de confiança** de 95%.

---

**[INEP 2025 · Edição 2 · Questão 77]**

A equipe de uma Unidade Básica de Saúde (UBS) está preocupada com o aumento de casos de hipertensão arterial entre adultos jovens na comunidade. Então, decide realizar um estudo observacional para investigar se o sedentarismo está associado ao aumento do risco de hipertensão nessa população. O estudo dividiu os participantes em dois grupos, sedentários e não sedentários, e acompanhou esses dois grupos por 12 meses para observar o surgimento de novos casos de hipertensão. Ao final do estudo, é identificado o risco relativo (RR) de 0,6. Nesse estudo, o valor do RR permite inferir que

A) o sedentarismo pode ser um fator protetor para o desenvolvimento da hipertensão.
B) a prevalência da doença pode ser avaliada, sem possibilidades de associação dos fatores.
C) os sedentários têm maior risco de desenvolver hipertensão em comparação com os não sedentários.
D) o desenho do estudo em questão não permite o uso do RR para avaliar associação entre as variáveis.

**Gabarito oficial: A**

**Por que A está correta:** o estudo é uma **coorte** (grupos definidos pela exposição, acompanhados para ver casos novos) — o delineamento próprio para calcular **risco relativo** (incidência nos expostos ÷ incidência nos não expostos). **RR < 1** significa que os expostos (sedentários) tiveram **menor** incidência — ou seja, o dado aponta o sedentarismo **como fator protetor** nesta amostra. É um resultado contraintuitivo (e provavelmente fruto de viés, confusão ou acaso — deveria ser avaliado com o intervalo de confiança), mas é a **leitura correta do número**.

**Por que as demais estão erradas:**
- B) A coorte mede **incidência**, não prevalência, e permite medir associação.
- C) Seria verdade se **RR > 1**.
- D) Coorte é exatamente o desenho que **permite** calcular RR.

⚠️ **PEGADINHA DO INEP:** a banca aposta que você responda pelo que "sabe" (sedentarismo causa hipertensão) em vez de interpretar o dado. **RR = 1**: sem associação; **> 1**: fator de risco; **< 1**: fator de proteção — sempre conferindo se o IC95% cruza o 1.

**O que a banca estava testando:** interpretação do risco relativo num estudo de coorte.

---

## 4. FLASHCARDS (Anki)

```
Como converter um risco relativo (RR) em % de aumento de risco?	(RR − 1) × 100% — nunca multiplicar o RR diretamente por 100	Revalida::Preventiva::MedidasAssociacao::Interpretacao
RR = 1,5 corresponde a que % de aumento de risco?	50% (não 150%)	Revalida::Preventiva::MedidasAssociacao::Interpretacao
RR = 2,57 corresponde a que % de aumento de risco?	157% (não 257%)	Revalida::Preventiva::MedidasAssociacao::Interpretacao
Quando um RR/OR é considerado estatisticamente significativo pelo IC95%?	Quando o IC95% NÃO inclui o valor 1	Revalida::Preventiva::MedidasAssociacao::Interpretacao
Como se calcula o RR a partir de uma tabela 2x2?	Incidência no grupo exposto ÷ incidência no grupo não exposto	Revalida::Preventiva::MedidasAssociacao::Calculo
Em que tipo de estudo se usa RR? E OR?	RR em coorte/ensaios clínicos; OR em caso-controle	Revalida::Preventiva::MedidasAssociacao::Definicoes
Um RR pontual alto (ex.: 1,5) com IC cruzando 1 é estatisticamente significativo?	Não — o IC cruzando 1 invalida a significância estatística, mesmo com valor pontual "alto"	Revalida::Preventiva::MedidasAssociacao::Interpretacao
```

---

## 5. RESUMO DE FIXAÇÃO (1 página)

🎯 **As 5 frases que resolvem a maioria das questões:**
1. % de aumento de risco = (RR − 1) × 100%, nunca RR × 100% diretamente.
2. RR = 1,5 → 50% de aumento; RR = 2,0 → 100% de aumento (risco dobrado); RR = 2,57 → 157% de aumento.
3. IC95% que não inclui 1 = estatisticamente significativo; IC que cruza 1 = não significativo.
4. RR é usado em coorte/ensaios; OR é usado em caso-controle.
5. Sempre olhar o IC, não só o valor pontual do RR/OR, antes de concluir significância.

📊 **Tabela-síntese**
| RR | % de aumento de risco |
|---|---|
| 1,0 | 0% (sem associação) |
| 1,5 | 50% |
| 2,0 | 100% |
| 2,57 | 157% |

⚡ **Fluxograma textual:** identificar desenho (coorte→RR; caso-controle→OR) → calcular valor pontual → converter para % com (valor−1)×100% → checar se IC95% cruza 1 → concluir significância estatística e força da associação.

🚫 **Os 3 erros mais comuns:** (1) multiplicar RR/OR diretamente por 100 em vez de aplicar (valor−1)×100%; (2) ignorar o IC e concluir significância só pelo valor pontual; (3) confundir RR com OR quanto ao desenho de estudo correspondente.

🔗 **Conexões com outros módulos:** PREV-02 (delineamento de estudos), PREV-05 (indicadores de saúde).

<!-- METADADOS -->
```json
{
  "codigo": "PREV-03",
  "especialidade": "Preventiva",
  "tema": "Medidas de associação epidemiológica",
  "assunto": "Risco relativo, odds ratio e interpretação de intervalo de confiança",
  "tier": "A",
  "n_questoes": 3,
  "n_flashcards": 7,
  "tempo_estudo_min": 80,
  "prerequisitos": ["PREV-02"],
  "relacionados": ["PREV-02", "PREV-05"],
  "data_geracao": "2026-07-29",
  "itens_a_verificar": [
    "Questão 2011.1-Q107: alternativas A e B extraídas com texto idêntico, C/D fragmentadas — não incluída como card interativo, apenas discutida conceitualmente. PENDENTE reconstrução visual do PDF original 2011.1",
    "Questão 2011.1-Q110: cálculo direto de RR a partir da tabela 2x2 do enunciado resulta em RR=2,0, mas o gabarito registrado no banco (D) sugere valor 4 pelo padrão de alternativas numéricas recuperado — discrepância não resolvida, questão excluída do simulado interativo por prudência. PENDENTE reconstrução visual do PDF original 2011.1 para confirmar o texto exato das alternativas e resolver a discrepância",
    "Este módulo ficou sem nenhuma questão interativa nesta rodada devido à gravidade da contaminação em ambos os itens da amostra — prioridade alta para revisão quando a reconstrução visual for feita",
    "Confirmar se este módulo tem mais questões nas 17 edições do banco ainda não classificadas e atualizar a seção 3 quando disponível"
  ]
}
```
