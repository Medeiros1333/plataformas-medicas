# Plano — questões destinadas a módulos novos (2026-09-30, lote 13+)

Ponto de partida: `lacunas.js "" --novos` listava 289 questões.
1. **83** já tinham bloco escrito em módulo existente → `modulo_destino` corrigido com `reatribuir.js` (backup do raw em
   `dados/_backup_lote5_20260929/raw_pre_reatrib_20260930/`).
2. **18** foram reatribuídas a módulos existentes afins (regra do usuário: não criar módulo para 1–2 questões se
   houver módulo afim): PNE-18→PREV-04 (asbesto), PNE-19→PNE-02 (abscesso), ORT-14 e REU-06→ORT-02 (lombalgia com
   sinais de alerta / inflamatória), END-19→NEF-06 (estatina/rabdomiólise). (2023.2-Q63 é TTRN, fica em PED-112.)
   (2022.2-Q61 é bulimia → PSI-30; 2022.2-Q96 é fibromialgia → REU-05: o campo `assunto` do mapa estava trocado com o da vizinha — decidir SEMPRE pelo texto.)
3. O restante (~188) vai para **módulos novos**, criados com o modelo de PREV-61 (seções 0–5 + JSON; seção 3 vazia,
   preenchida com `inserir_multi.js` para passar pela guarda do gabarito oficial).

Módulos novos (código — título adotado):
CAR-11 Valvopatias · CAR-13 Endocardite infecciosa · CAR-22 Arritmias (taqui e bradiarritmias) ·
CIR-72 Doenças da próstata (HPB e câncer) · CIR-108 Cirurgia bariátrica · CIR-115 Trauma urogenital ·
CIR-123 Atendimento inicial ao politraumatizado (ATLS/APH) · CIR-134 Escroto agudo (torção testicular) ·
DER-06 Melanoma · DER-07 Farmacodermias · END-17 Hipertireoidismo/Graves · END-20 Distúrbios do cálcio/paratireoide ·
GAS-20 Icterícia obstrutiva e câncer de pâncreas · GAS-24 Doenças do esôfago · GAS-38 Pancreatite crônica ·
GIN-59 Miomatose uterina · HEM-09 Anemia ferropriva · HEM-17 Púrpura trombocitopênica imune ·
HEM-18 Mieloma múltiplo e neoplasias hematológicas do idoso · NEF-09 Nefrolitíase · NEF-13 Doença renal crônica e diálise ·
NEU-19 Cefaleias primárias · OFT-08 Urgências e afecções oculares · ORT-05 Ortopedia pediátrica e tumores ósseos ·
ORT-06 Fraturas e lesões do membro superior/quadril · ORT-18 Trauma raquimedular · OTO-03 Urgências otorrino (epistaxe, corpos estranhos, cerume) ·
PED-60 Tumores abdominais da infância · PED-97 Alimentação no 1º ano e desnutrição · PED-100 Dermatoses do RN e lactente ·
PED-101 Malformações e afecções cirúrgicas congênitas · PED-108 Infecções neonatais graves · PED-112 Desconforto respiratório do RN ·
PNE-08 Câncer de pulmão · PNE-17 Traqueostomia em UTI · PNE-23 Derrame pleural ·
PSI-09 Psicofarmacologia (efeitos adversos/situações especiais) · PSI-11 Emergências psiquiátricas e RAPS ·
PSI-20 Ansiedade e pânico · PSI-25 TDAH e comportamento disruptivo · PSI-30 Transtornos alimentares ·
PSI-32 Álcool e outras substâncias · REU-05 Fibromialgia

Progresso: marcar aqui cada módulo criado (✓) e rodar integridade/auditoria a cada lote.

## Andamento
- ✓ Reatribuições + 15 blocos em módulos existentes (NEF-06, ORT-02, PNE-02, PREV-04) com complementos de teoria.
- ✓ CAR-11, CAR-13, CAR-22 (11) · ✓ CIR-72, CIR-108, CIR-115, CIR-123, CIR-134 (24) · ✓ DER-06, DER-07, END-17, END-20 (13) · ✓ GAS-20, GAS-24, GAS-38 (18) · ✓ GIN-59, HEM-09, HEM-17, HEM-18, NEF-09, NEF-13 (16) · ✓ NEU-19, OFT-08, OTO-03 (23) · ✓ ORT-05, ORT-06, ORT-18 (15). Faltam: PED-60, 97, 100, 101, 108, 112; PNE-08, 17, 23; PSI-09, 11, 20, 25, 30, 32; REU-05 (71 questões).
- Ferramenta nova: `sync_meta_nq.js [PREFIXO]` (acerta "n_questoes" do JSON de metadados pelo nº real de blocos).
- Fluxo por módulo novo: escrever o .md com seção 3 vazia ("## 3. …\n\n---\n\n## 4. FLASHCARDS") e cabeçalho com
  "**Nº de questões históricas do INEP sobre o assunto:** 0 ·" → blocos em arquivo @@COD → `inserir_multi.js` →
  `sync_meta_nq.js` → `integridade.js` → `fidelidade_bloco.js`.
- ⚠️ O campo `assunto` do mapa_mestre às vezes descreve a questão VIZINHA — decidir encaixe sempre pelo texto.
