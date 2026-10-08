# RETOMADA — CONAREM Hub (estado em 2026-10-08, 2ª sessão)

## Onde está tudo
- **Site publicado:** https://medeiros1333.github.io/plataformas-medicas/CONAREM/hub/ (commit 5fef2b1 no repo Medeiros1333/plataformas-medicas)
- **Pasta de trabalho (fonte):** `C:\Users\gusta\OneDrive\Documentos\AI Agent\CONAREM`
  - `hub/` (index.html, app.js, style.css, data.js público, data_privado.js só local)
  - `data/transcripciones/*.txt` — 19 provas oficiais transcritas (formato em `scripts/parse-transcripciones.js`)
  - `data/explicaciones/*.json` — explicações próprias `{ id: { e, r } }` (só as 6 provas troncais: 420 questões)
  - `data/privado/` — banco SimuResi importado (NÃO publicar)
  - `data/temario_txt/` — texto dos PDFs de temário do INS; `data/bibliografia.json` — links por matéria
  - `scripts/`: parse-transcripciones.js → importar-externos.js → generar-hub-data.js
- **Material baixado:** `C:\Users\gusta\OneDrive\Área de Trabalho\CONAREM\`
  - `Provas_CONAREM/` — 27 PDFs oficiais (2022 TRO, 2024 TRO+SUB, 2026 TRO+SUB, matrizes 2026) + LEIA-ME.md
  - `Bibliografia_CONAREM/` — temários oficiais (Troncales/Subespecialidades), 15 documentos gratuitos, LINKS_BIBLIOGRAFIA.md
  - `Plataforma_CONAREM/` (SimuResi, produto pago de terceiro) e `Otras_plataformas_o_bancos/` (CONAFLIX Apache-2.0, ExamPro sem conteúdo útil)

## Reestruturação (2ª sessão, 2026-10-08) — pedido do usuário
- Só as 5 troncais como módulos (MI, PED, CIR, GO, SP); questões de subespecialidade separadas (botões Troncales/Subespecialidades no Banco; simulacro CONAREM só usa troncais).
- Cada troncal dividida em conteúdos/temas do edital: `scripts/taxonomia.js` (palavras-chave por tema) + `scripts/lib-clasificar.js`.
  As 420 troncais oficiais foram revisadas à mão → `data/clasificacion_manual.json` (103 correções).
- Temário: conteúdos ordenados por incidência (% das questões troncais oficiais), questões por ano, temas com frequência, capítulos dos livros, checklist do edital. Progresso do temário usa chaves novas `AREA-SUB|i`.
- Livros que o usuário baixou: `Área de Trabalho/CONAREM/Bibliografia_CONAREM/Livros` (Harrison 20ª pt, Schwartz 11ª, Williams Obs 26ª, Williams Gyn 4ª EN, Nelson 22ª EN, Johns Hopkins 6ª).
  `node scripts/indice-libros.js` → `data/privado/indice_libros.json`; capítulos por tema em `data/referencias_libros.json`. Links file:// só funcionam abrindo o hub localmente.
- Manuais novos em Documentos_Gratuitos_Oficiais: Patologías Obstétricas 2018 (GO), Método Madre Canguro (PED), Plan Nacional de Salud Adolescente 2023 (SP). O AIEPI enviado era duplicado (ficou em Para_Adicionar).
- Pasta `Área de Trabalho/CONAREM/Para_Adicionar/` criada para o usuário deixar material novo.

## Publicar
`powershell -ExecutionPolicy Bypass -File "C:\Users\gusta\OneDrive\Documentos\AI Agent\publicar_github.ps1" "mensagem"`
(o script já inclui CONAREM e exclui `data/privado` e `data_privado.js`). Atenção: ele espelha as 4 pastas —
se Farmaco/MIR/Revalida tiverem trabalho não publicado, ele vai junto; alternativa: robocopy só da pasta CONAREM.

## Números
- 1.066 questões oficiais: TRO 2022 (140), 2024 (140), 2026 (140); SUB 2024 (CIR, EM, GO[46], MF, MI, PED, TRAUMA) e 2026 (CARDIO, CIR, GO, MI, PED, TRAUMA), 50 cada.
- SimuResi: 3.146 questões (574 coincidem com oficiais → 570 explicações reaproveitadas localmente; 2.577 extras) + 225 flashcards.
- CONAFLIX: 8 temas, 10 questões. 12 questões oficiais repetidas entre anos.
- Formato dos blocos 2026: Bloco I = CIR 30 + MI 30 + SP 20; Bloco II = PED 30 + GO 30 (2022/2024: I = CIR+GO+SP, II = MI+PED).

## Decisões
- Banco SimuResi fica só local (conteúdo pago de terceiro, site é público) — o usuário disse que é uso próprio.
- Gabarito oficial sempre mantido; quando suspeito, linha `!? X | nota` (aviso no app):
  2026 SUB GO #1 e #4, 2024 SUB GO #32, 2024 SUB TRAUMA #14 (+ matiz em 2024 SUB PED #14).
- Data da prova padrão no calendário: 2027-03-06 (configurável na aba Calendário).

## Pendente (próximas sessões)
1. (baixa prioridade — foco é troncal) Explicações próprias das 646 questões de subespecialidades (`data/explicaciones/2024_SUB_*.json`, `2026_SUB_*.json`).
2. Provas 2015–2021, 2023, 2025: INS não publicou cadernos (só SimuResi/Studocu/Course Hero não oficiais).
3. Opcional: mais resumos de temas além dos 8 do CONAFLIX.
