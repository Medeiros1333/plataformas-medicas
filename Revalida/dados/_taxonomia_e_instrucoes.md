# Taxonomia e instruções de extração — Mapa Mestre Revalida

Referência única usada por todos os agentes de extração de provas. Não desviar da taxonomia abaixo sem marcar com "*".

## Especialidades canônicas (20) — código de módulo

| Código | Especialidade | Tier |
|---|---|---|
| PED | Pediatria | A |
| CIR | Cirurgia (geral + subespecialidades cirúrgicas: urologia, cirurgia plástica, oncologia cirúrgica etc.) | A |
| PREV | Medicina Preventiva e Social (SUS, epidemiologia, bioética, saúde da família) | A |
| OBS | Obstetrícia | A |
| GIN | Ginecologia | A |
| INF | Infectologia | A |
| GAS | Gastroenterologia (não hepática) | B |
| END | Endocrinologia | B |
| PSI | Psiquiatria | B |
| CAR | Cardiologia | B |
| NEF | Nefrologia | B |
| NEU | Neurologia | B |
| HEM | Hematologia | B |
| PNE | Pneumologia | B |
| ORT | Ortopedia | C |
| DER | Dermatologia | C |
| REU | Reumatologia | C |
| HEP | Hepatologia | C |
| OTO | Otorrinolaringologia | C |
| OFT | Oftalmologia | C |

Regras de enquadramento:
- Urologia, cirurgia plástica, cirurgia vascular, oncologia cirúrgica → CIR.
- Medicina de família, ética médica, legislação do SUS, epidemiologia, saúde do trabalhador, saúde do idoso, imunizações/PNI → PREV (a menos que a questão seja claramente sobre uma doença específica de outra especialidade, ex.: "vacina contra sarampo" pode ficar em PED se o contexto for puericultura).
- Medicina de emergência/trauma → normalmente CIR (trauma) ou a especialidade do quadro clínico de base (ex.: IAM → CAR).
- Se a questão cruzar 2 especialidades, escolha a PRIMÁRIA pelo que está sendo *testado* (o desfecho da pergunta), e liste a outra em `especialidade_secundaria`.
- Nunca crie uma 21ª especialidade. Se realmente não couber em nenhuma, use a mais próxima e marque `"status": "revisar"`.

## Schema de cada questão (JSON)

```json
{
  "id": "INEP{ano}-{edicao}-Q{numero:03d}",
  "ano": 2024,
  "edicao": 2,
  "numero": 1,
  "tipo": "objetiva",
  "enunciado": "Texto INTEGRAL do enunciado, verbatim, incluindo comandos da questão. Se houver figura/imagem/ECG/tabela, descreva entre colchetes: [IMG: descrição objetiva do que a imagem mostra, incluindo achados relevantes visíveis].",
  "alternativas": {"A": "texto completo", "B": "texto completo", "C": "texto completo", "D": "texto completo", "E": "texto completo (se existir; omitir a chave se a prova daquele ano só tem A-D)"},
  "gabarito_oficial": "C",
  "anulada": false,
  "especialidade_primaria": "Infectologia",
  "especialidade_secundaria": [],
  "tema": "Tuberculose",
  "assunto": "Tuberculose pulmonar - diagnóstico",
  "competencia": "diagnostico",
  "dificuldade_estimada": 3,
  "status": "ok"
}
```

- `competencia` ∈ {diagnostico, tratamento, epidemiologia, conduta_inicial, prevencao, etica_gestao}
- `dificuldade_estimada` ∈ {1,2,3,4,5} — 1 muito direto (decoreba simples), 5 exige raciocínio multi-etapa/integração.
- `status` ∈ {"ok", "ilegivel", "revisar"}. Use "ilegivel" só se o texto realmente não puder ser recuperado (raro, dado que os PDFs têm texto/imagem legível). Use "revisar" quando a extração ficou íntegra mas há dúvida de classificação ou de enquadramento de especialidade.
- NUNCA invente uma questão. NUNCA invente o gabarito — ele vem SEMPRE do PDF de gabarito oficial daquele ano/edição, não do seu próprio raciocínio clínico.
- Se o gabarito oficial mostra "—", "ANULADA", ou similar para o número, marque `"anulada": true` e ainda assim preencha o resto normalmente (enunciado, alternativas, classificação) — a questão anulada ainda é material de estudo válido, só não conta ponto.
- Questões com enunciado dependente de imagem (radiografia, ECG, lesão de pele, fluxograma): LEIA A PÁGINA DO PDF DIRETAMENTE (o Read tool renderiza PDF, inclusive imagens) e descreva a imagem dentro do enunciado com `[IMG: ...]`. Não pule a questão por causa da imagem.

## Processo de extração recomendado (MÉTODO RÁPIDO — leia isto com atenção, evita estourar cota/tempo)

Já existe texto pré-extraído de TODAS as provas e gabaritos em `dados/raw_text/{ano}__{nome_do_arquivo}.txt`
(gerado via `pdftotext`, UTF-8, sem quebra de layout). Use-o como fonte PRIMÁRIA — é muito mais rápido
que renderizar o PDF página por página como imagem, e ler o PDF inteiro como imagem foi a causa de
travamentos em tentativas anteriores. **Não leia o PDF inteiro como imagem.**

1. Leia primeiro o `.txt` do GABARITO da sua edição (arquivo pequeno). Monte um dicionário número→gabarito.
   Confirme o total de questões (100 ou 110). **Exceção conhecida:** os gabaritos de **2017** e **2020**
   não extraíram como texto (a resposta é desenhada graficamente, não como texto selecionável) — para
   esses dois anos especificamente, abra o PDF do gabarito com o Read tool (é só 1 página) e leia
   visualmente a grade de respostas.
2. Leia o `.txt` da PROVA inteira (é só um arquivo de texto, cabe numa ou duas chamadas de Read). A ordem
   das questões no texto pode ter pequenas trocas locais (ex.: "quest. 12" aparecer antes de "quest. 11")
   por causa do layout em duas colunas do PDF original — isso é normal, o conteúdo de cada questão
   costuma vir intacto entre seu próprio cabeçalho "QUESTÃO N" e o próximo; ordene por N ao final.
3. Use o Read tool no PDF ORIGINAL (página específica, não o documento inteiro) apenas quando:
   (a) a questão referenciar uma figura/imagem/ECG/radiografia/lesão de pele/fluxograma ("a seguir",
       "reproduz-se", "Figura", "imagem" etc.) — abra só aquela página para descrever a imagem com
       [IMG: ...]; ou
   (b) o texto de uma questão específica parecer cortado/misturado com a vizinha — abra só aquela página
       para desembaralhar visualmente.
   Fora desses dois casos, não é necessário abrir o PDF original.
4. Para CADA questão, na ordem 1..N, transcreva o enunciado completo e as alternativas completas a partir
   do texto já extraído.
5. Depois de extrair o texto, classifique cada questão (especialidade/tema/assunto/competência/dificuldade).
6. Confira: nº de questões extraídas deve bater com o nº de questões da edição (100 ou 110). Se faltar
   alguma, procure-a antes de finalizar — não omita.
7. Salve o array JSON completo no arquivo indicado pela tarefa assim que estiver pronto — não deixe a
   escrita para o fim de uma resposta longa.
8. Ao final, devolva um resumo BREVE (menos de 150 palavras): nº de questões no PDF | nº extraídas | nº
   anuladas | nº com status "revisar"/"ilegivel" | especialidades mais frequentes desse lote.

## FASE B — finalizar + classificar (a partir de dados/raw/{ano}.{edicao}.pre.json)

Esta fase NÃO extrai do zero. Já existe `dados/raw/{ano}.{edicao}.pre.json` com a maioria das
questões já com enunciado + alternativas separados e gabarito_oficial/anulada corretos (vindo
do script `dados/_scripts/extrair.js`). Sua tarefa por edição é:

1. Leia `dados/raw/{ano}.{edicao}.pre.json` (é pequeno, ~100-110 objetos, uma leitura só).
2. Para cada questão com `"status":"ok"`: mantenha enunciado/alternativas como estão (não
   reescreva, não "corrija" o português — é transcrição literal da prova), e apenas ADICIONE os
   campos de classificação (especialidade_primaria, especialidade_secundaria, tema, assunto,
   competencia, dificuldade_estimada) conforme a taxonomia acima. Troque `"status":"ok"` por
   `"status":"ok"` mesmo (mantém).
3. Para cada questão com `"status":"revisar_extracao"`: o campo `enunciado` contém o texto bruto
   da questão (stem + alternativas ainda grudados, possivelmente com pequenos trechos de outra
   questão vizinha misturados por causa da diagramação em 2 colunas do PDF original). Releia esse
   texto com atenção e separe manualmente em enunciado limpo + alternativas A-E. Se o texto
   estiver claramente contaminado com fragmento de outra questão (uma frase solta que não faz
   sentido no contexto), remova o fragmento estranho do enunciado. Se a questão referenciar figura
   (`_motivo` menciona "figura"), abra a página específica do PDF original (caminho em
   `Provas_Revalida/{ano}/...`) para descrever a imagem com `[IMG: ...]`. Depois de corrigido, mude
   `"status"` para `"ok"` e classifique normalmente. Se não der para recuperar o texto de forma
   confiável, deixe `"status":"revisar_extracao"` e classifique mesmo assim com o que houver.
4. Números de questão AUSENTES do array (o `.pre.json` pode pular alguns números que não tiveram
   bloco de texto localizado — confira contra o total esperado, 100 ou 110): para esses, abra a
   página específica do PDF original da prova (não precisa ler o documento inteiro, só a página
   daquela questão) e transcreva a questão inteira do zero, no schema completo. Insira no array na
   posição correta (ordenado por `numero`).
5. Salve o resultado final (array completo, na ordem de `numero`, SEM o campo `_motivo` que era só
   uso interno do script) em `dados/raw/{ano}.{edicao}.json` (sem o `.pre` no nome — esse é o
   arquivo final).

Isso é bem mais rápido que extrair do zero: a maior parte do trabalho pesado (ler e transcrever)
já está feita: você só está terminando o polimento e adicionando a classificação.

**Exemplo de qualidade/referência**: veja `dados/raw/2013.1.json` (110 questões, já finalizado
nesse padrão) para o nível de detalhe esperado em `tema`/`assunto` (específico, não genérico —
ex.: "Adenomegalia cervical/supraclavicular em criança - sinal de alarme para neoplasia" e não
apenas "Linfonodomegalia") e em como as correções de `revisar_extracao` foram feitas.

## Por que isso importa

Este mapa alimenta um sistema de estudo real para a prova do Revalida INEP. Precisão break aqui gera erro em cascata (teoria errada, flashcard errado, decorado 40 vezes). Prefira marcar "revisar" a chutar uma classificação duvidosa.
