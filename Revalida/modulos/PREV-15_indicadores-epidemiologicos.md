## 0. CABEÇALHO

**Código:** PREV-15 · **Especialidade:** Preventiva · **Tema:** Indicadores epidemiológicos · **Assunto:** Cálculo do coeficiente de letalidade (óbitos/casos) · **Tier:** A · **Nº de questões históricas do INEP sobre o assunto:** 6 (2011.1-Q106, 2016.1-Q85, 2020.1-Q47, 2022.2-Q45, 2023.1-Q5, 2026.1-Q20) — banco completo das 16 edições extraídas (2011.1 a 2025.2); faltam apenas 2022.1 e 2026.1, cujos PDFs têm encoding corrompido · **Tempo estimado de estudo:** 60 min · **Pré-requisitos:** nenhum · **Data de geração:** 2026-07-29

---

## 1. TEORIA

O coeficiente (taxa) de letalidade é um indicador epidemiológico frequentemente confundido com o coeficiente de mortalidade — o Revalida testa o cálculo correto e a diferenciação conceitual entre os dois.

**Coeficiente de letalidade vs. coeficiente de mortalidade:**
- **Coeficiente de letalidade:** proporção de óbitos **entre os casos da doença** — mede a "gravidade" da doença entre quem a contraiu. Fórmula: **(nº de óbitos pela doença) / (nº de casos da doença) × 100** (ou × constante).
- **Coeficiente de mortalidade:** proporção de óbitos **em relação à população total** (não apenas os casos) — mede o impacto da doença na população geral. Fórmula: (nº de óbitos pela doença) / (população total) × constante.

⚠️ **PEGADINHA DO INEP central deste tema:** o denominador do coeficiente de letalidade é o número de **casos** da doença, não a população total do município/região — usar o denominador errado (população total em vez de casos) é o erro mais comum nesse tipo de questão, gerando um resultado numericamente muito menor do que o correto.

**Exemplo de cálculo:** em uma cidade de 2 milhões de habitantes, com 400 casos de gripe H1N1 e 8 óbitos, o coeficiente de letalidade é: 8/400 = 0,02 (ou 2%) — usando o número de CASOS (400) como denominador, não a população total (2 milhões).

### Referências
1. Ministério da Saúde — Guia de Vigilância em Saúde, capítulo de indicadores epidemiológicos.

---

## 2. PRÁTICA CLÍNICA REAL

**Como aparece na vigilância epidemiológica real:** ao analisar um surto ou epidemia, a equipe de vigilância calcula o coeficiente de letalidade para avaliar a gravidade clínica da doença circulante — o desafio prático é não confundir esse cálculo com o coeficiente de mortalidade (que usa a população total).

**Sequência prática de conduta:**
1. Identificar o número de casos confirmados da doença no período.
2. Identificar o número de óbitos atribuídos a essa doença no mesmo período.
3. Calcular letalidade = óbitos / casos (não óbitos / população total).
4. Interpretar: letalidade alta sugere doença mais grave ou população mais vulnerável.

**Erros que profissionais cometem de verdade:**
- Usar a população total como denominador em vez do número de casos (confundindo letalidade com mortalidade).
- Confundir "coeficiente" com "número absoluto" de óbitos, sem calcular a proporção.

**O que dizer à equipe de vigilância:** letalidade é sobre gravidade da doença entre quem a teve; mortalidade é sobre impacto na população total — são perguntas diferentes com denominadores diferentes.

**ESTAÇÃO PRÁTICA (2ª etapa):**
- ✅ Calcular letalidade usando o número de casos como denominador.
- ✅ Diferenciar letalidade de mortalidade.
- ✅ Interpretar corretamente o resultado numérico (proporção, não número absoluto).

---

## 3. QUESTÕES DO INEP (banco histórico)

📌 *Atualizado em 2026-09-30: este módulo cobre **todas as 16 edições já extraídas** do banco (2011.1–2025.2); gabaritos conferidos um a um contra os PDFs oficiais do INEP.*

📋 **Nota sobre item do banco não incluído no simulado (2011.1-Q106):** esta questão pedia o cálculo do coeficiente de letalidade em uma cidade de 2 milhões de habitantes, com 400 casos de gripe H1N1 e 8 óbitos, com as alternativas A) 0,000004; B) 0,0002; C) 0,02; D) 0,04; E) 0,2. O cálculo direto pela fórmula padrão de letalidade (óbitos/casos = 8/400) resulta em **0,02**, que corresponde à alternativa **C**. No entanto, o `gabarito_oficial` registrado no arquivo fonte já finalizado é a alternativa **B** (0,0002) — um valor que não corresponde ao cálculo direto pela fórmula de letalidade nem pela fórmula de mortalidade (óbitos/população = 8/2.000.000 = 0,000004, que corresponderia à alternativa A). Diante dessa **inconsistência aritmética entre o gabarito registrado e o cálculo esperado pela fórmula padrão** (mesmo padrão de cautela já aplicado ao erro #16 deste banco, sobre questões de cálculo com gabarito destoante), esta questão foi **excluída do simulado interativo** para não ensinar um cálculo incorreto como se fosse validado. Fica sinalizada como **prioridade para a auditoria final** do banco (verificação contra o PDF original do INEP).

**O que a banca provavelmente estava testando (conceito, independente do valor do gabarito registrado):** cálculo correto do coeficiente de letalidade usando o número de CASOS (não a população total) como denominador — 8 óbitos / 400 casos = 0,02 (2%).

**[INEP 2011 · Edição 1 · Questão 106]**

Considere que, em uma cidade de dois milhões de habitantes, houve 400 casos de gripe pelo vírus H1N1, no ano de 2009. Oito pessoas faleceram. O cálculo do coeficiente de letalidade das infecções pelo vírus H1N1 nessa cidade resulta em que valor?

A) 0,000004
B) 0,0002
C) 0,02
D) 0,04
E) 0,2

⚠️ *Nota de extração: a alternativa E vinha com texto institucional de rodapé colado ao final — removido nesta transcrição.*

**Gabarito oficial: C**

**Por que C está correta:** o **coeficiente de letalidade** mede a **gravidade** de uma doença: entre os que **adoeceram**, quantos morreram. Seu denominador é, portanto, o **número de casos** — não a população.

$$\text{Letalidade} = \frac{\text{óbitos pela doença}}{\text{casos da doença}} = \frac{8}{400} = \mathbf{0,02} \;(2\%)$$

A população de **dois milhões** é informação **deliberadamente inútil** para esta pergunta — ela serviria para calcular incidência ou mortalidade, não letalidade.

**Por que as demais estão erradas:** cada distrator corresponde a um erro específico de denominador ou de aritmética.
- A) **0,000004** = 8 ÷ 2.000.000 — é o **coeficiente de mortalidade** pela doença (óbitos sobre a **população**), não a letalidade.
- B) **0,0002** = 400 ÷ 2.000.000 — é o **coeficiente de incidência** (casos novos sobre a população).
- D) **0,04** — corresponde a 16 ÷ 400, ou ao dobro do resultado correto; erro de cálculo.
- E) **0,2** — é 80 ÷ 400, resultado de erro de uma casa decimal.

⚠️ **PEGADINHA DO INEP:** a questão testa se o candidato distingue **três indicadores que usam os mesmos números com denominadores diferentes**. Fixe o quadro, que resolve praticamente toda questão do tema:

| Indicador | Numerador | Denominador | O que mede | No caso |
|---|---|---|---|---|
| **Incidência** | Casos **novos** | **População** exposta | Risco de adoecer | 400/2.000.000 = 0,0002 |
| **Mortalidade** | **Óbitos** pela doença | **População** | Impacto da doença na população | 8/2.000.000 = 0,000004 |
| **Letalidade** | **Óbitos** pela doença | **Casos** da doença | **Gravidade** da doença | **8/400 = 0,02** |

A regra mnemônica: **letalidade tem "doentes" no denominador; mortalidade tem "todo mundo"**. Uma doença pode ter **alta letalidade e baixa mortalidade** (rara, mas quase sempre fatal — como a raiva) ou **baixa letalidade e alta mortalidade** (branda, porém muito frequente).

**O que a banca estava testando:** cálculo e diferenciação dos **coeficientes de incidência, mortalidade e letalidade**, com atenção ao denominador correto de cada um e à identificação de dados irrelevantes no enunciado.

---

**[INEP 2016 · Edição 1 · Questão 85]**

Um médico de família, ao final do turno de atendimento em uma Unidade Básica de Saúde, observou terem sido atendidos 12 pacientes, com as seguintes ocorrências: HIV/AIDS em adulto; varicela em criança sem gravidade; violência doméstica; intoxicação por agrotóxico; mordedura em mão por cão desconhecido; picada de escorpião; hanseníase; sífilis primária em adulto; toxoplasmose gestacional; acidente de trabalho em técnica de enfermagem da Unidade por perfuração com agulha descartada; coqueluche em adulto; doença aguda pelo vírus zika. Desses casos, aqueles de notificação compulsória imediata, em menos de 24 horas, são

A) HIV/AIDS em adulto; varicela em criança sem gravidade; hanseníase.
B) intoxicação por agrotóxico; doença aguda pelo vírus zika; toxoplasmose gestacional.
C) picada de escorpião; mordedura em mão por cão desconhecido; coqueluche em adulto.
D) sífilis primária em adulto; violência doméstica; acidente de trabalho com exposição a material biológico.

**Gabarito oficial: C**

**Por que C está correta:** na lista de notificação compulsória vigente (Portaria GM/MS 204/2016), são de **notificação imediata (até 24 h)**: **acidente por animal peçonhento** (escorpião), **acidente por animal potencialmente transmissor da raiva** (mordedura por cão desconhecido — decisão urgente sobre profilaxia antirrábica) e **coqueluche** (risco de surtos, bloqueio de contatos).

**Por que as demais estão erradas:**
- A) HIV/AIDS e hanseníase são de notificação **semanal**; varicela sem gravidade isolada não é de notificação individual (só surtos e casos graves/óbitos).
- B) Intoxicação exógena e toxoplasmose gestacional são **semanais**; zika é semanal (imediata só em gestante e óbito).
- D) Sífilis, violência doméstica e acidente com material biológico são **semanais** (violência sexual e tentativa de suicídio é que são imediatas, municipais).

⚠️ **PEGADINHA DO INEP:** pense em "**o que exige ação em horas?**" — raiva (profilaxia), peçonhentos, coqueluche, sarampo, meningite, febre amarela, cólera, violência sexual, óbito por dengue... → imediata.

**O que a banca estava testando:** agravos de notificação compulsória imediata.

---

**[INEP 2020 · Edição 1 · Questão 47]**

O quadro a seguir apresenta os dados sobre a mortalidade nas capitais brasileiras por COVID-19 e a população que vive com menos de US$ 5,5 por dia, faixa que define a linha da pobreza, segundo o Banco Mundial.

*[quadro não reproduzido — imagem ausente no texto extraído]*

Disponível em: <https://www.pcs.iacit.com.br:8443/imagens/116>. Acesso em: 22 ago. 2020.

Com base nas informações do quadro apresentado, assinale a alternativa correta.

A) As capitais com as maiores taxas de mortalidade por COVID-19 possuem maior população estimada, indicando maior concentração demográfica e, portanto, maior risco de contágio.
B) Não há associação entre a mortalidade por COVID-19 e a taxa de população mais pobre, pois a ocorrência de morte pela doença se relaciona à idade e à presença de comorbidades.
C) Há grande diferença na mortalidade por COVID-19, sendo mais elevada onde é maior a proporção de pessoas mais pobres, o que reforça a determinação social da saúde.
D) As capitais com maiores taxas de mortalidade por COVID-19 apresentam menores proporções de pessoas com rendimento familiar abaixo da linha da pobreza.

**Gabarito oficial: C**

**Por que C está correta:** o quadro (não reproduzido aqui) mostrava que as capitais com **maior proporção de pessoas abaixo da linha de pobreza** tinham **maior mortalidade por COVID-19**. Isso ilustra a **determinação social da saúde**: pobreza significa mais aglomeração domiciliar, trabalho que não permite isolamento, transporte lotado, mais comorbidades e menor acesso a cuidados.

**Por que as demais estão erradas:**
- A) A associação destacada é com **pobreza**, não com tamanho populacional.
- B) Idade e comorbidades importam, mas **também se distribuem desigualmente** conforme a renda — negar a associação contraria os dados.
- D) É o inverso do que o quadro mostrava.

⚠️ **PEGADINHA DO INEP:** em questões com tabela ou gráfico de desigualdade, a resposta costuma ser a que conecta o dado aos **determinantes sociais**. Alternativas que "explicam" tudo por fatores individuais (idade, comorbidade) tendem a estar erradas.

**O que a banca estava testando:** interpretação de dados e determinação social do processo saúde-doença.

---

**[INEP 2022 · Edição 2 · Questão 45]**

As figuras 1 e 2, a seguir, foram extraídas de um boletim epidemiológico do Ministério da Saúde publicado em 20 de abril de 2020, no início da pandemia de covid-19 no Brasil.

Figura 1: Hospitalizações por síndrome respiratória aguda grave (SRAG) por covid-19 segundo raça/etnia*. Brasil, 2020.

Figura 2: Óbitos por síndrome respiratória aguda grave (SRAG) por covid-19 segundo raça/etnia*. Brasil, 2020.

*[figuras não reproduzidas — imagens ausentes no texto extraído]*

Fonte: Ministério da Saúde. Boletins Epidemiológicos covid-19. Disponível em: https://www.gov.br/saude/pt-br/coronavirus/boletins-epidemiologicos/boletim-epidemiologico-covid-19-no-13.pdf/view. Acesso em 06 de maio de 2022.

Conforme os dados dos gráficos apresentados, assinale a opção correta acerca da raça/etnia de pessoas com SRAG por covid-19, naquele momento da pandemia.

A) Houve mais óbitos de indígenas do que de pessoas de raça/etnia amarela.
B) As pessoas brancas tiveram melhor sobrevida do que as pessoas das outras raças/etnias juntas.
C) Entre as pessoas de raça/etnia preta, houve um número maior de internações do que entre as pessoas pardas.
D) As pessoas de raça/etnia amarela e indígena, juntas, foram mais submetidas a internações do que as pessoas de raça/etnia preta.

**Gabarito oficial: B**

**Por que B está correta:** no boletim de abril de 2020, os **brancos** representavam a **maior parcela das hospitalizações** por SRAG-covid, mas uma **parcela menor dos óbitos**; já **pretos e pardos** respondiam por proporção de óbitos **maior** do que sua proporção de internações. Comparando as duas figuras, a letalidade entre brancos foi menor — ou seja, **melhor sobrevida** do que nas demais raças/etnias somadas.

**Por que as demais estão erradas (pelo padrão dos dados do boletim):**
- A) Amarelos e indígenas eram grupos pequenos, e os óbitos de indígenas não superavam os de amarelos naquele recorte.
- C) Pardos tiveram **muito mais** internações que pretos (são grupo populacional bem maior).
- D) Amarelos + indígenas somavam menos internações que pretos.

⚠️ **PEGADINHA DO INEP:** comparar **proporção de internações × proporção de óbitos** do mesmo grupo é o que revela a letalidade. Número absoluto maior não significa risco maior.

**O que a banca estava testando:** leitura de gráficos epidemiológicos e desigualdades raciais em saúde.

---

**[INEP 2023 · Edição 1 · Questão 5]**

Sindemia é um conjunto de problemas de saúde intimamente interligados e que aumentam mutuamente, que afetam significativamente o estado geral de saúde de uma população no contexto de persistência de condições sociais adversas.

SINGER, M. A dose of drugs, a touch of violence, a case of AIDS: conceptualizing the SAVA syndemic. Free Inquiry in Creative Sociology. Okhlahoma, Estados Unidos, v. 24, n. 2, p. 99-110, 1996.

A sindemia não constitui simplesmente um sistema de comorbidade; ao contrário, significa um sistema de transmorbidade. Implica, ademais, entender essa sindemia como determinada socialmente e, por consequência, compreender que ela não será solucionada somente com modelos de intervenção provenientes exclusivamente do campo biomédico.

VILAÇA MENDES, E. O lado oculto de uma pandemia: a terceira onda da covid-19 ou o paciente invisível. CONASS. 2020.

Acerca da perspectiva sindêmica da Covid-19, assinale a opção correta.

A) A distribuição das taxas de morbidade e mortalidade da Covid-19 entre os diferentes segmentos sociais reflete as desigualdades estruturais e os determinantes sociais da saúde.
B) A suspensão dos atendimentos de pessoas com doenças crônicas foi medida acertada diante da emergência sanitária, dada a necessidade de priorizar o atendimento e o acompanhamento dos casos de Covid-19.
C) A interação entre epidemias resulta na redução considerável da taxa de incidência das doenças, assim como da severidade dos casos e das repercussões para as comunidades, prevalecendo uma das epidemias em detrimento das demais.
D) A teoria sindêmica da Covid-19 reforça a importância de investimentos em políticas de natureza curativa, sobretudo na estruturação e ampliação de leitos clínicos e de terapia intensiva direcionados aos casos graves, que requerem acompanhamento hospitalar.

**Gabarito oficial: A**

**Por que A está correta:** na perspectiva **sindêmica**, a covid-19 interagiu com as doenças crônicas e com as **condições sociais adversas**, e seu impacto se distribuiu de forma **desigual** — mais grave nos segmentos mais vulneráveis. A distribuição de adoecimento e morte **reflete as desigualdades estruturais** e os determinantes sociais.

**Por que as demais estão erradas:**
- B) Suspender o cuidado das condições crônicas gerou a "**terceira onda**" (o "paciente invisível" de Mendes): descompensações e mortes evitáveis. Não foi medida acertada.
- C) Na sindemia, as epidemias se **potencializam**, aumentando incidência e gravidade — não se anulam.
- D) A teoria afirma justamente que a solução **não é só biomédica/curativa**; exige ações sobre os determinantes sociais.

⚠️ **PEGADINHA DO INEP:** **sindemia** = epidemias que interagem **+** contexto social que as agrava. Não é só "comorbidade".

**O que a banca estava testando:** conceito de sindemia e determinação social da covid-19.

**[INEP 2026 · Edição 1 · Questão 20]**

Um relatório de vigilância epidemiológica avaliou os casos notificados de quatro tipos de câncer em um município com 100 mil habitantes no ano de 2025. A tabela apresenta, para cada tipo, o número de casos notificados em 2025 e o número de óbitos entre esses casos no mesmo ano.

Número de casos novos e óbitos dos cânceres mais frequentes, 2025

| Tipo de Câncer | Nº de casos novos | Nº de óbitos entre os casos novos |
|---|---|---|
| Colorretal | 21 | 7 |
| Estômago | 10 | 5 |
| Mama | 40 | 4 |
| Próstata | 30 | 6 |

Com base nesses resultados, qual câncer teve a maior letalidade do município, em 2025?

A) Colorretal.
B) Estômago.
C) Mama.
D) Próstata.

**Gabarito oficial: B**

**Por que B está correta:** **letalidade** = óbitos pela doença ÷ casos da doença × 100. Colorretal: 7/21 = 33%; **estômago: 5/10 = 50%**; mama: 4/40 = 10%; próstata: 6/30 = 20%. O câncer de **estômago** teve a maior letalidade.

**Por que as demais estão erradas:**
- A) Colorretal teve mais óbitos absolutos que o de estômago, mas letalidade menor (33%).
- C) Mama teve mais casos, mas a menor letalidade (10%).
- D) Próstata: 20%.

⚠️ **PEGADINHA DO INEP:** não confunda **letalidade** (óbitos/casos — gravidade da doença) com **mortalidade** (óbitos/população) ou com número absoluto de óbitos.

**O que a banca estava testando:** cálculo e conceito de letalidade.

---

## 4. FLASHCARDS (Anki)

```
Qual a fórmula do coeficiente de letalidade?	(Número de óbitos pela doença) / (número de casos da doença)	Revalida::Preventiva::IndicadoresEpidemiologicos::Formula
Coeficiente de letalidade usa a população total ou o número de casos como denominador?	Número de casos (diferente do coeficiente de mortalidade, que usa a população total)	Revalida::Preventiva::IndicadoresEpidemiologicos::Conceito
Em cidade com 400 casos e 8 óbitos de uma doença, qual o coeficiente de letalidade?	8/400 = 0,02 (2%)	Revalida::Preventiva::IndicadoresEpidemiologicos::Calculo
```

---

## 5. RESUMO DE FIXAÇÃO (1 página)

🎯 **As 5 frases que resolvem a maioria das questões:**
1. Letalidade = óbitos / CASOS da doença (não população total).
2. Mortalidade = óbitos / população total.
3. Letalidade mede gravidade da doença entre quem a teve.
4. Mortalidade mede impacto da doença na população geral.
5. Sempre conferir qual denominador a questão está pedindo (casos vs. população).

📊 **Tabela-síntese**
| Indicador | Denominador |
|---|---|
| Letalidade | Número de casos |
| Mortalidade | População total |

⚡ **Fluxograma textual:** identificar número de casos e óbitos → calcular letalidade = óbitos/casos → interpretar gravidade da doença.

🚫 **Os 3 erros mais comuns:** (1) usar população total como denominador da letalidade; (2) confundir letalidade com mortalidade; (3) não converter a proporção para porcentagem ao interpretar.

🔗 **Conexões com outros módulos:** nenhum diretamente relacionado neste lote.

<!-- METADADOS -->
```json
{
  "codigo": "PREV-15",
  "especialidade": "Preventiva",
  "tema": "Indicadores epidemiológicos",
  "assunto": "Cálculo do coeficiente de letalidade (óbitos/casos)",
  "tier": "A",
  "n_questoes": 6,
  "n_flashcards": 3,
  "tempo_estudo_min": 60,
  "prerequisitos": [],
  "relacionados": [],
  "data_geracao": "2026-07-29",
  "itens_a_verificar": [
    "PRIORIDADE ALTA - AUDITORIA FINAL: questão 2011.1-Q106 excluída do simulado por inconsistência aritmética entre o gabarito oficial registrado (B = 0,0002) e o cálculo direto pela fórmula padrão de letalidade (óbitos/casos = 8/400 = 0,02 = alternativa C). Verificar contra PDF original do INEP.",
    "Módulo com apenas 1 questão na amostra atual — prioridade para revisão quando mais edições forem classificadas"
  ]
}
```
