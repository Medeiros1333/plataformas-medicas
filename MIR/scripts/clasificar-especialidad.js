#!/usr/bin/env node
/**
 * Clasificador MECÁNICO (por palabras clave) de preguntas por especialidad —
 * primera pasada de la Fase 5. Es una heurística, no un juicio clínico: sirve
 * para resolver rápido los casos obvios y aislar los ambiguos/no resueltos
 * para revisión manual posterior (ver playbook §6 y §17).
 *
 * Puntúa cada pregunta (enunciado + alternativas) contra listas de términos
 * distintivos por especialidad. Asigna la especialidad ganadora solo si su
 * puntuación es claramente superior a la segunda (margen >= 2 y score >= 2);
 * si no, la deja sin clasificar (null) para revisión manual.
 *
 * Uso: node clasificar-especialidad.js <preguntas.json> <salida.json>
 * La salida añade "especialidad_sugerida" y "confianza" (score, score2) a
 * cada pregunta, SIN tocar el archivo original ni el campo "especialidad"
 * definitivo (eso se decide y graba aparte, tras revisión).
 */
const fs = require("fs");

// Términos distintivos por especialidad. Minúsculas, sin acentos (se normaliza
// el texto antes de comparar). Cuanto más específico el término, mejor señal.
const TERMINOS = {
  CAR: ["cardiaco","cardiaca","cardiopatia","arritmia","fibrilacion auricular","flutter","taquicardia","bradicardia","marcapasos","desfibrilador","valvulopatia","estenosis aortica","insuficiencia mitral","insuficiencia cardiaca","infarto de miocardio","cardiopatia isquemica","angina de pecho","coronariografia","electrocardiograma","ecg","soplo cardiaco","pericarditis","miocardiopatia","endocarditis","aneurisma de aorta","disección de aorta","hipertension arterial","insuficiencia cardíaca","cateterismo cardiaco","bloqueo de rama","segmento st","troponina"],
  DIG: ["hepatico","hepatica","cirrosis","hepatitis","pancreatitis","colecistitis","colelitiasis","coledocolitiasis","enfermedad de crohn","colitis ulcerosa","ulcera peptica","helicobacter pylori","hemorragia digestiva","varices esofagicas","disfagia","reflujo gastroesofagico","apendicitis","hernia inguinal","hernia umbilical","obstruccion intestinal","diverticulitis","colangitis","ictericia","ascitis","colon","intestino delgado","recto","esofago","estomago","gastritis","enfermedad celiaca","sindrome de intestino irritable","tumor de estomago","cancer colorrectal","peritonitis","eventracion"],
  END: ["diabetes mellitus","hipoglucemia","hiperglucemia","tiroides","hipotiroidismo","hipertiroidismo","tsh","nodulo tiroideo","suprarrenal","cushing","addison","feocromocitoma","hipofisis","acromegalia","prolactina","hipopituitarismo","obesidad","dislipemia","hipercolesterolemia","paratiroides","hipercalcemia","osteoporosis","insulina","cetoacidosis diabetica","sindrome metabolico"],
  NFR: ["renal","riñon","nefropatia","glomerulonefritis","insuficiencia renal","nefritico","nefrotico","dialisis","hemodialisis","trasplante renal","creatinina","filtrado glomerular","pielonefritis","poliquistosis renal","litiasis renal","acidosis tubular","hiponatremia","hiperpotasemia","hipopotasemia"],
  NML: ["pulmonar","pulmon","asma","epoc","neumonia","tuberculosis","derrame pleural","neumotorax","embolia pulmonar","tromboembolismo pulmonar","fibrosis pulmonar","bronquitis","disnea","espirometria","saturacion de oxigeno","insuficiencia respiratoria","sindrome de apnea","apnea del sueño","bronquiectasias","nodulo pulmonar"],
  NEU: ["ictus","accidente cerebrovascular","epilepsia","convulsion","cefalea","migraña","esclerosis multiple","parkinson","alzheimer","demencia","neuropatia","miastenia gravis","esclerosis lateral amiotrofica","hemiparesia","afasia","ataxia","temblor","meningitis","encefalitis","hipertension intracraneal","resonancia magnetica cerebral","tumor cerebral","glioma","neuralgia","vertigo central","radiculopatia"],
  OFT: ["ocular","ojo","retina","retinopatia","glaucoma","catarata","cornea","uveitis","conjuntivitis","desprendimiento de retina","agudeza visual","fondo de ojo","macula","nervio optico","estrabismo","queratitis"],
  ONC: ["quimioterapia","metastasis","tumor maligno","neoplasia maligna","carcinoma","biopsia tumoral","marcador tumoral","radioterapia","oncologico","estadificacion tnm","cancer de mama","cancer de pulmon","cancer de ovario","cancer de prostata"],
  ORL: ["otitis","faringitis","amigdalitis","sinusitis","otorrea","hipoacusia","vertigo periferico","laringitis","disfonia","epistaxis","otoscopia","tumor de laringe","adenoides","voz"],
  PED: ["recien nacido","neonato","lactante","pediatrico","niño de","niña de","vacuna infantil","percentil","reflejo de moro","displasia de cadera","bronquiolitis","enfermedad de kawasaki","fiebre reumatica","escarlatina","varicela","sarampion"],
  PSQ: ["depresion","trastorno bipolar","esquizofrenia","ansiedad","trastorno de personalidad","suicidio","psicosis","antidepresivo","antipsicotico","trastorno obsesivo compulsivo","anorexia nerviosa","bulimia nerviosa","trastorno del animo","delirium","insomnio","abstinencia","dependencia al alcohol","trastorno de conducta alimentaria"],
  REU: ["artritis reumatoide","lupus eritematoso","espondiloartritis","artrosis","gota","vasculitis","fibromialgia","sindrome de sjogren","esclerodermia","polimialgia reumatica","artritis psoriasica","espondilitis anquilosante"],
  TRA: ["fractura","luxacion","esguince","artrosis de cadera","artrosis de rodilla","protesis de cadera","protesis de rodilla","hernia discal","escoliosis","osteomielitis","osteosarcoma","menisco","ligamento cruzado","hombro","columna vertebral","traumatismo"],
  GIN: ["embarazo","gestacion","parto","cesarea","preeclampsia","eclampsia","endometriosis","mioma uterino","cancer de cuello uterino","cancer de endometrio","menopausia","anticoncepcion","amenorrea","dismenorrea","ovario poliquistico","placenta previa","aborto","diabetes gestacional","citologia cervical","cancer de ovario"],
  HEM: ["anemia","leucemia","linfoma","trombocitopenia","coagulacion","hemofilia","mieloma multiple","policitemia","trombosis venosa profunda","anticoagulacion","transfusion","hemograma","neutropenia","sindrome mielodisplasico"],
  INF: ["infeccion por vih","tuberculosis pulmonar","sepsis","bacteriemia","antibiotico","fiebre de origen desconocido","hepatitis viral","covid","virus","bacteria","microorganismo","meningitis bacteriana","endocarditis infecciosa","profilaxis antibiotica","resistencia bacteriana"],
  URO: ["prostata","hiperplasia prostatica","cancer de prostata","vejiga","incontinencia urinaria","litiasis urinaria","calculo renal","infeccion urinaria","cistitis","hematuria","disfuncion erectil","testiculo","escroto","varicocele"],
  ALG: ["alergia","alergico","anafilaxia","urticaria","angioedema","rinitis alergica","dermatitis atopica","hipersensibilidad","inmunoterapia alergenos"],
  DER: ["piel","cutaneo","dermatitis","psoriasis","melanoma","carcinoma basocelular","carcinoma epidermoide","eccema","acne","alopecia","urticaria cronica","lesion cutanea","nevus"],
  ANE: ["anestesia","anestesico","sedacion","intubacion","via aerea dificil","bloqueo anestesico","anestesia general","anestesia regional","relajante muscular","anestesia epidural","anestesia raquidea","escala de mallampati","hipertermia maligna","bloqueo neuromuscular"],
  ANP: ["anatomia patologica","biopsia con estudio histologico","inmunohistoquimica","citologia","estudio anatomopatologico","pieza quirurgica","microscopia optica"],
  BIE: ["consentimiento informado","confidencialidad","secreto profesional","eutanasia","testamento vital","comite de etica","capacidad de decision","voluntades anticipadas","objecion de conciencia","limitacion del esfuerzo terapeutico","principio de autonomia","principio de beneficencia","principio de no maleficencia","principio de justicia distributiva"],
  BIQ: ["bioquimica","metabolismo de","enzima","aminoacido","ciclo de krebs","glucolisis","gluconeogenesis","beta oxidacion","fosforilacion oxidativa","cadena respiratoria mitocondrial","glucogenolisis"],
  GEN: ["herencia autosomica","herencia ligada al x","mutacion genetica","cariotipo","cromosoma","arbol genealogico","enfermedad mitocondrial","consanguinidad","sindrome de down","herencia mendeliana","penetrancia incompleta","imprinting genomico","secuenciacion genetica","enfermedad monogenica"],
  MFC: ["atencion primaria","medicina de familia","consulta de primaria","medico de familia","centro de salud"],
  EST: ["sensibilidad y especificidad","valor predictivo","riesgo relativo","odds ratio","intervalo de confianza","estudio de cohortes","estudio caso-control","ensayo clinico aleatorizado","sesgo de","prevalencia","incidencia","curva roc"],
  PREV: ["cribado","prevencion primaria","prevencion secundaria","prevencion terciaria","salud publica","vacunacion","epidemia","pandemia","programa de salud","medicina preventiva","promocion de la salud","enfermedad de declaracion obligatoria","brote epidemico","cuarentena","aislamiento respiratorio"],
  URG: ["urgencias","parada cardiorrespiratoria","reanimacion cardiopulmonar","shock","politraumatizado","intoxicacion por","triaje"],
  FAR: ["farmacocinetica","farmacodinamia","interaccion farmacologica","efecto adverso del farmaco","mecanismo de accion del farmaco","dosis toxica","biodisponibilidad","vida media de eliminacion","union a proteinas plasmaticas","efecto de primer paso","induccion enzimatica","inhibicion enzimatica","citocromo p450","farmacovigilancia","reaccion adversa medicamentosa","profarmaco","aclaramiento renal del farmaco","volumen de distribucion","aclaramiento hepatico","aclaramiento plasmatico","ensayo clinico fase i","cinetica de eliminacion","farmacogenetica"],
  IMN: ["inmunodeficiencia","complemento","anticuerpo monoclonal","hipersensibilidad tipo","autoinmune","linfocito t","linfocito b","hla"],
};

function normalizar(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function clasificar(pregunta) {
  const texto = normalizar(
    [pregunta.enunciado, pregunta.alternativas.A, pregunta.alternativas.B, pregunta.alternativas.C, pregunta.alternativas.D].join(" ")
  );
  const puntuaciones = {};
  for (const [cod, terminos] of Object.entries(TERMINOS)) {
    let score = 0;
    for (const t of terminos) {
      if (texto.includes(normalizar(t))) score++;
    }
    if (score > 0) puntuaciones[cod] = score;
  }
  const ranking = Object.entries(puntuaciones).sort((a, b) => b[1] - a[1]);
  if (ranking.length === 0) return { especialidad_sugerida: null, score: 0, score2: 0, candidatos: [] };
  const [cod1, score1] = ranking[0];
  const score2 = ranking.length > 1 ? ranking[1][1] : 0;
  const confiable = score1 >= 1 && score1 > score2;
  return {
    especialidad_sugerida: confiable ? cod1 : null,
    score: score1,
    score2,
    candidatos: ranking.slice(0, 4).map(([c, s]) => `${c}:${s}`),
  };
}

function main() {
  const [, , entrada, salida] = process.argv;
  if (!entrada || !salida) {
    console.error("Uso: node clasificar-especialidad.js <preguntas.json> <salida.json>");
    process.exit(1);
  }
  const preguntas = JSON.parse(fs.readFileSync(entrada, "utf8"));
  const resultado = preguntas.map((p) => ({ ...p, ...clasificar(p) }));
  fs.writeFileSync(salida, JSON.stringify(resultado, null, 2), "utf8");
  const clasificadas = resultado.filter((p) => p.especialidad_sugerida).length;
  console.log(`OK: ${clasificadas}/${resultado.length} clasificadas automáticamente -> ${salida}`);
}

main();
