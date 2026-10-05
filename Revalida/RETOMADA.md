# RETOMADA — como continuar o banco de questões do Revalida

> **Leia este arquivo primeiro ao retomar o projeto.** Ele é autossuficiente: quem o ler
> consegue continuar sem depender do histórico de nenhuma conversa.
> Complementos: `PROGRESSO.md` (histórico de lotes) e `PROCESSO_E_APRENDIZADO.md` (metodologia).
>
> Última atualização: **2026-10-01** (lote 15 — **banco completo: 1.850/1.850 questões das 18 edições justificadas**)

---

## 1. Onde o trabalho está agora

Rode isto para ver o estado real a qualquer momento:

```bash
cd "c:/Users/gusta/OneDrive/Documentos/AI Agent/Revalida"
node dados/_ferramentas/verificar_tudo.js
```

Resultado esperado hoje:

| Indicador | Valor |
|---|---|
| Questões no banco | **1.850** (18 edições: 2011.1–2026.1) |
| Gabaritos conferidos contra o PDF oficial | **1.850 / 1.850 — zero divergência** |
| Blocos de questão escritos nos módulos | **1.854** |
| Blocos com número e gabarito conferidos | **1.854 · zero erro** — e texto das alternativas conferido por `conferir_alternativas.js` |
| Módulos `.md` | **370** |
| Hub (`hub/revalida_hub.html`) | 9,51 MB · JS válido · filtros e simulado ativos · **1.854 questões interativas, zero divergência** |
| Cobertura de justificativas | **1.850 de 1.850 (100%)** — todas as 18 edições |
| `lacunas.js "" --existentes --resumo` | **TOTAL 0** (inclui 2026.1) |
| Hub publicado (artifact) | https://claude.ai/artifact/Re3foFTyfVubDLWM3H4meE — versão 22 (2026-10-01, 1.854 questões, busca por área). Para atualizar: publicar `hub/revalida_hub.html` com esse `url` (capability `downloads` é mantida) |

---

## 2. A mudança estrutural de 2026-09-24 — leia antes de tudo

O banco foi **reconstruído a partir do caderno oficial**. Antes disso, ele vinha de uma
extração que lia as duas colunas da prova como se fossem uma só. Isso produzia três erros
encadeados, e o terceiro era grave:

1. o texto de uma questão se misturava com o da vizinha;
2. questões sem alternativas recuperáveis eram descartadas, e a numeração seguia por
   **posição**, não pelo número impresso;
3. como o gabarito é aplicado **pelo número**, questões deslocadas recebiam a **resposta de
   outra questão**.

A auditoria encontrou **140 questões guardadas sob o número errado** e, por consequência,
**123 gabaritos trocados**. Entre eles havia erros clinicamente perigosos — um AVC isquêmico
dentro da janela cuja "resposta certa" era anticoagulação plena em vez de trombólise; uma
dengue com sinais de alarme classificada como Grupo B, com hidratação oral.

### Por que o erro passou despercebido antes

A verificação anterior (`renum3.js`) comparava o banco com o arquivo
`*_Prova_LAYOUT_reordenado.txt` — **derivado da mesma extração defeituosa**. Era uma
verificação circular: confirmava o banco contra ele mesmo. A verificação atual compara com
`dados/raw_text_layout/`, que preserva as colunas e é fonte independente.

**Lição que vale para o futuro: uma verificação só tem valor se a fonte de comparação for
independente daquilo que se quer verificar.**

### O que a reconstrução trouxe de novo

- **2026.1 entrou no banco** (100 questões) — a edição era considerada perdida;
- enunciados e alternativas passaram a vir do caderno oficial, não da extração misturada;
- **278 blocos já escritos tiveram o texto trocado pelo texto limpo**, com as antigas notas
  de "ruído de extração" removidas;
- **19 justificativas foram reescritas** porque defendiam a resposta errada.

---

## 3. Invariantes — nunca violar

1. **Nunca inventar texto de questão.** Se um trecho não foi recuperado, marque a falta.
   O extrator usa `⟪?⟫` exatamente para isso.
2. **Gabarito vem do PDF oficial**, via `dados/_gabaritos_oficiais.json`. Nunca do campo
   `assunto`, nunca de raciocínio clínico.
3. **O campo `assunto` é texto gerado pelo próprio projeto**, não pelo INEP. Já levou dois
   módulos a rejeitarem o gabarito correto. Não é fonte de nada.
4. **Discordância clínica se registra, não se corrige.** Se o gabarito oficial contraria a
   literatura, explique os dois lados — mas o gabarito é o do INEP. (Atenção: **a maioria das
   "divergências" registradas antes era erro de numeração, não da banca.** Antes de declarar
   divergência, confira o número contra o caderno oficial.)
5. **Hierarquia de fontes clínicas:** MS/PCDT > sociedades brasileiras > gabarito INEP >
   diretrizes internacionais.
6. **Questão anulada não ganha resposta inventada.** Marque `ANULADA` e explique por quê.
7. **Toda alteração em lote precisa de backup antes e verificação depois.**
   `dados/_backup_numeracao_20260923/` guarda o estado anterior à reconstrução.

---

## 4. Fluxo para escrever um módulo

```bash
# 1. Ver o que falta
node dados/_ferramentas/worklist.js | head -25

# 2. Puxar o texto oficial das questões que faltam
node dados/_ferramentas/dump.js INF-26

# 3. Ver uma questão específica direto do caderno oficial
node dados/_ferramentas/reextrair.js 2024.1 45
node dados/_ferramentas/layout.js  2024.1 45      # com as colunas lado a lado

# 4. Procurar uma questão pelo texto, quando não se sabe o número
node dados/_ferramentas/buscar_oficial.js "abaixamento de colon"

# 5. Escrever os blocos num .txt e inserir na seção 3
node dados/_ferramentas/inserir.js modulos/INF-26_sifilis.md blocos.txt

# 6. Conferir número e gabarito de TUDO que foi escrito
node dados/_ferramentas/auditar_modulos.js

# 7. Propagar para o Hub
node dados/_ferramentas/reconstruir_hub.js
node dados/_scripts/gerar_qmeta.js
node dados/_ferramentas/patch_hub.js

# 8. Verificação final
node dados/_ferramentas/verificar_tudo.js
```

### Anatomia de um bloco (o parser do Hub depende deste formato)

```markdown
**[INEP 2024 · Edição 1 · Questão 45]**

<enunciado oficial, sem alterações>

A) <texto>
B) <texto>
C) <texto>
D) <texto>

**Gabarito oficial: D**

**Por que D está correta:** ...

**Por que as demais estão erradas:**
- A) ...
- B) ...
- C) ...

⚠️ **PEGADINHA DO INEP:** ...

**O que a banca estava testando:** ...
```

Para questão anulada, a linha do gabarito é:

```markdown
**Gabarito oficial: ANULADA** — o INEP anulou esta questão; não há resposta oficial.
```

### Padrão de qualidade da justificativa

- Explica **por que** a certa está certa, não só que está;
- Ataca **cada** alternativa errada pelo motivo específico dela;
- Nomeia a armadilha que a banca armou;
- Traz o critério, a classificação ou a tabela que resolve o tema inteiro, não só aquela questão;
- Escreve para quem vai fazer a prova — direto, sem hedge desnecessário.

---

## 5. Ferramentas (`dados/_ferramentas/`)

### Extração e conferência do caderno oficial

| Script | O que faz |
|---|---|
| `layout.js ED NUM` | mostra a questão com as duas colunas separadas |
| `reextrair.js ED NUM [--aplicar]` | reconstrói enunciado e alternativas do caderno oficial |
| `reextrair_lote.js` | roda o reextrator sobre tudo que está incompleto |
| `construir_banco_oficial.js` | monta `dados/_banco_oficial.json` — a fonte da verdade |
| `limpar_contaminacao.js` | corta o resto da questão seguinte colado no fim da anterior |
| `limpar_ruido.js` | remove rodapé institucional grudado nas alternativas |
| `buscar_oficial.js "texto"` | acha em que edição/questão um texto está |
| `caderno.js ED NUM [--enunciado]` | texto **corrido** da questão (raw_text sem colunas) — use quando o `layout.js` corta o fim das linhas (2014.1, 2013.1) |
| `validar_reextracao.js` | testa o extrator contra questões já íntegras |

### Banco

| Script | O que faz |
|---|---|
| `reconstruir_banco.js [--aplicar]` | refaz `raw/*.json` a partir do banco oficial |
| `reconstruir_mapa.js` | regera `mapa_mestre.json` e ressincroniza `modulos.json` |
| `auditar_conteudo.js` | confere se cada questão está sob o número certo |
| `cmp.js` | banco × gabarito oficial (tem de dar DIVERGE 0) |
| `classificar_pendentes.js` | atribui especialidade (e módulo, quando inequívoco) |
| `marcar_texto_corrompido.js` | marca questões com fonte cifrada |
| `decifrar.js [--aplicar]` | quebra a cifra da fonte simbólica (ver §7) |
| `auditar_classificacao.js` | acha questões atribuídas ao módulo errado (compara o **texto** com as questões dos demais módulos) |
| `reatribuir.js ID MODULO [TEMA]` | move uma questão para outro módulo |
| `integridade.js` | estrutura de todos os .md (seções 0–5 uma vez, metadados JSON válidos, sem cabeçalho repetido, sem bloco que sumiu desde o último hub). **Rodar ANTES de reconstruir_hub** (depois do rebuild o backup _conteudo é sobrescrito) |
| `lacunas.js PREFIXO [--existentes|--novos] [--resumo]` | lista questões sem bloco, com texto e gabarito oficial, agrupadas por módulo — a worklist para escrever |
| `sincronizar_banco.js ED NUM [...] [--aplicar]` | copia enunciado+alternativas **do bloco conferido** para raw e banco (sem --aplicar mostra o diff). Antes, compare o tamanho do enunciado: se o bloco for **menor** que o banco, o bloco está resumido — refaça o bloco, não o banco |

### Módulos

| Script | O que faz |
|---|---|
| `worklist.js` | lacunas por módulo |
| `dump.js CODIGO` | texto das questões que faltam no módulo |
| `inserir.js ARQ BLOCOS.txt` | insere blocos na seção 3 |
| `refazer_questao.js LOTE.txt` | seções `@@COD ANO ED NUM`: troca enunciado+alternativas do bloco pelo texto do caderno, mantém a explicação, apaga a nota de extração |
| `substituir_enunciado.js COD ANO ED NUM ARQ` | troca só o enunciado de um bloco |
| `ver_bloco.js ARQ ANO ED NUM` | mostra um bloco inteiro |
| `conferir_bloco.js ARQ ANO ED NUM` | bloco × melhores candidatos oficiais |
| `auditar_modulos.js` | confere número e gabarito de todos os blocos |
| `sanear_blocos.js [--aplicar] [--forcar]` | troca o texto pelo oficial, com critério de qualidade |
| `renumerar_bloco.js` | corrige o número no cabeçalho de um bloco |
| `trocar_justificativa.js` | troca só a justificativa, preservando enunciado e gabarito |
| `reescrever_bloco.js` | reescreve o bloco inteiro a partir do oficial |

### Hub

| Script | O que faz |
|---|---|
| `reconstruir_hub.js` | regera o conteúdo dos 326 módulos e injeta tudo |
| `patch_hub.js` | injeta QMETA, filtros e o modo simulado |
| `verificar_tudo.js` | checagem única de integridade |

### Dados derivados (podem ser regerados)

`_banco_oficial.json` · `_gabaritos_oficiais.json` · `_hub_qmeta.json` · `_auditoria_modulos.json`
`_auditoria_conteudo.json` · `_mapa_ids.json` · `_mapa_cifra.json` · `_worklist.json`

---

## 6. Estado final e o que ainda pode ser melhorado

### Estado em 2026-10-01 (lote 15) — BANCO COMPLETO

| Grupo | Questões sem bloco | Observação |
|---|---|---|
| 16 edições de texto claro (2011.1–2025.2) | **0** | lotes 1–13 |
| **2022.1** (fonte cifrada) | **0** | lote 14 — texto conferido no PDF, 100 blocos |
| **2026.1** (fonte cifrada) | **0** | lote 15 — re-decifrada por palavra, 100 questões conferidas no PDF, 100 blocos |

`lacunas.js "" --existentes --resumo` → TOTAL 0 (agora inclui 2026.1). `verificar_tudo.js` → cobertura 1.850/1.850.

**Regra do usuário:** não criar módulo novo para 1 questão só — encaixar num existente afim (todas as 200 questões
de 2022.1 e 2026.1 entraram em módulos existentes).

**Fluxo para novas questões/edições (usado nos lotes 14–15):** texto no `raw/` conferido com o PDF → classificação
num `_classificacao_<ED>.json` → `classificar_2022.js ARQ ED` → `banco_de_raw.js ED --aplicar` → `reconstruir_mapa.js`
→ explicações em `dados/_explicacoes_<ED>/E*.txt` (seções `##N`, sem `---` entre elas sendo necessário — o montador
remove) → `montar_blocos.js EXP ED SAIDA` → `inserir_multi.js SAIDA` → `sync_meta_nq.js` → `integridade.js` →
`conferir_alternativas.js` → pipeline do Hub (§5) → `verificar_tudo.js`.

**Fluxo para módulo novo (lote 13):** escrever o .md com a seção 3 vazia (só o título "## 3. QUESTÕES DO INEP (banco histórico)" seguido de uma linha `---` e do título da seção 4) e cabeçalho com `**Nº de questões históricas do INEP sobre o assunto:** 0 ·` → blocos num arquivo `@@COD` → `inserir_multi.js` → `sync_meta_nq.js` → `integridade.js` → `fidelidade_bloco.js` → `conferir_alternativas.js`.

### Melhorias opcionais (não bloqueiam nada)

1. **9 blocos "não totalmente corretos"** no item 2 do `verificar_tudo` (1.845 de 1.854 "já corretos") e as
   **8 divergências antigas** de grafia do `conferir_alternativas.js` (banco antigo com ⟪?⟫) — revisar à mão.
2. **4 blocos a mais que questões** (1.854 × 1.850): questões que aparecem em dois módulos de propósito; conferir
   se continuam desejadas.
3. Teoria dos módulos: vários módulos receberam muitas questões novas (2022.1/2026.1) sem complemento de teoria —
   pode-se acrescentar "### Complemento" onde o tema novo não estiver coberto (ex.: PREV-14 telessaúde/nome social,
   PREV-08 IVCF-20 e lesão por pressão, CIR-123 trauma na gestante, PSI-06 parassonias).
4. Nuances registradas nos blocos (gabarito oficial mantido): 2022.1-Q53 (RN < 34 sem), 2026.1-Q73 (dor óssea ×
   PTI), 2026.1-Q98 (Doppler antes de anticoagular).

### D) 2022.1 — CONCLUÍDA (lote 14)

`dados/raw/2022.1.json`: 100 questões decifradas e conferidas (40 transcritas/corrigidas pelo PDF, as demais com
fidelidade ≥ 98% e checagem de trigramas). Gabaritos oficiais (10 anuladas = `null`).

**Regenerar 2022.1 do zero** (se algo estragar):
1. `cp dados/_backup_lote5_20260929/raw_2022.1_cifrado.json dados/raw/2022.1.json`
2. `node dados/_ferramentas/decifrar.js 2022.1 --aplicar`
3. `node dados/_ferramentas/limpar_2022.js` (rodapé `\u0015\u0013\u0015\u0015` e "Espaço livre")
4. `node dados/_ferramentas/reconstruir_manual_2022.js` (Q11, 48, 71, 72, 91, 100)
5. `node dados/_ferramentas/recortar_2022.js --aplicar`
6. `node dados/_ferramentas/aplicar_correcoes_2022.js --aplicar`
7. `node dados/_ferramentas/classificar_2022.js` (classificação de `_classificacao_2022.1.json`)

### C) 2026.1 — CONCLUÍDA (lote 15)

**Regenerar 2026.1 do zero:** `decifrar_2026.js --aplicar` (lê o cifrado do backup
`_banco_oficial_pre_2022.1.json` se o banco já estiver decifrado) → `aplicar_correcoes_2026.js --aplicar` →
`classificar_2022.js dados/_classificacao_2026.1.json 2026.1`. Reproduz exatamente o texto atual.
Ferramenta de conferência: `mostrar_2026.js N,M,...` imprime o texto para comparar com a página do PDF.

---

## 7. A cifra das provas 2022.1 e 2026.1

Essas duas provas usam uma fonte simbólica: o PDF guarda os glifos, não as letras. O texto
sai como `ŵƵůŚĞƌ` no lugar de `mulher`.

A cifra é uma **substituição 1:1 que preserva a ordem alfabética**:

```
Ă=a  ă=à  Ą=á  ą=â  Ć=ã  ď=b  Đ=c  ĕ=ç  Ě=d  Ğ=e  Ġ=é  ġ=ê  Ĩ=f  Ő=g  Ś=h
ŝ=i  ş=í  ũ=j  ů=l  ŵ=m  Ŷ=n  Ž=o  ſ=ó  ƀ=ô  Ɓ=õ  Ɖ=p  Ƌ=q  ƌ=r  Ɛ=s  ƚ=t
Ƶ=u  Ʒ=ú  ǀ=v  ǆ=x  Ǉ=y  ǌ=z        dígitos: codepoint − 0x3BC
```

As **maiúsculas** caem em caracteres de controle e ASCII, também em ordem alfabética:
`A=U+0004  B=U+0011  C=U+0012  D=U+0018  E=U+001C  G=U+0027  M=U+0044  N=U+0045
Q=U+0059  S=U+005E  U=U+0068`. E há **ligaduras**: `Ɵ = "ti"`, `İ = "fí"`, `į = "fi"`.

`decifrar.js` resolve o resto sozinho: usa o vocabulário das outras 16 provas como
dicionário e aceita uma letra apenas quando **todas** as palavras candidatas concordam.
Nenhuma palavra é inventada. O mapa final fica em `dados/_mapa_cifra.json` (hoje com o mapa de
2022.1; o de 2026.1 está em `_backup_lote5_20260929/_mapa_cifra_2026.json`).

**Lições de 2022.1 (lote 14):**
- **O PDF lido visualmente (ferramenta Read com `pages`) renderiza perfeito — é a fonte-ouro.**
  Página da questão N: {1-4:2, 5-8:3, 9-11:4, 12-16:5, 17-19:6, 20-23:7, 24-26:8, 27-30:9, 31-36:10,
  37-40:11, 41-44:12, 45-47:13, 48-50:14, 51-54:15, 55-58:16, 59-62:17, 63-66:18, 67-70:19, 71-73:20,
  74-78:21, 79-82:22, 83-86:23, 87-90:24, 91:25, 92-95:26, 96-99:27, 100:28}.
- Extração por layout perde palavras na borda das colunas; texto corrido intercala colunas em
  algumas páginas. Marcadores de alternativa em 2022.1 = letra + U+0003.
- Maiúsculas de 2022.1 extras (MAI22 em `decifrar.js`). Símbolos: U+0444 `<`, U+0445 `>`,
  U+0447 `≤`, U+0448 `≥`, U+034D `?`, Σ/ȗ `°` (não "°C").
- Ferramentas: `decifrar_trecho.js`, `fidelidade_2022.js`, `recortar_2022.js`,
  `aplicar_correcoes_2022.js` (+ `dados/_correcoes_2022.1_pdf.json`).
**Lições de 2026.1 (lote 15):**
- O caderno **mistura texto claro e fonte simbólica** na mesma questão. Decifrar a string inteira estraga o
  texto claro (a tabela de maiúsculas usa ASCII: `h`→U, `s`→V, `d`→T...). Decifre **por palavra**: só as que têm
  U+0003 (espaço da fonte simbólica) ou glifo cifrado (`decifrar_2026.js`).
- 2026.1 usa a **mesma fonte de 2022.1**: o mapa de 2022.1 serve, mais U+0416 ₂, U+03F9/U+0421 ³, U+03F8/U+0420 ²,
  U+037B •, U+038E *, U+01E1 °, U+0452 µ, U+043F x, U+0182 ö e ligaduras U+019E tf, U+014C ft (ver `EXTRA`).
- Palavras em **itálico** usam outra fonte e saem trocadas (mellituV, NVcUericUia) → `_subs` globais.
- Tabelas saem achatadas (uma linha) e uma célula pode "pular" para a questão vizinha (Q18 recebeu "Mama" da
  tabela de Q20). Reescreva tabelas em Markdown e compare com o PDF.
- Conferência eficiente: `mostrar_2026.js` + leitura da página do PDF (4 questões por página) + varredura de
  palavras fora do vocabulário das outras edições (pega erros de 1 letra, como "naúseas").

---

## 8. Armadilhas já pagas — não repetir

1. **Verificação circular.** `renum3.js` comparava o banco contra um arquivo derivado do
   próprio banco. Confirmava o erro. Fonte de verificação tem de ser independente.
2. **O campo `assunto` não é do INEP.** É classificador interno. Dois módulos rejeitaram o
   gabarito certo por confiar nele.
3. **`raw/*.json` usa `enunciado`; `mapa_mestre.json` usa `enunciado_resumo`.** Um script que
   trate só o primeiro deixa o segundo inconsistente.
4. **O "questionário de percepção" no fim da prova também numera `QUESTÃO 1..9`** e colide
   com as questões reais. Todo parser tem de cortar ali.
5. **A ordem de leitura do caderno é por página:** coluna esquerda inteira, depois a direita
   **da mesma página**. Uma questão que começa no pé da esquerda continua no topo da direita.
   Tratar as colunas como dois fluxos contínuos quebra exatamente as questões de fim de página.
6. **Heredoc no Git Bash deste ambiente engole barras invertidas duplicadas.** Dentro de
   heredoc, escreva regex com barra simples; ou gere o arquivo com a ferramenta de escrita.
7. **O `preparar_conteudo_modulo.js` imprime na saída padrão** — é preciso redirecionar para
   `_conteudo_<COD>.json`. Esquecer disso faz o Hub ficar com dados velhos sem dar erro.
8. **Substituir texto por "melhor" pode piorar.** O saneamento em lote só troca o texto quando
   o oficial passa num critério de qualidade; sem esse critério, 18 blocos regrediram.
9. **Sugestão automática de classificação é ponto de partida, não decisão.** O
   `auditar_classificacao.js` sugere por semelhança de texto — e dor abdominal com amilase
   elevada aparece em pancreatite, aneurisma roto e colelitíase. Duas reatribuições feitas
   sem ler a questão tiveram de ser revertidas. **Leia antes de aplicar.**
10. **Bloco sem a linha `**Gabarito oficial:**` entra no Hub sem resposta, e em silêncio.**
    O `inserir.js` agora recusa o lote quando o número de cabeçalhos não bate com o de
    linhas de gabarito — mas o mesmo cuidado vale para edições feitas à mão.
11. **`dump.js` lê o `_worklist.json` em cache.** Depois de reatribuir questões ou inserir
    blocos, rode `reconstruir_mapa.js` e `worklist.js` antes de voltar a usar o `dump.js`,
    ou você verá a lista antiga.
12. **2014.1 e 2020.1: o arquivo de gabarito traz o título "GABARITO PRELIMINAR", mas o usuário
    confirmou (2026-09-29) que são os gabaritos oficiais publicados no site do INEP.** Não é
    pendência. O campo `gabarito_preliminar: true` continua nos dados só como rastro histórico.
    Onde o gabarito diverge da clínica (ex.: 2020.1-Q8, fístula × fissura), vale a invariante 4:
    registra-se a divergência, o gabarito é o do INEP.
13. **Um verificador vale o que vale sua fonte.** As armadilhas 1 e 12 são a mesma. Antes de
    confiar num número de conferência, pergunte de onde vem a referência.


---

## 9. Por onde começar o próximo lote

**O banco está completo (lote 15).** Rode `verificar_tudo.js` para confirmar e escolha uma das melhorias
opcionais da §6 (revisar os 9 blocos não totalmente corretos, as 8 divergências antigas de grafia, ou
acrescentar complementos de teoria nos módulos que receberam muitas questões de 2022.1/2026.1).
Para uma **nova edição** (ex.: 2026.2), siga o "Fluxo para novas questões/edições" da §6; se o PDF vier em fonte
cifrada, use a §7 (decifrar por palavra + conferência visual no PDF).
Se o Hub for refeito a partir de um modelo antigo, rode também `patch_busca_areas.js` (busca/seletor por área; idempotente).
Feche qualquer lote com `reconstruir_mapa.js` → `reconstruir_hub.js` → `gerar_qmeta.js` → `patch_hub.js` →
`verificar_tudo.js`.

---

## Regra nova (2026-09-29): conferir o TEXTO, não só a letra

Depois de inserir blocos, rode também:

```bash
node dados/_ferramentas/conferir_alternativas.js 0.75   # texto de cada alternativa x banco
```

Ele pegou blocos antigos com alternativas deslocadas, de outra questão e até questão inteira
errada sob o número (PROGRESSO, lote 7). Divergência pode ser legítima quando o **banco** está
danificado — confira com `layout.js`/`raw_text`; `verificar_no_caderno.js` ajuda. Para corrigir:
`corrigir_alternativa.js` (uma linha) ou `substituir_multi.js` (bloco inteiro).

**Armadilha 14:** um verificador que só confere a **letra** do gabarito aprova um bloco cujo texto é de
outra questão, se as letras coincidirem. Foi assim que a 2023.2-Q34 ficou ensinando a resposta errada.

### Armadilha 15 — bloco com número errado não aparece na auditoria se a letra coincidir

2015.1: o bloco da enterorragia estava como "Q86" (gab B) — a Q86 real também tem gabarito B, então
`auditar_modulos.js` dizia "correto". Era a **Q84 (gab C)** e o bloco ensinava a resposta errada. Só apareceu
porque `conferir_alternativas.js` comparou o **texto** (sim=0.00). Regra: similaridade ~0 numa alternativa =
**questão diferente**, não banco danificado. Confira no caderno qual número tem aquele texto antes de
"corrigir o banco". E rode `grep` de cabeçalhos duplicados: mesmo número em dois blocos do **mesmo** módulo
é erro; em módulos diferentes pode ser proposital.

### Armadilha 17 — crases dentro de comando Bash com aspas duplas

Crases (`...`) dentro de `node -e "..."` ou `cat <<EOF` são **executadas pelo shell** (substituição de
comando): o texto some e o shell tenta rodar o conteúdo como comando (já tentou "executar" o hub.html).
Para editar .md com crases, use a ferramenta de edição de arquivo (Edit/Write), nunca o shell.
Para heredoc sem expansão use `<<'EOF'` (com aspas).

### Armadilha 16 — rodar o mesmo lote duas vezes duplica blocos (e "desduplicar" à mão estraga)

2026-09-30: `inserir_multi.js PED1.txt` foi executado 2× (a 2ª só para "ver erros") → 37 blocos duplicados.
Um script improvisado de desduplicação cortou trechos errados: 14 módulos ficaram com as seções 1–5
**inteiras repetidas**, PED-14 perdeu o título "## 3." e 12 blocos sumiram. Recuperação: os
`dados/_scripts/_conteudo_COD.json` (gerados no último `reconstruir_hub.js`) guardam enunciado,
alternativas, gabarito e comentário de todos os blocos — serviram de backup para reconstruir.
**Agora:** `inserir.js` RECUSA inserir cabeçalho que o módulo já tem (use `substituir_multi.js` para trocar).
**Regras:** (1) nunca rode um lote duas vezes; para ver erros, olhe a saída da 1ª execução;
(2) antes de qualquer edição em massa nos .md, copie `modulos/` para `dados/_backup_*`;
(3) conferência de integridade: cada .md tem exatamente 1× "## 0." … "## 5." e 1× "<!-- METADADOS -->",
nenhum cabeçalho `**[INEP …]**` repetido no mesmo arquivo, e nenhum bloco do último `_conteudo_*.json` faltando.
