// Taxonomía del CONAREM Hub: las 5 especialidades troncales divididas en "contenidos" (subáreas) y temas,
// siguiendo el temario/bibliografía oficial aprobado por CONAREM (Acta 11/2025, INS).
//
//   area -> subareas[] -> { id, nombre, ref (bibliografía), edital[] (ítems oficiales del temario), temas[] }
//   tema -> { id, nombre, kw[] }   kw: palabras clave normalizadas (minúsculas, sin tildes). Coinciden como
//   prefijo de palabra ("hipertiroid" encuentra "hipertiroidismo"); terminada en "$" exige palabra completa.
//
// Lo usa scripts/clasificar-preguntas.js para asignar cada pregunta a un contenido/tema, y
// scripts/generar-hub-data.js para el temario, el banco por contenido y el calendario.

const AREAS = {
  MI: {
    nombre: 'Medicina Interna',
    libro: 'Harrison. Principios de Medicina Interna, 21ª ed. (McGraw Hill, 2022)',
    subareas: [
      {
        id: 'CARDIO', nombre: 'Cardiología', ref: 'Harrison, Parte 6 — Trastornos del aparato cardiovascular',
        edital: ['Estudio del paciente con posibles problemas cardiovasculares', 'Exploración física del aparato cardiovascular',
          'Imágenes no invasivas: ecocardiografía, RM y TC', 'Cateterismo cardiaco y angiografía coronaria', 'Electrocardiografía',
          'Bradiarritmias: nódulo sinoauricular y auriculoventricular', 'Taquiarritmias supraventriculares, taquicardia sinusal y TPSV',
          'Fibrilación auricular', 'Arritmias ventriculares: TV sostenida, TV polimorfa y FV', 'Insuficiencia cardiaca: fisiopatología, diagnóstico y tratamiento',
          'Miocardiopatía y miocarditis', 'Valvulopatías: aórtica, mitral, tricuspídea, pulmonar y múltiple', 'Enfermedades del pericardio',
          'Cardiopatía isquémica', 'SCA sin elevación del ST', 'IAM con elevación del ST', 'Hipertensión arterial', 'Enfermedad renovascular',
          'Enfermedades de la aorta', 'Enfermedades arteriales de las extremidades', 'Enfermedad venosa crónica y linfedema',
          'Trombosis venosa profunda y tromboembolia pulmonar', 'Hipertensión pulmonar'],
        temas: [
          { id: 'ISQ', nombre: 'Cardiopatía isquémica y SCA', kw: ['infarto', 'iam$', 'iamcest', 'iamsest', 'sindrome coronario', 'angina', 'troponina', 'elevacion del st', 'elevacion del segmento st', 'supradesnivel', 'cardiopatia isquemica', 'coronari', 'trombolis', 'fibrinolis', 'angioplastia', 'revascularizacion', 'killip', 'nitroglicerina'] },
          { id: 'ICC', nombre: 'Insuficiencia cardiaca, miocardiopatías y miocarditis', kw: ['insuficiencia cardiaca', 'fraccion de eyeccion', 'edema agudo de pulmon', 'edema pulmonar', 'bnp', 'sacubitril', 'miocardiopatia', 'cardiomiopatia', 'miocarditis', 'cardiomegalia', 'framingham', 'nyha'] },
          { id: 'ARRIT', nombre: 'Arritmias y ECG', kw: ['fibrilacion auricular', 'flutter', 'taquicardia', 'bradicardia', 'bradiarritmia', 'taquiarritmia', 'bloqueo auriculoventricular', 'bloqueo av', 'bloqueo de rama', 'arritmia', 'wolff', 'preexcitacion', 'qt largo', 'marcapaso', 'cardioversion', 'torsade', 'fibrilacion ventricular', 'enfermedad del nodo sinusal', 'electrocardiogra', 'ecg$', 'onda p$', 'intervalo pr', 'qrs', 'adenosina', 'amiodarona', 'chads'] },
          { id: 'HTA', nombre: 'Hipertensión arterial', kw: ['hipertension arterial', 'hipertenso', 'presion arterial', 'crisis hipertensiva', 'emergencia hipertensiva', 'urgencia hipertensiva', 'renovascular', 'antihipertensiv', 'enalapril', 'losartan', 'amlodipin', 'hidroclorotiazida', 'tension arterial'] },
          { id: 'VALV', nombre: 'Valvulopatías y endocarditis (clínica)', kw: ['estenosis aortica', 'insuficiencia aortica', 'estenosis mitral', 'insuficiencia mitral', 'valvul', 'soplo', 'tricuspid', 'prolapso mitral', 'protesis valvular', 'chasquido de apertura'] },
          { id: 'PERI', nombre: 'Pericardio', kw: ['pericardi', 'taponamiento', 'pulso paradojico', 'frote pericardico', 'beck'] },
          { id: 'VASC', nombre: 'Aorta, arterias periféricas, TVP/TEP e hipertensión pulmonar', kw: ['trombosis venosa profunda', 'tromboembolia pulmonar', 'tromboembolismo pulmonar', 'embolia pulmonar', 'tep$', 'tvp$', 'dimero d', 'hipertension pulmonar', 'diseccion aortica', 'aneurisma de aorta', 'aneurisma aortico', 'enfermedad arterial periferica', 'claudicacion', 'indice tobillo', 'linfedema', 'insuficiencia venosa', 'wells'] }
        ]
      },
      {
        id: 'NEUMO', nombre: 'Neumología', ref: 'Harrison, Parte 7 — Trastornos del aparato respiratorio',
        edital: ['Estudio del paciente con enfermedad respiratoria', 'Trastornos de la función respiratoria', 'Procedimientos diagnósticos en enfermedades respiratorias',
          'Neumonitis por hipersensibilidad e infiltrados pulmonares con eosinofilia', 'Enfermedad pulmonar ocupacional y ambiental', 'Bronquiectasias',
          'Enfermedad pulmonar obstructiva crónica', 'Enfermedad pulmonar intersticial', 'Trastornos de la pleura', 'Apnea del sueño'],
        temas: [
          { id: 'OBST', nombre: 'EPOC, asma del adulto y bronquiectasias', kw: ['epoc$', 'enfermedad pulmonar obstructiva', 'enfisema', 'bronquitis cronica', 'bronquiectasia', 'asma', 'broncodilatador', 'tiotropio', 'espirometr', 'vef1', 'fev1', 'capacidad vital', 'gold$', 'oxigenoterapia domiciliaria'] },
          { id: 'INTER', nombre: 'Intersticiales, ocupacionales e hipersensibilidad', kw: ['intersticial', 'fibrosis pulmonar', 'neumonitis', 'neumoconiosis', 'silicosis', 'asbest', 'ocupacional', 'eosinofilia pulmonar', 'loffler', 'sarcoidosis'] },
          { id: 'PLEURA', nombre: 'Pleura y apnea del sueño', kw: ['derrame pleural', 'pleura', 'light$', 'exudado', 'trasudado', 'toracocentesis', 'empiema', 'neumotorax', 'apnea del sueno', 'apnea obstructiva', 'polisomnograf'] },
          { id: 'FUNC', nombre: 'Función respiratoria y diagnóstico', kw: ['insuficiencia respiratoria', 'hipoxemia', 'gradiente alveolo', 'gasometr', 'gases arteriales', 'broncoscop', 'difusion de co', 'dlco', 'hipercapnia'] }
        ]
      },
      {
        id: 'CRIT', nombre: 'Medicina crítica (shock, sepsis, paro)', ref: 'Harrison, Parte 8 — Medicina de cuidados intensivos',
        edital: ['Estudio del paciente con enfermedad crítica', 'Síndrome de insuficiencia respiratoria aguda (SDRA)', 'Estudio del paciente en estado de choque',
          'Septicemia y choque séptico', 'Choque cardiogénico y edema pulmonar', 'Colapso cardiovascular, paro cardiaco y muerte súbita',
          'Enfermedades del sistema nervioso en la UCI'],
        temas: [
          { id: 'SEPSIS', nombre: 'Sepsis y choque', kw: ['sepsis', 'septic', 'choque', 'shock', 'qsofa', 'sofa$', 'vasopresor', 'noradrenalina', 'norepinefrina', 'lactato', 'hipoperfusion'] },
          { id: 'SDRA', nombre: 'SDRA y ventilación mecánica', kw: ['sdra', 'distres respiratorio agudo', 'dificultad respiratoria aguda', 'ventilacion mecanica', 'peep', 'volumen corriente', 'intubacion', 'pao2/fio2'] },
          { id: 'PARO', nombre: 'Paro cardiaco y reanimación', kw: ['paro cardi', 'paro cardiorrespiratorio', 'reanimacion cardiopulmonar', 'rcp$', 'muerte subita', 'desfibrila', 'actividad electrica sin pulso', 'asistolia'] }
        ]
      },
      {
        id: 'INFECTO', nombre: 'Enfermedades infecciosas', ref: 'Harrison, Parte 5 — Enfermedades infecciosas',
        edital: ['Estudio del paciente con enfermedad infecciosa y del paciente febril', 'Vacunación del adulto y salud del viajero', 'Cambio climático y enfermedades infecciosas',
          'Neumonía y absceso pulmonar', 'Endocarditis infecciosa', 'Infecciones de piel, músculo y tejidos blandos', 'Artritis infecciosa y osteomielitis',
          'Infecciones y abscesos intraabdominales', 'Diarreas infecciosas, intoxicación alimentaria y C. difficile', 'Infecciones urinarias, pielonefritis y prostatitis',
          'Infecciones de transmisión sexual', 'Encefalitis, meningitis aguda y crónica, absceso cerebral', 'Tétanos y botulismo',
          'Salmonelosis, shigelosis, cólera y brucelosis', 'Tuberculosis, lepra y antimicobacterianos', 'Sífilis y leptospirosis',
          'Infecciones respiratorias virales, COVID-19 y gripe', 'VIH/sida', 'Varicela-zóster, Epstein-Barr, CMV y herpesvirus 6, 7 y 8',
          'Micosis: candidiasis, coccidioidomicosis, aspergilosis, mucormicosis', 'Paludismo, leishmaniosis, Chagas y toxoplasmosis',
          'Protozoos intestinales, helmintos y cestodos', 'Mordeduras', 'Infecciones asociadas a la atención de salud y en trasplantados',
          'Antimicrobianos y resistencia bacteriana', 'Infecciones estafilocócicas y estreptocócicas'],
        temas: [
          { id: 'RESP', nombre: 'Neumonía, gripe y COVID-19', kw: ['neumonia', 'absceso pulmonar', 'gripe', 'influenza', 'covid', 'sars-cov', 'coronavirus', 'curb', 'legionel', 'neumococ', 'mycoplasma'] },
          { id: 'TB', nombre: 'Tuberculosis y lepra', kw: ['tuberculo', 'mycobacter', 'micobacter', 'bacilo de koch', 'baciloscop', 'isoniazida', 'rifampicina', 'pirazinamida', 'etambutol', 'lepra', 'hansen', 'ppd$', 'tuberculina'] },
          { id: 'VIH', nombre: 'VIH e ITS', kw: ['vih', 'sida$', 'cd4', 'antirretrovir', 'tarv$', 'sifilis', 'treponema', 'vdrl', 'chancro', 'gonorrea', 'gonococ', 'clamidia', 'chlamydia', 'uretritis', 'transmision sexual', 'its$', 'pneumocystis'] },
          { id: 'SNC', nombre: 'Infecciones del SNC', kw: ['meningitis', 'encefalitis', 'absceso cerebral', 'empiema subdural', 'liquido cefalorraquideo', 'lcr$', 'puncion lumbar', 'meningococ', 'rigidez de nuca', 'kernig', 'brudzinski'] },
          { id: 'ENDOC', nombre: 'Endocarditis infecciosa', kw: ['endocarditis', 'duke', 'vegetacion', 'janeway', 'osler'] },
          { id: 'PIELOST', nombre: 'Piel, partes blandas, hueso y articulación', kw: ['celulitis', 'erisipela', 'fascitis', 'impetigo', 'piomiositis', 'osteomielitis', 'artritis septica', 'artritis infecciosa', 'gangrena gaseosa', 'mordedura', 'pie diabetico infectado'] },
          { id: 'GI', nombre: 'Diarreas e infecciones intraabdominales', kw: ['diarrea', 'gastroenteritis', 'clostridi', 'difficile', 'colitis pseudomembranosa', 'salmonel', 'tifoidea', 'shigel', 'colera', 'vibrio', 'intoxicacion alimentaria', 'escherichia', 'campylobacter', 'absceso intraabdominal', 'absceso hepatico'] },
          { id: 'ITU', nombre: 'Infección urinaria', kw: ['infeccion urinaria', 'infeccion de vias urinarias', 'itu$', 'pielonefritis', 'cistitis', 'prostatitis', 'bacteriuria', 'urocultivo'] },
          { id: 'TROP', nombre: 'Zoonosis y enfermedades tropicales', kw: ['leptospir', 'brucel', 'chagas', 'trypanosoma', 'tripanosom', 'leishman', 'paludismo', 'malaria', 'plasmodium', 'dengue', 'fiebre amarilla', 'chikungunya', 'zika', 'hantavirus', 'rabia', 'toxoplasm', 'arbovirus'] },
          { id: 'HERPES', nombre: 'Herpesvirus (VZV, VEB, CMV)', kw: ['varicela', 'zoster', 'herpes', 'epstein', 'mononucleosis', 'citomegalovirus', 'cmv$', 'herpesvirus'] },
          { id: 'MICO', nombre: 'Micosis', kw: ['candid', 'aspergil', 'mucor', 'coccidio', 'histoplasm', 'paracoccidio', 'criptococ', 'cryptococ', 'micosis', 'antifungic', 'fluconazol', 'anfotericina', 'voriconazol'] },
          { id: 'PARAS', nombre: 'Parasitosis intestinales y helmintos', kw: ['helmint', 'cestod', 'cisticerc', 'teniasis', 'taenia', 'hidatid', 'equinococ', 'ameb', 'giardia', 'tricomon', 'estrongiloid', 'strongyloid', 'ascaris', 'protozo', 'albendazol', 'metronidazol'] },
          { id: 'TOX', nombre: 'Tétanos y botulismo', kw: ['tetanos', 'tetanica', 'botulis', 'clostridium tetani', 'trismus'] },
          { id: 'ATB', nombre: 'Antimicrobianos, resistencia, IAAS y vacunas del adulto', kw: ['antibiotic', 'antimicrobian', 'betalactam', 'vancomicina', 'carbapenem', 'resistencia bacteriana', 'meticilina', 'sarm$', 'mrsa', 'blee', 'estafilococ', 'staphylococ', 'estreptococ', 'streptococ', 'nosocomial', 'asociada a la atencion', 'trasplant', 'neutropenia febril', 'vacuna', 'viajero', 'viaje', 'fiebre de origen desconocido'] }
        ]
      },
      {
        id: 'HEMATO', nombre: 'Hematología', ref: 'Harrison, Parte 4 (secc. 2–4) — Hematopoyesis, hemostasia y trombosis',
        edital: ['Ferropenia y otras anemias hipoproliferativas', 'Trastornos de la hemoglobina', 'Anemias megaloblásticas', 'Anemias hemolíticas',
          'Anemia por hemorragia aguda', 'Insuficiencia de la médula ósea: anemia aplásica y mielodisplasia', 'Policitemia vera y otras neoplasias mieloproliferativas',
          'Leucemia mieloide aguda', 'Leucemia mieloide crónica', 'Trastornos de las células plasmáticas', 'Biología de la transfusión y tratamiento transfusional',
          'Trastornos de las plaquetas y la pared vascular', 'Trastornos de la coagulación', 'Trombosis arterial y venosa',
          'Antiagregantes plaquetarios, anticoagulantes y fibrinolíticos'],
        temas: [
          { id: 'ANEM', nombre: 'Anemias', kw: ['anemia', 'ferropen', 'ferropriva', 'ferritina', 'hierro serico', 'sulfato ferroso', 'talasemia', 'drepanocit', 'falciforme', 'megaloblast', 'b12', 'cobalamina', 'acido folico', 'folato', 'hemolis', 'hemolitica', 'esferocit', 'coombs', 'reticulocit', 'hemoglobinuria', 'aplasica', 'pancitopenia'] },
          { id: 'NEOH', nombre: 'Leucemias, mieloma y neoplasias mieloides', kw: ['leucemia', 'mieloma', 'gammapatia', 'plasmocit', 'proteina de bence', 'componente monoclonal', 'linfoma', 'hodgkin', 'policitemia', 'trombocitemia', 'mielofibrosis', 'mieloproliferativ', 'mielodisplas', 'bcr-abl', 'filadelfia', 'imatinib', 'blastos'] },
          { id: 'HEMOST', nombre: 'Hemostasia, trombosis y anticoagulación', kw: ['plaqueta', 'trombocitopenia', 'purpura', 'hemofilia', 'von willebrand', 'coagulacion', 'coagulopatia', 'anticoagul', 'heparina', 'warfarina', 'acenocumarol', 'rivaroxaban', 'apixaban', 'dabigatran', 'inr$', 'tiempo de protrombina', 'ttpa', 'trombofilia', 'factor v leiden', 'antiagregante', 'aspirina', 'clopidogrel', 'cid$', 'coagulacion intravascular', 'fibrinolitico'] },
          { id: 'TRANSF', nombre: 'Transfusión', kw: ['transfusion', 'hemoderivado', 'concentrado de hematies', 'plasma fresco', 'crioprecipitado', 'reaccion transfusional', 'grupo sanguineo'] }
        ]
      },
      {
        id: 'ONCO', nombre: 'Oncología', ref: 'Harrison, Parte 4 (secc. 1) — Oncología',
        edital: ['Estudio del paciente con cáncer', 'Prevención y detección oportuna del cáncer', 'Infecciones en el paciente con cáncer',
          'Urgencias oncológicas', 'Síndromes paraneoplásicos endocrinos y hematológicos', 'Síndromes neurológicos paraneoplásicos y encefalitis autoinmunitarias'],
        temas: [
          { id: 'GEN', nombre: 'Estudio, prevención y detección del cáncer', kw: ['cancer', 'neoplasia maligna', 'tumor maligno', 'metastas', 'quimioterap', 'radioterap', 'estadificacion', 'tnm$', 'marcador tumoral', 'tamizaje de cancer', 'deteccion temprana', 'ecog', 'karnofsky', 'carcinoma'] },
          { id: 'URG', nombre: 'Urgencias oncológicas, infecciones y síndromes paraneoplásicos', kw: ['lisis tumoral', 'compresion medular', 'vena cava superior', 'paraneoplas', 'hipercalcemia maligna', 'hipercalcemia tumoral', 'siadh', 'eaton', 'encefalitis autoinmun', 'neutropenia febril', 'neutropenic'] }
        ]
      },
      {
        id: 'NEFRO', nombre: 'Nefrología, medio interno y ácido-base', ref: 'Harrison, Parte 9 — Trastornos del riñón y vías urinarias',
        edital: ['Estudio del paciente con enfermedad renal o de vías urinarias', 'Lesión renal aguda', 'Enfermedad renal crónica', 'Diálisis',
          'Trasplante renal', 'Enfermedades glomerulares', 'Nefrolitiasis', 'Trastornos hidroelectrolíticos', 'Hipercalcemia e hipocalcemia', 'Acidosis y alcalosis'],
        temas: [
          { id: 'LRA', nombre: 'Lesión renal aguda y ERC', kw: ['lesion renal aguda', 'insuficiencia renal', 'enfermedad renal cronica', 'erc$', 'dialisis', 'hemodialisis', 'creatinina', 'filtrado glomerular', 'tasa de filtracion', 'necrosis tubular', 'prerrenal', 'azoemia', 'uremia', 'uremico', 'trasplante renal', 'kdigo'] },
          { id: 'GLOM', nombre: 'Glomerulopatías', kw: ['glomerul', 'nefrotico', 'nefritico', 'proteinuria', 'hematuria', 'cilindros', 'nefropatia por iga', 'berger', 'membranosa', 'cambios minimos', 'hialinosis', 'goodpasture'] },
          { id: 'LITO', nombre: 'Nefrolitiasis', kw: ['litiasis renal', 'nefrolitiasis', 'calculo renal', 'calculos renales', 'colico renal', 'urolitiasis', 'oxalato'] },
          { id: 'HE', nombre: 'Agua, sodio, potasio y calcio', kw: ['hiponatremia', 'hipernatremia', 'sodio serico', 'hipopotasemia', 'hiperpotasemia', 'hipokalemia', 'hiperkalemia', 'potasio', 'hipercalcemia', 'hipocalcemia', 'hipomagnesemia', 'hipofosfatemia', 'osmolaridad', 'osmolalidad', 'diabetes insipida', 'secrecion inadecuada', 'hidroelectrolit'] },
          { id: 'AB', nombre: 'Trastornos ácido-base', kw: ['acidosis', 'alcalosis', 'anion gap', 'brecha anionica', 'hiato anionico', 'bicarbonato', 'acido-base', 'acido base', 'winter'] }
        ]
      },
      {
        id: 'DIGEST', nombre: 'Gastroenterología y hepatología', ref: 'Harrison, Parte 10 — Trastornos del aparato digestivo',
        edital: ['Estudio del paciente con enfermedad del tubo digestivo', 'Enfermedades del esófago', 'Úlcera péptica y trastornos relacionados',
          'Trastornos de la absorción', 'Enfermedad intestinal inflamatoria', 'Síndrome de colon irritable', 'Estudio del paciente con hepatopatía y función hepática',
          'Hiperbilirrubinemias', 'Hepatitis viral aguda', 'Hepatitis por tóxicos y fármacos', 'Hepatitis crónica', 'Hepatopatía alcohólica',
          'Hígado graso no alcohólico (EHNA)', 'Cirrosis y sus complicaciones', 'Estudio del paciente con enfermedad pancreática', 'Pancreatitis aguda y crónica'],
        temas: [
          { id: 'ESOEST', nombre: 'Esófago, úlcera péptica y hemorragia digestiva', kw: ['esofag', 'reflujo gastroesofagico', 'erge$', 'disfagia', 'acalasia', 'ulcera peptica', 'ulcera gastrica', 'ulcera duodenal', 'helicobacter', 'dispepsia', 'gastritis', 'hemorragia digestiva', 'melena', 'hematemesis', 'inhibidor de la bomba', 'omeprazol'] },
          { id: 'INT', nombre: 'Malabsorción, EII y colon irritable', kw: ['malabsorcion', 'celiac', 'gluten', 'crohn', 'colitis ulcerosa', 'enfermedad inflamatoria intestinal', 'colon irritable', 'roma iv', 'sobrecrecimiento bacteriano', 'esteatorrea'] },
          { id: 'HEP', nombre: 'Hepatitis e hiperbilirrubinemias', kw: ['hepatitis', 'hbsag', 'anti-hbc', 'hepatotox', 'paracetamol', 'transaminasa', 'bilirrubina', 'ictericia', 'gilbert', 'crigler', 'dubin', 'esteatosis', 'higado graso', 'esteatohepatitis', 'hepatopatia', 'alcoholica', 'autoinmune hepat', 'colangitis biliar primaria'] },
          { id: 'CIRR', nombre: 'Cirrosis y complicaciones', kw: ['cirrosis', 'ascitis', 'encefalopatia hepatica', 'varices esofagicas', 'hipertension portal', 'peritonitis bacteriana espontanea', 'child', 'meld', 'hepatorrenal', 'gradiente de albumina', 'paracentesis'] },
          { id: 'PANC', nombre: 'Páncreas', kw: ['pancrea', 'amilasa', 'lipasa', 'ranson', 'balthazar', 'atlanta'] }
        ]
      },
      {
        id: 'REUMA', nombre: 'Reumatología e inmunología', ref: 'Harrison, Parte 11 y 15 — Trastornos inmunitarios, reumáticos y articulares',
        edital: ['Lupus eritematoso sistémico', 'Síndrome antifosfolipídico', 'Artritis reumatoide', 'Fiebre reumática aguda', 'Esclerosis sistémica',
          'Síndrome de Sjögren', 'Espondiloartritis', 'Síndromes vasculíticos', 'Polimiositis, dermatomiositis y miositis por cuerpos de inclusión',
          'Sarcoidosis', 'Enfermedad relacionada con IgG4', 'Valoración de los trastornos articulares', 'Osteoartritis', 'Gota y artropatías por cristales', 'Fibromialgia'],
        temas: [
          { id: 'AUTO', nombre: 'LES, AR y conectivopatías', kw: ['lupus', 'antifosfolip', 'artritis reumatoide', 'factor reumatoide', 'anti-ccp', 'esclerodermia', 'esclerosis sistemica', 'sjogren', 'polimiositis', 'dermatomiositis', 'miositis', 'antinuclear', 'ana$', 'anti-dna', 'anti-ro', 'raynaud', 'metotrexato', 'hidroxicloroquina', 'igg4', 'conectivopatia'] },
          { id: 'VASCU', nombre: 'Vasculitis y fiebre reumática', kw: ['vasculitis', 'arteritis', 'granulomatosis', 'poliangeitis', 'anca$', 'takayasu', 'poliarteritis', 'behcet', 'fiebre reumatica', 'jones'] },
          { id: 'ART', nombre: 'Espondiloartritis, artrosis, gota y fibromialgia', kw: ['espondil', 'anquilosante', 'hla-b27', 'sacroileitis', 'artritis reactiva', 'psoriasica', 'artrosis', 'osteoartritis', 'osteoartrosis', 'gota$', 'gotosa', 'acido urico', 'hiperuricemia', 'alopurinol', 'colchicina', 'condrocalcinosis', 'pirofosfato', 'fibromialgia', 'liquido sinovial', 'artrocentesis', 'monoartritis', 'poliartritis'] }
        ]
      },
      {
        id: 'ENDO', nombre: 'Endocrinología y metabolismo', ref: 'Harrison, Parte 12 — Endocrinología y metabolismo',
        edital: ['Enfoque del paciente con trastornos endocrinos', 'Hipopituitarismo', 'Trastornos de la glándula tiroides', 'Trastornos de la corteza suprarrenal',
          'Feocromocitoma', 'Neoplasias endocrinas múltiples', 'Síndromes poliendocrinos autoinmunitarios', 'Obesidad', 'Diabetes mellitus: diagnóstico, clasificación y fisiopatología',
          'Diabetes mellitus: control y tratamiento', 'Diabetes mellitus: complicaciones', 'Hipoglucemia', 'Trastornos de las lipoproteínas', 'Síndrome metabólico',
          'Paratiroides y homeostasia del calcio', 'Osteoporosis', 'Hemocromatosis'],
        temas: [
          { id: 'DM', nombre: 'Diabetes mellitus e hipoglucemia', kw: ['diabet', 'insulina', 'metformina', 'glucemia', 'glucosa en ayunas', 'hemoglobina glicosilada', 'hemoglobina glucosilada', 'hba1c', 'cetoacidosis', 'hiperosmolar', 'hipoglucemia', 'sulfonilurea', 'glibenclamida', 'sglt2', 'glp-1', 'retinopatia', 'nefropatia diabetica', 'neuropatia diabetica'] },
          { id: 'TIROID', nombre: 'Tiroides', kw: ['tiroid', 'hipotiroid', 'hipertiroid', 'tirotoxicosis', 'graves', 'basedow', 'hashimoto', 'levotiroxina', 'tsh$', 't4 libre', 'bocio', 'metimazol', 'propiltiouracilo', 'mixedema', 'tormenta tiroidea'] },
          { id: 'SUPRA', nombre: 'Suprarrenal, hipófisis y MEN', kw: ['suprarrenal', 'adrenal', 'cushing', 'addison', 'cortisol', 'aldosteron', 'hiperaldosteronismo', 'conn$', 'feocromocitoma', 'catecolamina', 'metanefrina', 'hipofis', 'prolactin', 'acromegalia', 'hipopituitarismo', 'sheehan', 'neoplasia endocrina multiple', 'men 1', 'men 2', 'poliendocrin'] },
          { id: 'METAB', nombre: 'Obesidad, lípidos y síndrome metabólico', kw: ['obesidad', 'indice de masa corporal', 'imc$', 'dislipidemia', 'colesterol', 'ldl$', 'hdl$', 'triglicerid', 'estatina', 'atorvastatina', 'sindrome metabolico', 'hipercolesterolemia', 'hemocromatosis'] },
          { id: 'CALCIO', nombre: 'Paratiroides, calcio y osteoporosis', kw: ['paratiroid', 'paratohormona', 'pth$', 'hiperparatiroidismo', 'osteoporosis', 'bifosfonat', 'alendronato', 'densitometr', 'vitamina d', 'osteomalacia', 'paget'] }
        ]
      },
      {
        id: 'NEURO', nombre: 'Neurología', ref: 'Harrison, Parte 13 — Trastornos neurológicos',
        edital: ['Estudio del paciente con enfermedad neurológica', 'Convulsiones y epilepsia', 'Enfermedades cerebrovasculares', 'Migraña y cefaleas primarias',
          'Alzheimer, demencia frontotemporal, vascular y por cuerpos de Lewy', 'Enfermedad de Parkinson', 'Temblor, corea y otros trastornos del movimiento',
          'Neuralgia del trigémino, parálisis de Bell y pares craneales', 'Esclerosis múltiple y enfermedades desmielinizantes',
          'Síndrome de Guillain-Barré y neuropatías inmunitarias', 'Miastenia grave y enfermedades de la unión neuromuscular'],
        temas: [
          { id: 'GEN', nombre: 'Semiología neurológica, coma y encefalopatías', kw: ['coma$', 'estupor', 'cheyne', 'wernicke', 'korsakoff', 'tiamina', 'encefalopatia', 'pupila', 'semiologia neurologica', 'muerte encefalica', 'sindrome medular'] },
          { id: 'ACV', nombre: 'Enfermedad cerebrovascular', kw: ['accidente cerebrovascular', 'acv$', 'ictus', 'ataque isquemico transitorio', 'ait$', 'infarto cerebral', 'hemorragia intracerebral', 'hemorragia subaracnoidea', 'trombolisis', 'alteplasa', 'nihss', 'hemiparesia', 'afasia', 'arteria cerebral media'] },
          { id: 'EPI', nombre: 'Epilepsia y convulsiones', kw: ['convulsi', 'epilep', 'crisis focal', 'crisis tonico', 'estado epileptico', 'status epilepticus', 'fenitoina', 'valproato', 'levetiracetam', 'carbamazepina', 'ausencias'] },
          { id: 'CEF', nombre: 'Cefaleas', kw: ['migrana', 'cefalea', 'cluster', 'triptan', 'aura$'] },
          { id: 'DEGEN', nombre: 'Demencias y trastornos del movimiento', kw: ['alzheimer', 'demencia', 'deterioro cognitivo', 'cuerpos de lewy', 'frontotemporal', 'parkinson', 'levodopa', 'temblor', 'corea', 'huntington', 'distonia', 'bradicinesia'] },
          { id: 'NMUSC', nombre: 'Desmielinizantes, neuropatías, miastenia y pares craneales', kw: ['esclerosis multiple', 'desmielin', 'neuritis optica', 'guillain', 'polineuropatia', 'polirradiculo', 'miastenia', 'acetilcolina', 'piridostigmina', 'neuralgia del trigemino', 'paralisis de bell', 'paralisis facial', 'par craneal', 'pares craneales', 'esclerosis lateral'] }
        ]
      },
      {
        id: 'TOXI', nombre: 'Toxicología', ref: 'Harrison, Parte 14 — Intoxicaciones y sobredosis',
        edital: ['Intoxicaciones y sobredosis de fármacos y drogas'],
        temas: [
          { id: 'INTOX', nombre: 'Intoxicaciones y antídotos', kw: ['intoxicacion', 'sobredosis', 'organofosforad', 'carbamato', 'antidoto', 'naloxona', 'flumazenil', 'n-acetilcisteina', 'monoxido de carbono', 'metanol', 'etilenglicol', 'salicilat', 'toxindrome', 'carbon activado', 'lavado gastrico', 'atropina', 'pralidoxima', 'ofidi', 'emponzonamiento'] }
        ]
      },
      {
        id: 'GENERAL', nombre: 'Profesión médica, ética y cuidados paliativos', ref: 'Harrison, Parte 1 — La profesión médica',
        edital: ['La práctica de la medicina clínica', 'Toma de decisiones en medicina clínica', 'Seguridad y calidad en la atención de la salud',
          'Aspectos éticos de la medicina clínica', 'Cuidados paliativos y al final de la vida'],
        temas: [
          { id: 'ETICA', nombre: 'Ética, decisiones clínicas y paliativos', kw: ['etica', 'bioetica', 'consentimiento', 'autonomia', 'beneficencia', 'paliativ', 'final de la vida', 'seguridad del paciente', 'error medico', 'evento adverso', 'toma de decisiones', 'medicina basada en', 'sensibilidad', 'especificidad', 'valor predictivo', 'probabilidad pretest', 'cociente de probabilidad', 'razon de verosimilitud'] }
        ]
      }
    ]
  },

  PED: {
    nombre: 'Pediatría',
    libro: 'Nelson. Tratado de Pediatría, 22ª ed. (Elsevier, 2023) + Libro Rojo AAP (vacunas) + manuales del MSPBS',
    subareas: [
      {
        id: 'NEO', nombre: 'Neonatología', ref: 'Nelson, Parte XI — El feto y el recién nacido · Manual de Atención Neonatal MSPBS 2016',
        edital: ['Recién nacido sano: peso, talla, PC y características por sistemas', 'Atención inmediata del RN: Apgar, examen físico y pesquisa de malformaciones (atresia de coanas, esófago, ano imperforado, displasia de cadera)',
          'Síndrome de dificultad respiratoria del RN: membrana hialina, aspiración meconial, taquipnea transitoria, neumonía connatal',
          'Recién nacido asfixiado y encefalopatía hipóxico-isquémica', 'Recién nacido prematuro: clasificación, trastornos inmediatos y tardíos',
          'Sepsis neonatal precoz y tardía', 'Complejo TORCHS', 'Enterocolitis necrotizante', 'Meningitis neonatal',
          'Hiperbilirrubinemia indirecta: ictericia fisiológica y enfermedad hemolítica del RN', 'Hiperbilirrubinemia directa: atresia de vías biliares',
          'Alteraciones metabólicas del RN: hipoglucemia, hipocalcemia, hipomagnesemia, hipofosfatemia',
          'Reanimación neonatal: vía aérea, VPP, masaje, intubación, drogas y cuidados post-reanimación'],
        temas: [
          { id: 'RNSANO', nombre: 'RN sano, atención inmediata y malformaciones', kw: ['recien nacido sano', 'atencion inmediata', 'apgar', 'capurro', 'ballard', 'edad gestacional', 'peso al nacer', 'bajo peso al nacer', 'pequeno para la edad', 'grande para la edad', 'atresia de coanas', 'atresia esofagica', 'atresia de esofago', 'ano imperforado', 'imperforacion anal', 'displasia de cadera', 'displasia del desarrollo de la cadera', 'ortolani', 'barlow', 'cefalohematoma', 'caput', 'cordon umbilical', 'onfalitis', 'madre canguro', 'contacto piel', 'eritema toxico', 'reflejo de moro', 'vitamina k'] },
          { id: 'RESPN', nombre: 'Dificultad respiratoria neonatal', kw: ['membrana hialina', 'surfactante', 'taquipnea transitoria', 'aspiracion meconial', 'meconio', 'neumonia connatal', 'dificultad respiratoria del recien nacido', 'silverman', 'displasia broncopulmonar', 'hipertension pulmonar persistente'] },
          { id: 'ASFIX', nombre: 'Asfixia y reanimación neonatal', kw: ['asfixia', 'encefalopatia hipoxico', 'hipoxico isquemica', 'sarnat', 'reanimacion neonatal', 'ventilacion a presion positiva', 'sala de partos', 'masaje cardiaco', 'compresiones toracicas', 'neonato deprimido', 'recien nacido deprimido', 'hipotermia terapeutica'] },
          { id: 'PREM', nombre: 'Prematurez', kw: ['prematur', 'pretermino', 'muy bajo peso', 'retinopatia del prematuro', 'hemorragia intraventricular', 'ductus'] },
          { id: 'INFN', nombre: 'Infecciones neonatales (sepsis, TORCH, ECN)', kw: ['sepsis neonatal', 'sepsis precoz', 'sepsis tardia', 'torch', 'sifilis congenita', 'toxoplasmosis congenita', 'rubeola congenita', 'citomegalovirus congenito', 'herpes neonatal', 'enterocolitis necrotizante', 'neumatosis', 'meningitis neonatal', 'estreptococo del grupo b', 'streptococcus agalactiae', 'listeria'] },
          { id: 'ICT', nombre: 'Ictericia neonatal', kw: ['ictericia', 'hiperbilirrubinemia', 'fototerapia', 'kernicterus', 'exanguinotransfusion', 'exanguino', 'enfermedad hemolitica del recien nacido', 'incompatibilidad', 'atresia de vias biliares', 'colestasis neonatal', 'zonas de kramer', 'kramer'] },
          { id: 'METN', nombre: 'Alteraciones metabólicas del RN', kw: ['hipoglucemia neonatal', 'hipocalcemia neonatal', 'hipomagnesemia', 'hijo de madre diabetica', 'policitemia neonatal'] }
        ]
      },
      {
        id: 'SANO', nombre: 'Niño sano: crecimiento y desarrollo', ref: 'Nelson, Parte II — Crecimiento, desarrollo y conducta · Manual de Evaluación Nutricional MSPBS 2024',
        edital: ['Crecimiento y desarrollo: etapas intrauterinas y postnatal', 'Control del niño sano', 'Malformaciones genéticas: Down, Pierre Robin, Turner, Klinefelter', 'Fortalecimiento del vínculo madre-hijo'],
        temas: [
          { id: 'CREC', nombre: 'Crecimiento y desarrollo psicomotor', kw: ['crecimiento', 'desarrollo psicomotor', 'hitos del desarrollo', 'hito', 'perimetro cefalico', 'fontanela', 'denticion', 'pubertad', 'tanner', 'talla baja', 'velocidad de crecimiento', 'curva de crecimiento', 'percentil', 'sonrisa social', 'sedestacion', 'marcha', 'camina solo', 'lenguaje', 'balbuceo', 'control del nino sano', 'pinza'] },
          { id: 'GEN', nombre: 'Genética y síndromes', kw: ['sindrome de down', 'trisomia', 'turner', 'klinefelter', 'pierre robin', 'cariotipo', 'genetic', 'cromosom', 'dismorf'] }
        ]
      },
      {
        id: 'VAC', nombre: 'Vacunas e inmunidad', ref: 'Libro Rojo AAP 2021–2024 (vacunas e inmunización pasiva) · Normas Nacionales de Vacunación PAI 2017 · Esquema MSPBS',
        edital: ['Vacunas: definición, tipos, esquema nacional actualizado (PAI)', 'Vías de administración, indicaciones, contraindicaciones y efectos adversos',
          'Inmunidad innata, celular y humoral; inmunidad activa y pasiva'],
        temas: [
          { id: 'VACU', nombre: 'Esquema, indicaciones y contraindicaciones', kw: ['vacuna', 'vacunacion', 'inmuniza', 'bcg', 'pentavalente', 'hexavalente', 'dpt$', 'dtpa', 'sabin', 'salk', 'ipv$', 'opv$', 'antipolio', 'triple viral', 'spr$', 'srp$', 'toxoide', 'pai$', 'esavi', 'cadena de frio', 'inmunoglobulina', 'inmunidad pasiva', 'inmunidad activa', 'antigeno', 'anticuerpo'] }
        ]
      },
      {
        id: 'NUT', nombre: 'Nutrición, lactancia y desnutrición', ref: 'Nelson, Parte V — Nutrición · Guías Alimentarias < 2 años (INAN) · Manual de Evaluación Nutricional 2024',
        edital: ['Lactancia materna: composición, calostro, duración, destete, problemas (grietas, congestión, mastitis, pezones planos)',
          'Alimentación láctea artificial: tipos de leche, dilución, carga calórica', 'Alimentación complementaria y suplementos vitamínicos',
          'Alimentación del preescolar, escolar y adolescente', 'Malnutrición: evaluación del estado nutricional, desnutrición, rehabilitación',
          'Avitaminosis e hipervitaminosis (A, B, C, D)'],
        temas: [
          { id: 'LACT', nombre: 'Lactancia materna y artificial', kw: ['lactancia', 'leche materna', 'calostro', 'amamant', 'pezon', 'grieta', 'congestion mamaria', 'mastitis', 'formula lactea', 'formula infantil', 'leche de vaca', 'leche de inicio', 'leche entera', 'destete', 'extraccion de leche', 'leche de transicion', 'leche madura'] },
          { id: 'ALIM', nombre: 'Alimentación complementaria y suplementos', kw: ['alimentacion complementaria', 'ablactacion', 'introduccion de alimentos', 'guias alimentarias', 'suplementacion', 'suplemento', 'hierro profilactico', 'micronutriente', 'alimentacion del preescolar', 'alimentacion del escolar', 'miel'] },
          { id: 'DESN', nombre: 'Desnutrición, obesidad y vitaminas', kw: ['desnutricion', 'malnutricion', 'marasmo', 'kwashiorkor', 'puntaje z', 'desvio estandar', 'peso para la talla', 'talla para la edad', 'peso para la edad', 'imc para la edad', 'antropometr', 'emaciacion', 'obesidad infantil', 'sobrepeso', 'vitamina a', 'vitamina d', 'vitamina c', 'raquitismo', 'escorbuto', 'avitaminosis', 'hipervitaminosis', 'realimentacion'] }
        ]
      },
      {
        id: 'HID', nombre: 'Diarrea, deshidratación y medio interno', ref: 'Nelson, Parte VII (líquidos y electrolitos) y gastroenterología · Manual AIEPI 2023',
        edital: ['Diarrea aguda: etiología, patrones, enfoque y tratamiento', 'Deshidratación: grados, tipos según osmolaridad, SRO e hidratación parenteral',
          'Desequilibrio hidroelectrolítico y ácido-base: Na, K, acidosis y alcalosis metabólica', 'Diarrea crónica: enfermedad celíaca, alergia alimentaria'],
        temas: [
          { id: 'DESH', nombre: 'Deshidratación y rehidratación', kw: ['deshidrata', 'sales de rehidratacion', 'rehidratacion', 'sro$', 'plan a$', 'plan b$', 'plan c$', 'hidratacion parenteral', 'signo del pliegue', 'llenado capilar'] },
          { id: 'DIA', nombre: 'Diarrea aguda y crónica', kw: ['diarrea', 'gastroenteritis', 'rotavirus', 'disenteria', 'sindrome uremico hemolitico', 'celiac', 'alergia a la proteina', 'proteina de leche de vaca', 'intolerancia a la lactosa', 'zinc'] },
          { id: 'ELEC', nombre: 'Electrolitos y ácido-base', kw: ['hiponatremia', 'hipernatremia', 'hipokalemia', 'hiperkalemia', 'hipopotasemia', 'hiperpotasemia', 'acidosis metabolica', 'alcalosis metabolica', 'medio interno', 'requerimiento hidrico', 'holliday'] }
        ]
      },
      {
        id: 'RESP', nombre: 'Respiratorio: infecciones y asma', ref: 'Nelson, Parte XVIII — Aparato respiratorio · Manual AIEPI 2023',
        edital: ['IRA altas: epiglotitis, laringitis, traqueítis, resfriado común', 'Otitis media aguda', 'Faringe, amígdalas, adenoides y senos paranasales',
          'IRA bajas: bronquiolitis, neumonía complicada y no complicada, derrame pleural', 'Asma: crisis y tratamiento preventivo'],
        temas: [
          { id: 'ALTA', nombre: 'Vía aérea superior y otitis', kw: ['laringitis', 'crup', 'laringotraqueitis', 'epiglotitis', 'traqueitis', 'estridor', 'resfriado', 'rinofaringitis', 'otitis', 'faringitis', 'faringoamigdalitis', 'amigdal', 'adenoid', 'sinusitis', 'absceso periamigdalino'] },
          { id: 'BAJA', nombre: 'Bronquiolitis y neumonía', kw: ['bronquiolitis', 'virus sincitial', 'vsr$', 'sincicial', 'neumonia', 'derrame pleural', 'empiema', 'tiraje', 'frecuencia respiratoria', 'taquipnea'] },
          { id: 'ASMA', nombre: 'Asma y sibilancias', kw: ['asma', 'sibilan', 'broncoespasmo', 'salbutamol', 'corticoide inhalado', 'budesonida', 'crisis asmatica', 'pulmonary score', 'cuerpo extrano'] }
        ]
      },
      {
        id: 'INFECTO', nombre: 'Infectología pediátrica', ref: 'Nelson, Parte XV — Enfermedades infecciosas · Guías MSPBS de dengue, chikungunya y COVID-19',
        edital: ['Fiebre en el niño: sin foco, prolongada, de origen desconocido', 'Enfermedades febriles exantemáticas (sarampión, rubéola, exantema súbito, eritema infeccioso, Coxsackie, Kawasaki, escarlatina, varicela, herpes)',
          'Infecciones del SNC: meningitis, encefalitis, absceso cerebral', 'Infecciones osteoarticulares', 'Infección urinaria',
          'Parotiditis, difteria, coqueluche, tétanos', 'Enteroparasitosis y ectoparasitosis (escabiosis, pediculosis, tungiasis, miasis)',
          'Tuberculosis en el niño', 'Hepatitis viral', 'VIH en el niño', 'Arbovirosis: dengue, Zika, chikungunya', 'COVID-19 y SIM-P'],
        temas: [
          { id: 'EXAN', nombre: 'Exantemáticas y Kawasaki', kw: ['exantem', 'sarampion', 'rubeola', 'roseola', 'exantema subito', 'eritema infeccioso', 'parvovirus', 'quinta enfermedad', 'varicela', 'mano pie boca', 'mano-pie-boca', 'coxsackie', 'escarlatina', 'kawasaki', 'mononucleosis', 'herpes', 'koplik'] },
          { id: 'FIEB', nombre: 'Fiebre sin foco', kw: ['fiebre sin foco', 'fiebre de origen desconocido', 'fiebre prolongada', 'lactante febril', 'bacteriemia oculta'] },
          { id: 'SNC', nombre: 'Infecciones del SNC', kw: ['meningitis', 'encefalitis', 'absceso cerebral', 'puncion lumbar', 'liquido cefalorraquideo', 'lcr$', 'meningococ', 'rigidez de nuca'] },
          { id: 'ITU', nombre: 'Infección urinaria', kw: ['infeccion urinaria', 'infeccion del tracto urinario', 'itu$', 'pielonefritis', 'urocultivo', 'reflujo vesicoureteral', 'cistouretrografia', 'orina simple'] },
          { id: 'OSTEO', nombre: 'Infecciones osteoarticulares', kw: ['osteomielitis', 'artritis septica', 'osteoartritis aguda', 'artritis aguda'] },
          { id: 'CLAS', nombre: 'Parotiditis, difteria, tos ferina y tétanos', kw: ['parotiditis', 'paperas', 'difteria', 'coqueluche', 'tos ferina', 'pertussis', 'bordetella', 'tetanos'] },
          { id: 'PARAS', nombre: 'Parasitosis y ectoparasitosis', kw: ['parasit', 'ascaris', 'anquilostom', 'uncinaria', 'oxiur', 'enterobius', 'taenia', 'tenia', 'trichuris', 'tricocefal', 'strongyloid', 'estrongiloid', 'giardia', 'ameba', 'escabiosis', 'sarna', 'pediculosis', 'piojo', 'tungiasis', 'pique', 'miasis', 'albendazol', 'mebendazol', 'permetrina'] },
          { id: 'TBVIH', nombre: 'Tuberculosis, VIH y hepatitis', kw: ['tuberculo', 'ppd$', 'tuberculina', 'isoniazida', 'bcg', 'vih', 'transmision vertical', 'sida$', 'hepatitis'] },
          { id: 'ARBO', nombre: 'Dengue, Zika, chikungunya y COVID-19', kw: ['dengue', 'zika', 'chikungunya', 'arbovirus', 'signos de alarma', 'covid', 'sars-cov', 'coronavirus', 'sindrome inflamatorio multisistemico', 'sims', 'sim-p', 'pims'] }
        ]
      },
      {
        id: 'CARDIORENAL', nombre: 'Cardiología y nefrología pediátrica', ref: 'Nelson, Partes XX (cardiovascular) y XXII (nefrología)',
        edital: ['Valoración del niño con alteraciones cardiovasculares', 'Insuficiencia cardiaca: cardiopatías congénitas cianóticas y no cianóticas, cardiopatía reumática, miocarditis, miocardiopatías',
          'Shock: hipovolémico, distributivo, cardiogénico y séptico', 'Insuficiencia renal aguda y crónica', 'Síndrome nefrítico', 'Síndrome nefrótico', 'Fiebre reumática'],
        temas: [
          { id: 'CARD', nombre: 'Cardiopatías congénitas e insuficiencia cardiaca', kw: ['cardiopatia congenita', 'cianotica', 'acianotica', 'tetralogia', 'fallot', 'comunicacion interventricular', 'comunicacion interauricular', 'civ$', 'cia$', 'ductus arterioso', 'conducto arterioso', 'coartacion', 'transposicion', 'insuficiencia cardiaca', 'miocarditis', 'soplo', 'cardiopatia reumatica', 'fiebre reumatica', 'hiperoxia'] },
          { id: 'SHOCK', nombre: 'Shock pediátrico', kw: ['shock', 'choque', 'hipovolem', 'septico', 'distributivo', 'cardiogenico'] },
          { id: 'RENAL', nombre: 'Síndrome nefrítico, nefrótico e insuficiencia renal', kw: ['nefrotico', 'nefritico', 'glomerulonefritis', 'postestreptococ', 'proteinuria', 'hematuria', 'edema', 'insuficiencia renal', 'lesion renal aguda', 'enfermedad renal cronica', 'hipertension arterial', 'complemento c3'] }
        ]
      },
      {
        id: 'NEUROENDO', nombre: 'Neurología y endocrinología pediátrica', ref: 'Nelson, Partes XXVI (endocrino) y XXVII (neurología)',
        edital: ['Cefaleas e hipertensión endocraneana', 'Convulsiones febriles y afebriles: clasificación, diagnóstico y tratamiento',
          'Hipotiroidismo congénito y adquirido', 'Diabetes mellitus tipo 1 y cetoacidosis diabética'],
        temas: [
          { id: 'NEURO', nombre: 'Convulsiones, cefalea e HTE', kw: ['convulsi', 'epilep', 'estado epileptico', 'crisis febril', 'cefalea', 'hipertension endocraneana', 'hipertension intracraneal', 'hidrocefalia', 'paralisis cerebral', 'diazepam', 'midazolam', 'fenobarbital', 'migrana'] },
          { id: 'ENDO', nombre: 'Tiroides y diabetes tipo 1', kw: ['hipotiroidismo', 'tiroid', 'tsh$', 'pesquisa neonatal', 'diabetes', 'cetoacidosis', 'insulina', 'glucemia', 'hiperplasia suprarrenal', 'pubertad precoz', 'talla baja'] }
        ]
      },
      {
        id: 'HEMONC', nombre: 'Hematología, oncología y reumatología pediátrica', ref: 'Nelson, Partes XXI (hematología), XXIII (oncología) y XIII (reumatología)',
        edital: ['Anemias: estructurales, hemoglobinopatías, metabólicas, carenciales; transfusiones', 'Leucemias y linfomas', 'Tumores sólidos: óseos, renales y cerebrales',
          'Trastornos hemorrágicos: PTI, Schönlein-Henoch, hemofilias, CID', 'Enfermedades del colágeno: artritis idiopática juvenil, LES, esclerodermia, EMTC'],
        temas: [
          { id: 'ANEM', nombre: 'Anemias y transfusión', kw: ['anemia', 'ferropen', 'hierro', 'ferritina', 'talasemia', 'drepanocit', 'falciforme', 'esferocit', 'hemolis', 'g6pd', 'glucosa-6', 'transfusion', 'hemoglobina'] },
          { id: 'ONC', nombre: 'Leucemias, linfomas y tumores sólidos', kw: ['leucemia', 'linfoma', 'hodgkin', 'tumor de wilms', 'wilms', 'nefroblastoma', 'neuroblastoma', 'retinoblastoma', 'leucocoria', 'meduloblastoma', 'tumor cerebral', 'osteosarcoma', 'ewing', 'masa abdominal', 'cancer infantil'] },
          { id: 'HEMOR', nombre: 'Trastornos hemorrágicos', kw: ['purpura', 'trombocitopen', 'pti$', 'henoch', 'schonlein', 'schoenlein', 'vasculitis por iga', 'hemofilia', 'von willebrand', 'coagulacion intravascular', 'cid$', 'petequia', 'plaqueta'] },
          { id: 'REUMA', nombre: 'Reumatología pediátrica', kw: ['artritis idiopatica juvenil', 'artritis reumatoide juvenil', 'lupus', 'esclerodermia', 'tejido conectivo', 'colageno'] }
        ]
      },
      {
        id: 'URG', nombre: 'Urgencias, trauma y maltrato', ref: 'Nelson, Partes VIII (urgencias) y IV (maltrato) · Manual AIEPI 2023',
        edital: ['Atención primaria y enfermedades prevalentes de la infancia (AIEPI)', 'Traumatismos en la infancia: accidentes y violencia', 'Maltrato infantil: físico, sexual, emocional, negligencia',
          'Evaluación de gravedad del niño y RCP básica y avanzada', 'Urgencias abdominales: dolor abdominal agudo, invaginación, apendicitis', 'Quemaduras: clasificación y manejo'],
        temas: [
          { id: 'RCP', nombre: 'Evaluación de gravedad y RCP pediátrica', kw: ['reanimacion cardiopulmonar', 'rcp$', 'paro cardiorrespiratorio', 'triangulo de evaluacion', 'evaluacion pediatrica', 'compresiones', 'via aerea', 'bolsa mascarilla', 'adrenalina', 'intraosea', 'signos de peligro', 'aiepi', 'signo general de peligro'] },
          { id: 'TRAUMA', nombre: 'Trauma, quemaduras e intoxicaciones', kw: ['traumatismo', 'trauma', 'tec$', 'craneoencefalico', 'fractura', 'quemadura', 'intoxicacion', 'ingesta de', 'ahogamiento', 'accidente', 'mordedura'] },
          { id: 'MALT', nombre: 'Maltrato infantil', kw: ['maltrato', 'abuso sexual', 'abuso fisico', 'negligencia', 'violencia', 'nino sacudido', 'zarandeado'] },
          { id: 'ABD', nombre: 'Abdomen agudo pediátrico', kw: ['invaginacion', 'intususcepcion', 'apendicitis', 'estenosis hipertrofica', 'estenosis pilorica', 'dolor abdominal agudo', 'abdomen agudo', 'malrotacion', 'volvulo', 'hernia inguinal', 'testiculo', 'torsion testicular', 'divertículo de meckel', 'meckel', 'hirschsprung'] }
        ]
      },
      {
        id: 'CONDUCTA', nombre: 'Conducta y salud mental', ref: 'Nelson, Parte III — Trastornos conductuales y psiquiátricos',
        edital: ['Trastorno del espectro autista y TDAH', 'Crisis de pánico, ansiedad y terror nocturno', 'Rumiación y pica', 'Suicidio e intento de suicidio',
          'Trastornos de la conducta alimentaria', 'Enuresis y encopresis', 'Adopción e impacto de la violencia en los niños'],
        temas: [
          { id: 'CONDU', nombre: 'Trastornos del neurodesarrollo y conducta', kw: ['autis', 'espectro autista', 'tdah', 'hiperactividad', 'deficit de atencion', 'panico', 'ansiedad', 'terror nocturno', 'pesadilla', 'pica$', 'rumiacion', 'suicid', 'anorexia', 'bulimia', 'conducta alimentaria', 'enuresis', 'encopresis', 'adopcion', 'berrinche', 'metilfenidato'] }
        ]
      }
    ]
  },

  CIR: {
    nombre: 'Cirugía General',
    libro: 'Schwartz. Principios de Cirugía, 11ª ed. (McGraw Hill, 2020)',
    subareas: [
      {
        id: 'BASES', nombre: 'Bases de la cirugía y perioperatorio', ref: 'Schwartz, caps. 3–6, 9–14, 47 y 52',
        edital: ['Cap. 3: Líquidos y electrolitos en el paciente quirúrgico', 'Cap. 4: Hemostasia, hemorragia quirúrgica y transfusión', 'Cap. 5: Choque',
          'Cap. 6: Infecciones quirúrgicas', 'Cap. 9: Cicatrización de heridas', 'Cap. 10: Oncología', 'Cap. 11: Trasplante',
          'Cap. 12: Calidad, seguridad del paciente y complicaciones', 'Cap. 13: Vigilancia fisiológica del paciente quirúrgico',
          'Cap. 14: Cirugía de mínima invasión, robótica, NOTES y laparoscopía de una incisión', 'Cap. 47: Consideraciones quirúrgicas en el anciano', 'Cap. 52: Cirugía ambulatoria'],
        temas: [
          { id: 'LIQ', nombre: 'Líquidos, electrolitos y ácido-base', kw: ['liquido', 'cristaloide', 'solucion salina', 'ringer', 'perdidas insensibles', 'hiponatremia', 'hipernatremia', 'potasio', 'hipopotasemia', 'hiperpotasemia', 'hipokalemia', 'hiperkalemia', 'acidosis', 'alcalosis', 'electrolit', 'agua corporal', 'osmolaridad', 'nutricion parenteral', 'nutricion enteral'] },
          { id: 'HEMO', nombre: 'Hemostasia y transfusión', kw: ['hemostasia', 'coagulacion', 'transfusion', 'plaqueta', 'plasma fresco', 'crioprecipitado', 'anticoagul', 'heparina', 'warfarina', 'hemorragia quirurgica', 'hemofilia', 'von willebrand', 'tromboprofilaxis', 'acido tranexamico'] },
          { id: 'CHOQUE', nombre: 'Choque', kw: ['choque', 'shock', 'hipovolem', 'hipoperfusion', 'lactato', 'vasopresor', 'reanimacion con liquidos', 'neurogenico', 'cardiogenico', 'septic', 'sepsis'] },
          { id: 'INFQ', nombre: 'Infecciones quirúrgicas', kw: ['infeccion del sitio quirurgico', 'infeccion de herida', 'herida limpia', 'limpia-contaminada', 'contaminada', 'profilaxis antibiotica', 'fascitis necrotizante', 'absceso', 'gangrena', 'antibiotico'] },
          { id: 'CICAT', nombre: 'Cicatrización de heridas', kw: ['cicatriz', 'queloide', 'hipertrofica', 'herida cronica', 'ulcera por presion', 'colageno', 'fase inflamatoria', 'fase proliferativa', 'remodelacion', 'cierre por primera', 'segunda intencion', 'injerto'] },
          { id: 'PERIOP', nombre: 'Perioperatorio, complicaciones, oncología quirúrgica y trasplante', kw: ['postoperatori', 'posoperatori', 'preoperatori', 'riesgo quirurgico', 'asa$', 'fiebre postoperatoria', 'atelectasia', 'dehiscencia', 'evisceracion', 'laparoscop', 'neumoperitoneo', 'minima invasion', 'robotic', 'anciano', 'adulto mayor', 'cirugia ambulatoria', 'trasplante', 'rechazo', 'inmunosupres', 'seguridad del paciente', 'lista de verificacion', 'oncologia quirurgica', 'margen', 'vigilancia hemodinamica', 'cateter venoso central', 'swan'] }
        ]
      },
      {
        id: 'TRAUMA', nombre: 'Trauma y quemaduras', ref: 'Schwartz, caps. 7 y 8 (+ ATLS)',
        edital: ['Cap. 7: Traumatismos', 'Cap. 8: Quemaduras'],
        temas: [
          { id: 'POLI', nombre: 'Atención inicial del politraumatizado', kw: ['trauma', 'politraumat', 'atls', 'abcde', 'revision primaria', 'glasgow', 'via aerea definitiva', 'cricotiroidotomia', 'fast$', 'ecofast', 'lavado peritoneal', 'laparotomia exploradora', 'arma de fuego', 'arma blanca', 'herida penetrante', 'contuso', 'neumotorax a tension', 'hemotorax', 'torax inestable', 'taponamiento cardiaco', 'lesion esplenica', 'lesion hepatica', 'pelvis', 'traumatismo craneo', 'hematoma epidural', 'hematoma subdural', 'control de danos', 'triada letal', 'transfusion masiva'] },
          { id: 'QUEM', nombre: 'Quemaduras', kw: ['quemad', 'regla de los nueve', 'parkland', 'superficie corporal quemada', 'inhalacion de humo', 'escarotomia', 'electrica', 'lund'] },
          { id: 'ORTO', nombre: 'Traumatología y ortopedia (subespecialidad)', kw: ['fractura', 'luxacion', 'esguince', 'ortoped', 'yeso', 'osteosintesis', 'clavo', 'menisco', 'ligamento cruzado', 'tendon', 'columna', 'escoliosis', 'cadera', 'rodilla', 'hombro', 'femur', 'tibia', 'radio distal', 'sindrome compartimental', 'salter', 'gustilo', 'pie bot', 'osteosarcoma'] }
        ]
      },
      {
        id: 'PIELMAMA', nombre: 'Piel, partes blandas y mama', ref: 'Schwartz, caps. 16 y 17',
        edital: ['Cap. 16: La piel y el tejido subcutáneo', 'Cap. 17: Mamas'],
        temas: [
          { id: 'PIEL', nombre: 'Piel y tejido subcutáneo', kw: ['melanoma', 'basocelular', 'espinocelular', 'epidermoide cutaneo', 'piel', 'cutane', 'quiste sebaceo', 'quiste epidermoide', 'lipoma', 'hidradenitis', 'nevus', 'nevo', 'breslow', 'clark', 'queratosis', 'sarcoma de partes blandas'] },
          { id: 'MAMA', nombre: 'Mama', kw: ['mama$', 'mamas$', 'mamari', 'mastectomia', 'cuadrantectomia', 'fibroadenoma', 'cancer de mama', 'carcinoma ductal', 'carcinoma lobulillar', 'mamografia', 'bi-rads', 'birads', 'ganglio centinela', 'brca', 'tamoxifeno', 'her2', 'ginecomastia', 'telorrea', 'mastalgia', 'phyllodes', 'paget del pezon'] }
        ]
      },
      {
        id: 'TORAX', nombre: 'Tórax', ref: 'Schwartz, cap. 19',
        edital: ['Cap. 19: Pared torácica, pulmón, mediastino y pleura'],
        temas: [
          { id: 'TOR', nombre: 'Pulmón, pleura y mediastino', kw: ['pulmon', 'pulmonar', 'nodulo pulmonar', 'cancer de pulmon', 'carcinoma broncogenico', 'mediastin', 'timoma', 'pleura', 'derrame pleural', 'empiema', 'neumotorax', 'toracostomia', 'tubo de torax', 'toracotomia', 'toracoscop', 'pared toracica', 'pectus', 'lobectomia', 'hemoptisis'] }
        ]
      },
      {
        id: 'VASC', nombre: 'Cirugía vascular', ref: 'Schwartz, caps. 22–24',
        edital: ['Cap. 22: Aneurismas de la aorta torácica y disección aórtica', 'Cap. 23: Enfermedades arteriales', 'Cap. 24: Enfermedad venosa y linfática'],
        temas: [
          { id: 'ART', nombre: 'Aorta y enfermedad arterial', kw: ['aneurisma', 'diseccion aortica', 'aorta', 'isquemia arterial', 'isquemia aguda', 'embolia arterial', 'claudicacion', 'enfermedad arterial periferica', 'indice tobillo', 'carotid', 'endarterectomia', 'fontaine', 'pie diabetico', 'amputacion', 'fogarty', 'bypass femoro'] },
          { id: 'VEN', nombre: 'Venas y linfáticos', kw: ['varices', 'variz', 'insuficiencia venosa', 'safena', 'trombosis venosa', 'tvp$', 'tromboflebitis', 'ulcera venosa', 'linfedema', 'tromboembolia', 'ceap'] }
        ]
      },
      {
        id: 'ESOEST', nombre: 'Esófago, estómago y obesidad', ref: 'Schwartz, caps. 25–27',
        edital: ['Cap. 25: Esófago y hernia diafragmática', 'Cap. 26: Estómago', 'Cap. 27: Tratamiento quirúrgico de la obesidad'],
        temas: [
          { id: 'ESO', nombre: 'Esófago y hernia hiatal', kw: ['esofag', 'acalasia', 'hernia hiatal', 'hernia diafragmatica', 'hernia paraesofagica', 'reflujo', 'barrett', 'fundoplicatura', 'nissen', 'zenker', 'disfagia', 'boerhaave', 'caustico'] },
          { id: 'EST', nombre: 'Estómago y úlcera péptica', kw: ['estomago', 'gastric', 'gastrectomia', 'ulcera peptica', 'ulcera perforada', 'ulcera gastrica', 'ulcera duodenal', 'helicobacter', 'piloro', 'hemorragia digestiva alta', 'forrest', 'gist', 'linfoma malt', 'billroth', 'dumping', 'vagotomia'] },
          { id: 'OBES', nombre: 'Cirugía bariátrica', kw: ['obesidad', 'bariatric', 'bypass gastrico', 'manga gastrica', 'gastrectomia vertical', 'banda gastrica', 'imc$', 'indice de masa corporal', 'metabolica'] }
        ]
      },
      {
        id: 'INTEST', nombre: 'Intestino, colon, recto, ano, apéndice y abdomen agudo', ref: 'Schwartz, caps. 28–30',
        edital: ['Cap. 28: Intestino delgado', 'Cap. 29: Colon, recto y ano', 'Cap. 30: Apéndice'],
        temas: [
          { id: 'APEN', nombre: 'Apendicitis', kw: ['apendic', 'apendice', 'mcburney', 'alvarado', 'rovsing', 'psoas', 'plastron', 'fosa iliaca derecha'] },
          { id: 'DELG', nombre: 'Intestino delgado y obstrucción', kw: ['obstruccion intestinal', 'oclusion intestinal', 'ileo', 'intestino delgado', 'bridas', 'adherencias', 'crohn', 'meckel', 'isquemia mesenterica', 'tumor carcinoide', 'fistula enterocutanea', 'intestino corto', 'niveles hidroaereos'] },
          { id: 'COLON', nombre: 'Colon y recto', kw: ['colon', 'colorrectal', 'diverticul', 'volvulo', 'megacolon', 'colitis', 'polipo', 'poliposis', 'colonoscop', 'hemicolectomia', 'hartmann', 'recto', 'rectal', 'cea$', 'hemorragia digestiva baja', 'ogilvie', 'colitis ulcerosa'] },
          { id: 'ANO', nombre: 'Patología anorrectal', kw: ['hemorroid', 'fisura anal', 'fistula anal', 'fistula perianal', 'absceso perianal', 'absceso anorrectal', 'pilonidal', 'prolapso rectal', 'canal anal', 'esfinter anal', 'condiloma', 'goodsall'] },
          { id: 'ABDAG', nombre: 'Abdomen agudo y peritonitis', kw: ['abdomen agudo', 'peritonitis', 'irritacion peritoneal', 'dolor abdominal', 'neumoperitoneo', 'blumberg', 'perforacion', 'laparotomia'] }
        ]
      },
      {
        id: 'HBP', nombre: 'Hígado, vías biliares, páncreas y bazo', ref: 'Schwartz, caps. 31–34',
        edital: ['Cap. 31: Hígado', 'Cap. 32: Vesícula biliar y sistema biliar extrahepático', 'Cap. 33: Páncreas', 'Cap. 34: Bazo'],
        temas: [
          { id: 'BIL', nombre: 'Vesícula y vía biliar', kw: ['vesicula', 'colecist', 'colelitiasis', 'litiasis biliar', 'coledoc', 'colangitis', 'charcot', 'reynolds', 'murphy', 'ictericia obstructiva', 'cpre', 'colangiografia', 'colangiocarcinoma', 'klatskin', 'courvoisier', 'ileo biliar', 'mirizzi', 'via biliar', 'colico biliar', 'quiste de coledoco'] },
          { id: 'HIG', nombre: 'Hígado', kw: ['higado', 'hepatic', 'hepatocarcinoma', 'carcinoma hepatocelular', 'absceso hepatico', 'quiste hidatidico', 'hidatid', 'hemangioma hepatico', 'hiperplasia nodular focal', 'adenoma hepatico', 'hipertension portal', 'varices', 'hepatectomia', 'segmentos de couinaud'] },
          { id: 'PANC', nombre: 'Páncreas', kw: ['pancrea', 'pseudoquiste', 'whipple', 'ampuloma', 'insulinoma', 'gastrinoma', 'zollinger', 'ranson', 'necrosis pancreatica', 'amilasa', 'lipasa'] },
          { id: 'BAZO', nombre: 'Bazo', kw: ['bazo', 'esplen', 'asplenia', 'esplenectomia', 'vacuna post'] }
        ]
      },
      {
        id: 'PARED', nombre: 'Pared abdominal, hernias y retroperitoneo', ref: 'Schwartz, caps. 35 y 37',
        edital: ['Cap. 35: Pared abdominal, epiplón, mesenterio y retroperitoneo', 'Cap. 37: Hernias inguinales'],
        temas: [
          { id: 'HERN', nombre: 'Hernias', kw: ['hernia inguinal', 'hernia crural', 'hernia femoral', 'hernia umbilical', 'hernia incisional', 'eventracion', 'hernia estrangulada', 'hernia encarcelada', 'hernia indirecta', 'hernia directa', 'hesselbach', 'lichtenstein', 'hernioplastia', 'herniorrafia', 'conducto inguinal', 'spiegel', 'hernia'] },
          { id: 'PARED', nombre: 'Pared abdominal, epiplón, mesenterio y retroperitoneo', kw: ['pared abdominal', 'recto abdominal', 'hematoma de la vaina', 'diastasis', 'epiplon', 'mesenterio', 'retroperitone', 'fibrosis retroperitoneal', 'desmoide'] }
        ]
      },
      {
        id: 'ENDOCIR', nombre: 'Cirugía endocrina', ref: 'Schwartz, cap. 38',
        edital: ['Cap. 38: Tiroides, paratiroides y suprarrenales'],
        temas: [
          { id: 'TIR', nombre: 'Tiroides y paratiroides', kw: ['tiroid', 'nodulo tiroideo', 'bocio', 'carcinoma papilar', 'carcinoma folicular', 'carcinoma medular', 'anaplasico', 'tiroidectomia', 'bethesda', 'paaf', 'puncion aspiracion', 'nervio laringeo', 'paratiroid', 'hiperparatiroid', 'hipocalcemia postoperatoria', 'chvostek', 'trousseau'] },
          { id: 'SUPRA', nombre: 'Suprarrenales', kw: ['suprarrenal', 'adrenal', 'feocromocitoma', 'incidentaloma', 'adrenalectomia', 'cushing', 'aldosteronoma'] }
        ]
      }
    ]
  },

  GO: {
    nombre: 'Ginecología y Obstetricia',
    libro: 'Obstetricia de Williams, 26ª ed. (2022) · Ginecología de Williams, 4ª ed. (2020) · Manuales del MSPBS',
    subareas: [
      {
        id: 'FISIO', nombre: 'Anatomía, fisiología materna y desarrollo fetal', ref: 'Williams Obstetricia, caps. 1–7',
        edital: ['Cap. 1: Aspectos generales de la obstetricia', 'Cap. 2: Anatomía materna', 'Cap. 3: Anomalías genitourinarias congénitas', 'Cap. 4: Fisiología materna',
          'Cap. 5: Implantación y desarrollo placentario', 'Cap. 6: Anomalías placentarias', 'Cap. 7: Embriogénesis y desarrollo morfológico fetal'],
        temas: [
          { id: 'FIS', nombre: 'Fisiología materna y anatomía', kw: ['fisiologia materna', 'cambios fisiologicos', 'durante el embarazo normal', 'gasto cardiaco', 'volumen plasmatico', 'anemia fisiologica', 'anatomia', 'pelvis', 'musculo elevador', 'utero', 'arteria uterina', 'mulleri', 'utero bicorne', 'tabique uterino', 'mortalidad materna', 'razon de mortalidad'] },
          { id: 'PLAC', nombre: 'Placenta, implantación y desarrollo fetal', kw: ['placenta', 'implantacion', 'trofoblasto', 'decidua', 'gonadotropina corionica', 'hcg', 'cordon umbilical', 'arteria umbilical unica', 'embriogenesis', 'organogenesis', 'desarrollo fetal', 'circulacion fetal', 'liquido amniotico', 'corion', 'amnios', 'lactogeno'] }
        ]
      },
      {
        id: 'PRENATAL', nombre: 'Atención preconcepcional, prenatal y diagnóstico prenatal', ref: 'Williams Obstetricia, caps. 9, 10, 14 y 17 · Guía Prenatal MSPBS',
        edital: ['Cap. 9: Atención preconcepcional', 'Cap. 10: Atención prenatal', 'Cap. 14: Imágenes obstétricas', 'Cap. 17: Diagnóstico prenatal', 'Normas MSPBS de atención prenatal'],
        temas: [
          { id: 'CPN', nombre: 'Control prenatal y preconcepcional', kw: ['control prenatal', 'prenatal', 'preconcepcional', 'primera consulta', 'fecha probable de parto', 'naegele', 'edad gestacional', 'altura uterina', 'leopold', 'ganancia de peso', 'acido folico', 'suplementacion', 'vacuna', 'antitetanica', 'tdap', 'grupo sanguineo', 'tamizaje', 'cribado', 'test de o\'sullivan', 'ecografia del primer trimestre'] },
          { id: 'DXP', nombre: 'Ecografía y diagnóstico prenatal', kw: ['ecografia', 'ultrasonido', 'translucencia nucal', 'amniocentesis', 'biopsia de vellosidades', 'cariotipo', 'aneuploid', 'trisomia', 'down', 'defecto del tubo neural', 'alfafetoproteina', 'doppler', 'anomalia fetal', 'malformacion fetal', 'adn fetal'] }
        ]
      },
      {
        id: 'PRIMERTRIM', nombre: 'Aborto, ectópico y enfermedad trofoblástica', ref: 'Williams Obstetricia, caps. 11–13 · Williams Ginecología, cap. 37',
        edital: ['Cap. 11: Pérdida del embarazo en el primero y segundo trimestres', 'Cap. 12: Embarazo ectópico', 'Cap. 13: Enfermedad trofoblástica gestacional', 'Ginecología cap. 37: Enfermedad trofoblástica gestacional'],
        temas: [
          { id: 'ABORTO', nombre: 'Aborto', kw: ['aborto', 'amenaza de aborto', 'perdida del embarazo', 'perdida gestacional', 'huevo anembrionado', 'embrion sin actividad', 'legrado', 'ameu', 'aspiracion manual', 'misoprostol', 'incompetencia cervical', 'insuficiencia cervical', 'cerclaje', 'aborto habitual', 'recurrente'] },
          { id: 'ECTO', nombre: 'Embarazo ectópico', kw: ['ectopico', 'tubario', 'salping', 'zona discriminatoria', 'metotrexato', 'masa anexial'] },
          { id: 'ETG', nombre: 'Enfermedad trofoblástica gestacional', kw: ['mola', 'molar', 'trofoblastic', 'coriocarcinoma', 'quistes teca', 'neoplasia trofoblastica'] }
        ]
      },
      {
        id: 'PARTO', nombre: 'Trabajo de parto, parto y cesárea', ref: 'Williams Obstetricia, caps. 21–31',
        edital: ['Cap. 21: Fisiología del trabajo de parto', 'Cap. 22: Trabajo de parto normal', 'Cap. 23: Trabajo de parto anormal', 'Cap. 24: Valoración durante el parto',
          'Cap. 25: Analgesia y anestesia obstétrica', 'Cap. 26: Inducción y aumento del trabajo de parto', 'Cap. 27: Parto vaginal', 'Cap. 28: Parto en presentación pélvica',
          'Cap. 29: Parto vaginal quirúrgico', 'Cap. 30: Cesárea e histerectomía periparto', 'Cap. 31: Cesárea previa'],
        temas: [
          { id: 'TP', nombre: 'Trabajo de parto normal y anormal', kw: ['trabajo de parto', 'fase latente', 'fase activa', 'periodo expulsivo', 'expulsivo', 'dilatacion', 'borramiento', 'distocia', 'partograma', 'desproporcion', 'detencion', 'mecanismo del parto', 'rotacion interna', 'presentacion', 'variedad de posicion', 'occipito', 'plano de hodge', 'estacion', 'contracciones', 'alumbramiento'] },
          { id: 'FETAL', nombre: 'Vigilancia fetal intraparto', kw: ['monitoreo fetal', 'cardiotocograf', 'frecuencia cardiaca fetal', 'desaceleracion', 'variabilidad', 'dips', 'sufrimiento fetal', 'estado fetal no tranquilizador', 'categoria iii', 'perfil biofisico', 'ph de cuero'] },
          { id: 'INDUC', nombre: 'Inducción, analgesia y parto vaginal', kw: ['induccion', 'oxitocina', 'misoprostol', 'prostaglandina', 'bishop', 'maduracion cervical', 'amniotomia', 'epidural', 'analgesia', 'anestesia raquidea', 'parto vaginal', 'episiotomia', 'desgarro perineal', 'desgarro de', 'distocia de hombros', 'mcroberts', 'forceps', 'vacuum', 'ventosa', 'podalica', 'pelvica', 'presentacion de nalgas', 'version cefalica externa'] },
          { id: 'CES', nombre: 'Cesárea y cesárea previa', kw: ['cesarea', 'histerectomia periparto', 'cicatriz uterina', 'rotura uterina', 'ruptura uterina', 'parto vaginal despues de cesarea', 'pvdc', 'incision de pfannenstiel', 'incision segmentaria'] }
        ]
      },
      {
        id: 'PATOBS', nombre: 'Patología obstétrica (Manual MSPBS)', ref: 'Manual Nacional de Normas de Patologías Obstétricas MSPBS 2018 · Código Rojo Obstétrico 2018',
        edital: ['Trastornos hipertensivos del embarazo: preeclampsia, eclampsia, HELLP', 'Hemorragias de la segunda mitad: placenta previa, desprendimiento, rotura uterina',
          'Hemorragia posparto y Código Rojo obstétrico', 'Rotura prematura de membranas y corioamnionitis', 'Amenaza y trabajo de parto pretérmino',
          'Diabetes gestacional', 'Restricción del crecimiento fetal, embarazo prolongado y óbito', 'Isoinmunización Rh', 'Infecciones en el embarazo (ITU, sífilis, VIH, estreptococo B)', 'Embarazo múltiple'],
        temas: [
          { id: 'HTA', nombre: 'Estados hipertensivos del embarazo', kw: ['preeclampsia', 'pre-eclampsia', 'eclampsia', 'hellp', 'sulfato de magnesio', 'hipertension gestacional', 'hipertension en el embarazo', 'hipertension cronica', 'labetalol', 'nifedipina', 'hidralazina', 'proteinuria', 'alfametildopa', 'metildopa'] },
          { id: 'HEM', nombre: 'Hemorragias obstétricas y Código Rojo', kw: ['placenta previa', 'desprendimiento', 'abruptio', 'dppni', 'hemorragia posparto', 'hemorragia postparto', 'hemorragia obstetrica', 'atonia uterina', 'codigo rojo', 'acretismo', 'placenta acreta', 'inversion uterina', 'retencion placentaria', 'vasa previa', 'balon de bakri', 'b-lynch', 'uterotonico', 'choque hipovolemico', 'indice de choque'] },
          { id: 'RPM', nombre: 'RPM y parto pretérmino', kw: ['rotura prematura', 'ruptura prematura', 'rpm$', 'corioamnionitis', 'parto pretermino', 'parto prematuro', 'amenaza de parto', 'tocolis', 'nifedipino', 'atosiban', 'indometacina', 'maduracion pulmonar', 'betametasona', 'dexametasona', 'neuroproteccion', 'cervicometria'] },
          { id: 'DMG', nombre: 'Diabetes gestacional', kw: ['diabetes gestacional', 'diabetes pregestacional', 'diabetes en el embarazo', 'macrosomia', 'curva de tolerancia', 'tolerancia oral a la glucosa', 'ptog', 'glucemia en ayunas'] },
          { id: 'FETO', nombre: 'Crecimiento fetal, líquido amniótico, embarazo prolongado y óbito', kw: ['restriccion del crecimiento', 'rciu', 'pequeno para la edad gestacional', 'oligohidramnios', 'polihidramnios', 'embarazo prolongado', 'postermino', 'muerte fetal', 'obito', 'oligoamnios'] },
          { id: 'ISO', nombre: 'Isoinmunización Rh', kw: ['isoinmuniz', 'aloinmuniz', 'rh negativ', 'anti-d', 'inmunoglobulina anti', 'coombs indirecto', 'hidrops', 'eritroblastosis'] },
          { id: 'INFEMB', nombre: 'Infecciones y otras patologías en el embarazo', kw: ['bacteriuria asintomatica', 'pielonefritis', 'sifilis', 'vih', 'estreptococo del grupo b', 'streptococcus agalactiae', 'toxoplasm', 'rubeola', 'listeria', 'colestasis intrahepatica', 'hiperemesis', 'anemia en el embarazo', 'gemelar', 'embarazo multiple', 'monocorial', 'transfusion feto-fetal', 'cardiopatia y embarazo', 'tiroides y embarazo', 'lupus y embarazo', 'trombofilia'] }
        ]
      },
      {
        id: 'PUERP', nombre: 'Puerperio e infección puerperal', ref: 'Williams Obstetricia, caps. 36–37',
        edital: ['Cap. 36: Puerperio', 'Cap. 37: Infección puerperal'],
        temas: [
          { id: 'PUER', nombre: 'Puerperio normal y patológico', kw: ['puerperio', 'puerperal', 'posparto', 'postparto', 'loquios', 'involucion uterina', 'endometritis', 'mastitis', 'absceso mamario', 'lactancia', 'depresion posparto', 'tristeza posparto', 'psicosis puerperal', 'tromboflebitis pelvica'] }
        ]
      },
      {
        id: 'ANTICONC', nombre: 'Anticoncepción y planificación familiar', ref: 'Williams Obstetricia, cap. 38 · Manual Nacional de Normas de Planificación Familiar MSPBS 2018',
        edital: ['Cap. 38: Anticoncepción', 'Criterios médicos de elegibilidad (OMS) y métodos disponibles en el MSPBS', 'Anticoncepción de emergencia', 'Esterilización quirúrgica'],
        temas: [
          { id: 'ANTI', nombre: 'Métodos anticonceptivos', kw: ['anticoncep', 'contracep', 'planificacion familiar', 'diu$', 'dispositivo intrauterino', 'implante subdermico', 'preservativo', 'condon', 'pildora', 'anovulatorio', 'levonorgestrel', 'emergencia', 'ligadura tubaria', 'salpingoclasia', 'vasectomia', 'criterios de elegibilidad', 'acetato de medroxiprogesterona', 'inyectable', 'anillo vaginal', 'mela$', 'amenorrea de la lactancia', 'pearl', 'metodo de barrera', 'metodos naturales'] }
        ]
      },
      {
        id: 'GINEBEN', nombre: 'Ginecología general y benigna', ref: 'Williams Ginecología, caps. 1–4, 8, 11 y 12',
        edital: ['Cap. 1: Atención de la mujer sana', 'Cap. 2: Imágenes en ginecología', 'Cap. 3: Infecciones ginecológicas', 'Cap. 4: Trastornos benignos del aparato genital inferior',
          'Cap. 8: Sangrado uterino anormal', 'Cap. 11: Endometriosis', 'Cap. 12: Dolor pélvico'],
        temas: [
          { id: 'INF', nombre: 'Infecciones ginecológicas e ITS', kw: ['vaginosis', 'vaginitis', 'gardnerella', 'candidiasis vulvovaginal', 'candida', 'tricomon', 'flujo vaginal', 'leucorrea', 'enfermedad inflamatoria pelvica', 'epi$', 'absceso tuboovarico', 'cervicitis', 'clamidia', 'chlamydia', 'gonorrea', 'herpes genital', 'condiloma', 'bartholin', 'fitz-hugh', 'clue cells', 'celulas clave', 'amsel'] },
          { id: 'SUA', nombre: 'Sangrado uterino anormal y miomas', kw: ['sangrado uterino anormal', 'hemorragia uterina', 'menorragia', 'metrorragia', 'palm-coein', 'mioma', 'leiomioma', 'miomectomia', 'adenomiosis', 'polipo endometrial', 'hiperplasia endometrial', 'histeroscopia', 'histerectomia', 'ablacion endometrial'] },
          { id: 'ENDOM', nombre: 'Endometriosis y dolor pélvico', kw: ['endometriosis', 'endometrioma', 'dolor pelvico', 'dismenorrea', 'dispareunia', 'torsion ovarica', 'torsion anexial', 'quiste ovarico', 'quiste funcional', 'cuerpo luteo', 'masa anexial'] },
          { id: 'SANA', nombre: 'Atención de la mujer sana e imágenes', kw: ['mujer sana', 'examen ginecologico', 'tamizaje', 'ecografia transvaginal', 'ultrasonido pelvico', 'resonancia pelvica', 'liquen', 'vulvar benigno', 'vulvodinia'] }
        ]
      },
      {
        id: 'ENDOREP', nombre: 'Endocrinología reproductiva, infertilidad y menopausia', ref: 'Williams Ginecología, caps. 16–19 y 22 · Manual de Climaterio MSPBS',
        edital: ['Cap. 16: Endocrinología de la reproducción', 'Cap. 17: Amenorreas', 'Cap. 18: Síndrome de ovarios poliquísticos e hiperandrogenismo', 'Cap. 19: Trastornos anatómicos',
          'Cap. 22: Menopausia y la mujer madura'],
        temas: [
          { id: 'AMEN', nombre: 'Amenorrea y ciclo menstrual', kw: ['amenorrea', 'ciclo menstrual', 'fase folicular', 'fase lutea', 'ovulacion', 'fsh$', 'lh$', 'gnrh', 'hipotalam', 'hiperprolactinem', 'prolactina', 'sheehan', 'asherman', 'turner', 'insuficiencia ovarica', 'falla ovarica', 'menarca', 'pubertad', 'rokitansky', 'himen imperforado', 'tabique vaginal', 'prueba de progesterona'] },
          { id: 'SOP', nombre: 'SOP, hiperandrogenismo e infertilidad', kw: ['ovario poliquistico', 'ovarios poliquisticos', 'sop$', 'rotterdam', 'hirsutismo', 'hiperandrogen', 'androgenos', 'infertilidad', 'esterilidad', 'fertilidad', 'clomifeno', 'letrozol', 'induccion de la ovulacion', 'fertilizacion in vitro', 'histerosalpingograf', 'espermograma'] },
          { id: 'MENOP', nombre: 'Menopausia y climaterio', kw: ['menopausia', 'climaterio', 'perimenopausia', 'posmenopausi', 'postmenopausi', 'terapia hormonal', 'terapia de reemplazo', 'sofoco', 'bochorno', 'sindrome genitourinario', 'atrofia vaginal', 'osteoporosis'] }
        ]
      },
      {
        id: 'UROGINE', nombre: 'Uroginecología y suelo pélvico', ref: 'Williams Ginecología, caps. 23–24',
        edital: ['Cap. 23: Incontinencia urinaria', 'Cap. 24: Prolapso de los órganos pélvicos'],
        temas: [
          { id: 'URO', nombre: 'Incontinencia y prolapso', kw: ['incontinencia', 'urgencia miccional', 'vejiga hiperactiva', 'esfuerzo', 'prolapso', 'cistocele', 'rectocele', 'enterocele', 'pop-q', 'pesario', 'piso pelvico', 'suelo pelvico', 'kegel', 'cabestrillo', 'tvt$', 'urodinami'] }
        ]
      },
      {
        id: 'ONCOGIN', nombre: 'Oncología ginecológica y patología cervical', ref: 'Williams Ginecología, caps. 29–36 · Manual de Patología Cervical MSPBS',
        edital: ['Cap. 29: Lesiones preinvasivas del aparato genital inferior', 'Cap. 30: Cáncer cervicouterino', 'Cap. 31: Cáncer vulvar', 'Cap. 32: Cáncer vaginal',
          'Cap. 33: Cáncer endometrial', 'Cap. 34: Sarcoma uterino', 'Cap. 35: Cáncer de ovario epitelial', 'Cap. 36: Tumores ováricos de células germinales y estromales'],
        temas: [
          { id: 'CERV', nombre: 'VPH, lesiones preinvasivas y cáncer de cuello', kw: ['papanicolaou', 'pap$', 'citologia cervical', 'citologia cervicovaginal', 'vph', 'virus del papiloma', 'papiloma humano', 'colposcop', 'lesion intraepitelial', 'neoplasia intraepitelial', 'nic$', 'nic 1', 'nic 2', 'nic 3', 'lsil', 'hsil', 'asc-us', 'ascus', 'conizacion', 'cono', 'leep', 'asa diatermica', 'cancer de cuello', 'cancer cervical', 'cervicouterino', 'carcinoma de cervix', 'inspeccion visual'] },
          { id: 'ENDOMC', nombre: 'Cáncer de endometrio y sarcomas', kw: ['cancer de endometrio', 'cancer endometrial', 'carcinoma endometrial', 'adenocarcinoma de endometrio', 'sarcoma uterino', 'leiomiosarcoma', 'sangrado posmenopausico', 'sangrado postmenopausico', 'lynch', 'tamoxifeno'] },
          { id: 'OVAR', nombre: 'Tumores de ovario', kw: ['cancer de ovario', 'carcinoma de ovario', 'tumor de ovario', 'tumor ovarico', 'ca-125', 'ca 125', 'disgerminoma', 'teratoma', 'tumor de celulas de la granulosa', 'granulosa', 'sertoli', 'germinales', 'brca', 'meigs', 'krukenberg', 'quiste dermoide'] },
          { id: 'VULVA', nombre: 'Cáncer de vulva y vagina', kw: ['cancer de vulva', 'cancer vulvar', 'carcinoma vulvar', 'cancer de vagina', 'cancer vaginal', 'neoplasia intraepitelial vulvar'] }
        ]
      }
    ]
  },

  SP: {
    nombre: 'Salud Pública',
    libro: 'Primer Libro de Salud Pública de Paraguay (INS, 2022) · documentos MSPBS, OPS/OMS y UNICEF del temario',
    subareas: [
      {
        id: 'SIST', nombre: 'Sistemas de salud y Sistema Nacional de Salud', ref: 'Libro de Salud Pública INS 2022 · Plan Estratégico MSPBS 2024–2028 · Ley 1.032/96',
        edital: ['Concepto y funciones de los sistemas de salud', 'Modelos de financiamiento y organización: Bismarck, Beveridge, mixtos',
          'Cobertura Universal de Salud y ODS', 'Determinantes sociales y equidad sanitaria', 'Funciones esenciales de la salud pública (FESP)',
          'Política Nacional de Salud 2015–2030', 'Sistema Nacional de Salud: estructura, marco legal (Ley 1.032/96) y financiamiento',
          'Planificación estratégica 2024–2028', 'Protección financiera en salud (CONACYT, cap. I)'],
        temas: [
          { id: 'MOD', nombre: 'Modelos, funciones y financiamiento', kw: ['sistema de salud', 'sistemas de salud', 'bismarck', 'beveridge', 'semashko', 'financiamiento', 'seguro social', 'ips$', 'instituto de prevision', 'gasto de bolsillo', 'gasto catastrofico', 'proteccion financiera', 'rectoria', 'gobernanza', 'funciones esenciales', 'fesp', 'subsector', 'segmentacion', 'fragmentacion'] },
          { id: 'PY', nombre: 'SNS Paraguay, políticas y planes', kw: ['ley 1032', 'ley n° 1032', '1.032', 'sistema nacional de salud', 'politica nacional de salud', 'plan estrategico', 'mspbs', 'ministerio de salud', 'consejo nacional de salud', 'consejos regionales', 'consejos locales', 'decreto 21376', 'superintendencia'] },
          { id: 'CUS', nombre: 'Cobertura universal, determinantes y equidad', kw: ['cobertura universal', 'acceso universal', 'salud universal', 'objetivos de desarrollo sostenible', 'ods$', 'determinantes sociales', 'determinante', 'equidad', 'inequidad', 'desigualdad', 'lalonde', 'gradiente social'] }
        ]
      },
      {
        id: 'APS', nombre: 'Atención primaria y redes integradas (RIISS)', ref: 'Manual de Organización del Primer Nivel MSPBS · Manual RIISS 2019 · OMS 2008 · OPS Alma-Ata +40',
        edital: ['Fundamentos y evolución de la APS: Alma-Ata y su renovación', 'Sistemas de salud basados en APS: valores, principios y elementos',
          'RIISS: definición, atributos y funcionamiento', 'Organización del Primer Nivel de Atención en Paraguay', 'Unidades de Salud Familiar (USF)',
          'Telemedicina e innovación digital en APS', 'Declaración de Astana (2018)'],
        temas: [
          { id: 'APS', nombre: 'APS: Alma-Ata, Astana y principios', kw: ['atencion primaria', 'aps$', 'alma ata', 'alma-ata', 'astana', 'salud para todos', 'renovacion de la aps', 'valores', 'principios'] },
          { id: 'RED', nombre: 'RIISS, primer nivel y USF', kw: ['riiss', 'redes integradas', 'red integrada', 'primer nivel', 'segundo nivel', 'tercer nivel', 'niveles de atencion', 'usf$', 'unidad de salud familiar', 'unidades de salud familiar', 'equipo de salud de la familia', 'agente comunitario', 'territorio', 'adscripcion', 'referencia y contrarreferencia', 'contrarreferencia', 'telemedicina', 'telesalud'] }
        ]
      },
      {
        id: 'PROMO', nombre: 'Promoción de la salud y comunicación', ref: 'Carta de Ottawa (1986) · Política Nacional de Promoción de la Salud 2023–2027',
        edital: ['Carta de Ottawa y evolución de la promoción de la salud', 'Determinantes sociales, participación y empoderamiento comunitario',
          'Políticas públicas saludables y entornos favorecedores', 'Descentralización y promoción a nivel local', 'Sistema de información municipal y salas de situación',
          'Comunicación en salud: planificación, mensajes, públicos y medios', 'Estrategias comunicacionales participativas, monitoreo y evaluación'],
        temas: [
          { id: 'PROM', nombre: 'Carta de Ottawa y promoción de la salud', kw: ['promocion de la salud', 'ottawa', 'empoderamiento', 'participacion comunitaria', 'participacion social', 'politicas publicas saludables', 'entornos saludables', 'entornos favorables', 'municipio saludable', 'escuelas saludables', 'reorientacion de los servicios', 'aptitudes personales', 'shanghai', 'yakarta', 'descentraliz'] },
          { id: 'COM', nombre: 'Comunicación en salud y salas de situación', kw: ['comunicacion en salud', 'comunicacion para la salud', 'educacion para la salud', 'mensaje', 'publico objetivo', 'medios de comunicacion', 'campana', 'sala de situacion', 'salas de situacion', 'informacion municipal', 'mercadeo social'] }
        ]
      },
      {
        id: 'MATERNO', nombre: 'Salud materna, niñez y adolescencia', ref: 'Plan Nacional de Salud Sexual y Reproductiva 2019–2030 · Plan de Prevención del Embarazo Adolescente · UNICEF 2023',
        edital: ['Plan Nacional de Salud Sexual y Reproductiva (2019–2030)', 'Derechos sexuales y reproductivos; consentimiento informado', 'Métodos anticonceptivos y planificación familiar',
          'Atención integral en el ciclo de vida: embarazo, niñez, adolescencia', 'Vigilancia del crecimiento y desarrollo', 'Salud nutricional en grupos vulnerables',
          'Prevención del embarazo adolescente y estrategias intersectoriales'],
        temas: [
          { id: 'SSR', nombre: 'Salud sexual y reproductiva y embarazo adolescente', kw: ['salud sexual', 'reproductiva', 'derechos sexuales', 'embarazo adolescente', 'embarazo en la adolescencia', 'adolescen', 'planificacion familiar', 'anticoncep', 'consentimiento informado', 'violencia de genero', 'mortalidad materna', 'muerte materna'] },
          { id: 'NINEZ', nombre: 'Niñez, nutrición y ciclo de vida', kw: ['ninez', 'infancia', 'unicef', 'crecimiento y desarrollo', 'desnutricion', 'nutricional', 'lactancia', 'ciclo de vida', 'estado mundial de la infancia', 'primera infancia', 'mil dias', 'grupos vulnerables', 'pani$'] }
        ]
      },
      {
        id: 'VITAL', nombre: 'Estadísticas vitales e indicadores', ref: 'Indicadores Básicos de Salud MSPBS 2024 · Manual de Registro de Hechos Vitales 2024',
        edital: ['Certificados de nacido vivo y de defunción: funciones del equipo de salud', 'Indicadores básicos: demográficos, socioeconómicos, mortalidad, morbilidad, recursos y cobertura',
          'Proyecciones de población: urbana, rural, fecundidad, migración, esperanza de vida'],
        temas: [
          { id: 'CERT', nombre: 'Certificados y hechos vitales', kw: ['certificado de defuncion', 'certificado de nacido vivo', 'hechos vitales', 'causa basica', 'causa directa', 'causa de muerte', 'registro civil', 'subregistro', 'estadisticas vitales', 'cie-10', 'cie 10', 'defuncion'] },
          { id: 'IND', nombre: 'Indicadores y demografía', kw: ['tasa de mortalidad', 'mortalidad infantil', 'mortalidad neonatal', 'mortalidad general', 'razon de mortalidad', 'tasa bruta', 'natalidad', 'fecundidad', 'esperanza de vida', 'piramide', 'indicador', 'proyeccion', 'poblacion', 'demograf', 'transicion demografica', 'transicion epidemiologica', 'avpp', 'anos de vida', 'avad', 'migracion', 'indice de dependencia', 'censo'] }
        ]
      },
      {
        id: 'EPI', nombre: 'Epidemiología e investigación', ref: 'Epidemiología Básica OPS (Bonita, 2008) · MOPECE OPS 2011',
        edital: ['Historia natural de la enfermedad, cadena epidemiológica y niveles de prevención', 'Medidas de frecuencia y asociación',
          'Diseños de estudios epidemiológicos', 'Pruebas diagnósticas y tamizaje', 'Investigación epidemiológica en salud pública'],
        temas: [
          { id: 'HN', nombre: 'Historia natural, cadena epidemiológica y prevención', kw: ['historia natural', 'cadena epidemiologica', 'triada epidemiologica', 'agente', 'huesped', 'reservorio', 'puerta de entrada', 'mecanismo de transmision', 'periodo de incubacion', 'prevencion primaria', 'prevencion secundaria', 'prevencion terciaria', 'prevencion cuaternaria', 'niveles de prevencion', 'leavell', 'periodo prepatogenico', 'inmunidad de rebano', 'portador'] },
          { id: 'MED', nombre: 'Medidas de frecuencia y asociación', kw: ['incidencia', 'prevalencia', 'riesgo relativo', 'odds ratio', 'razon de odds', 'razon de momios', 'riesgo atribuible', 'fraccion atribuible', 'nnt$', 'numero necesario', 'tasa', 'proporcion', 'razon', 'letalidad', 'tasa de ataque', 'densidad de incidencia'] },
          { id: 'EST', nombre: 'Diseños de estudio, sesgos y estadística', kw: ['cohorte', 'casos y controles', 'caso-control', 'ensayo clinico', 'aleatoriz', 'transversal', 'ecologico', 'estudio descriptivo', 'estudio analitico', 'sesgo', 'confusion', 'variable', 'hipotesis', 'muestra', 'muestreo', 'intervalo de confianza', 'valor de p', 'significancia', 'media$', 'mediana', 'moda$', 'desviacion estandar', 'chi cuadrado', 'bradford hill', 'causalidad', 'metaanalisis', 'revision sistematica'] },
          { id: 'DX', nombre: 'Pruebas diagnósticas y tamizaje', kw: ['sensibilidad', 'especificidad', 'valor predictivo', 'falsos positivos', 'falsos negativos', 'verdaderos positivos', 'tamizaje', 'cribado', 'screening', 'prueba diagnostica', 'curva roc', 'cociente de probabilidad'] }
        ]
      },
      {
        id: 'VIGI', nombre: 'Vigilancia, brotes e IAAS', ref: 'Guía Nacional de Vigilancia y Control de Enfermedades MSPBS 2015 · Manual de IAAS 2017',
        edital: ['Vigilancia en salud pública: conceptos, objetivos, eventos bajo vigilancia, etapas del sistema', 'Investigación de brotes', 'Infecciones asociadas a la atención de salud y su prevención'],
        temas: [
          { id: 'VIG', nombre: 'Vigilancia epidemiológica y brotes', kw: ['vigilancia', 'notificacion', 'notificacion obligatoria', 'evento de notificacion', 'brote', 'epidemia', 'endemia', 'pandemia', 'curva epidemica', 'canal endemico', 'definicion de caso', 'caso sospechoso', 'caso probable', 'caso confirmado', 'centinela', 'reglamento sanitario internacional', 'investigacion de brote', 'cerco epidemiologico', 'bloqueo'] },
          { id: 'IAAS', nombre: 'IAAS y bioseguridad', kw: ['infecciones asociadas', 'asociada a la atencion', 'iaas$', 'intrahospitalaria', 'nosocomial', 'higiene de manos', 'lavado de manos', 'cinco momentos', 'precauciones estandar', 'precauciones de contacto', 'aislamiento', 'bioseguridad', 'residuos hospitalarios', 'esterilizacion', 'desinfeccion', 'equipo de proteccion'] }
        ]
      },
      {
        id: 'CLIMA', nombre: 'Cambio climático y seguridad alimentaria', ref: 'Inseguridad Alimentaria y Emergencia Climática (Rede Unida, 2023)',
        edital: ['Marcos teóricos y antecedentes de las crisis alimentaria y climática en América Latina', 'Inseguridad alimentaria y emergencia climática: sindemia global en Paraguay',
          'Estrategias de enfrentamiento de las crisis alimentaria y climática'],
        temas: [
          { id: 'CLIM', nombre: 'Sindemia global: clima y alimentación', kw: ['cambio climatico', 'climatic', 'emergencia climatica', 'inseguridad alimentaria', 'seguridad alimentaria', 'soberania alimentaria', 'sindemia', 'hambre', 'calentamiento global', 'efecto invernadero', 'agroecolog', 'ultraprocesad', 'sistemas alimentarios'] }
        ]
      }
    ]
  }
};

const ORDEN_TRONCALES = ['MI', 'PED', 'CIR', 'GO', 'SP'];
module.exports = { AREAS, ORDEN_TRONCALES };
