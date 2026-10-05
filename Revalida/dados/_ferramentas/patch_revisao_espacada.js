// patch_revisao_espacada.js — salva o progresso sozinho (localStorage) e cria a aba 🧠 Revisão: as questões
// erradas entram num baralho com repetição espaçada tipo Anki (SM-2). O código injetado fica em
// revisao_espacada.js/.css (mesma pasta). Idempotente: se o hub já tiver o marcador REVISAO-ESPACADA, só
// reinjeta o código novo dos dois arquivos. Rodar depois de reconstruir_hub.js/patch_hub.js se o hub for
// refeito a partir de um modelo antigo (o reconstruir_hub só reinjeta dados, então normalmente basta 1 vez).
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const F=process.argv[2]||path.join(R,'hub','revalida_hub.html');let h=fs.readFileSync(F,'utf8');
const JS=fs.readFileSync(path.join(__dirname,'revisao_espacada.js'),'utf8').trim();
const CSS=fs.readFileSync(path.join(__dirname,'revisao_espacada.css'),'utf8').trim();
const INI_JS='/* <REVISAO-ESPACADA-JS> */', FIM_JS='/* </REVISAO-ESPACADA-JS> */';
const INI_CSS='/* <REVISAO-ESPACADA-CSS> */', FIM_CSS='/* </REVISAO-ESPACADA-CSS> */';
const troca=(a,b,nome)=>{
  const n=h.split(a).length-1;
  if(n!==1) throw new Error('trecho '+(n?'repetido ('+n+'x)':'nao encontrado')+': '+nome);
  h=h.split(a).join(b);
};
const blocoJS=INI_JS+'\n'+JS+'\n'+FIM_JS+'\n';
const blocoCSS=INI_CSS+'\n'+CSS+'\n'+FIM_CSS+'\n';

if(h.includes(INI_JS)){
  // já aplicado: só atualiza o código injetado
  h=h.replace(new RegExp(esc(INI_JS)+'[\\s\\S]*?'+esc(FIM_JS)+'\\n'),()=>blocoJS);
  h=h.replace(new RegExp(esc(INI_CSS)+'[\\s\\S]*?'+esc(FIM_CSS)+'\\n'),()=>blocoCSS);
  fs.writeFileSync(F,h,'utf8'); console.log('ja aplicado — codigo da revisao atualizado'); process.exit(0);
}
function esc(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

// 1) CSS e bloco de código
troca('</style>', blocoCSS+'</style>', 'fim do <style>');
troca('/* =================================================================\n   BOOT / EVENTOS GLOBAIS',
      blocoJS+'\n/* =================================================================\n   BOOT / EVENTOS GLOBAIS', 'secao BOOT');

// 2) estado + aba
troca('ESTADO (em memória — sem persistência automática nesta plataforma)', 'ESTADO (salvo sozinho no localStorage — ver REVISAO-ESPACADA)', 'comentario ESTADO');
troca('  erros:[],', '  erros:[],\n  srs:{},            // { questaoId: {ivl, ease, reps, lapses, due:"AAAA-MM-DD"} } — baralho da revisão', 'state.erros');
troca("  {id:'questoes', label:'Questões', ic:'❓'},\n  {id:'estatisticas'", "  {id:'questoes', label:'Questões', ic:'❓'},\n  {id:'revisao', label:'Revisão', ic:'🧠'},\n  {id:'estatisticas'", 'TABS');

// 3) renderAll: sincroniza baralho, badge, nova aba e salva
troca("function renderAll(){\n  renderTabs();\n  ({hoje:renderHoje, modulo:renderModulo, cronograma:renderCronograma, questoes:renderQuestoes, estatisticas:renderEstatisticas, notas:renderNotas}[state.ui.aba] || renderHoje)();\n}",
      "function renderAll(){\n  srsSincronizar();\n  renderTabs(); marcarBadgeRevisao();\n  ({hoje:renderHoje, modulo:renderModulo, cronograma:renderCronograma, questoes:renderQuestoes, revisao:renderRevisao, estatisticas:renderEstatisticas, notas:renderNotas}[state.ui.aba] || renderHoje)();\n  salvarLocal();\n}", 'renderAll');

// 4) errar uma questão a manda para a revisão (cartão e simulado)
troca("    state.respostasQuestoes[qid] = { escolhida, correta: escolhida===questao.gabarito_oficial && !questao.anulada };",
      "    state.respostasQuestoes[qid] = { escolhida, correta: escolhida===questao.gabarito_oficial && !questao.anulada };\n    if(!state.respostasQuestoes[qid].correta && !questao.anulada) srsErrou(qid);", 'resposta no cartao');
troca("if(esc) state.respostasQuestoes[q.id]={escolhida:esc, correta: esc===q.gabarito_oficial && !q.anulada}; });",
      "if(esc) state.respostasQuestoes[q.id]={escolhida:esc, correta: esc===q.gabarito_oficial && !q.anulada}; if(esc && esc!==q.gabarito_oficial && !q.anulada) srsErrou(q.id); });", 'encerrar simulado');
troca("${errada? '✓ na fila de erros':'Marquei errado'}", "${errada? '🧠 Na revisão'+srsProxLabel(q.id):'➕ Pôr na revisão'}", 'botao do cartao');

// 5) avisos: Hoje e caderno de erros
troca("    ${!MODULOS.length ? bannerVazio() : ''}\n    <div class=\"hero-card\">", "    ${!MODULOS.length ? bannerVazio() : ''}\n    ${bannerRevisao()}\n    <div class=\"hero-card\">", 'banner Hoje');
troca('Revisitado automaticamente 1x/semana no dia de consolidação do cronograma.', 'Agendadas na aba 🧠 Revisão (repetição espaçada, como no Anki).', 'texto caderno de erros');

// 6) salvar também o que não chama renderAll (notas, realces) e ao sair; carregar no boot
troca("state.notas[m.codigo]=e.target.value; },500)", "state.notas[m.codigo]=e.target.value; salvarLocal(); },500)", 'notas');
troca("  toast('Trecho realçado — veja em Notas');", "  salvarLocal();\n  toast('Trecho realçado — veja em Notas');", 'realces');
troca("\nrenderAll();\n})();", "\ncarregarLocal();\non(window,'pagehide',salvarLocal);\non(document,'visibilitychange',()=>{ if(document.visibilityState==='hidden') salvarLocal(); });\non($('#btnTheme'),'click',()=>setTimeout(salvarLocal,0));\nrenderAll();\n})();", 'boot');

// 7) backup inclui o baralho; exportar baixa arquivo de verdade fora do claude.ai
troca('    respostasQuestoes: state.respostasQuestoes,', '    respostasQuestoes: state.respostasQuestoes, srs: state.srs,', 'coletarBackup');
troca("    Object.assign(state.respostasQuestoes, obj.respostasQuestoes||{});", "    Object.assign(state.respostasQuestoes, obj.respostasQuestoes||{});\n    Object.assign(state.srs, obj.srs||{});", 'aplicarImport');
troca("    $('#pasteImport').value = data;\n    toast('Download indisponível aqui — copie o JSON da caixa abaixo.');",
      "    try{\n      const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([data],{type:'application/json'}));\n      a.download=filename; document.body.appendChild(a); a.click(); a.remove();\n      setTimeout(()=>URL.revokeObjectURL(a.href),1000);\n      toast('Backup exportado.');\n    }catch(err){\n      $('#pasteImport').value = data;\n      toast('Download indisponível aqui — copie o JSON da caixa abaixo.');\n    }", 'exportar');
h=h.replace(/Este artefato não usa armazenamento automático entre sessões\.[\s\S]*?continuar de onde parou\./,
  'Seu progresso (status dos módulos, realces, notas, revisão e checklist) é <b>salvo automaticamente neste navegador</b>.\n      <b>Exporte um backup</b> de vez em quando — se os dados do navegador forem apagados, ele se perde — e\n      <b>importe</b> para levá-lo a outro computador.');

fs.writeFileSync(F,h,'utf8');
console.log('revisao espacada aplicada | hub: '+(h.length/1048576).toFixed(2)+' MB');
