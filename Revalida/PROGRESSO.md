# Progresso — Sistema de Estudo Revalida

> 🚦 **RETOMANDO O PROJETO? Leia `RETOMADA.md` primeiro.** Ele tem o estado atual, os invariantes,
> o fluxo passo a passo para escrever um módulo, o catálogo de ferramentas em `dados/_ferramentas/`
> e as armadilhas já mapeadas. Este arquivo aqui é o **histórico** dos lotes.

Última atualização: 2026-09-24 (reconstrução do banco a partir do caderno oficial). Este arquivo existe para que o trabalho NUNCA se perca entre sessões — leia-o primeiro se estiver retomando este projeto.

---

## 🚨 2026-09-24 — RECONSTRUÇÃO DO BANCO A PARTIR DO CADERNO OFICIAL

**Esta seção supera parte do que está registrado abaixo, na auditoria de 2026-09-23.**
Aquela auditoria corrigiu 206 gabaritos comparando o banco com o PDF do gabarito — mas
assumiu que a **numeração** do banco estava certa. Não estava.

### O que foi descoberto

A extração original lia as duas colunas do caderno como se fossem uma só. Três consequências:

1. o texto de uma questão se misturava com o da vizinha;
2. questões sem alternativas recuperáveis eram descartadas e a numeração seguia por
   **posição**, não pelo número impresso na prova;
3. como o gabarito é aplicado **pelo número**, questões deslocadas recebiam a resposta
   **de outra questão**.

Números da auditoria: **140 questões sob o número errado**, **123 gabaritos trocados**.

Casos clinicamente perigosos encontrados:

| Módulo | Era | Virou | Por quê importa |
|---|---|---|---|
| NEU-05 (AVC isquêmico) | A — anticoagulação plena | **B — trombólise com rtPA** | ensinava a não trombolisar na janela |
| INF-03 (dengue) | C — Grupo B, hidratação oral | **D — Grupo C, internação** | ensinava alta para criança com sinal de alarme |
| OBS-04 (pré-eclâmpsia) | D — emergência hipertensiva | **B — investigar** | ensinava sulfato de magnésio com PA 140×95 |
| PED-93 (teste do coraçãozinho) | B — repetir em 12 h | **D — repetir em 1 h** | intervalo errado em cardiopatia ducto-dependente |
| OBS-53 (gestação pós-bariátrica) | B — TOTG 24–28 sem | **A — intervalo curto até concepção** | o TOTG é contraindicado após bypass |

### Por que o erro passou pela auditoria anterior

O verificador de numeração (`renum3.js`) comparava o banco com
`*_Prova_LAYOUT_reordenado.txt` — arquivo **derivado da mesma extração defeituosa**.
Era verificação circular: confirmava o banco contra ele mesmo. Por isso reportava
"numeração validada" enquanto 140 questões estavam fora de lugar.

**Regra que fica:** uma verificação só vale se a fonte de comparação for independente
daquilo que se quer verificar.

### O que foi feito

1. **Novo extrator com leitura por coluna e por página** (`reextrair.js`). A ordem real do
   caderno é: coluna esquerda inteira, depois a direita **da mesma página** — uma questão que
   começa no pé da esquerda continua no topo da direita.
2. **Banco oficial reconstruído** (`construir_banco_oficial.js`): 1.721 questões com
   enunciado, alternativas e gabarito vindos todos do caderno oficial.
3. **2026.1 entrou no banco** — 100 questões, edição antes considerada perdida.
4. **Classificação reatada por conteúdo**, não por número.
5. **278 blocos já escritos tiveram o texto trocado pelo oficial**, sob critério de qualidade
   (o saneamento sem critério regrediu 18 blocos; o critério foi adicionado e o lote refeito).
6. **19 justificativas reescritas** porque defendiam a resposta errada.
7. **Cifra das provas com fonte simbólica quebrada** (`decifrar.js`) — a 2026.1 saiu legível a
   ~85% por palavra, usando como dicionário o vocabulário das outras 16 provas.

### Estado verificado ao fim

```
gabaritos do banco vs PDF oficial   1721/1721   DIVERGE 0
blocos escritos vs caderno oficial   556 ok     numero errado 0   gabarito errado 0
hub                                  5,68 MB    JS OK   593 questões   DIVERGE 0
cobertura                            591/1721   (34,3%)
```

### Ferramentas novas

`layout.js` · `reextrair.js` · `reextrair_lote.js` · `construir_banco_oficial.js` ·
`limpar_contaminacao.js` · `limpar_ruido.js` · `buscar_oficial.js` · `validar_reextracao.js` ·
`reconstruir_banco.js` · `reconstruir_mapa.js` · `auditar_conteudo.js` · `auditar_modulos.js` ·
`sanear_blocos.js` · `ver_bloco.js` · `conferir_bloco.js` · `renumerar_bloco.js` ·
`trocar_justificativa.js` · `reescrever_bloco.js` · `reconstruir_hub.js` ·
`classificar_pendentes.js` · `marcar_texto_corrompido.js` · `decifrar.js` · `verificar_tudo.js`

### Lote de módulos escrito após a reconstrução

Com o banco corrigido, a escrita recomeçou — e desta vez sobre texto oficial limpo.

| Módulo | Tema | Questões |
|---|---|---|
| INF-26 | Sífilis | +5 |
| PED-04 | Maus-tratos infantis | +5 |
| OBS-16 | Hemorragia pós-parto | +4 |
| GIN-08 | Corrimento vaginal | +4 |
| PED-09 | Reanimação neonatal | +4 |
| PED-13 | Diarreia aguda | +4 |
| OBS-04 | Síndromes hipertensivas da gestação | +5 |
| CIR-01 | Queimaduras | +3 |
| GIN-03 | Síndrome dos ovários policísticos | +3 |
| INF-34 | Leptospirose | +3 |
| END-07 | Diabetes mellitus tipo 2 | +4 |
| GAS-06 | Helicobacter pylori | +4 |
| CAR-04 | Parada cardiorrespiratória | +3 |
| CIR-03 | Complicações pós-operatórias | +2 |
| GIN-04 | Doença inflamatória pélvica | +4 |
| GAS-03 | Pancreatite aguda | +3 |
| INF-19 | Malária | +3 |
| CIR-04 | Colelitíase e colecistite | +3 |
| CIR-42 | Trauma torácico | +3 |
| PED-02 | Desenvolvimento neuropsicomotor | +4 |

**Cobertura: 591 → 666 questões justificadas (34,3% → 38,6%).**

### Classificação corrigida

A reconstrução herdou a classificação por semelhança de conteúdo, e parte dela vinha de
registros contaminados. Ao abrir cada módulo para escrever, apareceram questões no lugar
errado — uma úlcera perfurada em "maus-tratos infantis", uma meningite em "queimaduras",
uma icterícia neonatal em "complicações pós-operatórias". Foram **16 reatribuições**,
e a ferramenta `auditar_classificacao.js` foi escrita para encontrar o resto.

⚠️ **Duas reatribuições feitas a partir da sugestão automática estavam erradas** e
precisaram ser revertidas (um aneurisma de aorta e uma colelitíase mandados para
"pancreatite aguda", porque os três casos compartilham dor abdominal e amilase). A
sugestão do detector é ponto de partida — **ler a questão antes de aplicar é obrigatório.**

### Guarda adicionada

Um bloco foi inserido sem a linha `**Gabarito oficial:**` e entrou no Hub sem resposta.
O `inserir.js` agora **recusa** um lote em que o número de cabeçalhos não bate com o
número de linhas de gabarito.

### Backups

`dados/_backup_numeracao_20260923/` — banco, módulos e mapa antes da reconstrução, mais os
módulos em três estágios intermediários do saneamento.

---

## 🚨 2026-09-23 — AUDITORIA DE GABARITOS (leia antes de escrever qualquer módulo novo)

**O que foi encontrado:** 206 das 1.604 questões do banco (12,8%) tinham `gabarito_oficial`
divergente do PDF oficial do INEP. Três causas, todas confirmadas:

1. **2011.1 Q61–110** — foi aplicada a chave da **PROVA VERMELHA** (bate 50/50) enquanto o texto
   extraído é o da **PROVA CINZA**. O arquivo `2011__Gabarito_2011.txt` contém as duas provas em
   sequência, e o parser antigo lia até o fim, sobrescrevendo a cinza pela vermelha.
2. **2016.1, 2022.2, 2025.2 e outras** — gabarito aplicado por **posição na lista**, não por
   número da questão, desalinhando a partir da primeira questão anulada.
3. **2023.x, 2024.x, 2025.1** — o caractere de traço do PDF (`-`, `—`, `̶`) foi gravado como se
   fosse a letra do gabarito, em vez de marcar `anulada: true`.

**Além disso:** em 2011.1 as questões **7 e 8 estavam trocadas** no banco (banco Q7 = prova Q8).
Única edição com erro de numeração — todas as outras 15 foram validadas casando o enunciado
contra o texto oficial da prova (2022.2: 96/96; 2015.1: 110/110; 2016.1: 94/97).

**O que foi corrigido:**
- `dados/raw/*.json` e `dados/mapa_mestre.json` → **1604/1604 gabaritos agora conferem** com os
  PDFs oficiais. Backup íntegro do estado anterior em `dados/_backup_gabaritos_20260923/`.
- **32 justificativas já escritas** em 30 módulos ensinavam a resposta errada — todas reescritas
  (9 reclassificadas como questões anuladas, 1 renumerada, 22 com justificativa refeita do zero).
- Novo script `dados/_scripts/corrigir_gabaritos.js` (idempotente) + `dados/_gabaritos_oficiais.json`
  (chave oficial por número, extraída e validada das 18 edições).
- Log completo das alterações em `dados/_scripts/_log_correcao_gabaritos.json`.

**⚠️ LIÇÃO PARA OS PRÓXIMOS LOTES:** o campo `assunto` do banco é texto gerado pelo classificador
**deste projeto**, não pelo INEP — ele **nunca** é fonte para decidir gabarito. Dois módulos
(CIR-128, OBS-57) tinham notas de "🔴 DIVERGÊNCIA" que rejeitavam o gabarito correto justamente
por confiar nesse campo. Ao suspeitar de um gabarito, confira o **PDF oficial**, nunca o `assunto`.

**Divergência técnica legítima que permanece:** 2024.1-Q22 (OBS-04) — o gabarito oficial é **D**
("emergência hipertensiva" com PA 140×95), tecnicamente insustentável. Mantido o gabarito oficial
com nota 🔴 explicando a conduta correta. Mesma situação, em menor grau, em 2022.2-Q17 (OBS-53).

## 🆕 2026-09-23 — Lote 9: fechamento de módulos defasados (em andamento)

Prioridade escolhida pelo usuário: **fechar os módulos que já existem mas cujo `.md` não acompanhou
o `modulos.json`** — as questões já estavam mapeadas para o módulo, só faltava escrevê-las.

**Fechados neste lote (17 módulos, +69 questões justificadas):**

| Módulo | Antes → Depois | Observação |
|---|---|---|
| INF-03 Dengue | 2 → 11 | 3 itens sem texto recuperável viraram nota de prosa; 2022.2-Q55 remontada a partir de deslocamento de coluna |
| INF-25 Tuberculose | 1 → 9 | 2012.1-Q26 remontada (deslocamento de coluna); 2016.1-Q47 sem texto → nota |
| PNE-01 Asma | 3 → 11 | todas utilizáveis |
| END-01 Cetoacidose diabética | 2 → 7 | 2011.1-Q68 com 4 alternativas irrecuperáveis → nota de prosa |
| CIR-35 Apendicite aguda | 1 → 6 | 2017.1-Q12 com as 4 alternativas truncadas, incluída com marcação |
| GIN-14 Sangramento pós-menopausa | 1 → 6 | todas utilizáveis |
| PNE-02 Pneumonia adquirida na comunidade | 1 → 7 | 2014.1-Q95 remontada (alternativas deslocadas); 2016.1-Q61 sem alternativas → nota |
| REU-03 Lúpus eritematoso sistêmico | 1 → 7 | 2020.1-Q69 e 2012.1-Q66 remontadas de bleed/fusão de alternativas |
| GAS-12 Doença inflamatória intestinal | **0 → 4** | módulo que não tinha nenhuma questão escrita |

**Segunda frente — módulos que estavam com ZERO questão escrita** (eram teoria sem banco).
Eram 34; agora são 26. Preenchidos: **GAS-04** Hemorragia digestiva alta (3, uma delas anulada
pelo INEP, mantida com o raciocínio de priorização), **CIR-97** Complicações de acesso venoso
central (2), **HEP-02** Hepatites virais (2), **INF-56** Zika na gestação (2), **PREV-03** Medidas
de associação (1 + 1 nota), **PREV-11** Territorialização (1), **PREV-15** Indicadores
epidemiológicos (1), **PREV-28** Transição demográfica (1).

**Cobertura justificada: 520 → 589 de 1.604 questões (32,4% → 36,7%).**
Todos os 69 blocos passaram por `verificar_gabaritos.js` com zero divergência.

**Divergências técnicas do INEP registradas neste lote** (gabarito oficial mantido, com nota 🔴
explicando a conduta correta): **2020.1-Q44** (classifica como dengue grupo B um caso com dois
sinais de alarme — deveria ser grupo C).

### 🔧 Correção secundária: efeito colateral da renumeração de 2011

A troca 7↔8 de 2011.1 aplicada em `dados/raw/` **não havia sido aplicada em `mapa_mestre.json`**,
porque `destrocar2011()` testava o campo `enunciado` e o mapa mestre usa **`enunciado_resumo`**.
Resultado: os dois registros ficaram com identidade trocada no mapa e receberam o gabarito do
vizinho. Corrigido em `corrigir_gabaritos.js` (agora aceita os dois nomes de campo) e reaplicado.

Em seguida, `modulos.json` foi ressincronizado com `mapa_mestre.json` pelo campo `modulo_destino`:
**2 vínculos trocados** (PNE-02 ↔ HEM-01, exatamente os dois esperados) — o restante do mapeamento
estava íntegro. O campo `n_questoes_historicas` foi recalculado em todos os módulos.

⚠️ **Lição:** ao editar em lote, lembrar que `raw/*.json` usa `enunciado` e `mapa_mestre.json` usa
`enunciado_resumo`. Sempre rodar o script nos **dois** e conferir um registro de cada arquivo.

**Lacunas restantes: 257 questões em 135 módulos** (161 com texto aproveitável, 96 com extração
danificada); **26 dos 326 módulos ainda sem nenhuma questão escrita** (9 deles porque a única
questão disponível tem extração irrecuperável). Use `worklist.js` para a lista atualizada.

**Ferramentas criadas para este trabalho** (em `_scratchpad`, replicáveis):
`worklist.js` (lista as lacunas por módulo), `dump.js` (texto das questões faltantes de um módulo),
`inserir.js` (insere blocos na seção 3 e atualiza o cabeçalho), `bloco.js` (extrai um bloco
existente), `reescrever.js` (troca a justificativa preservando enunciado e alternativas).

## 🆕 2026-09-23 — Aba "Questões" do Hub reformulada
Filtros por **especialidade, edição, competência, dificuldade e situação** (não respondidas /
errei / acertei / na fila de erros), busca textual, painel de acerto do filtro e **modo simulado
cronometrado** (sorteia do filtro atual, esconde o gabarito até o fim, resultado com desempenho
por especialidade e envio dos erros para a fila). `acertoEsp()` — que era um stub retornando
`null` — agora calcula o acerto real por especialidade e alimenta a aba Estatísticas.
Novo índice `dados/_hub_qmeta.json` (gerado por `dados/_scripts/gerar_qmeta.js`) com os metadados
de todas as 1.604 questões; **rodar esse script sempre que `mapa_mestre.json` mudar**, antes de
`injetar_no_hub.js`.

---

📌 **Leia também `PROCESSO_E_APRENDIZADO.md`** — documenta a metodologia completa (pipeline de
extração em 3 camadas, padrão de módulo validado pelo usuário, log de erros com exatamente onde
cada um impactou o conteúdo, e o procedimento passo a passo para gerar os módulos restantes.

## RESUMO EXECUTIVO (leia isto primeiro)

Sistema funcional entregue com: 330 questões classificadas (edições 2011.1, 2013.1, 2015.1),
`mapa_mestre.json` + `modulos.json` (269 módulos candidatos, códigos agora ESTÁVEIS entre
reconsoli­dações — ver `PROCESSO_E_APRENDIZADO.md` seção "correção estrutural"), `cronograma.json`
(502 dias, hoje → Revalida 2028.1 estimado), **46 módulos de estudo completos** (48 códigos do
`modulos.json` marcados "gerado", já que PED-24 e PED-27 foram mesclados em PED-12 — ver nota de
consolidação no cabeçalho de `modulos/PED-12_infeccao-urinaria-infancia.md`) — cada um com deck
Anki próprio em `anki/`:
- INF-01 Meningites bacterianas · PED-01 Imunizações · GIN-01 Rastreamento câncer de colo ·
  CIR-01 Queimaduras · PREV-01 Documentação médico-legal (lote 1)
- OBS-01 Diabetes gestacional · OBS-02 Distocias do trabalho de parto · GAS-01 Úlcera péptica ·
  END-01 Cetoacidose diabética · CAR-01 Síndrome coronariana aguda · CAR-02 Febre reumática ·
  PNE-01 Asma (lote 2)
- PED-02 Desenvolvimento neuropsicomotor · PED-03 Icterícia neonatal · PED-04 Maus-tratos
  infantis · PED-05 Diarreia crônica na infância · PED-06 Obesidade infantil · CIR-02 Hérnias
  da parede abdominal · CIR-03 Complicações pós-operatórias · PREV-02 Delineamento de estudos
  epidemiológicos (lote 3)
- PREV-03 Medidas de associação epidemiológica · PREV-04 Saúde do trabalhador · PREV-05
  Indicadores de saúde · PREV-06 Redes de Atenção à Saúde · PREV-07 Política Nacional de
  Atenção Básica · PREV-08 Saúde do idoso · PREV-09 Níveis de prevenção · OBS-03 Pré-natal
  (lote 4)
- GIN-02 Rastreamento câncer de mama · GIN-03 Síndrome dos ovários policísticos · GIN-04
  Doença inflamatória pélvica · GIN-05 Puerpério · INF-02 Parasitoses intestinais · INF-03
  Dengue · INF-04 Meningites (diagnóstico diferencial) · INF-05 Toxoplasmose gestacional ·
  PED-07 Imunossupressão e infecções em pediatria · PED-08 Anemias carenciais (lote 5)
- OBS-04 Síndromes hipertensivas da gestação · OBS-05 Infecção urinária na gestação · PED-09
  Reanimação neonatal · PED-12 Infecção urinária na infância (mesclado com PED-24/PED-27) ·
  PED-13 Diarreia aguda · PED-15 Choque séptico na infância · PED-17 Pneumonia adquirida na
  comunidade (mesclado com PED-19) · PED-21 Desidratação na infância (lote 6)
- PED-22 Infecções de vias aéreas — faringite/herpangina viral (mesclado com PED-37); PED-08 e
  PED-17 (lote 6) foram ampliados retroativamente com questões de PED-38 e PED-19 respectivamente
  (lote 7)
- CIR-03 Complicações pós-operatórias (ampliado, mesclado com CIR-12/CIR-28) · CIR-04 Colelitíase
  e colecistite (mesclado com CIR-10/CIR-22) · CIR-05 Obstrução intestinal (mesclado com CIR-15)
  · CIR-07 Doença diverticular (mesclado com CIR-27) · CIR-21 Doença aneurismática da aorta
  (mesclado com CIR-39) · CIR-32 Sutura e reparo de feridas (mesclado com CIR-40) (lote 8)
- CIR-06 Megacólon tóxico · CIR-08 Trauma cranioencefálico (mesclado com CIR-24) · CIR-09
  Pneumotórax hipertensivo · CIR-13 Doença arterial periférica (⚠️ questão excluída do simulado —
  ver nota abaixo) · CIR-23 Hemotórax maciço (**reclassificado** — era rotulado "Trauma
  torácico/Pneumotórax hipertensivo", corrigido após verificar o conteúdo real) · CIR-29
  Pancreatite aguda biliar · CIR-35 Apendicite aguda · CIR-37 Divertículo de Meckel (lote 9)
- CIR-11 Tromboembolismo venoso · CIR-14 Massas inguinais (⚠️ questão excluída do simulado — ver
  nota abaixo) · CIR-16 Complicações pós-trauma torácico · CIR-17 Complicações da tireoidectomia
  (⚠️ questão excluída do simulado — ver nota abaixo) · CIR-18 Hemorragia digestiva baixa · CIR-19
  Doença hemorroidária · CIR-20 Abdome agudo na infância · CIR-25 Trauma abdominal na infância
  (questão ANULADA pelo INEP) · CIR-26 Abdome agudo vascular · CIR-30 Infecções de pele e partes
  moles · CIR-31 Trauma abdominal penetrante · CIR-33 Neoplasias gástricas · CIR-34 Nódulo
  pulmonar solitário · CIR-36 Segurança do paciente · CIR-38 Trauma - reposição volêmica
  (⚠️ questão excluída do simulado — ver nota abaixo) — lote 10, 2026-07-29. **Com este lote,
  Cirurgia está 100% concluída (nenhum módulo `nao_gerado` restante nesta especialidade).**
- Toda a especialidade **Preventiva** (29 módulos, PREV-10 a PREV-38): transplantes/morte
  encefálica, territorialização (⚠️ excluída), violência sexual, validade de testes diagnósticos
  (⚠️ excluída), ética médica, indicadores epidemiológicos (⚠️ excluída), saúde escolar, ESF,
  transplante de órgãos no SUS, tuberculose, Rede Cegonha, aborto legal, mortalidade materna,
  redes de atenção/SUS, imunizações na gestação, bioética, hemoterapia, curvas epidêmicas,
  transição demográfica (⚠️ excluída), ética em pesquisa, mortalidade infantil (⚠️ excluída),
  epidemiologia analítica, pacto federativo (⚠️ excluída), saúde do idoso (⚠️ excluída),
  rastreamento de neoplasias, profilaxia antitetânica, imunizações, população em situação de
  rua, erro de medicação — lote 11, 2026-07-29. **Com este lote, Preventiva está 100% concluída.**
- Toda a especialidade **Infectologia** (27 módulos, INF-06 a INF-34): helmintíases, raiva,
  doença meningocócica, doenças diarreicas agudas, arboviroses (dengue), coinfecção TB/HIV
  (mesclado com INF-29), bacteriúria assintomática, IST/cancro mole, úlceras genitais/sífilis
  primária (⚠️ excluída), HIV na gestação, acidentes ofídicos (⚠️ excluída), leishmaniose
  visceral, influenza/SRAG, malária (questão ANULADA pelo INEP), febre amarela, hanseníase,
  infecções bacterianas de pele/partes moles (mesclado com INF-33, questão do INF-33 excluída),
  infecções oportunistas no HIV, infecções congênitas (CMV), tuberculose (contactantes), sífilis
  (neurossífilis em HIV+), exantemas virais, HIV e amamentação, infecção urinária de repetição,
  acidentes por animais peçonhentos, varicela, leptospirose — lote 12, 2026-07-30. **Com este
  lote, Infectologia está 100% concluída.**
- Toda a especialidade **Pediatria restante** (19 módulos, PED-10 a PED-39; PED-22 também
  corrigido no `modulos.json` — já estava escrito desde lote anterior mas com bookkeeping
  esquecido): cólica do lactente, cardiopatias congênitas (TGA), crise asmática (doses),
  abdome agudo/intussuscepção (⚠️ excluída), distúrbios do metabolismo ósseo/raquitismo,
  distúrbios funcionais GI, síndrome nefrótica, exantemas virais (⚠️ excluída), refluxo
  gastroesofágico, tuberculose - profilaxia neonatal, bronquiolite viral aguda, parasitoses/
  vulvovaginites, sinais de alarme em pediatria, TCE leve, ALTE/BRUE (⚠️ excluída), baixa
  estatura, fimose/aderência balanoprepucial, convulsão febril, hipertensão arterial na
  infância (⚠️ excluída) — lote 13, 2026-07-30. **Com este lote, Pediatria está 100%
  concluída (nenhum módulo `nao_gerado` restante).**
- Toda a especialidade **Ginecologia restante** (15 módulos escritos cobrindo os 17 códigos
  pendentes, GIN-06 a GIN-21; 2 mesclagens): aleitamento materno, massa anexial/neoplasia de
  ovário, corrimento vaginal (mesclado com GIN-22, ⚠️ ambas as questões excluídas — uma por
  gabarito inconsistente, outra por gabarito nulo), herpes genital (mesclado com GIN-18),
  infertilidade conjugal, doenças da mama, puerpério/ingurgitamento mamário, doença
  trofoblástica gestacional, sangramento uterino pós-menopausa, prevenção do câncer de colo
  uterino, ciclo menstrual normal, distúrbios menstruais/hiperprolactinemia, abortamento,
  anticoncepção em situações especiais, amenorreia primária — lote 14, 2026-07-30. **Com este
  lote, Ginecologia está 100% concluída.**
- Toda a especialidade **Obstetrícia restante** (14 módulos, OBS-06 a OBS-20; mais 1 mesclagem):
  trabalho de parto prematuro, descolamento prematuro de placenta, abortamento séptico (questão
  ANULADA pelo INEP), pré-natal na adolescência, analgesia obstétrica, imunizações na gestação
  (OBS-11 mesclado em PREV-24, já publicado), gestação de alto risco, partograma e distocias,
  náuseas e vômitos na gestação, gestação prolongada, hemorragia pós-parto, sangramento no
  terceiro trimestre, pré-eclâmpsia grave/eclâmpsia iminente, assistência ao parto, doença
  hemolítica perinatal — lote 15, 2026-07-30. **Com este lote, Obstetrícia está 100% concluída.**
- Toda a especialidade **Gastroenterologia restante** (12 módulos, GAS-02 a GAS-13; sem
  mesclagens — os 12 temas eram genuinamente distintos, incluindo 3 etiologias diferentes de
  pancreatite aguda mantidas separadas por gatilho diagnóstico específico): úlcera péptica
  perfurada (epidemiologia), pancreatite aguda por hipertrigliceridemia, hemorragia digestiva
  alta por varizes esofágicas (questão ANULADA pelo INEP), DRGE/orientações higienodietéticas
  (⚠️ excluída — 3+ alternativas danificadas incluindo o próprio gabarito), Helicobacter pylori/
  teste da urease, câncer colorretal/sinais de alarme (⚠️ excluída — 2 alternativas totalmente
  ausentes), esôfago de Barrett, doença celíaca, constipação intestinal do idoso, pancreatite
  aguda e hepatopatia alcoólica, doença inflamatória intestinal/retocolite ulcerativa (questão
  ANULADA pelo INEP + alternativas danificadas), hemorragia digestiva baixa por doença
  diverticular — lote 16, 2026-07-30. **Com este lote, Gastroenterologia está 100% concluída.**
  ⚠️ Erro autocorrigido durante este lote: GAS-13/2015.1-Q84 foi inicialmente escrito com
  gabarito B, mas o `gabarito_oficial` bruto é C — corrigido após a verificação cruzada de
  fim de lote (ver nota abaixo, mesmo padrão do erro CIR-30 do lote 10). A causa raiz não foi
  erro de fonte, mas raciocínio clínico desatualizado: hemoglobina "abaixo do valor de
  referência laboratorial" (8,5 g/dL) não implica necessidade de transfusão — o padrão
  validado por ensaios clínicos (estratégia restritiva) usa o limiar Hb < 7 g/dL, e a paciente
  estava hemodinamicamente estável.
- Toda a especialidade **Cardiologia restante** (7 módulos, CAR-03 a CAR-09; sem mesclagens —
  os temas se sobrepunham em nome mas testavam conceitos clinicamente distintos): insuficiência
  cardíaca (ICFER com tratamento farmacológico de base + ICFEP secundária a HAS, 2 questões
  em 1 módulo), parada cardiorrespiratória (ritmos chocáveis — imagem do monitor lida
  visualmente no PDF para confirmar TV monomórfica), tratamento farmacológico da hipertensão
  com nefropatia e bradicardia, fibrilação atrial em hipertireoidismo (imagem do ECG também
  lida visualmente para confirmar o padrão irregularmente irregular), HAS estágio 1 com lesão
  de órgão-alvo, ICC descompensada com fibrilação atrial (controle de frequência +
  anticoagulação), hipertensão secundária por estenose de artéria renal bilateral — lote 17,
  2026-07-31. **Com este lote, Cardiologia está 100% concluída.** Todos os 8 gabaritos
  interativos bateram exatamente com o `gabarito_oficial` bruto na verificação cruzada de
  fim de lote — nenhum erro de transcrição nem inconsistência gabarito-vs-conteúdo detectada
  neste lote.
- Toda a especialidade **Psiquiatria** (7 módulos, PSI-01 a PSI-07, primeiro lote desta
  especialidade — sem mesclagens, apesar de 4 questões tocarem "dificuldade escolar" sob
  ângulos distintos: territorialidade/desmedicalização, luto vs. comportamento patológico,
  TCC no luto complicado, avaliação biopsicossocial familiar): episódio depressivo/conduta na
  atenção primária, dificuldade escolar (abordagem territorial da Reforma Psiquiátrica),
  dificuldade escolar após luto (comportamento esperável vs. patológico), psicose puerperal,
  delirium hiperativo em idosa, luto complicado na infância (TCC), avaliação biopsicossocial
  da dificuldade escolar — lote 18, 2026-07-31. **Com este lote, Psiquiatria está 100%
  concluída.** Todos os 7 gabaritos interativos bateram exatamente com o `gabarito_oficial`
  bruto. Caso notável: PSI-06/2015.1-Q29 tinha o enunciado com reordenação de colunas (o
  início real da questão estava deslocado para o fim do bloco de texto, misturado com
  fragmentos de outras 2 questões) — identificado e reposicionado corretamente (texto
  literal do arquivo fonte, não inventado).
- Toda a especialidade **Hematologia** (7 módulos, HEM-01 a HEM-07, primeiro lote desta
  especialidade — sem mesclagens): anemia macrocítica com reticulocitose (⚠️ excluída — 8º
  caso confirmado de gabarito bruto inconsistente com o próprio enunciado, ver nota abaixo),
  complicações infecciosas na anemia falciforme, adenomegalia cervical/supraclavicular como
  sinal de alarme para linfoma, pancitopenia por anemia aplásica, anemia falciforme
  (eletroforese/HPLC para diagnóstico), traço falciforme e hemoglobinopatias, linfoma de
  Hodgkin (célula de Reed-Sternberg) — lote 19, 2026-07-31. **Com este lote, Hematologia
  está 100% concluída.** ⚠️ HEM-01/2011.1-Q7: o enunciado informa explicitamente
  "reticulócitos aumentados", achado incompatível com o gabarito bruto registrado (A =
  deficiência de vitamina B12, que é por definição uma anemia arregenerativa/de baixa
  produção) — tecnicamente a alternativa correta seria B (anemia hemolítica regenerativa).
  Excluída do simulado interativo com nota completa, seguindo a mesma política dos 7 casos
  anteriores (CIR-13, CIR-14, CIR-17, PREV-11, PREV-15, INF-16, GIN-08). Os demais 6
  gabaritos interativos do lote bateram exatamente com o `gabarito_oficial` bruto.
- Toda a especialidade **Pneumologia restante** (6 módulos, PNE-02 a PNE-07): PAC na
  gestante + PAC em idosa com DPOC (módulo combinado; a segunda questão tem gabarito_oficial
  null sem estar anulada — excluída com nota distinta), exacerbação da DPOC (causa mais
  frequente), tuberculose pulmonar em criança contactante de bacilífero (⚠️ excluída — 5
  alternativas totalmente ausentes no arquivo fonte), tromboembolismo pulmonar (reconstruído
  a partir de reordenação de colunas — mesmo padrão do PSI-06, mas com reconstrução mais
  extensa: enunciado + 5 alternativas reagrupadas a partir de um bloco de texto misturado),
  oxigenoterapia domiciliar prolongada na DPOC (critério gasométrico), asma quase-fatal com
  hipercapnia (indicação de intubação) — lote 20, 2026-07-31. **Com este lote, Pneumologia
  está 100% concluída.** Todos os 5 gabaritos interativos do lote (incluindo o reconstruído
  de PNE-05) bateram exatamente com o `gabarito_oficial` bruto.
- Toda a especialidade **Endocrinologia restante** (6 módulos, END-02 a END-07): atraso
  puberal constitucional (⚠️ excluída — alternativa totalmente ausente + alternativa
  truncada), cetoacidose diabética (diagnóstico gasométrico e conduta inicial), ajuste de
  insulina NPH/regular por automonitorização glicêmica, hipotireoidismo primário (quadro
  clínico e TSH/T4L), nódulo tireoidiano com características suspeitas (indicação de PAAF
  mesmo em nódulo pequeno), metformina como primeira escolha no DM2 com sobrepeso — lote 21,
  2026-07-31. **Com este lote, Endocrinologia está 100% concluída.** Todos os 5 gabaritos
  interativos do lote bateram exatamente com o `gabarito_oficial` bruto.
- Toda a especialidade **Nefrologia** (6 módulos, NEF-01 a NEF-06, primeiro lote desta
  especialidade — sem mesclagens, apesar de 3 questões tocarem glomerulonefrite sob ângulos
  distintos): glomerulonefrite pós-estreptocócica (mecanismo fisiopatológico imunomediado),
  síndrome nefrótica por nefropatia diabética não diagnosticada, doença por anticorpo
  anti-membrana basal glomerular (padrão linear de IgG), glomerulonefrite rapidamente
  progressiva com antecedente de artralgia/hipótese de lúpus (⚠️ excluída — 3 alternativas
  totalmente ausentes + gabarito bruto possivelmente incongruente com o quadro agudo
  multissistêmico, flagged para auditoria), hipercalemia com alteração de ECG (insulina +
  glicose como conduta imediata), lesão renal aguda por rabdomiólise pós-maratona — lote 22,
  2026-07-31. **Com este lote, Nefrologia está 100% concluída.** Todos os 5 gabaritos
  interativos do lote bateram exatamente com o `gabarito_oficial` bruto.
- Toda a especialidade **Hepatologia** (4 módulos, HEP-01 a HEP-04, primeiro lote desta
  especialidade): hepatite C (fatores preditivos de resposta virológica sustentada + manejo
  de falha ao telaprevir, 2 questões em 1 módulo), hepatites virais (interpretação de perfil
  sorológico combinado hepatite A aguda + hepatite B crônica — ⚠️ excluída, 9º caso de
  gabarito inconsistente: gabarito bruto tinha HBsAg não reativo, contradizendo o próprio
  enunciado que descreve "carreador crônico" de hepatite B), cirrose hepática descompensada
  por hepatite C (⚠️ excluída — 10º caso de gabarito inconsistente, desta vez contradizendo
  também o próprio campo `assunto` do banco, mesmo padrão do GIN-08), cirrose e hipertensão
  portal (profilaxia secundária de varizes + avaliação para transplante em cirrose alcoólica)
  — lote 23, 2026-07-31. **Com este lote, Hepatologia está 100% concluída.** Os 3 gabaritos
  interativos do lote bateram exatamente com o `gabarito_oficial` bruto.
- Toda a especialidade **Dermatologia** (4 módulos, DER-01 a DER-04, primeiro lote desta
  especialidade): paracoccidioidomicose (perfil epidemiológico + achado histopatológico em
  roda de leme + itraconazol), lesão anular refratária a antifúngico sugerindo hanseníase
  (neurite associada + Intradermorreação de Mitsuda), carcinoma basocelular nodular (exérese
  cirúrgica + fotoproteção abrangente), escabiose com caso familiar concomitante (tratar
  todos os contactantes + afastamento temporário da creche) — lote 24, 2026-07-31. **Com
  este lote, Dermatologia está 100% concluída.** Todos os 4 gabaritos interativos do lote
  bateram exatamente com o `gabarito_oficial` bruto.
- Toda a especialidade **Reumatologia** (4 módulos, REU-01 a REU-04, primeiro lote desta
  especialidade): fatores de risco não modificáveis para osteoporose (⚠️ excluída — 3
  alternativas com dano severo de bleed, uma irrecuperável), gota não tofácea vs. artrite
  séptica (nunca iniciar alopurinol durante a crise aguda — alternativa reconstruída a
  partir de fragmento dividido entre enunciado e lista de alternativas), LES/autoanticorpo
  de maior especificidade (anti-DNA nativo, não o FAN que é o mais sensível), artrite
  reumatoide com nódulos reumatoides (metotrexato como DMARD de primeira escolha) — lote 25,
  2026-07-31. **Com este lote, Reumatologia está 100% concluída.** Todos os 3 gabaritos
  interativos do lote bateram exatamente com o `gabarito_oficial` bruto.
- **Lote 26 (final) — Neurologia (3), Ortopedia (3), Otorrinolaringologia (1) e Oftalmologia
  (1), 8 módulos:** hipertensão intracraniana/AVC hemorrágico (intubação + hiperventilação +
  manitol diante de sinais de herniação), AIT com fibrilação atrial (anticoagulação como
  medida de maior impacto na prevenção secundária), hemorragia subaracnóidea (tomografia de
  crânio como exame inicial diante de cefaleia thunderclap), síndrome compartimental pós-
  trauma (⚠️ excluída — gabarito sem texto recuperável no arquivo fonte), lombalgia mecânica
  sem sinais de alarme (conduta conservadora), entorse de tornozelo sem fratura (reconstrução
  por reordenação severa de colunas — 3 fragmentos remontados: início do enunciado + final da
  alternativa C, ambos deslocados para dentro do bloco da alternativa D), otite média aguda
  (⚠️ excluída — gabarito sem texto recuperável), dacrioestenose congênita (massagem do saco
  lacrimal como conduta inicial) — 2026-07-31.

**🎉 COM ESTE LOTE, TODAS AS 20 ESPECIALIDADES ESTÃO 100% CONCLUÍDAS — os 269 módulos
candidatos do `modulos.json` estão todos marcados `"gerado"` (0 pendentes).** Todos os 6
gabaritos interativos do lote final bateram exatamente com o `gabarito_oficial` bruto,
incluindo o gabarito reconstruído de ORT-03.

O Hub está publicado com TODOS esses dados reais + os 250 módulos carregados (282 questões
comentadas no total, 6 anuladas), além de modo "simulado" nas questões (responde antes de
revelar gabarito/comentário):
https://claude.ai/code/artifact/c7877dfa-f598-45df-835d-7fb19b8ed5d7

**📌 Leia OBRIGATORIAMENTE `PROCESSO_E_APRENDIZADO.md`** antes de continuar — tem o passo a
passo exato de como gerar os próximos módulos (procedimento testado 60 vezes com sucesso), o
padrão de qualidade validado pelo usuário, e o log de erros/onde cada um impactou o conteúdo.
Note especialmente:
- Erro #17: checar se um `tema` parecido já foi escrito antes de criar um módulo novo — pode ser
  duplicata real; já ocorreu 14 vezes.
- Erro #19: nunca usar texto placeholder tipo "B) [não recuperado]" dentro de um bloco de
  questão formal.
- **Erro #21 (NOVO E IMPORTANTE):** questão CIR-13/2011.1-Q63 tem gabarito registrado no banco
  (D, TVP) **clinicamente inconsistente** com o próprio enunciado (ausência de pulsos arteriais
  não ocorre em TVP) — excluída do simulado interativo por prudência. Isto é diferente dos erros
  de extração já catalogados (texto perdido/bleed) — é um possível erro de CLASSIFICAÇÃO no
  arquivo `2011.1.json` já finalizado, não um problema do pipeline de texto. **Ao escrever
  qualquer módulo, se a explicação de "por que a alternativa X está errada" ficar forçada ou
  pouco convincente, considere que o gabarito pode estar equivocado na fonte, não que sua lógica
  está errada.**
- Descoberta CIR-23: o módulo rotulado "Trauma torácico"/"Pneumotórax hipertensivo" no
  `modulos.json` era na verdade sobre **hemotórax maciço** (percussão com macicez, não
  hipertimpanismo; gabarito de drenagem formal + autotransfusão, não punção descompressiva) —
  reclassificado no conteúdo do módulo E no campo `tema` do `modulos.json` (`_tema_original`
  preservado para rastreabilidade). Isso reforça: **sempre ler o enunciado completo da questão
  antes de assumir que o `tema`/`assunto` do banco está correto** — pode estar errado, não só
  incompleto.
- **Erro #22 (lote 10) — recorrência do padrão do erro #21, mais grave:** no lote 10, DUAS novas
  questões tiveram o mesmo tipo de inconsistência gabarito-vs-conteúdo detectada:
  - CIR-14/2011.1-Q65: gabarito registrado E ("massa inguinal, provável neoplasia"), mas a
    semiologia do enunciado (retrátil + aumenta com Valsalva) é o padrão-ouro de HÉRNIA inguinal,
    não neoplasia — E as alternativas estavam gravemente danificadas (3+ ilegíveis). Excluída.
  - CIR-17/2011.1-Q103: gabarito registrado C ("lesão do ramo inferior do nervo laríngeo
    superior" — estrutura anatômica atípica, o laríngeo superior não tem "ramo inferior"), mas o
    próprio campo `assunto` do banco E a semiologia (paralisia completa de prega vocal = lesão
    motora) apontam para a alternativa E ("lesão do nervo laríngeo recorrente"). Excluída.
  - **Lição consolidada:** ao terminar de escrever CADA questão, comparar o texto do gabarito
    letra-a-letra com o campo `assunto`/`tema` do banco E com a semiologia/fisiopatologia do
    enunciado — não confiar cegamente na letra do `gabarito_oficial`. Já são 3 casos confirmados
    (CIR-13, CIR-14, CIR-17) só nesta especialidade — a taxa de inconsistência gabarito-conteúdo
    é maior do que se pensava inicialmente, reforçando a necessidade da auditoria final completa.
- **Erro corrigido durante o lote 10 (auto-detectado antes de publicar):** CIR-30/2015.1-Q32 foi
  inicialmente escrito com gabarito C ("compressa + antibiótico"), mas o `gabarito_oficial` no
  banco é D ("compressa e aguardar drenagem espontânea", sem antibiótico — paciente com bom
  estado geral e sinais vitais normais não precisa de antibiótico sistêmico de rotina). Detectado
  na verificação cruzada gabarito-por-gabarito ANTES de injetar no Hub, corrigido no módulo
  inteiro (teoria, prática, questão, flashcards, resumo) antes de publicar. **Lição: sempre
  rodar um script de verificação cruzada gabarito-escrito-vs-gabarito-bruto para TODOS os
  códigos de um lote antes de injetar no Hub — não confiar apenas na revisão manual durante a
  escrita.**

**🎉 MARCO: geração de módulos 100% concluída.** Todas as 20 especialidades canônicas estão
completas (0 módulos `nao_gerado` em `modulos.json`, dos 269 candidatos totais). O Hub tem
250 módulos carregados (alguns candidatos foram mesclados em módulos combinados — ver notas
de consolidação nos cabeçalhos), 282 questões comentadas, 6 anuladas, 0 alternativas vazias.

**Para continuar — o que resta é trabalho de EXTRAÇÃO/CLASSIFICAÇÃO de dados brutos, não mais
geração de módulos:**
1. **Fase B de classificação** das 15 edições que já têm `.pre.json` pronto (2021.1, 2022.2,
   2023.1, 2023.2, 2024.1, 2024.2, 2025.1, 2025.2, e outras — ver lista completa na seção
   "Fase B em andamento" abaixo) — cada edição adiciona mais questões aos módulos já existentes
   (a maioria dos módulos atuais tem apenas 1-2 questões de uma amostra de 2-3 edições
   classificadas de 18 totais).
2. **2 edições especiais com fonte quebrada** (2022.1, 2026.1) — precisam de reconstrução
   visual completa via leitura do PDF como imagem (~200 questões no total), tratadas como
   tarefa isolada à parte do resto do banco.
3. **Auditoria final** (explicitamente deferida durante todo o projeto, conforme instrução do
   usuário): resolver os **10 casos confirmados de gabarito bruto inconsistente** com o
   conteúdo do próprio enunciado ou com o campo `assunto` do banco (CIR-13, CIR-14, CIR-17,
   PREV-11, PREV-15, INF-16, GIN-08, HEM-01, HEP-02, HEP-03), verificar contra o PDF original
   os **~15 módulos com reconstrução de texto por reordenação de colunas ou bleed severo**
   (flagged com "PRIORIDADE ALTA - AUDITORIA FINAL" no `itens_a_verificar` de cada módulo —
   buscar por essa string em `modulos/*.md` para listar todos de uma vez), e revisar os poucos
   itens com gabarito nulo (não anulado oficialmente) ou alternativas totalmente irrecuperáveis
   que foram excluídas do simulado interativo.
4. **Atualizar módulos existentes** conforme novas edições forem classificadas — a maioria dos
   módulos tem nota explícita "amostra parcial de X/18 edições" no cabeçalho, e devem ser
   expandidos (não recriados do zero) quando uma edição nova trouxer mais questões sobre o
   mesmo tema — seguir a mesma lógica de expansão já usada para PREV-24 (absorveu questão de
   OBS-11 de uma edição diferente).
5. Confirmar a data oficial do Revalida 2028.1 e regenerar `cronograma.json` (pendente desde
   o início do projeto, nunca bloqueante para a geração de módulos).

Se for retomar a extração de novas edições, siga a arquitetura documentada na seção
"PRÓXIMOS PASSOS" abaixo (Fase A/B/C) e use os scripts em `dados/_scripts/` (`extrair.js`,
`reordenar_colunas.js`, `compactar.js`, `mesclar_classificacao.js`). Se for expandir um módulo
existente com uma nova questão, releia primeiro o padrão de qualidade validado em
`PROCESSO_E_APRENDIZADO.md` (pipeline de 3 camadas, template de 6 seções, políticas de dano de
extração/gabarito inconsistente) antes de editar — não recriar o módulo do zero.

## O que já está PRONTO e não precisa ser refeito

1. **Arquitetura de pastas** criada em `Revalida/`:
   - `dados/` — dados estruturados (raw_text, raw, mapa_mestre.json, modulos.json, cronograma.json)
   - `modulos/` — módulos de estudo em Markdown (ainda vazio)
   - `anki/` — decks .tsv (ainda vazio)
   - `hub/` — código-fonte do dashboard

2. **Taxonomia e schema** definidos em `dados/_taxonomia_e_instrucoes.md`:
   - 20 especialidades canônicas com código de módulo (PED, CIR, PREV, OBS, GIN, INF, GAS, END, PSI, CAR, NEF, NEU, HEM, PNE, ORT, DER, REU, HEP, OTO, OFT) e Tier A/B/C.
   - Schema JSON de cada questão (ver arquivo).

3. **Texto pré-extraído de TODAS as 18 edições** (2011 a 2026.1) já está em `dados/raw_text/{ano}__{nome}.txt`, gerado via `pdftotext -enc UTF-8` (sem `-layout`) a partir dos PDFs originais em `Provas_Revalida/`. Isso já valida que os PDFs têm texto extraível (não são scans) e evita ter que reler os PDFs originais — **use estes .txt como fonte, não os PDFs**, exceto para:
   - Gabaritos de **2013, 2017 e 2020**: a extração de texto do gabarito falhou (respostas desenhadas graficamente, não como texto). Para esses 3 anos, o gabarito precisa ser lido diretamente do PDF original (1 página, via Read tool, visualmente).
   - Questões com figura (ECG, radiografia, lesão de pele, fluxograma): a página específica do PDF original precisa ser lida visualmente para descrever a imagem com `[IMG: ...]`.

4. **Contagem de questões por edição** (confirmar sempre contra o gabarito, mas os valores esperados são):
   - 2011, 2012, 2013, 2014, 2015: **110 questões**, edição única (edicao=1)
   - 2016, 2017, 2020, 2021: **100 questões**, edição única (edicao=1)
   - 2022, 2023, 2024, 2025: **100 questões cada**, DUAS edições (.1 e .2)
   - 2026: **100 questões**, só a edição .1 existe até agora (2026.2 ainda não foi aplicada)
   - Total: ~1.850 questões no banco.

5. **Hub (dashboard) construído e publicado**: `hub/revalida_hub.html`, artefato em
   https://claude.ai/code/artifact/c7877dfa-f598-45df-835d-7fb19b8ed5d7
   - 6 abas (Hoje, Módulo, Cronograma, Questões, Estatísticas, Notas), sub-abas de módulo, realce de texto, busca Ctrl+K, caderno de erros, replanejamento, import/export JSON (via capability `downloads` — **não existe localStorage neste ambiente de artefato**, por isso progresso do usuário só persiste via export/import manual).
   - Estado atual: rodando com dados VAZIOS (`MODULOS=[]`, `CRONOGRAMA=[]`, `MAPA_STATS` zerado, `CONTEUDO_MODULOS={}`). Precisa ser **atualizado e republicado** (mesmo file_path) assim que houver dados reais.
   - Paleta de gráficos (divergente azul/vermelho/cinza, validada via skill dataviz) já embutida no CSS.

6. **Parâmetros do cronograma já coletados do usuário**:
   - Prova-alvo: **Revalida 2028.1** (NÃO é a janela padrão do documento original, que ia só até 07/2027 — o cronograma final precisa ser recalculado para essa janela mais longa)
   - Disponibilidade: ~3-4h em dias úteis, 6h+ em finais de semana
   - Sem dias fixos bloqueados por enquanto

## O que NÃO está pronto (bloqueado / em andamento)

**Tentativas de extração via agentes LLM (histórico, não repetir):**
- 14 agentes em paralelo lendo PDF como imagem → estourou limite de sessão da conta repetidamente (reset empurrado 4:20 → 9:30 → 14:40).
- 3 e depois 2 agentes em paralelo, já usando texto pré-extraído → travamentos ("stalled: no progress for 600s", "stream watchdog did not recover") — instabilidade de infraestrutura da plataforma no momento, não um problema do método.
- **Decisão tomada:** abandonar extração via agente-por-ano-inteiro. Construído em vez disso um script determinístico (`dados/_scripts/extrair.js`, Node.js, sem LLM, sem risco de estourar cota) que faz a extração MECÂNICA a partir do texto pré-extraído.

### Estado real da extração mecânica (`dados/raw/*.pre.json`) — rodado e salvo com sucesso

O script separa cada questão por número, tenta separar enunciado/alternativas (3 formatos de prova detectados) e casa com o gabarito (3 formatos de gabarito detectados). Resultado por edição (`total` = questões com bloco de texto encontrado; `ok` = já com alternativas A-D/E separadas corretamente; as demais têm o texto bruto capturado em `enunciado` mas ainda precisam ter as alternativas separadas manualmente/por LLM):

| Edição | total | ok | Observação |
|---|---|---|---|
| 2011.1 | 101/110 | 43 | gabarito 100% (110/110) |
| 2012.1 | 101/110 | 31 | gabarito 100% |
| 2013.1 | 94/110 | 0 | **gabarito ilegível como texto** (respostas desenhadas) |
| 2014.1 | 95/110 | 19 | gabarito 100% |
| 2015.1 | 107/110 | 49 | gabarito 105/110 |
| 2016.1 | 72/100 | 27 | gabarito 95/100 |
| 2017.1 | 73/100 | 0 | **gabarito ilegível como texto** |
| 2020.1 | 89/100 | 0 | **gabarito ilegível como texto** |
| 2021.1 | 69/100 | 23 | gabarito 100% |
| 2022.1 | 81/100 | 0 | gabarito 90/100 |
| 2022.2 | 92/100 | 25 | gabarito 86/100 |
| 2023.1 | 87/100 | 22 | gabarito 100% |
| 2023.2 | 93/100 | 26 | gabarito 100% |
| 2024.1 | 89/100 | 28 | gabarito 100% |
| 2024.2 | 90/100 | 25 | gabarito 100% |
| 2025.1 | 83/100 | 38 | gabarito 100% |
| 2025.2 | 73/100 | 59 | gabarito 90/100 |
| 2026.1 | 93/100 | 0 | **gabarito ilegível como texto** (fonte com encoding quebrado) |

### ATUALIZAÇÃO — pipeline v2 (pdftotext -layout + reordenação de colunas)

Descoberta: usar `pdftotext -layout` (preserva posição espacial) e depois um script
(`dados/_scripts/reordenar_colunas.js`) que separa cada linha em coluna esquerda/direita
pelo maior espaçamento e concatena col.esquerda-completa + col.direita-completa por página
(via form-feed `\f`) resolve a maior parte do embaralhamento de 2 colunas. Gerado em
`dados/raw_text/{ano/edicao}__Prova_LAYOUT_reordenado.txt` para todos os 18. O parser
`extrair.js` também ganhou um 3º heurístico de separação de alternativas (letra maiúscula
isolada por espaços, sem exigir maiúscula depois — cobre o formato "...quadro clínico A é
crônico... B requer...").

**Resultado final por edição (`ok` = enunciado+alternativas limpos; total sobe para ~1852):**

| Edição | ok/total | Edição | ok/total | Edição | ok/total |
|---|---|---|---|---|---|
| 2011.1 | 80/110 | 2017.1 | 68/100 | 2023.1 | 78/100 |
| 2012.1 | 89/110 | 2020.1 | 51/100 | 2023.2 | 80/100 |
| 2013.1 | 97/110 | 2021.1 | 91/100 | 2024.1 | 69/100 |
| 2014.1 | 88/110 | 2022.1 | **0/100** ⚠️ | 2024.2 | 78/100 |
| 2015.1 | 102/110 | 2022.2 | 68/100 | 2025.1 | 90/100 |
| 2016.1 | 66/100 | | | 2025.2 | 77/100 |
| | | | | 2026.1 | **100/100** ✅ |

**Total ≈ 1372/1852 (74%) já limpos.** O resto tem o texto bruto capturado (nada perdido), só falta separar em alternativas A-E — trabalho para a Fase B/C abaixo.

⚠️ **2022.1 E 2026.1 são casos especiais**: os PDFs das provas (não os gabaritos) têm fonte com mapeamento Unicode quebrado — todo o texto sai como glifos aleatórios (ex.: "hŵĂ ŵƵůŚĞƌ" em vez de "Uma mulher", "Ϯϰ ĂŶŽƐ" em vez de "24 anos"), tanto com `-layout` quanto sem, e tanto na versão original quanto na reordenada por coluna. `pdftotext` não consegue recuperar esses 2 arquivos de jeito nenhum (confirmado via grep no padrão "ĂŶŽƐ" em todos os 18 `raw_text` — só esses dois têm o problema). O `.pre.json` e o `.json` de **2026.1 estão CORROMPIDOS e não devem ser usados** (foram gerados a partir do texto quebrado antes de eu perceber o problema — preciso invalidar/refazer). Única saída para os dois: reconstruir via leitura visual do PDF (Read tool, renderiza como imagem) — tratar como tarefa isolada, ~200 questões no total, à parte do resto do banco.

✅ **Gabaritos 2013, 2017, 2020, 2026 corrigidos**: lidos visualmente (1-2 páginas cada) e salvos como `dados/raw_text/{ano}__Gabarito_VISUAL.txt` (formato simples "número letra" por linha). Todos os 18 gabaritos agora estão 100% corretos e batem com o total esperado.

### Fase B — ESTADO REAL ATUALIZADO EM 2026-08-07 — TODAS AS 16 EDIÇÕES NORMAIS 100% CLASSIFICADAS (verificado por `ls dados/raw/*.json`, não apenas relatado)

✅ **A Fase B de classificação normal está COMPLETA.** Todas as 16 edições com `.pre.json` íntegro (2011.1, 2012.1, 2013.1, 2014.1, 2015.1, 2016.1, 2017.1, 2020.1, 2021.1, 2022.2, 2023.1, 2023.2, 2024.1, 2024.2, 2025.1, 2025.2) têm `dados/raw/{edição}.json` com todas as questões presentes classificadas (`especialidade_primaria`, `tema`, `assunto`, `competencia`, `dificuldade_estimada`). **Só restam pendentes as 2 edições especiais com fonte de encoding quebrado (2022.1 e 2026.1)**, que exigem reconstrução visual do PDF e são tratadas à parte (ver nota sobre mapeamento Unicode corrompido, abaixo).

**Concluídos e 100% classificados (`dados/raw/{ano}.{edicao}.json` existe, com `especialidade_primaria`, `tema`, `assunto`, `competencia` preenchidos em cada questão)**: **2011.1, 2013.1, 2015.1, 2012.1, 2014.1, 2016.1, 2017.1, 2020.1, 2021.1, 2022.2, 2023.1, 2023.2, 2024.1, 2024.2, 2025.1, 2025.2** — as 3 primeiras são a base de dados usada durante TODO o maratona de geração de módulos deste projeto (todas as 269 questões usadas nos módulos vieram delas). **2012.1, 2014.1, 2016.1, 2017.1, 2020.1, 2021.1, 2022.2, 2023.1, 2023.2, 2024.1, 2024.2, 2025.1 e 2025.2 foram classificadas em 2026-08-07** (110, 110, 97, 96, 90, 99, 96, 98, 94, 94, 96, 98 e 96 questões respectivamente — a maioria tem menos de 100/110 porque alguns números de questão estão ausentes do `.pre.json`, não localizados pela extração mecânica; ver erros #42-#52) e ainda não tiveram nenhum módulo escrito a partir delas — ficam disponíveis para expandir módulos existentes ou gerar novos na próxima passada de geração. Notas: **2022.2, 2023.1, 2023.2, 2024.1, 2024.2, 2025.1 e 2025.2** têm várias questões com `gabarito_oficial: null` sem estarem oficialmente ANULADAS — categoria distinta, classificadas normalmente mas sem card interativo possível no futuro (mesmo padrão já documentado em PREV-13/PREV-33 etc.); em **2024.1** esse marcador nulo aparece como um caractere de sobrescrito/tilde estranho no gabarito bruto ("̶") em vez do `-` ou `null` visto nas outras edições — mesma categoria, notação diferente (questões 7, 17, 43 e 83); em **2024.2** o marcador nulo aparece como travessão "—" (questões 22, 30, 37, 46 e 60) — mais uma notação distinta para a mesma categoria; em **2025.1** volta a aparecer como "-" simples, como nas edições de 2022-2023 (questões 7, 23 e 34). Notas de formato: 2014.1 é a prova "Cinza" e tem só 4 alternativas por questão (A-D); 2016.1, 2017.1 e 2020.1 também têm só 4 alternativas (A-D) e são divididas em "Prova Objetiva V1-Manhã" com 100 questões nominais (não 110); 2017.1 e 2020.1 têm menções a COVID-19 (2020.1 é a edição realizada durante a pandemia); **2021.1 é a edição com melhor qualidade de extração encontrada até agora nesta rodada de Fase B** (apenas 1 número ausente de 100, texto com item de referência tipo "ITEM 138269" antes de cada enunciado, muito menos bleed entre questões vizinhas do que 2016.1/2017.1/2020.1); **2024.1 tem apenas 94/100 questões recuperáveis como entradas próprias** (números 3, 24, 34, 50, 59 e 85 não existem como entradas separadas no `.pre.json` — conteúdo absorvido integralmente pelo vizinho, confirmado programaticamente, não apenas por falha de leitura de cabeçalho); **2024.2 tem 96/100 questões recuperáveis** (números 8, 25, 35 e 48 igualmente confirmados ausentes do `.pre.json`, mesmo padrão); **2025.1 tem 98/100 questões recuperáveis** (apenas números 10 e 16 ausentes do `.pre.json` — a segunda melhor taxa de recuperação do lote, atrás apenas de 2021.1); **2025.2 tem 96/100 questões recuperáveis** (números 19, 31, 74 e 97 confirmados ausentes do `.pre.json`, mesmo padrão), e é a última edição normal da Fase B, encerrando essa etapa do projeto.

⚠️ **Nota de correção (histórica):** uma versão anterior deste documento afirmava que 2012.1, 2014.1, 2016.1, 2017.1 e 2020.1 estavam "rodando via agente" — isso não se confirmou na época; todas as 5 agora estão de fato concluídas (ver acima).

⚠️ **Nova suspeita de gabarito inconsistente (2020.1-Q98, estenose aórtica):** quadro clínico clássico de estenose aórtica grave sintomática (síncope + angina + dispneia, área valvar 0,9 cm², gradiente 55 mmHg, FE preservada 52%) aponta para indicação cirúrgica de troca valvar (alternativa D), mas o gabarito bruto registra a alternativa C (cateterismo por suspeita de DAC com "disfunção sistólica do VE", não sustentada pela FE relatada). Adicionado à lista de casos a auditar no PDF original.

⚠️ **Novas suspeitas de gabarito inconsistente (2024.1):** **Q5** — enunciado descreve visitas domiciliares como abordagem integral do indivíduo em seu contexto familiar/comunitário, definição clássica do princípio da **integralidade** (alternativa C), mas o gabarito bruto registra a alternativa A (Equidade). **Q81** — RN de 10 dias com secreção purulenta ocular abundante de início rápido, mãe com pré-natal irregular e leucorreia purulenta não tratada — quadro de alto risco para oftalmia gonocócica (indicaria D: ceftriaxona IM + colírio sem aguardar swab, pelo risco de perda visual), mas o gabarito bruto registra a alternativa C (conjuntivite bacteriana, aguardar swab). Ambas adicionadas à lista de casos a auditar no PDF original.

⚠️ **Nova suspeita de gabarito inconsistente (2025.2-Q3, esporotricose):** paciente com lesão ulceronodular em dorso da mão após arranhadura de gato, biópsia com dermatite granulomatosa, corpos asteroides e material eosinofílico ao redor de células — achados clássicos (corpos asteroides = fenômeno de Splendore-Hoeppli) e contexto epidemiológico (arranhadura de gato) fortemente sugestivos de esporotricose, cujo tratamento indicado seria itraconazol (alternativa C), mas o gabarito bruto registra a alternativa A (furunculose). Adicionado à lista de casos a auditar no PDF original.

**Pendentes de Fase B: NENHUMA edição normal restante — a Fase B de classificação está 100% concluída para as 16 edições com `.pre.json` íntegro.**

**2 edições especiais com fonte quebrada (fora da Fase B normal, precisam de reconstrução visual)**: 2022.1, 2026.1 — ver nota acima sobre o mapeamento Unicode corrompido.

Script de apoio usado para todo esse processo: `dados/_scripts/extrair.js` (extração mecânica), `dados/_scripts/reordenar_colunas.js` (corrige colunas via `-layout`), `dados/_scripts/compactar.js` (gera dump legível para classificação sem gastar tokens em JSON), `dados/_scripts/mesclar_classificacao.js` (aplica classificação + correções pontuais de volta no `.pre.json`, gerando o `.json` final), `dados/_scripts/consolidar.js` (refaz `mapa_mestre.json` e `modulos.json` a partir de todos os `dados/raw/*.json`).

**Lição aprendida (retrospectiva):** extrair E classificar uma prova inteira em uma única chamada de agente falhava repetidamente (rate limit da conta + instabilidade de streaming). Separar em (1) extração mecânica via script determinístico, sem LLM, e (2) classificação em tarefas menores por edição, com exemplos de referência prontos, se mostrou muito mais robusto e é o padrão a seguir dali para frente — inclusive para as edições que ainda faltam.

⚠️ **Nota sobre `consolidar.js` (2026-08-07, atualizada após 2014.1):** ao rodar `consolidar.js` depois de classificar 2012.1, o `modulos.json` foi regenerado com 328 entradas (antes 269) — a maioria dos códigos antigos foi preservada com o mesmo `codigo`/`status_geracao` (confirmado: INF-01, GAS-13, PSI-06, OFT-01, OTO-01 mantiveram `"gerado"` corretamente), e os novos módulos candidatos entraram como `"nao_gerado"`. **Um código órfão foi detectado**: `CIR-23_hemotorax-macico.md` existe como arquivo em `modulos/`, mas não há mais nenhum `codigo:"CIR-23"` no `modulos.json` novo — o tema provavelmente foi reagrupado sob outro código de trauma torácico. Nenhum conteúdo foi perdido (a questão original ainda está em `mapa_mestre.json`), mas o rastreamento desse 1 módulo ficou quebrado. **Ação**: incluir na auditoria final. Depois de classificar 2014.1 e rodar `consolidar.js` de novo (`modulos.json` foi para 385 entradas), rodei o mesmo diff de sanidade: **os 268 módulos `"gerado"` continuam intactos e nenhum órfão NOVO apareceu** — `CIR-23` continua sendo o único caso conhecido. Isso sugere que o órfão foi um evento pontual (fusão de um tema de baixa frequência), não um problema recorrente a cada `consolidar.js` — mas continuar rodando o diff a cada edição nova é a forma barata de confirmar isso.

## Fase C — Geração de conteúdo dos módulos, RETOMADA em 2026-08-08 (pós-Fase B completa)

Com a Fase B 100% concluída (16 edições, 1604 questões classificadas), o `consolidar.js` recalculou `dados/modulos.json` do zero e o total de módulos candidatos saltou de **269 (maratona original, baseada em só 3 edições) para 936** — a maioria (668, hoje 656) ainda **sem conteúdo próprio (`status_geracao: "nao_gerado"`)**, porque a Fase B revelou muito mais temas e muito mais questões por tema do que o banco parcial original continha.

⚠️ **Achado importante ao retomar a geração — duplicação semântica de módulos.** O agrupamento em `consolidar.js` é por **string exata** de `(especialidade, tema)`. Como o `tema` é escrito livremente a cada rodada de classificação (não vem de uma lista fixa), o mesmo assunto clínico real frequentemente ganha módulos "gêmeos" com nomes ligeiramente diferentes (ex.: "Rastreamento **de** câncer de colo uterino" vs. "Rastreamento **do** câncer de colo uterino"). Isso **já existia na maratona original de 268 módulos** — exemplos confirmados sem mexer ainda: `INF-01` (Meningites bacterianas) e `INF-04` (Meningites); `INF-11` (Tuberculose e HIV) e `INF-29` (Coinfecção TB/HIV); `PED-12`/`PED-24`/`PED-27` (três módulos de ITU pediátrica); `PED-19`/`PED-22`/`PED-37` (três módulos de infecção respiratória alta na infância); `PREV-06`/`PREV-23` (Redes de Atenção à Saúde, praticamente idêntico); `GIN-05`/`GIN-12` (Puerpério). **Nenhum desses foi mexido nesta rodada** — ficam registrados aqui para a auditoria final decidir se vale a pena consolidar (o risco de mexer em módulos `"gerado"` antigos é maior do que o de deixá-los como estão por ora).

O que **foi corrigido nesta rodada**, porque aconteceu ao vivo durante a geração do primeiro lote: duas duplicatas **novas**, criadas pela própria Fase B recém-concluída, foram detectadas e consolidadas antes de virarem lixo permanente:
- **GIN-24** ("Rastreamento de câncer de colo uterino", 15 questões reais de 16 edições) foi **fundido dentro de `GIN-01`** (que tinha só 4 questões de 3 edições antigas) — o conteúdo mais completo/atualizado (com estratificação etária de ASC-US/LSIL, "ver e tratar", HPV-DNA) tornou-se o corpo do módulo, mas o **código GIN-01 foi preservado** (nunca trocar o código de um módulo já referenciado). GIN-24 ficou marcado `"gerado"` no `modulos.json` sem arquivo próprio — mesmo padrão já usado para PREV-24/OBS-11.
- **GIN-33** ("Rastreamento de câncer de mama", 7 questões) foi fundido em `GIN-02` (2 questões antigas) pela mesma lógica — o GIN-33 resolvia uma ambiguidade que o GIN-02 antigo deixava em aberto (divergência MS/INCA "bienal 50-69" vs. SBM/FEBRASGO "anual 40+").

**Processo usado para gerar conteúdo novo (lote 1, 08/08/2026):** para cada módulo, (1) `node dados/_scripts/extrair_questoes_modulo.js CODIGO` (script novo, extrai as questões reais e completas — enunciado, alternativas, gabarito — direto de `dados/raw/*.json` pelo campo `modulo_destino`); (2) um subagente por módulo recebe essas questões reais + o exemplar-padrão `INF-01_meningites-bacterianas.md` como referência de formato/qualidade e escreve o `.md` completo (teoria, prática clínica, as questões reais com análise alternativa-por-alternativa, flashcards, resumo, metadados) — rodando em paralelo, um módulo por agente; (3) checagem manual de duplicata contra os módulos já `"gerado"` da mesma especialidade antes de aceitar o resultado; (4) `preparar_conteudo_modulo.js` + `injetar_no_hub.js` em lote; (5) atualizar `status_geracao` no `modulos.json` e reconfirmar a checagem de sanidade (nº de "gerado" e órfãos).

**Lote 1 concluído:** CIR-42 (trauma torácico), OBS-28 (gravidez ectópica), PED-47 (aleitamento materno), PREV-39 (tabagismo), PED-70 (púrpura de Henoch-Schönlein), PED-127 (TEA), PED-146 (calendário vacinal — complementar ao PED-01 já existente), GIN-69 (métodos contraceptivos — complementar ao GIN-20), INF-36 (ITU — complementar ao INF-30), INF-50 (sífilis na gestação — INF-26 existente só cobre neurossífilis em HIV+, sem sobreposição real). **12 módulos novos gerados + 2 duplicatas antigas consolidadas = `modulos.json` foi de 268 para 280 `"gerado"`, de 936 totais.** Sanidade confirmada: nenhum órfão novo além do já conhecido `CIR-23`.

**Novas suspeitas de gabarito inconsistente encontradas durante a geração deste lote** (adicionadas à lista de auditoria final, mesmo padrão dos casos já documentados):
- CIR-42: **INEP2025.2-Q17** tem `gabarito_oficial: null` sem marcação formal de anulação (mesma categoria já conhecida).
- OBS-28: **INEP2023.1-Q094** — o campo `gabarito_oficial` do banco pertence, na verdade, a uma questão de ética médica bleedada junto (não à vinheta de gravidez ectópica); nenhum gabarito foi atribuído à vinheta obstétrica nesse item.
- INF-36: **INEP2023.1-Q050** — gabarito bruto marca "D" (bacterioscopia vaginal), mas o próprio `assunto` da classificação da questão descreve a resposta esperada como "solicitar urocultura" (alternativa A) — contradição interna a verificar na fonte primária.
- INF-50: **INEP2022.2-Q025** — ruído de extração muito grave (mescla com questão de retocolite ulcerativa); o gabarito "B" contraria a conduta correta em gestante alérgica à penicilina (eritromicina/aguardar até o parto) — sinalizado no módulo como não confiável para uso clínico sem checagem do PDF original.

**Lote 2 concluído (mesmo dia, 08/08/2026):** 16 módulos novos gerados — CAR-10 (fibrilação atrial), GAS-17 (colangite aguda), GAS-18 (síndrome do intestino irritável), PSI-12 (depressão pós-parto — distinta de PSI-04/psicose puerperal), NEU-05 (AVC isquêmico agudo — distinto de NEU-02/AIT+FA+anticoagulação), NEU-11 (doença de Parkinson), PED-55 (sífilis congênita — lado da criança, distinto de INF-50/lado materno), PED-63 (hipovitaminose A), PED-81 (doença de Kawasaki), PED-93 (triagem neonatal), PED-88 (estenose hipertrófica do piloro), PED-119 (síndrome de Down), CIR-41 (abdome agudo perfurativo), CIR-50 (profilaxia antibiótica cirúrgica), CIR-57 (avaliação pré-operatória), CIR-94 (câncer de testículo). **Mais 4 duplicatas novas detectadas e consolidadas antes de gerar conteúdo redundante:** GAS-14→fundido em GAS-05 (DRGE), PED-45→fundido em CAR-02 (febre reumática — duplicata **cruzada entre especialidades**, mesmo tema exato classificado ora como Pediatria ora como Cardiologia), CIR-43→fundido em CIR-09 (pneumotórax hipertensivo — a fusão revelou um achado clínico real: questões de 2024 usam o **5º espaço intercostal linha axilar** para descompressão, não o clássico 2º EIC linha hemiclavicular, refletindo atualização real do ATLS), PREV-40→fundido em PREV-01 (declaração de óbito — a fusão revelou uma questão com gabarito aparentemente contraintuitivo, INEP2024-2-Q023, sinalizada como ALTA PRIORIDADE de auditoria). **`modulos.json` foi de 280 para 300 `"gerado"` de 936 totais.** Sanidade confirmada novamente: nenhum órfão novo além do já conhecido `CIR-23`.

**Restam 636 módulos genuinamente sem conteúdo** (excluindo os que só precisam apontar/mesclar em um módulo já `"gerado"`). Trabalho a continuar em lotes por prioridade (Tier A > B > C, maior nº de questões primeiro), seguindo exatamente o mesmo processo — sempre checando duplicata semântica contra a lista de módulos já `"gerado"` da mesma especialidade **antes** de mandar gerar um módulo novo, para não repetir o erro que já existe nos 268 originais. **Lição reforçada do lote 2:** a duplicata pode ser cruzada entre especialidades diferentes (PED-45/CAR-02 tinham o `tema` idêntico "Febre reumática", mas uma classificada em Pediatria e outra em Cardiologia) — a checagem de duplicata precisa varrer TODAS as especialidades relacionadas ao módulo candidato, não apenas a especialidade primária dele.

**Lote 3 concluído (08/08/2026):** metodologia refinada aplicando a lição do lote 2 — antes de fechar a lista do lote, os 25 candidatos prioritários foram cruzados contra as listas COMPLETAS de módulos `"gerado"` de Infectologia, Pediatria, Obstetrícia, Ginecologia e Preventiva simultaneamente (não uma especialidade por vez), identificando 12 duplicatas e 12 candidatos genuinamente novos de uma só vez, antes de disparar qualquer agente de geração.

- **12 módulos novos gerados:** OBS-26 (gestação pós-termo), OBS-57 (restrição de crescimento fetal), GIN-32 (climatério/TH — distinto de GIN-14/sangramento pós-menopausa), GIN-48 (endometriose), INF-39 (leishmaniose tegumentar americana), INF-43 (esquistossomose mansônica), INF-45 (mononucleose infecciosa), INF-83 (cólera), PED-46 (leucemia linfoblástica aguda), PED-54 (criptorquidia), PED-68 (distúrbios ácido-base), PED-89 (artrite idiopática juvenil).
- **12 duplicatas detectadas e mescladas nos módulos já `"gerado"`** (desta vez direto por mim, lendo os arquivos-alvo e usando Edit, sem delegar a agentes): INF-35→INF-01 (meningites — reforça diagnóstico diferencial bacteriana/viral e indicação de PL), INF-40→**INF-11** (coinfecção TB/HIV — note: o alvo originalmente seria INF-29, mas **INF-29 é um código "gerado sem arquivo próprio"**, já mesclado dentro de INF-11 desde a maratona original — redirecionado corretamente), INF-67→INF-05 (toxoplasmose gestacional — questão nova sobre avidez de IgG forte/infecção pregressa), PED-40→INF-24 (infecções congênitas por CMV), PED-83→PED-93 (triagem neonatal — teste do coraçãozinho, revelou inconsistência entre dois gabaritos oficiais quanto ao limiar de diferença percentual "limítrofe" vs. "normal", documentada como item a verificar), PED-91→**PED-12** (ITU pediátrica — mesmo padrão do INF-29: o alvo original seria PED-24, também "gerado sem arquivo próprio", já mesclado dentro de PED-12 desde a maratona original — redirecionado corretamente; trouxe conteúdo novo sobre cintilografia renal DMSA para cicatriz renal), OBS-66→OBS-04 (síndromes hipertensivas — 2 questões novas sobre investigação inicial antes de classificar gravidade), OBS-27→OBS-02 (distocias — 1 questão nova de partograma, mais 2 questões não incluídas como cards por dano de extração), GIN-28→GIN-11 (doenças da mama — trouxe necrose gordurosa pós-trauma e conduta BIRADS 3 como conteúdo novo), PED-50→PED-03 (icterícia neonatal — trouxe colestase/atresia de vias biliares como subtema novo), PED-87→PED-04 (maus-tratos — trouxe abuso sexual infantil/perfil do agressor e profilaxia de hepatite B como subtema novo), PREV-41→PREV-13 (validade de testes — trouxe cálculo numérico de VPP/sensibilidade, que o módulo antes só tinha em nível conceitual).
- **Achado metodológico confirmado neste lote:** ao verificar os nomes de arquivo dos 12 alvos de mesclagem, `PED-24` e `INF-29` não tinham `.md` próprio — são exemplos do mesmo padrão já documentado para OBS-11/PREV-24 (código `"gerado"` no `modulos.json` apontando para conteúdo que vive em um módulo-irmão, sem arquivo próprio). Antes de mesclar, sempre checar `dados/modulos.json` diretamente (`status_geracao` + ausência de arquivo) para os alvos de mesclagem, não assumir que o código pendente aponta automaticamente para um arquivo do mesmo nome.
- **`modulos.json` foi de 300 para 324 `"gerado"` de 936 totais.** Sanidade confirmada novamente: nenhum órfão novo além do já conhecido `CIR-23`.

**Restam 612 módulos genuinamente sem conteúdo.**

**Lote 4 de geração de módulos (2026-08-13) — primeira rodada com ferramentas de fluxo de trabalho
automatizadas.** Antes de gerar conteúdo, construídos 3 scripts novos em `dados/_scripts/`:
- `detectar_duplicatas.js` — normaliza `tema` (remove acento/stopword, bag-of-words) e compara
  TODOS os candidatos `nao_gerado` contra TODOS os `gerado` (e entre si), classificando em
  "forte"/"possível"/"nenhuma" duplicata. Usa um gate duplo (containment + Jaccard) para não
  confundir um tema guarda-chuva de 1 palavra (ex. "Trauma") com falso-positivo contra toda uma
  família de subtemas. **Limitação conhecida:** não faz stemming — "Hérnias" e "Hérnia" contam
  como tokens diferentes (foi assim que `CIR-44` escapou da varredura automática e só foi pego por
  leitura manual do conteúdo — ver abaixo).
- `verificar_gabaritos.js` — compara o `gabarito_oficial` escrito em cada `_conteudo_<CODIGO>.json`
  contra o bruto em `mapa_mestre.json`, para um lote inteiro de códigos de uma vez. Automatiza o
  passo que os erros #23/#29 já tinham identificado como indispensável mas que era feito manualmente
  a cada lote.
- `selecionar_lote.js` — escolhe os N candidatos `nao_gerado` de maior prioridade, já excluindo os
  que dariam duplicata forte contra o já `gerado` OU contra outro candidato do mesmo lote.

**Processo do lote:** `selecionar_lote.js 10` escolheu PED-61, PED-96, PED-138, PED-154, CIR-44,
CIR-52, CIR-55, CIR-67, CIR-96, CIR-97 (todos Tier A, 2 questões cada — reflexo da fragmentação de
cauda longa que resta no banco). **Antes de gerar, leitura manual do conteúdo de CIR-44 ("Hérnia
inguinal") revelou que é duplicata real de `CIR-02` ("Hérnias da parede abdominal", já `gerado`) —
mesmo raciocínio central (redutível/encarcerada/estrangulada)** — não pego pelo detector automático
pela limitação de stemming acima. CIR-44 foi mesclado manualmente em CIR-02 (2 questões novas:
2012.1-Q50, 2014.1-Q35) e substituído por `CIR-111` ("Câncer de bexiga") no lote.

**10 módulos gerados via subagentes em paralelo** (um por módulo, cada um lendo o checklist
operacional novo — `dados/_scripts/_checklist_geracao_modulo.md`, criado nesta sessão para
condensar as regras da constituição do projeto sem exigir que cada agente releia o
`PROCESSO_E_APRENDIZADO.md` inteiro — e o exemplar INF-01): PED-61 (mastite puerperal), PED-96
(intoxicação medicamentosa acidental — 2 questões mantidas interativas com nota 🔴 DIVERGÊNCIA cada,
gabaritos possivelmente trocados na fonte), PED-138 (conjuntivite neonatal — questão excluída do
interativo por suspeita de gabarito incoerente, já era um item do backlog/erro #49), PED-154
(intoxicações exógenas), CIR-52 (trauma abdominal fechado), CIR-55 (anestesia geral — 1ª módulo da
especialidade), CIR-67 (queimadura elétrica), CIR-96 (hérnia incisional), CIR-97 (complicações de
acesso venoso central — 2 questões excluídas do interativo, seção 3 inteira em texto corrido),
CIR-111 (câncer de bexiga — 2 questões excluídas do interativo, mesmo padrão). **`modulos.json` foi
de 324 para 335 `"gerado"` de 936 totais** (10 novos + CIR-44 mesclado). Todos os 12 gabaritos
interativos do lote bateram exatamente contra `mapa_mestre.json` na verificação cruzada automática.

**Achado de QA importante, fora do escopo do lote em si:** ao rodar a verificação cruzada em todo o
Hub publicado (não só no lote novo), encontrados **16 cards de questão pré-existentes com
`alternativas: {}` vazio** — quebrados silenciosamente no Hub (renderização em branco, sem opção
clicável), mesmo padrão do erro #11 já documentado. Causa raiz: os módulos (`GIN-01`, `GAS-05`,
`CIR-42`, `PREV-39` [2×], `CAR-10`, `GAS-18`, `PED-63`, `PED-81`, `PED-119`, `CIR-50`, `CIR-57`,
`GIN-32`, `INF-39`, `INF-45`, `PED-89`, todos do "Fase C" lote 1) tinham corretamente reconhecido
que a questão estava danificada demais para ter alternativas confiáveis e escreveram uma nota
honesta em vez de inventar texto — mas mantiveram o cabeçalho formal `**[INEP ...]**`, que o parser
`preparar_conteudo_modulo.js` interpreta como bloco interativo válido mesmo sem alternativas.
Corrigido mecanicamente nos 16 casos: cabeçalho trocado para `**[Banco INEP ...]**` (não aciona
mais o parser), preservando o texto/nota already escrito. Também corrigido, na mesma varredura, um
bug real do parser (`preparar_conteudo_modulo.js` splitava por qualquer ocorrência da substring
`**[INEP`, inclusive dentro de uma citação em prosa entre crases — `CIR-97` mencionava o próprio
padrão de formato como exemplo do que NÃO estava usando, e isso virava um card fantasma; corrigido
para exigir `\n**[INEP AAAA` — início de linha + ano de 4 dígitos). E um gabarito genuinamente
errado por raciocínio próprio (não da fonte) encontrado e corrigido: `PREV-39`/INEP2024-2-Q098
estava escrito com gabarito D, mas o bruto é A — e o próprio campo `assunto` do banco ("Eficácia
comparável entre intervenções breves e de maior intensidade...") corresponde quase literalmente ao
texto da alternativa A, confirmando erro de transcrição/raciocínio (mesmo padrão CIR-30/GAS-13),
reescrito com a explicação correta. **Resultado: 0 cards quebrados em todo o Hub (472 questões
interativas, todas com alternativas reais), antes 16.**

**Também completado nesta rodada:** `CIR-02` já tinha, desde antes desta sessão, 2 questões de
2025.2 (Q08/Q10) apontadas para si em `dados/modulos.json` (`consolidar.js` já havia rodado com
dados mais completos), mas o `.md` nunca tinha sido atualizado para incluí-las — um gap
pré-existente descoberto ao comparar o Hub publicado (antes desta sessão) contra o `modulos.json`
local. As 2 questões (mesmo "quadro compartilhado", Q10 com a vinheta e Q08 com o painel
laboratorial + alternativas) foram reconstruídas e adicionadas — `CIR-02` agora tem 6 questões
(4 originais/mescladas + 2 de 2025.2), incluindo uma nota `⚠️ VERIFICAR` sobre possível gabarito
inguinal-vs-femoral não confirmável sem o dado de localização anatômica perdido na extração.

**Hub republicado no MESMO link** (mesmo `file_path`, artefato `c7877dfa-...`) com os 335 módulos
`"gerado"`, 298 módulos com conteúdo injetado, 472 questões interativas (0 quebradas). Anki `.tsv`
gerados para os 10 módulos novos + `CIR-02` atualizado.

**Lote 5 (2026-08-13, mesmo dia) — segunda rodada usando as ferramentas do lote 4, processo
confirmado e repetível.** `selecionar_lote.js 10` retornou CIR-128, CIR-129, CIR-116, PREV-42,
PREV-43, PREV-44, OBS-21, OBS-24, OBS-29, OBS-30. Checagem manual de conteúdo (não só de tema)
revelou **3 duplicatas reais que o detector automático não pegou**, todas por variação lexical fora
do alcance do bag-of-words simples:
- `CIR-116` ("Antibioticoprofilaxia cirúrgica") = duplicata de `CIR-50` ("Profilaxia antibiótica
  cirúrgica", já gerado) — mesclado, CIR-50 foi de 3 para 5 questões.
- `OBS-56` ("Profilaxia para estreptococo do grupo B") = duplicata de `OBS-24` ("Estreptococo do
  grupo B na gestação", candidato deste mesmo lote) — mesclados ANTES de gerar, OBS-24 escrito já
  com as 4 questões (1 excluída do interativo por alternativa com zero texto recuperável).
- `PED-134` ("Doença de Hirschsprung", Pediatria) = duplicata EXATA de tema de `CIR-129`... na
  verdade de `CIR-128` (mesmo tema, especialidades diferentes — mesmo padrão do erro #54
  PED-45/CAR-02) — mesclados ANTES de gerar, CIR-128 escrito com 3 questões.

**9 módulos gerados** (CIR-129 câncer de pênis, PREV-42 princípios/diretrizes do SUS, PREV-43 saúde
indígena/ribeirinha, PREV-44 controle social no SUS, OBS-21 hipotireoidismo na gestação, OBS-24 EGB
na gestação, OBS-29 cardiotocografia, OBS-30 sangramento de 1º trimestre, CIR-128 doença de
Hirschsprung) + `CIR-50` expandido. **Achado notável em CIR-128:** o gabarito bruto da questão
INEP2024-1-Q012 (A) contradizia o próprio campo `assunto` do banco (que descrevia a alternativa B
como a conduta correta) — corrigido para B com nota `🔴 DIVERGÊNCIA (corrigida)` e total
transparência, mesmo padrão de correção já usado no `PREV-39` do lote 4. **PREV-42** teve um caso
de "suspeita de gabarito" onde uma segunda leitura cuidadosa (seguindo o precedente OBS-10) concluiu
que o gabarito bruto estava correto (critério de priorização de visitas = equidade, não
integralidade) — mantido como bloco interativo normal, sem marcar divergência falsa.
`modulos.json` foi de 335 para **347 `"gerado"`** de 936 (9 novos + 3 mesclagens). Verificação
cruzada automática: 13/14 gabaritos bateram exatamente contra o banco bruto (o 14º é a correção
deliberada e documentada de CIR-128, não um erro). Hub republicado no mesmo link, 0 cards quebrados
em 486 questões interativas.

**Lote 6 (2026-08-13, mesmo dia dos lotes 4/5) — todos os 10 candidatos vieram de Obstetrícia,
maior densidade de duplicata/fragmentação já vista num único lote.** `selecionar_lote.js 10`
retornou OBS-31, OBS-32, OBS-33, OBS-34, OBS-42, OBS-45, OBS-53, OBS-69, OBS-70, OBS-71. A
checagem manual de conteúdo (obrigatória desde o lote 4) revelou **4 duplicatas reais**, nenhuma
pega pelo detector automático:
- `OBS-42` ("Pielonefrite na gestação") = duplicata de `OBS-05` ("Infecção urinária na gestação",
  já gerado, assunto já cobria pielonefrite explicitamente) — mesclado (só 1 das 2 questões
  aproveitável; a outra revelou-se um erro de alinhamento na Fase B, conteúdo de fissura anal).
- `OBS-45` ("Isoimunização Rh") = duplicata de `OBS-20` ("Doença hemolítica perinatal", já gerado,
  assunto já era aloimunização Rh) — mesclado (só 1 das 2 questões aproveitável; a outra, perda
  total por bleed duplo).
- `OBS-70` ("Estática fetal") e `OBS-33` ("Exame obstétrico") — mesmo campo (manobras de Leopold);
  **OBS-70 era literalmente a MESMA questão que OBS-33 já continha, dividida em 2 registros pela
  extração** (mesmo padrão "quadro compartilhado" já visto antes) — reconstruído e mesclado em
  OBS-33 antes de gerar.
- `OBS-71` ("Prevenção de parto pré-termo") e `OBS-34` ("Insuficiência istmocervical") — mesmo
  algoritmo clínico (colo curto/história obstétrica → cerclagem vs. progesterona vs. pessário) —
  fundidos num único módulo mais rico (`OBS-34`, escopo ampliado) em vez de 2 módulos finos
  sobrepostos.

**Danos de extração incomuns neste lote:** pelo menos 4 questões continham conteúdo de OUTRA
questão inteira (não apenas um fragmento bleeded) — ex. o registro de Q072/pielonefrite continha na
verdade uma questão inteira sobre fissura anal; o de Q021/isoimunização Rh continha DUAS questões
diferentes bleeded juntas (rastreio colorretal + cirurgia COVID). Esses casos foram tratados como
perda total (excluídos, não reconstruídos) — diferente do bleed parcial usual, aqui não havia
NENHUM fragmento aproveitável do conteúdo real.

**6 módulos novos gerados** (OBS-31 placenta prévia, OBS-32 RPMO, OBS-33 exame obstétrico +
OBS-70, OBS-34 prevenção de parto pré-termo + OBS-71, OBS-53 gestação pós-bariátrica, OBS-69 parto
operatório) + `OBS-05` e `OBS-20` expandidos com 1 questão nova cada. `modulos.json` foi de 347
para **357 `"gerado"`** de 936 (6 novos + 4 mesclagens + 2 expansões). Verificação cruzada: 11/11
gabaritos do lote novo bateram exatamente; nenhum mismatch. Hub republicado no mesmo link, 0 cards
quebrados em 499 questões interativas.

**Lote 7 (2026-08-13, mesmo dia dos lotes 4/5/6) — mistura de Ginecologia/Obstetrícia/Infectologia,
3 novas mesclagens confirmadas.** `selecionar_lote.js 10` retornou OBS-72, OBS-73, GIN-27, GIN-39,
GIN-41, GIN-42, GIN-51, GIN-70, INF-37, INF-48. Checagem manual de conteúdo revelou **3 duplicatas
reais**, nenhuma pega pelo detector automático:
- `GIN-39` ("Vaginose bacteriana") = duplicata de `GIN-08` ("Corrimento vaginal", já gerado, mas
  cujas 2 questões originais tinham AMBAS sido excluídas do simulado por problema de gabarito) —
  mesclado; as 2 questões de GIN-39 são limpas e finalmente deram a GIN-08 conteúdo interativo real.
- `OBS-72` ("Sangramento na gestação inicial") = duplicata de `OBS-30` ("Sangramento de 1º
  trimestre — ameaça de abortamento", já gerado, mas também com AMBAS as questões originais
  excluídas por dano) — mesma situação: mesclado, e as 2 questões de OBS-72 (limpas) finalmente
  deram conteúdo interativo real a OBS-30.
- `INF-48` ("Ancilostomíase") = duplicata de `INF-02` ("Parasitoses intestinais", já cobria a
  mesma associação anemia+eosinofilia) — mesclado; as 2 questões trouxeram conteúdo genuinamente
  novo (fase cutânea de penetração da larva e síndrome de Löffler/migração pulmonar), ampliando
  o módulo em vez de apenas repetir.

**Achado de qualidade:** `INF-02`/INEP2016.1-Q96 apresentou o mesmo padrão de contradição interna
já visto ~10 vezes no projeto (campo `assunto` do banco aponta para uma alternativa, `gabarito_
oficial` bruto aponta para outra) — resolvido com nota `🔴 DIVERGÊNCIA` explícita, sem alterar
silenciosamente o gabarito escrito nem aceitar cegamente o valor bruto.

**6 módulos novos gerados** (GIN-27 planejamento familiar, GIN-41 sangramento uterino anormal na
adolescência, GIN-42 cervicite, GIN-51 contracepção hormonal, GIN-70 massas anexiais, INF-37
HIV/AIDS) + `GIN-08`, `OBS-30` e `INF-02` expandidos. Um quase-duplicado (`GIN-70` "Massas
anexiais" vs. `GIN-07` "Massa anexial", já existente) foi investigado e confirmado como
COMPLEMENTAR, não duplicata — GIN-07 usa raciocínio clínico/fatores de risco para suspeitar de
malignidade, GIN-70 usa critérios morfológicos de ultrassom para decidir conduta — mantidos
separados com referência cruzada. `modulos.json` foi de 357 para **366 `"gerado"`** de 936 (6
novos + 3 mesclagens). Verificação cruzada: 9/9 gabaritos novos bateram exatamente. Hub
republicado no mesmo link, 0 cards quebrados em 514 questões interativas.

**Lote 8 (2026-08-13, mesmo dia dos lotes 4-7) — 3 novas mesclagens, e uma que resolveu 2
candidatos "irmãos" no mesmo pente.** `selecionar_lote.js 10` retornou OBS-73, INF-56, INF-58,
INF-60, INF-74, INF-82, PED-41, PED-42, PED-43, PED-44. Checagem manual revelou 3 mesclagens:
- `PED-41` ("Meningite viral em lactente") = mesmo assunto central de `INF-04` ("Meningites",
  já gerado, cujo `assunto` já era literalmente "diagnóstico diferencial de meningite por padrão
  liquórico — viral, tuberculosa e bacteriana parcialmente tratada") — mesclado como nota de
  texto corrido (a questão não tinha alternativas suficientes para virar card interativo).
- `PED-42` ("Diarreia/enteropatias na infância") e `PED-43` ("Enteropatia ambiental") — ambos do
  mesmo domínio de `PED-05` ("Diarreia crônica na infância", já gerado, cuja tabela de
  diferencial já citava APLV/celíaca/fibrose cística) — mesclados juntos, acrescentando 2
  entidades novas à tabela (enteropatia infecciosa aguda, enteropatia ambiental).

**⚠️ Incidente técnico neste lote:** ao disparar os 7 subagentes para os módulos genuinamente
novos (OBS-73, INF-56, INF-58, INF-60, INF-74, INF-82, PED-44), todos os 7 retornaram
`status: failed` por limite de sessão da API Anthropic (não um erro de conteúdo). **Verificado
manualmente que os 7 arquivos `.md` já haviam sido escritos em disco antes do erro** (o `Write`
final acontece antes do erro de sessão) — todos estruturalmente completos (6/6 headers, bloco de
metadados, sem placeholders quebrados) e processados normalmente pelo pipeline (preparar →
verificar gabaritos → injetar → atualizar `modulos.json`). **Lição: uma notificação `failed` de
agente não significa necessariamente que nada foi salvo — sempre checar `ls modulos/` pelo código
esperado antes de assumir perda de trabalho e re-disparar o agente.**

`modulos.json` foi de 366 para **376 `"gerado"`** de 936 (7 novos + 3 mesclagens). Verificação
cruzada: 7/7 gabaritos novos bateram exatamente contra o banco bruto. Hub republicado no mesmo
link, 0 cards quebrados em 521 questões interativas.

**Estado consolidado ao final do lote 8: 376/936 módulos = 40,2% do total de candidatos do banco
já têm conteúdo completo gerado.** Isso NÃO é o mesmo que "40% do edital pronto" — os 936
candidatos são desigualmente distribuídos (Tier A concentra os assuntos mais cobrados) e boa
parte dos ~560 restantes são candidatos de cauda longa (1-2 questões, prioridade 3) similares aos
já sendo processados nestes últimos lotes; as especialidades de maior peso (Pediatria, Cirurgia,
Preventiva, Obstetrícia, Ginecologia, Infectologia = Tier A, 66,7% da prova) já estavam 100%
cobertas pela maratona original antes destes lotes de expansão pós-Fase B.

**Restam 560 módulos genuinamente sem conteúdo** (936 candidatos − 376 gerados). Para o próximo
lote, seguir exatamente este processo (confirmado funcionando em 5 rodadas consecutivas, já rendeu
14 duplicatas/mesclagens reais que o detector automático sozinho não pegaria):
`node dados/_scripts/selecionar_lote.js 10` → checar manualmente por duplicata de CONTEÚDO (não só
de string de tema, pela limitação de stemming/variação lexical) contra módulos já gerados da mesma
família temática antes de aceitar a lista → mesclar qualquer duplicata encontrada ANTES de gerar
(nunca depois) → `extrair_questoes_modulo.js` → ler os dados brutos e PRÉ-ANALISAR toda questão com
`status:"revisar_extracao"` (decidir reconstrução vs. exclusão, verificar se `assunto` contradiz
`gabarito_oficial`, verificar se o texto pertence a OUTRA questão inteira — não só bleed parcial)
antes de escrever os prompts dos subagentes → gerar via subagentes em paralelo (checklist + INF-01
como referência, com as decisões de reconstrução/exclusão já prontas no prompt) →
`preparar_conteudo_modulo.js` + `verificar_gabaritos.js` em lote → `injetar_no_hub.js` → atualizar
`status_geracao` em `modulos.json` → extrair `.tsv` para `anki/` → republicar o Hub no mesmo link →
atualizar este arquivo e o `PROCESSO_E_APRENDIZADO.md`.

## PRÓXIMOS PASSOS — nova arquitetura (mais robusta)

Separar em duas fases independentes, cada uma pequena e retomável:

### Fase A — Extração mecânica (determinística, sem LLM, sem risco de travar)
Escrever um script Node.js (`dados/_scripts/extrair.js` ou similar) que:
1. Lê `dados/raw_text/{ano}__Prova_*.txt`
2. Separa por marcador `QUEST[ÃA]O\s*N` (regex tolerante a maiúsculas/minúsculas, zeros à esquerda, espaços)
3. Para cada bloco, extrai enunciado bruto + alternativas (regex para A/B/C/D/E, tolerando formatos "(A)" e "A ")
4. Lê o gabarito correspondente (txt, ou nota manual para 2013/2017/2020) e anexa gabarito_oficial + anulada
5. Ordena por número, sinaliza com `"status":"revisar_extracao"` qualquer questão cujo bloco pareça incompleto (poucas alternativas, texto muito curto/longo, referência a figura)
6. Salva em `dados/raw/{ano}.{edicao}.pre.json` — SEM classificação ainda (especialidade/tema/assunto ficam null)

Isso resolve a maior parte do trabalho (~90% das questões) sem gastar nenhuma chamada de LLM e sem risco de travar, porque é só processamento de texto local.

### Fase B — Classificação (precisa de julgamento, mas em lotes PEQUENOS)
Com o `.pre.json` pronto por ano, classificar em lotes de ~20-25 questões por vez (não 100-110 de uma vez) — cada lote é uma tarefa curta e rápida, e o resultado de cada lote é salvo imediatamente. Isso limita a perda em caso de falha a no máximo 20-25 questões, não 110.

### Fase C — Revisão manual/visual pontual
Só para: (a) questões marcadas "revisar_extracao" pelo script, (b) questões com figura (`[IMG:]`), (c) gabaritos de 2013/2017/2020. Isso é um conjunto pequeno e específico de questões, tratável uma a uma.

### Depois disso
- Consolidar tudo em `mapa_mestre.json` + `modulos.json` (ver arquitetura original no .MD)
- Gerar `cronograma.json` (janela até Revalida 2028.1)
- Gerar módulos Tier A prioritários (.md) + decks Anki (.tsv)
- Reinjetar dados reais no Hub e republicar (mesmo file_path, mesma URL)

## Arquivo-fonte de referência
O plano completo original está em `Sistema_Revalida_Prompts_e_Arquitetura.md` na raiz do projeto — todas as regras de estilo, estrutura de módulo, prompts, etc. continuam válidas e não mudaram.

---

## 2026-09-24 — Auditoria dos blocos órfãos: 13 gabaritos errados encontrados e corrigidos

`verificar_tudo.js` vinha relatando **38 blocos "sem par no oficial"** e tratando isso como
ruído tolerável. Não era. Investigados um a um, **13 deles ensinavam a resposta errada**.

### Por que a auditoria não os pegava

`auditar_modulos.js` casava o **texto inteiro** do bloco contra o caderno oficial. Mas esses
blocos foram escritos a partir de extrações em que o **enunciado se perdeu** — sobrou a
pergunta final e as alternativas. Com o enunciado ausente, a similaridade de texto cheio
despencava para 0,02-0,30 e o bloco caía em "sem par", sem que número nem gabarito fossem
conferidos.

A saída foi casar pelas **alternativas**, que sobreviveram quase intactas. São curtas,
específicas e raramente se repetem entre questões — assinatura muito mais estável que o
enunciado. Ferramenta nova: `auditar_sem_par.js`. Resultado: 13 blocos com similaridade
**1,00** contra uma questão de **outro número**, cada um carregando o gabarito da questão
que ocupava o número antigo.

### O que estava sendo ensinado errado

| Módulo | Era | É | Consequência do erro |
|---|---|---|---|
| CIR-02 hérnias | 2025.2-Q8 gab B | **Q10 gab C** | ensinava hérnia inguinal onde é **femoral encarcerada** |
| CIR-41 → CIR-29 | 2012.1-Q6 gab E | **Q7 gab B** | ensinava úlcera perfurada onde é **pancreatite biliar** |
| CIR-97 acesso venoso | 2023.1-Q76 gab B | **Q77 gab A** | ensinava hemotórax onde é **pneumotórax** |
| GAS-13 HDB | 2015.1-Q84 gab C | **Q86 gab B** | ensinava **não transfundir** idosa sangrando com Hb 8,5 |
| GIN-02 → GIN-11 | 2024.2-Q82 gab D | **Q84 gab B** | ensinava investigar adensamento onde é **cisto simples BIRADS 2** |
| GIN-32 climatério | 2020.1-Q5 gab B | **Q6 gab D** | ensinava pedir FSH onde se **trata** |
| INF-36 ITU | 2023.1-Q50 gab D | **Q51 gab B** | ensinava pedir urocultura onde se **trata empiricamente** |
| PED-89 | 2023.1-Q56 gab C | **Q58 gab A** | ensinava AIJ onde é **epifisiólise femoral** (emergência) |
| PREV-39 tabagismo | 2024.2-Q98 gab A | **Q100 gab D** | — |
| REU-03 → REU-04 | 2025.1-Q44 gab D | **Q46 gab B** | ensinava LES onde é **artrite reumatoide** |
| GAS-05 DRGE | 2012.1-Q57 gab D | **Q59 gab C** | ensinava antiácido onde se prescreve **IBP** |
| CIR-57 pré-op | 2017.1-Q36 | **Q37 gab D** | bloco híbrido, duplicata |
| PSI-12 dep. pós-parto | 2025.2-Q55 ANULADA | **Q57 gab C** | ensinava que o quadro **não tem resposta**, quando tem |

Mais 3 blocos com **número** errado e gabarito certo (CIR-42, PREV-14, OBS-19).

Em 4 casos o bloco também estava no **módulo errado** — pancreatite biliar em "abdome agudo
perfurativo", cisto de mama em "rastreamento de câncer de mama", artrite reumatoide em "LES",
infecção de sítio cirúrgico em "câncer de pênis". Todas as 13 justificativas foram
**reescritas do zero** para defender a alternativa correta: corrigir número e gabarito sem
reescrever o texto seria pior que não mexer — exibiria a letra certa com o argumento errado.

### A folha de respostas como segunda fonte

Os 24 blocos restantes continuavam sem verificação. A descoberta: `_gabaritos_oficiais.json`
cobre as 18 edições **inclusive as questões cujo texto se perdeu na extração** — são **129**
questões com gabarito conhecido e texto ausente (das quais 100 são a prova 2022.1 inteira).

Conferidos os 24 contra a folha: **24/24 com o gabarito correto**. Eles nunca estiveram
errados — faltava à auditoria a segunda fonte. `auditar_modulos.js` agora consulta a folha
antes de declarar "sem par", e o estado passou de *38 não verificados* para **664/664
verificados, 0 divergências**.

### Outras correções desta rodada

- **`worklist.js` casava código de módulo por substring** (`t.includes('CIR-12')` dá
  verdadeiro dentro de "CIR-129"). Três questões de infecção de sítio cirúrgico apareciam
  sob "câncer de pênis". Corrigido com limite de palavra.
- **660 questões apontam para 551 códigos de módulo que não existem** como arquivo — módulos
  planejados e nunca escritos. Não é defeito de dados; é o tamanho real do trabalho restante.
- **`limpar_rodapes.js`** (nova): removeu rodapé de página colado em **267 alternativas**,
  serial `ITEM nnnnn - V. nnnnnn` de **248 enunciados** (prova 2021.1 inteira) e cabeçalhos
  `QUESTÃO NN` embutidos. Primeira versão apagava o enunciado inteiro quando o rodapé caía
  no **início** do texto (2013.1-Q30 perdia 427 de 427 caracteres) — corrigido para remover
  a frase, não "dali até o fim", com rede de segurança contra resultado vazio.

### Ferramentas novas

`auditar_sem_par.js` · `corrigir_bloco.js` (número + gabarito + justificativa numa operação,
recusando gravar se o gabarito não bater com o banco) · `remover_bloco.js` (guarda cópia em
`dados/_removidos/`) · `limpar_rodapes.js`

**Estado ao fim:** 1721/1721 gabaritos · 664/664 blocos verificados · Hub 6,06 MB · 660
justificativas escritas (38,3%) · backup em `dados/_backup_rodapes_20260924/`

---

## 2026-09-24 (continuação) — Lote de escrita: 664 → 716 justificativas

**54 justificativas novas em 27 módulos**, todas verificadas contra o caderno oficial.

CIR-02 · CIR-03 · CIR-05 · CIR-19 · CIR-29 · CIR-57 · CIR-97 · CIR-111 · CAR-07 · END-04 ·
GAS-05 · GAS-09 · GAS-13 · GIN-11 · GIN-21 · GIN-32 · HEP-01 · INF-05 · INF-20 · INF-21 ·
INF-25 · INF-36 · INF-74 · OBS-01 · OBS-02 · OBS-03 · OBS-07 · OBS-30 · PED-01 · PED-03 ·
PED-06 · PED-23 · PED-36 · PED-89 · PED-119 · PNE-03 · PREV-39 · PSI-12 · REU-04

### Duas famílias de defeito de extração corrigidas

**1. Enunciado colado dentro da alternativa A — 108 questões.**
A quebra de coluna jogava o fim do comando (ou o caso inteiro) para dentro da alternativa A,
que ficava 2 a 10 vezes maior que as irmãs:

```
enunciado: ""
A: "febre amarela apresentou, no Brasil, dois picos epidêmicos ... em seu território,
    deve A notificar, semanalmente, todo caso que preencha os critérios de suspeita."
B: "orientar a antecipação da vacinação ..."     <- 90 caracteres
```

`separar_enunciado.js` corta no " A " solto — mas **só quando o texto que fica para trás termina
num comando de questão** ("assinale a opção...", "é correto afirmar que", "a conduta é",
"respectivamente", "?"). A primeira versão, sem esse filtro, cortava no meio da frase e produzia
alternativas como *"para Cadastramento das Famílias não fosse preenchida"* — **precisão vale mais
que recall aqui: uma questão não separada continua legível, uma questão partida no lugar errado
vira lixo silencioso.** Foram três rodadas de calibração (razão A/irmãs de 2,5 → 1,3; tamanho
mínimo da cabeça 150 → 20 quando o enunciado já está cheio).

**2. Rodapé de página colado no texto — 267 alternativas, 248 enunciados.**
`limpar_rodapes.js` remove "EXAME NACIONAL DE REVALIDAÇÃO...", "INEP1602 | 001-ProvaObjetiva..."
e o serial `ITEM nnnnn - V. nnnnnn` (prova 2021.1 inteira). A primeira versão apagava do rodapé
**até o fim do texto** — e quando o rodapé caía no *início*, levava a questão junto (2013.1-Q30
perdia 427 de 427 caracteres). Corrigido para remover a **frase**, com rede de segurança contra
resultado vazio.

**Reconstruções manuais a partir de `dados/raw_text_layout/`:** 2014.1-Q98 e 2024.1-Q14
(partograma e tabela de pré-natal), 2020.1-Q71, 2012.1-Q59, 2022.2-Q50, 2024.2-Q74.

### 11 questões estavam no módulo errado

Classificações herdadas da numeração antiga, cada uma lida antes de mover (armadilha #9):

| Questão | Estava em | Foi para | Conteúdo real |
|---|---|---|---|
| 2011.1-Q52, 2016.1-Q98, 2021.1-Q76 | CIR-12 (inexistente) | CIR-03 | infecção de sítio cirúrgico |
| 2016.1-Q40 | GIN-21 amenorreia | REU-04 | artrite reumatoide |
| 2025.1-Q46 | REU-03 LES | REU-04 | artrite reumatoide |
| 2012.1-Q7 | CIR-41 perfurativo | CIR-29 | pancreatite biliar |
| 2024.2-Q84 | GIN-02 rastreamento | GIN-11 | cisto de mama |
| 2012.1-Q2 | INF-36 ITU | PREV-11 | territorialização |
| 2023.1-Q50 | INF-36 ITU | PREV-43 | saúde indígena |
| 2024.1-Q3 | INF-36 ITU | PED-93 | nistagmo/teste do olhinho |
| 2016.1-Q97 | INF-02 parasitoses | GIN-20 | contracepção com TVP prévia |
| 2011.1-Q69 | PED-05 diarreia | OTO-01 | otite média aguda |
| 2020.1-Q27 | PED-06 obesidade | CIR-32 | remoção de anzol |
| 2023.1-Q100 | PED-119 Down | PREV-11 | determinantes sociais |

**O campo `assunto` do raw é fonte não confiável** — foi escrito sob a numeração antiga e
descreve, em muitos casos, uma questão diferente da que hoje ocupa aquele número. Use-o como
pista, nunca como verificação. Exemplo: 2024.2-Q23 (deficiência de G6PD) tinha `assunto` de
"fístula colo-cutânea pós-colectomia".

**Ferramentas novas:** `separar_enunciado.js` · `limpar_rodapes.js` (já registradas acima)

**Estado:** 1721/1721 gabaritos · 721/721 blocos verificados · Hub 6,41 MB · **716 justificativas
(41,6%)** · 96 lacunas restantes em 90 módulos, todas com texto usável

---

## 2026-09-24 — ⚠️ 2014.1 e 2020.1 usam GABARITO PRELIMINAR

**Descoberta que muda a confiança em 12% do banco.**

O INEP publica dois gabaritos por edição: o **preliminar**, logo após a prova, e o
**definitivo**, após a análise dos recursos. Entre um e outro, questões mudam de resposta e
outras são anuladas. Duas edições deste banco vieram do preliminar:

```
dados/raw_text/2014__Gabarito_2014.txt              -> "GABARITO PRELIMINAR"
dados/raw_text/2020__Gabarito_prova_objetiva_2020.txt -> "GABARITO PRELIMINAR"
```

**208 questões, 12,1% do banco. 72 já tinham justificativa escrita.**

### Como apareceu

Escrevendo o bloco de **2020.1-Q8**: o enunciado descreve uma **fístula perianal** de livro —
abscesso perianal drenado há 1 ano, orifício cutâneo a 2 cm da borda anal, **secreção de odor
fecaloide** à compressão, induração (o trajeto) ao toque. A alternativa C diz exatamente isso.
O gabarito diz **D: "fissura anal crônica"** — diagnóstico cujo sintoma definidor (dor anal
intensa à evacuação) o enunciado **sequer menciona**, e que não produz orifício cutâneo nem
drena secreção fecaloide.

É o padrão de questão **corrigida ou anulada em recurso**.

### Por que a verificação não pegava

`verificar_tudo.js` reportava **"1721/1721 gabaritos conferem"** — mas compara o banco contra
**esse mesmo arquivo preliminar**. É circular, exatamente como era o `renum3.js`, que comparava
a numeração contra um arquivo derivado da própria extração defeituosa. **Um verificador só vale
o que vale sua fonte de referência.**

### O que foi feito

- `marcar_gabarito_preliminar.js` marca as 208 questões com `gabarito_preliminar: true` no banco
  e no raw, e lista as 72 que já têm justificativa escrita
- `verificar_tudo.js` agora emite o aviso logo abaixo do "1721/1721", para que o número não seja
  lido como garantia
- O bloco de 2020.1-Q8 foi escrito **sinalizando a divergência** e ensinando a alternativa C
  (fístula perianal) como a correta, em vez de defender "fissura anal crônica"

### O que falta

**Obter os gabaritos DEFINITIVOS de 2014.1 e 2020.1** e reprocessar. Depois disso,
`auditar_modulos.js` apontará quais das 72 justificativas precisam ser reescritas. Enquanto isso
não acontece, as questões dessas duas edições devem ser tratadas como **não verificadas**.


---

## 2026-09-24 (lote 3) — 747 → 769 justificativas · 63 → 41 lacunas

**22 justificativas novas.** Módulos: CIR-04 (×2) · CIR-30 · GIN-11 · GIN-13 · GIN-14 · GIN-17 ·
GIN-20 · GIN-51 · HEM-01 · HEP-03 · INF-02 · INF-04 · INF-10 · INF-14 · INF-16 · INF-17 ·
INF-20 · INF-22 · INF-37 · INF-39 · INF-45 · INF-60 · INF-82 (×2) · NEF-02 · NEF-04

### Reconstruções manuais a partir de `dados/raw_text_layout/`

Cinco questões vieram do PDF original porque a extração as havia destruído:

| Questão | O que estava perdido |
|---|---|
| **2017.1-Q53** | enunciado de nefropatia diabética, truncado a cada linha por `⟪?⟫` |
| **2017.1-Q54** | mapas de febre amarela; texto misturado com a Q53 |
| **2014.1-Q26** | mononucleose, truncada a cada linha |
| **2023.1-Q100** | modelo de Dahlgren e Whitehead |
| **2015.1-Q98** | obesidade infantil, com uma questão de anemia colada ao fim |

Também corrigidas: letras espaçadas por justificação de texto em 2012.1-Q3
(`"m e n i n g i te v i ra l"` → `"meningite viral"`), letra intrusa em 2012.1-Q89, caudas de
rodapé em 2021.1-Q99 e 2022.2-Q40, e três enunciados colados dentro da alternativa A
(2011.1-Q68, 2012.1-Q34, 2013.1-Q58).

### Mais 6 questões no módulo errado

| Questão | Estava em | Foi para | Conteúdo real |
|---|---|---|---|
| 2025.1-Q52 | INF-03 dengue | CIR-04 | **coledocolitíase** |
| 2016.1-Q35 | INF-15 HIV gestação | CIR-04 | **coledocolitíase** |
| 2022.2-Q26 | INF-50 sífilis | GAS-12 | **retocolite ulcerativa** |
| 2024.2-Q15 | GIN-27 planejamento familiar | INF-82 | **tungíase** |
| 2020.1-Q8 | GIN-32 climatério | CIR-30 | **fístula perianal** |
| 2024.1-Q90 | GIN-01 rastreamento colo | GIN-17 | **sangramento uterino anormal** |

**Estado:** 1721/1721 gabaritos (⚠️ 208 sob gabarito preliminar) · 775/775 blocos verificados ·
Hub 6,79 MB · **769 justificativas (44,7%)** · 41 lacunas restantes


---

## 2026-09-24 (lote 4, registrado retroativamente) — 769 → 791 justificativas

Lote feito no fim do dia 24/09 e não registrado aqui na época. Os módulos editados
(PED-08, OBS-32, PED-34, PNE-04, PREV-13, PREV-03, PSI-05, PED-33, PED-25, PED-16, CIR-17 e
outros) foram gravados às 20:08–20:10, **depois** da última geração do Hub (20:05) — o Hub
ficou 4 questões atrás até o lote 5.

---

## 2026-09-29 (lote 5) — 791 → 809 justificativas · worklist zerado

**18 justificativas novas. O `worklist.js` agora mostra 0 lacunas.**

### As últimas 18 eram as mais difíceis por um motivo: 6 estavam no módulo errado

O `assunto` herdado da extração antiga descrevia outra questão. Lidas uma a uma e movidas:

| Questão | Estava em | Foi para | Conteúdo real |
|---|---|---|---|
| 2016.1-Q59 | OBS-34 insuficiência istmocervical | CIR-02 | **hérnia inguinal encarcerada** |
| 2025.1-Q10 | OBS-73 hipertensão crônica na gestação | PREV-21 | **gestação indesejada / aborto** |
| 2021.1-Q38 | PED-91 (arquivo PED-12, ITU) | PED-81 | **Kawasaki** |
| 2016.1-Q53 | PED-55 sífilis congênita | PREV-24 | **vacinação da gestante** |
| 2024.2-Q56 | PREV-39 tabagismo | CAR-07 | **emergência hipertensiva (rebote de clonidina)** |
| 2017.1-Q2 | PSI-12 depressão pós-parto | PSI-05 | **delirium pós-operatório** |

### Sete questões "excluídas do simulado" voltaram

PREV-30 (2015.1-Q28), PREV-32 (Q63), PREV-33 (Q81), PREV-42 (2024.2-Q10), PREV-44 (2024.2-Q30),
REU-01 (2011.1-Q102) e PED-81 (2021.1-Q38) tinham **notas dizendo que a questão fora excluída**
por texto truncado ou gabarito nulo. Isso era verdade na extração antiga; o banco reconstruído
tem o texto oficial íntegro. As notas (e os itens correspondentes em `itens_a_verificar`) foram
removidas e substituídas por blocos completos. O PED-81 tinha um **bloco-fantasma** com cabeçalho
`[Banco INEP ...]` (que o parser não reconhece) e texto "não recuperado".

- 2015.1-Q28: o banco ainda guarda o texto **cortado na borda da coluna** (`⟪?⟫`). O bloco usa o
  texto integral de `dados/raw_text/2015__Prova_objetiva_cinza_2015.txt`. O gráfico continua
  indisponível e o bloco diz isso.
- 2024.2-Q30 agora consta como **ANULADA** oficial (antes: gabarito "—").

**Estado:** 1721/1721 gabaritos (⚠️ 208 sob gabarito preliminar) · 816 blocos, 0 número errado,
0 gabarito errado · Hub 7,02 MB, 816 questões interativas · **809 justificativas (47,0%)**
· backup em `dados/_backup_lote5_20260929/`


---

## 2026-09-29 (fase de encaixe) — 822 questões órfãs classificadas pelo texto

O `worklist.js` zerado escondia **822 questões** sem justificativa (fora 2026.1): 560 atribuídas a
504 módulos **nunca gerados** e 262 sem módulo nenhum. Como o `assunto` antigo já tinha errado em
6 de 18 no lote 5, **nenhuma atribuição antiga foi aproveitada**: cada questão foi lida (trecho do
enunciado + alternativa correta; texto inteiro quando havia dúvida) e decidida à mão.

- Ferramentas novas: `sugerir_encaixe.js` (top-3 módulos por TF-IDF, modo `--curto`),
  `ver.js ID...` (questão inteira), `aplicar_encaixe.js [--aplicar]`
- Decisões registradas em **`dados/_encaixe_decisoes.txt`** (vale a última linha de cada ID)
- **613** foram para módulos existentes → hoje aparecem no `worklist.js`
- **209** foram para **49 módulos novos** (códigos com `+` no arquivo de decisões), todos com
  **≥ 2 questões** — a instrução do usuário foi não criar módulo para 1 questão só. Os dois
  casos isolados (obesidade adulto, notificação compulsória) foram para END-07 e PREV-15.
- 34 questões já escritas mas sem `modulo_destino` receberam o módulo onde estão escritas
- Sobram sem módulo apenas as **100 de 2026.1** (revisão de texto pendente)

### Dois defeitos de dados achados no caminho

1. **2025.2-Q3** guardava o texto do **questionário de percepção** ("Em relação ao tempo total de
   aplicação, você considera que a prova foi...") no lugar da questão real (TCE por queda de escada).
   O `reextrair.js` repete o erro, porque acha primeiro o "QUESTÃO 3" do questionário (armadilha 4).
   Texto restaurado de `raw_text/2025__Prova_objetiva_2025.2.txt` no raw e no `_banco_oficial.json`.
2. **2020.1-Q100** tinha o questionário colado na alternativa D e uma alternativa "E" espúria.
   Cortado e removida.
3. **2020.1-Q57 e Q58** estão **fundidas** (trauma torácico por arma de fogo + pescador com anzol,
   colunas misturadas, as duas com o mesmo texto). Encaixadas por tema (CIR-42 e PREV-11), mas
   **precisam ser reconstruídas pelo `layout.js` antes de escrever**.

Gabaritos de 2014.1 e 2020.1: o usuário confirmou que são os oficiais do site do INEP (o arquivo
diz "preliminar" no título). Avisos removidos de `verificar_tudo.js`, CIR-30 e PREV-34.

---

## 2026-09-29 (lote 6) — 809 → 897 justificativas

Primeiro lote depois do encaixe. **88 blocos** em CAR (01, 04, 07, 09, 10), END (01, 02, 05, 06, 07),
NEF (01, 02, 04, 05, 06), HEP (02, 03), HEM (01, 02, 05, 06, 07), REU (01, 02, 04), PNE (01–05),
NEU (01, 02, 05, 11). Especialidades clínicas com módulo existente: **concluídas**.

- **2025.2-Q91** — divergência registrada: gabarito **definitivo** D (VSR), conferido no PDF
  (caderno 01), contra quadro clássico de *Mycoplasma*. Bloco ensina os dois lados.
- Textos restaurados do `raw_text` ao escrever (colunas cortadas ou pergunta colada na alternativa A):
  2014.1-Q15/Q38/Q58/Q109, 2016.1-Q4/Q56, 2017.1-Q5/Q85, 2020.1-Q13/Q15/Q19/Q54, 2021.1-Q100,
  2023.2-Q81, 2024.1-Q86, 2024.2-Q66/Q76, 2012.1-Q91 (alternativa E estava colada na D).
- Ferramenta nova: `inserir_multi.js` — um arquivo com várias seções `@@CODIGO`.

---

## 2026-09-29 (lote 7) — 897 → 995 justificativas · auditoria do TEXTO das alternativas

**Novos blocos:** GAS (01, 04, 05, 07, 12, 17), DER-03/04, ORT-02, OTO-01, PSI-01/05/07 e
**Infectologia inteira** (58 blocos em 25 módulos).

### Achado grave: blocos antigos com alternativas que não eram as da prova

Um erro de cópia meu (2017.1-Q45 D) levou a criar `conferir_alternativas.js`, que compara o texto
de cada alternativa dos blocos com o banco. O `auditar_modulos.js` só conferia **número e letra**
do gabarito — nunca o texto sob a letra. Resultado em blocos de sessões anteriores:

| Tipo | Exemplos | O que foi feito |
|---|---|---|
| Alternativas **deslocadas de letra** | CIR-09 2011.1-Q31 | bloco reescrito |
| Alternativas **de outra questão** | NEU-05 2022.2-Q81 (tinha "clindamicina"), PREV-14 2011.1-Q57 | reescritos |
| **Questão inteira errada** sob o número | INF-24 "2012.1-Q105" era a **Q107** (CMV); GIN-01 "2023.2-Q32" era a **Q34** (LSIL) **com o gabarito da Q32 — ensinava a resposta errada** | Q107 e Q34 **adicionadas ao banco** (estavam ausentes); blocos renumerados/reescritos; Q105 (erisipela) e Q32 (abscesso pós-Hartmann) escritas nos módulos certos |
| Alternativas **parafraseadas** | CIR-03 2015.1-Q15, CIR-05 2011.1-Q92 | reescritos |
| **Placeholders** ("texto não recuperado", colchetes completando palavras) | ~30 blocos | alternativa corrigida pelo caderno (`corrigir_alternativa.js`) ou bloco reescrito |
| Banco com alternativas da questão vizinha, bloco certo | 2015.1-Q85, Q99 | **banco corrigido** |

Ferramentas novas: `conferir_alternativas.js`, `verificar_no_caderno.js`, `corrigir_alternativa.js`,
`substituir_multi.js` (remove o bloco antigo com backup e insere o novo). As ~20 divergências que
restam em `_auditoria_alternativas.txt` são banco danificado (alternativa A com o fim do enunciado
colado) ou grafia — o bloco está certo.

### Questões oficiais que faltam no banco (fora 2022.1)

Comparando `_gabaritos_oficiais.json` com o banco: **27 questões** ainda ausentes —
2011.1: 40, 43, 74, 105 · 2012.1: 28, 72, 79, 93 · 2013.1: 93, 106 · 2014.1: 22, 28 ·
2015.1: 17, 71, 84, 96, 109 · 2016.1: 61, 79 · 2021.1: 31 · 2023.2: 79 · 2024.1: 73, 91 ·
2024.2: 42, 46 · 2025.1: 7, 45. Como a Q107 e a Q34, algumas podem estar escritas em blocos sob
número errado. **Recuperar pelo `raw_text` e conferir com `conferir_alternativas.js`.**

**Estado:** 1723 questões · 1002 blocos, 0 número/gabarito errado · Hub 7,44 MB · **995 justificativas (57,7%)**

---

## Lote 8 — 2026-09-30 (995 → 1.093 justificativas) + limpeza de blocos antigos

**Preventiva, lotes 2–4 (74 blocos novos):** PREV-06/07/08 (redes, PNAB/APS, idoso), PREV-09/10/11/12
(níveis de prevenção, transplantes, territorialização, violência), PREV-14/15/17/21/22/25/26/28/29
(ética, indicadores, ESF, aborto legal, mortalidade materna, bioética, hemoterapia, transição, pesquisa).
Divergências registradas no bloco (gabarito oficial mantido): 2020.1-Q57 (oficial C; muitos esperariam D),
2024.2-Q28 (oficial C "febril não hemolítica"; dor em flancos + epistaxe obrigam a excluir hemólise).
Anuladas sem motivo inventado: 2022.2-Q85, 2017.1-Q69.

**Banco:**
- 2020.1-Q57/Q58 estavam fundidas → separadas pelo layout: Q57 = pescador/territorialização (PREV-11, gab C),
  Q58 = FAF no tórax (CIR-42, gab A). Blocos escritos para as duas.
- **2015.1: correção do lote 7.** O lote 7 disse "banco com alternativas da vizinha, bloco certo" para
  Q85/Q99 — estava errado: eram os **blocos** com número errado. Real: enterorragia = **Q84 (gab C)**, não Q86;
  menino com dificuldade escolar = **Q86**; parto (período expulsivo) = **Q96**, não Q99.
  O bloco GAS-13 "Q86" **ensinava o gabarito B (transfundir)**; reescrito como Q84, gab C (não transfundir).
  PSI-07 Q85→Q86 e OBS-19 Q99→Q96 renumerados. Q84 e Q96 entraram no banco (faltavam). Faltam de 2015.1: 17, 71, 109.
- `sincronizar_banco.js` levou ao banco o texto conferido de 34 blocos (capitular "A partir…" lida como
  alternativa A, enunciados truncados de 2014.1, rodapés).
- Rodapé "EXAME NACIONAL DE REVALIDAÇÃO DE DIPLOMAS MÉDICOS" colado no fim de alternativas: 39 linhas em
  módulos e 23 no banco limpas.

**Blocos antigos refeitos pelo caderno (regra: nunca texto reconstruído):** 14 blocos tinham enunciado
cortado, "[Paciente]", "[...]" ou alternativas "completadas por continuidade lógica" — todos trocados pelo texto
integral do caderno (`caderno.js` + `refazer_questao.js`): CAR-01 2013.1-Q24, CAR-08 2013.1-Q42, CIR-42 2017.1-Q52,
CIR-52 2014.1-Q94, END-01 2015.1-Q18, HEP-01 2015.1-Q76, INF-05 2015.1-Q83, INF-11 2015.1-Q38 (enunciado estava
resumido), INF-25 2014.1-Q97, OBS-04 2014.1-Q93, OBS-32 2016.1-Q6, OBS-34 2016.1-Q58, PED-54 2014.1-Q36,
PED-93 2020.1-Q85, PNE-01 2014.1-Q23/Q92; PED-08 2015.1-Q99 tinha "é visitada a pedido" (inventado) → texto real.
PED-05: bloco 2011.1-Q71 duplicado removido; 5 parágrafos "Banco INEP…" obsoletos (numeração antiga) removidos
de PED-05, INF-04 e CIR-97.

**Ferramentas novas:** `sincronizar_banco.js`, `caderno.js` (texto corrido do caderno, sem corte de coluna),
`substituir_enunciado.js`, `refazer_questao.js`.

**Estado:** 1.725 questões · 1.097 blocos, 0 número/gabarito errado · 5 divergências de texto (grafia/banco)
· Hub 7,65 MB · **1.093 justificativas (63,4%)**

### Lote 8b — 2026-09-30 (1.093 → 1.138) · Preventiva 100% coberta

- PREV lotes 5–7 (45 blocos): mortalidade infantil, pacto federativo, rastreamento (próstata/colorretal),
  imunizações, população de rua/LGBT, tabagismo, princípios do SUS, saúde indígena/ribeirinha/cigana,
  controle social, declaração de óbito, testes diagnósticos. Divergência registrada: 2023.1-Q92 (oficial D
  "risco moderado" para pólipo hiperplásico pequeno; literatura → risco médio).
- **PREV-40 (declaração de óbito) e PREV-41 (testes diagnósticos) não foram criados**: as 6 questões foram
  encaixadas em PREV-01 e PREV-13, que já cobrem os temas (regra do usuário: evitar módulo novo se já existe).
- **Módulo novo PREV-61 — Cuidados paliativos** (6 questões, 30 flashcards) — primeiro dos módulos "+".
- Blocos antigos: 2024.1-Q30 (PREV-39) sem a alternativa D → reescrito; 2016.1-Q7 (CIR-57, marca-passo) escrito;
  9 pseudo-blocos "[Banco INEP …]" com numeração antiga removidos (cópia em `dados/_removidos/`) — 8 já tinham
  bloco real em outro lugar; 2021.1-Q11 (osteossarcoma, anulada) segue pendente em ORT-05.
- Pendências obsoletas removidas dos metadados de INF-82 e INF-83.

**Estado:** 1.725 questões · 1.148 blocos · 0 número/gabarito errado · Hub 7,76 MB · **1.138 justificativas (66,0%)**.
Faltam ~490 (fora 2026.1): PED 121, CIR 130, GIN 95, OBS 65 (parte em módulos existentes) e ~200 em módulos novos
("+" em `_encaixe_decisoes.txt`: PSI 34, ORT 23, GAS 21, PNE 14, OFT 11, INF 11, CAR 10…).

---

## Lote 9 — 2026-09-30 (1.138 → 1.238 justificativas) · Pediatria (módulos existentes) 100% · banco completo

- **Pediatria:** 88 blocos nos módulos PED existentes (lotes PED1, PED2a, PED2b) → 0 lacunas em módulos PED que
  já têm .md. 2017.1-Q35 (telarca precoce, anulada) movida de PED-30 para END-02 (puberdade).
  Divergências/nuances registradas: 2023.2-Q68 (oficial **C**: Conselho Tutelar + vacinar; na prática APS
  dialoga antes — eu tinha escrito B, a auditoria pegou e o bloco foi corrigido), 2017.1-Q80 (ranitidina,
  retirada do mercado), 2020.1-Q40 (AIDPI antiga: tiragem = pneumonia grave).
- **Incidente e reparo (ver RETOMADA, armadilha 16):** o lote PED1 foi inserido 2×; uma desduplicação
  improvisada repetiu seções inteiras em 14 módulos e apagou 12 blocos. Tudo restaurado a partir dos
  `_conteudo_*.json` do último hub; `inserir.js` agora recusa cabeçalho repetido; nova ferramenta `integridade.js`
  (também em verificar_tudo); 46 módulos tinham separador `---` duplicado (corrigido).
- **Banco completo:** as 25 questões oficiais que faltavam (fora 2022.1) foram recuperadas.
  12 já tinham bloco escrito (o texto foi validado com a nova `fidelidade_bloco.js` — 5-gramas literais do caderno);
  15 foram extraídas do caderno (`caderno.js`/`layout.js`/grep em raw_text) e 13 ganharam bloco
  (2012.1-Q72 → +NEU-19 e 2016.1-Q79 → +CAR-13 aguardam a criação desses módulos).
  Nota: `_compacto_2011_61-110.txt` dizia gab D para 2011.1-Q105 — o oficial é **B** (vale o PDF oficial).
- Ferramentas novas: `lacunas.js`, `integridade.js`, `adicionar_questao.js`, `fidelidade_bloco.js`.

**Estado:** banco **1.750** (16 edições completas = 1.650 + 100 de 2026.1) · 1.242 blocos · 0 número/gabarito errado ·
Hub 7,95 MB · **1.238 justificativas (70,7%)**. Faltam: CIR/GIN/OBS em módulos existentes e ~215 questões dos
módulos novos ("+" em `_encaixe_decisoes.txt`); 2022.1 (100) e revisão de 2026.1 (100).

### Lote 10 — 2026-09-30 (1.238 → 1.324) · Cirurgia (módulos existentes) 100%

- 86 blocos de Cirurgia (CIR-03 a CIR-128) + 2016.1-Q31 movida de CIR-13 para CAR-05 (nefropatia diabética).
- Divergências/nuances registradas: 2020.1-Q33 (laparotomia em fecaloma com ceco 11 cm), 2014.1-Q82 × 2020.1-Q37
  (técnicas diferentes de onicocriptose aceitas em anos diferentes), 2024.2-Q31 (TC com contraste × PET/biópsia).
- **Erro meu pego pela auditoria:** 2020.1-Q48 (oficial C — angioembolização; eu tinha escrito B). Corrigido.
  Desde então `inserir.js` **recusa** bloco cujo gabarito difira de `_gabaritos_oficiais.json` (antes de inserir).

### Lote 11 — 2026-09-30 (1.324 → 1.392) · Ginecologia (módulos existentes) 100%

- 68 blocos de Ginecologia em 2 sub-lotes (GIN1: 30 blocos em GIN-01…15; GIN2: 38 blocos em GIN-16…70).
- Divergência registrada: **2016.1-Q39** (oficial A — síndrome de Morris; mas o caso não tem mamas, e Morris
  tem mamas desenvolvidas). Nuances: 2014.1-Q39 (amenorreia primária no limite dos 15 anos), 2014.1-Q37 e
  2017.1-Q81 (Lei 14.443/2022 mudou a esterilização), 2023.2-Q44 (TEV prévio × TH transdérmica).
- Enunciados corrigidos e sincronizados no banco: "A" inicial restaurado em 2022.2-Q14/Q90, 2023.2-Q15, 2024.1-Q59;
  rodapé removido de 2014.1-Q49; tabela de 2023.2-Q44 com rótulos C-HDL/C-LDL do caderno.
- `inserir_multi.js` reescrito: pula seção já inserida e continua após falha (lista FALHAS no fim);
  guarda de gabarito de `inserir.js` corrigida para `(ANULADA|[A-E])`.
- Fidelidade (`fidelidade_bloco.js`): 35/38 em 100%; os 3 restantes só diferem por quebra de coluna do layout.

**Estado:** 1.396 blocos · 0 número/gabarito errado · integridade 0 problemas · ~1.392 justificativas (79,5%).
Faltam: OBS (51 em módulos existentes), END-02 (1), módulos novos (~215), 2026.1 (revisão), 2022.1.

### Lote 12 — 2026-09-30 (1.392 → 1.444) · Obstetrícia + END-02 → **todos os módulos existentes 100%**

- 52 blocos (OBS1: 23 em OBS-01…13 + END-02; OBS2: 29 em OBS-16…73). `lacunas.js "" --existentes` → **TOTAL 0**.
- Divergência registrada: **2022.2-Q79** (oficial D — clindamicina; mas cesárea eletiva sem trabalho de parto e bolsa
  íntegra dispensa profilaxia para EGB pelo CDC/ACOG). Nuances: 2017.1-Q71 (HELLP não obriga cesárea),
  2025.1-Q19 (O₂ materno de rotina questionável).
- Enunciados reconstituídos do caderno (o "A" inicial tinha virado alternativa A): 2021.1-Q44/Q45/Q80, 2023.1-Q39;
  2024.1-Q69 e 2017.1-Q11 (texto truncado), 2020.1-Q1 (alt C), 2024.1-Q29 (alt A: faltava "iniciada"),
  2025.1-Q44 ("A negativo"), 2023.2-Q69 (ruído "cardíaca"); sincronizados no banco (17 questões).
- **Normalização geral** (backup em `_backup_lote5_20260929/modulos_pre_normalizacao_20260930/`): 335 blocos não
  tinham `---` antes do bloco seguinte (o conferir_alternativas misturava blocos — caso CIR-25/2013.1-Q107);
  253 módulos tinham a nota obsoleta "gerado a partir de 1 edição" → trocada pela nota de cobertura completa.
  3 blocos anulados no formato antigo (CIR-25, OBS-08, PREV-05) passaram ao formato padrão.
- Hub reconstruído: **1.448 questões interativas**, 0 divergência; justificativas **1.444 (82,5%)**.

**Falta:** 289 questões destinadas a módulos novos ("+" em `_encaixe_decisoes.txt`) — muitos com 1–2 questões,
que pela regra do usuário devem ir para módulos existentes afins; 2026.1 (revisão, 100); 2022.1 (100).

### Lote 13 — 2026-10-01 (1.444 → 1.650) · **banco das 16 edições 100% justificado** + 43 módulos novos

- `lacunas.js "" --novos` listava 289: **83** já tinham bloco em outro módulo (só `modulo_destino` corrigido);
  **16** reatribuídas a módulos existentes afins (ORT-02 ×9 com complemento de teoria sobre sinais de alerta/cauda
  equina/lombalgia inflamatória; NEF-06 ×2; PNE-02 ×2; PREV-04 ×2) — ver `dados/_plano_modulos_novos.md`.
- **43 módulos novos** (seções 0–5 completas + flashcards + JSON): CAR-11, 13, 22; CIR-72, 108, 115, 123, 134;
  DER-06, 07; END-17, 20; GAS-20, 24, 38; GIN-59; HEM-09, 17, 18; NEF-09, 13; NEU-19; OFT-08; ORT-05, 06, 18; OTO-03;
  PED-60, 97, 100, 101, 108, 112; PNE-08, 17, 23; PSI-09, 11, 20, 25, 30, 32; REU-05 — **190 blocos**.
- Divergência registrada: **2022.2-Q79** (OBS, no lote 12). Nuances: 2024.2-Q6 (radiculopatia × "neuropatia"),
  2017.1-Q22 (Garden II), 2025.2-Q76 (cintilografia × RM), 2024.1-Q46 (abscesso refratário — drenagem antes da cirurgia),
  2017.1-Q26 (ISRS na gestação), 2024.1-Q18 (meta de SpO₂ no RN).
- ⚠️ O campo `assunto` do mapa_mestre às vezes descreve a questão VIZINHA (2022.2-Q61, 2022.2-Q96, 2023.2-Q63) —
  decidir o encaixe sempre pelo texto.
- Enunciados reconstituídos do caderno e sincronizados no banco (36 questões; backup `banco_pre_sync_lote13.json`).
- Ferramenta nova: `sync_meta_nq.js` (acerta `n_questoes` do JSON de metadados — corrigiu também 96 módulos antigos).
- Hub: **370 módulos · 1.654 questões interativas · 0 divergência · 9,08 MB**.

**Estado:** 1.650/1.650 questões das 16 edições com justificativa (**94,3% do banco de 1.750**).
**Falta:** 2026.1 (100 questões — revisar texto contra o PDF e classificar) e 2022.1 (100 — decifrar o PDF).

### Lote 14 — 2026-10-01 (1.650 → 1.750) · **2022.1 decifrada, conferida no PDF e 100% justificada**

- **Texto:** `decifrar.js 2022.1` (mapa de maiúsculas MAI22, incluindo J=`:` e Z=U+007F; símbolos `<` `>` `≤` `≥`
  conferidos no PDF) → `limpar_2022.js` → `reconstruir_manual_2022.js` → `recortar_2022.js` →
  `aplicar_correcoes_2022.js`. **O PDF lido visualmente (Read com `pages`) é a fonte-ouro**: 39 questões
  transcritas/corrigidas página a página em `dados/_correcoes_2022.1_pdf.json` (inclui contaminações entre
  questões vizinhas: Q24, Q38, Q52, Q19; palavra intrusa em Q58; figura de Q99 descrita).
- Checagens novas: `palavras_intrusas_2022.js` (trigramas ausentes do texto corrido) e verificação de 6-gramas
  compartilhados entre questões. Resultado final: zero achado.
- **Classificação manual** das 100 (`dados/_classificacao_2022.1.json` → `classificar_2022.js`), todas em módulos
  **existentes** (nenhum módulo novo). `assunto` gravado só com o tema, sem a conclusão.
- **Banco:** `banco_de_raw.js 2022.1 --aplicar` preenche `_banco_oficial.json['2022.1']` a partir do raw revisado
  (backup `_banco_oficial_pre_2022.1.json`). Gabarito sempre de `_gabaritos_oficiais.json` (10 anuladas).
- **Blocos:** `montar_blocos.js` monta o arquivo `@@COD` a partir do texto do raw + gabarito oficial + explicações
  escritas em `dados/_explicacoes_2022.1/E22_*.txt` (seções `##N`) — não se redigita enunciado. 100 blocos em 5 lotes.
  Divergência/nuance registrada: Q53 (gabarito descreve o fluxo do RN ≥ 34 sem; diretriz SBP < 34 sem = saco plástico).
- Backups: `raw_2022.1_pre_pdf.json`, `raw_2022.1_pre_classif.json`, `modulos_pre_2022.1/`.
- verificar_tudo: gabaritos **1.850/1.850**, blocos **1.754** (0 número/gabarito errado), integridade 0,
  Hub **370 módulos · 1.754 questões interativas · 9,30 MB**.

**Estado:** **1.750/1.850 (94,6%)** — as 17 edições extraídas têm 100% de justificativa.
**Falta:** só **2026.1** (100 questões — revisar texto contra o PDF como foi feito em 2022.1, classificar, blocos).

### Lote 15 — 2026-10-01 (1.750 → 1.850) · **2026.1 re-decifrada, conferida no PDF e justificada — BANCO 100%**

- **Texto:** a decifragem antiga aplicava a tabela de maiúsculas também aos trechos em texto claro ("Mulher" →
  "MulUer"). Novo `decifrar_2026.js` decifra **por palavra** (só palavras com U+0003 ou glifo cifrado), com o mapa
  de 2022.1 (mesma fonte) + símbolos/ligaduras extras (₂ ³ ² • * ° µ ª tf ft fl tí fi). Fora do vocabulário: 3,1%,
  quase tudo palavra legítima.
- **Conferência visual das 100 questões no PDF** (páginas 3–26). Correções em `dados/_correcoes_2026.1_pdf.json`
  aplicadas por `aplicar_correcoes_2026.js`: 11 substituições globais (itálicos: mellitus, Escherichia…; códigos
  ASCII: INR, TGO/TGP, GGT, LDH), trocas pontuais por questão, **tabelas em Markdown** (Q4, 15, 17, 20, 21, 29, 40, 66,
  72, 73, 91, 96), **figuras descritas** (Q5 larva migrans, Q11 partograma, Q27 canal endêmico, Q68 mamografia),
  contaminação Q18↔Q20 ("Mama"), Q95 truncada completada, hífens de quebra de linha. Pipeline reproduz o estado
  exato a partir do cifrado.
- Classificação manual (`_classificacao_2026.1.json`), todas em módulos existentes; banco via `banco_de_raw.js`;
  `lacunas.js` passou a incluir 2026.1.
- **100 blocos** (`dados/_explicacoes_2026.1/E26_1..5.txt` → `montar_blocos.js`). Nuances registradas nos blocos:
  Q73 (dor em membros + plaquetopenia: gabarito PTI, mas dor óssea é alerta de leucemia), Q98 (Doppler antes de
  anticoagular no pós-operatório), Q44 (amamentação contraindicada pelo MS), Q22 (PCDT HAS 2025 — medicamento já no
  estágio 1).
- Backups: `raw_2026.1_pre_redecifra.json`, `raw_2026.1_pos_pdf_parcial.json`, `raw_2026.1_pre_classif.json`,
  `modulos_pre_2026.1/`.
- verificar_tudo: gabaritos **1.850/1.850**, blocos **1.854** (0 número/gabarito errado), integridade 0,
  Hub **370 módulos · 1.854 questões interativas · 9,51 MB**, cobertura **1.850/1.850 (100%)**.

**Estado: banco completo — as 18 edições (2011.1 a 2026.1) têm 100% das questões justificadas.**

### Lote 16 — 2026-10-01 · Hub: busca (Ctrl+K) e seletor de módulos organizados por área

- `dados/_ferramentas/patch_busca_areas.js` (idempotente; aceita caminho do hub como argumento): busca com chips por
  área (CAR, CIR, GIN, PED, INF… com contagem), chips por tipo (módulos/questões/notas), resultados agrupados por área
  com cabeçalho "GIN · Ginecologia", busca sem acento e com várias palavras, sigla como filtro ("gin sifilis"),
  setas + Enter, questão abre direto no banco filtrada pelo id. Seletor de módulos com `<optgroup>` por área em ordem
  numérica, só módulos com conteúdo (370). Aba Módulo abre no primeiro módulo com conteúdo. Ajustes de celular.
- `modulos.json` ganhou a entrada CIR-23 (tinha conteúdo mas não estava no catálogo).
- Testado em Chrome sem interface (cenários + capturas desktop e 390 px). Publicado: versão 22 do artifact.
