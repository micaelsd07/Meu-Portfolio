// Banco de Dados Local - UPET Petshop / Banho e Tosa / VeterinÃ¡rio
const initialServices = [
  {
    id: "banho-e-tosa",
    name: "Banho e Tosa",
    icon: "fa-bath",
    image: "img/cachorro1.jpg",
    shortDescription: "Higiene completa com cosmÃ©ticos premium e profissionais experientes.",
    description: "Nosso serviÃ§o de Banho e Tosa Ã© referÃªncia em TaubatÃ©. Utilizamos produtos de alta qualidade, especÃ­ficos para o tipo de pelagem e pele do seu pet, incluindo opÃ§Ãµes hipoalergÃªnicas. Dispomos de sopradores e secadores de baixo ruÃ­do para minimizar o estresse, toalhas higienizadas individualmente e um ambiente totalmente climatizado e seguro.",
    benefits: [
      "Secagem com temperatura controlada e secadores super silenciosos",
      "Corte de unhas e limpeza de ouvidos inclusos em todos os banhos",
      "EscovaÃ§Ã£o de dentes e aplicaÃ§Ã£o de fluido desembaÃ§ador",
      "Profissionais certificados em estÃ©tica animal e comportamento pet"
    ],
    prices: [
      { name: "Porte Pequeno", value: "R$ 69,90" },
      { name: "Porte MÃ©dio", value: "R$ 89,90" },
      { name: "Porte Grande", value: "R$ 119,90" }
    ],
    faq: [
      { q: "Quanto tempo demora o banho e tosa?", a: "Em mÃ©dia de 1h30 a 2h30, dependendo do porte, tipo de pelagem e comportamento do animal." },
      { q: "VocÃªs usam Ã¡gua morna?", a: "Sim, todos os nossos banhos sÃ£o realizados com Ã¡gua em temperatura morna e controlada termostaticamente para o conforto do pet." },
      { q: "Posso acompanhar o banho do meu pet?", a: "Temos uma divisÃ³ria de vidro temperado na recepÃ§Ã£o onde vocÃª pode observar todo o processo de higienizaÃ§Ã£o de forma transparente." }
    ]
  },
  {
    id: "veterinario",
    name: "VeterinÃ¡rio",
    icon: "fa-stethoscope",
    image: "img/unnamed (1).jpg",
    shortDescription: "Consultas preventivas, diagnÃ³sticos precisos e atendimento atencioso.",
    description: "A saÃºde do seu companheiro Ã© nossa maior prioridade. Nosso consultÃ³rio conta com infraestrutura moderna para consultas gerais e especializadas. Oferecemos um atendimento humanizado, focado na prevenÃ§Ã£o e no bem-estar continuado do seu pet, auxiliando-o em todas as fases da vida, desde filhote atÃ© a idade sÃªnior.",
    benefits: [
      "Equipe de veterinÃ¡rios experientes e em constante atualizaÃ§Ã£o",
      "ConsultÃ³rio climatizado com tÃ©cnicas de manejo Cat-Friendly (sem estresse)",
      "HistÃ³rico clÃ­nico 100% digitalizado e integrado",
      "Suporte a emergÃªncias veterinÃ¡rias durante horÃ¡rio de funcionamento"
    ],
    prices: [
      { name: "Consulta Geral", value: "R$ 130,00" },
      { name: "Consulta de Especialista", value: "R$ 180,00" },
      { name: "Retorno (atÃ© 15 dias)", value: "GrÃ¡tis" }
    ],
    faq: [
      { q: "Preciso agendar consulta com antecedÃªncia?", a: "Recomendamos o agendamento para evitar esperas, mas atendemos casos urgentes por ordem de chegada de acordo com a classificaÃ§Ã£o de risco." },
      { q: "Quais especialidades vocÃªs atendem?", a: "Dispomos de dermatologia, cardiologia, ortopedia, oncologia e pediatria animal sob agendamento prÃ©vio." }
    ]
  },
  {
    id: "vacinacao",
    name: "VacinaÃ§Ã£o",
    icon: "fa-syringe",
    image: "img/unnamed (5).jpg",
    shortDescription: "ImunizaÃ§Ã£o completa com vacinas importadas de alta eficÃ¡cia.",
    description: "Manter a carteira de vacinaÃ§Ã£o em dia Ã© o ato de amor mais eficaz para proteger seu pet contra doenÃ§as fatais como a raiva, parvovirose, cinomose e a gripe canina. Na UPET, utilizamos exclusivamente vacinas importadas das marcas lÃ­deres mundiais, armazenadas sob rigoroso controle de temperatura e aplicadas sob avaliaÃ§Ã£o clÃ­nica prÃ©via.",
    benefits: [
      "AvaliaÃ§Ã£o fÃ­sica completa gratuita antes da aplicaÃ§Ã£o da vacina",
      "Lembrete automÃ¡tico via WhatsApp quando a prÃ³xima dose estiver prÃ³xima",
      "Vacinas importadas de altÃ­ssima eficÃ¡cia e proteÃ§Ã£o",
      "Carteira de vacinaÃ§Ã£o digitalizada enviada para seu e-mail"
    ],
    prices: [
      { name: "Vacina V10 (CÃ£es) - Importada", value: "R$ 110,00" },
      { name: "Vacina QuÃ¡drupla (Gatos)", value: "R$ 120,00" },
      { name: "AntirrÃ¡bica - Importada", value: "R$ 90,00" }
    ],
    faq: [
      { q: "O pet pode tomar vacina se estiver com diarreia ou febre?", a: "NÃ£o. A vacina sÃ³ deve ser aplicada em animais perfeitamente saudÃ¡veis. Nosso veterinÃ¡rio farÃ¡ um exame clÃ­nico rÃ¡pido antes da aplicaÃ§Ã£o." },
      { q: "Qual o intervalo entre as doses dos filhotes?", a: "Geralmente Ã© de 21 a 30 dias para as doses iniciais da V10/QuÃ¡drupla e da AntirrÃ¡bica." }
    ]
  },
  {
    id: "consultas",
    name: "Consultas MÃ©dicas",
    icon: "fa-user-md",
    image: "img/unnamed (6).jpg",
    shortDescription: "Atendimento clÃ­nico geral detalhado para cÃ£es, gatos e pets exÃ³ticos.",
    description: "Nossas consultas mÃ©dicas visam avaliar detalhadamente os sinais vitais, alimentaÃ§Ã£o, pele, ouvidos e comportamento do seu pet. Realizamos um exame fÃ­sico completo e, se necessÃ¡rio, solicitamos exames laboratoriais ou de imagem parceiros, traÃ§ando a melhor estratÃ©gia terapÃªutica para uma recuperaÃ§Ã£o rÃ¡pida do seu pet.",
    benefits: [
      "Abordagem holÃ­stica focada no estilo de vida do animal",
      "PrescriÃ§Ã£o de receitas digitais enviadas direto para o celular",
      "Parceria com laboratÃ³rios de ponta para exames rÃ¡pidos",
      "Acompanhamento active pÃ³s-consulta via canais digitais"
    ],
    prices: [
      { name: "Consulta de Rotina", value: "R$ 130,00" },
      { name: "Consulta de UrgÃªncia", value: "R$ 170,00" },
      { name: "Acompanhamento geriÃ¡trico", value: "R$ 150,00" }
    ],
    faq: [
      { q: "Quais exames sÃ£o feitos na prÃ³pria clÃ­nica?", a: "Fazemos coletas de sangue, raspados de pele para exames dermatolÃ³gicos rÃ¡pidos e testes rÃ¡pidos para FIV/FeLV e Erliquiose." },
      { q: "Como funciona o retorno?", a: "O retorno mÃ©dico Ã© gratuito dentro do prazo de 15 dias corridos para avaliaÃ§Ã£o da eficÃ¡cia do tratamento prescrito." }
    ]
  },
  {
    id: "loja-pet",
    name: "Loja Pet",
    icon: "fa-shopping-bag",
    image: "img/unnamed (2).jpg",
    shortDescription: "AcessÃ³rios, raÃ§Ãµes super premium e brinquedos inovadores.",
    description: "Visite a nossa boutique UPET e encontre uma seleÃ§Ã£o de produtos premium curados por nossos especialistas. Contamos com as melhores raÃ§Ãµes do mercado, brinquedos educativos que estimulam o enriquecimento ambiental, caminhas ortopÃ©dicas confortÃ¡veis, medicamentos veterinÃ¡rios e cosmÃ©ticos de higiene aprovados por nossos esteticistas.",
    benefits: [
      "RaÃ§Ãµes Super Premium conservadas em temperatura ideal",
      "Brinquedos interativos atÃ³xicos e de alta durabilidade",
      "FarmÃ¡cia veterinÃ¡ria completa com medicamentos de procedÃªncia garantida",
      "Estacionamento privativo e atendimento consultivo na escolha dos itens"
    ],
    prices: [
      { name: "RaÃ§Ãµes Super Premium", value: "A partir de R$ 45,00" },
      { name: "Brinquedos de Enriquecimento", value: "A partir de R$ 19,90" },
      { name: "Produtos de Higiene", value: "A partir de R$ 25,00" }
    ],
    faq: [
      { q: "VocÃªs fazem entregas em TaubatÃ©?", a: "Sim! Entregamos em toda a Ã¡rea urbana de TaubatÃ© com frete grÃ¡tis em compras acima de R$ 150,00." },
      { q: "Posso encomendar um produto que não está no catálogo?", a: "Com certeza! Fale com nossa equipe e encomendaremos o produto específico com prazo de entrega de até 3 dias úteis." }
    ]
  }
];

const initialProducts = [
  {
    id: "prod-1",
    name: "RaÃ§Ã£o Royal Canin Premium CÃ£es Adultos 10kg",
    category: "RaÃ§Ãµes",
    price: 189.90,
    image: "https://images.unsplash.com/photo-1589722819827-62f7ef77a771?q=80&w=600&auto=format&fit=crop",
    description: "RaÃ§Ã£o super premium indicada para cÃ£es adultos de porte mÃ©dio. Auxilia na manutenÃ§Ã£o do peso ideal, promove saÃºde da pele e pelagem brilhante, com alta digestibilidade.",
    features: ["Pelagem brilhante", "ManutenÃ§Ã£o de peso", "Ingredientes altamente selecionados"]
  },
  {
    id: "prod-2",
    name: "RaÃ§Ã£o Premiatta Gatos Castrados SalmÃ£o 1.5kg",
    category: "RaÃ§Ãµes",
    price: 64.90,
    image: "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?q=80&w=600&auto=format&fit=crop",
    description: "Alimento completo formulado especialmente para gatos adultos castrados. Controla o pH urinÃ¡rio, reduz a formaÃ§Ã£o de bolas de pelo e possui calorias controladas.",
    features: ["Controle de pH urinÃ¡rio", "ReduÃ§Ã£o de bolas de pelo", "Sabor irresistÃ­vel de salmÃ£o"]
  },
  {
    id: "prod-3",
    name: "Brinquedo Mordedor Kong Classic Vermelho MÃ©dio",
    category: "Brinquedos",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=600&auto=format&fit=crop",
    description: "O brinquedo de borracha natural nÃºmero 1 do mundo. Recomendado por veterinÃ¡rios e adestradores para aliviar o tÃ©dio, a ansiedade de separaÃ§Ã£o e estimular o enriquecimento ambiental.",
    features: ["Borracha super resistente", "Compartimento para petiscos", "Evita estresse e tÃ©dio"]
  },
  {
    id: "prod-4",
    name: "Brinquedo Varina de Penas e Catnip para Gatos",
    category: "Brinquedos",
    price: 24.90,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=600&auto=format&fit=crop",
    description: "Varinha interativa com penas naturais coloridas e guizo. ContÃ©m catnip premium no interior das penas para atrair e divertir o seu felino por horas estimulando o instinto caÃ§ador.",
    features: ["Estimula exercÃ­cio fÃ­sico", "Penas naturais e atÃ³xicas", "ContÃ©m Catnip Premium"]
  },
  {
    id: "prod-5",
    name: "Antipulgas e Carrapatos Simparic 20mg (10 a 20kg)",
    category: "RemÃ©dios",
    price: 104.90,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop",
    description: "Comprimido mastigÃ¡vel altamente palatÃ¡vel para cÃ£es. Elimina 100% das pulgas e carrapatos em poucas horas e mantÃ©m proteÃ§Ã£o activa por atÃ© 35 dias consecutivos.",
    features: ["ProteÃ§Ã£o por 35 dias", "AÃ§Ã£o rÃ¡pida em atÃ© 3 horas", "MastigÃ¡vel e palatÃ¡vel"]
  },
  {
    id: "prod-6",
    name: "VermÃ­fugo Chemital Gatos Blister com 4 Comprimidos",
    category: "RemÃ©dios",
    price: 38.90,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop",
    description: "VermÃ­fugo de amplo espectro indicado no combate de vermes redondos e chatos em gatos de todas as idades. FÃ¡cil administraÃ§Ã£o e alta seguranÃ§a.",
    features: ["Amplo espectro", "4 comprimidos", "Dosagem de alta seguranÃ§a"]
  },
  {
    id: "prod-7",
    name: "Shampoo Hidratante UPET HipoalergÃªnico Coco 500ml",
    category: "Higiene",
    price: 34.90,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop",
    description: "FÃ³rmula exclusiva desenvolvida com extrato de coco natural. Limpa suavemente, nutre profundamente os pelos secos, acalma a pele sensÃ­vel e deixa uma fragrÃ¢ncia suave.",
    features: ["HipoalergÃªnico", "Ph neutro balanceado", "Extrato natural de coco"]
  },
  {
    id: "prod-8",
    name: "Educador SanitÃ¡rio Pipi Pode Upet Pet 30ml",
    category: "Higiene",
    price: 19.90,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop",
    description: "Auxilia no adestramento sanitÃ¡rio de cÃ£es filhotes e adultos. Possui odor especÃ­fico que atrai o cÃ£o e estimula-o a fazer suas necessidades no local correto determinado pelo tutor.",
    features: ["Facilita o adestramento", "Odor atrativo exclusivo", "FÃ³rmula segura para a famÃ­lia"]
  }
];

const initialVets = [
  {
    id: "vet-1",
    name: "Dra. Mariana Silva",
    crmv: "CRMV-SP 45.192",
    specialty: "ClÃ­nica Geral & Dermatologia",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop",
    hours: "Segunda a Sexta - 09:00 Ã s 17:00",
    description: "Especialista em alergias, infecÃ§Ãµes de pele e manejo terapÃªutico de pets com dermatites crÃ´nicas. Apaixonada por cuidados integrados e bem-estar canino."
  },
  {
    id: "vet-2",
    name: "Dr. Roberto Santos",
    crmv: "CRMV-SP 38.271",
    specialty: "Cardiologia & EmergÃªncias",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
    hours: "TerÃ§a a SÃ¡bado - 08:00 Ã s 16:00",
    description: "Mais de 12 anos de experiÃªncia na Ã¡rea de cardiologia de cÃ£es e gatos. ResponsÃ¡vel pela ala de diagnÃ³sticos por imagem e triagem intensiva da UPET."
  },
  {
    id: "vet-3",
    name: "Dra. Camila Nogueira",
    crmv: "CRMV-SP 52.883",
    specialty: "Medicina Felina & Pediatria",
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=400&auto=format&fit=crop",
    hours: "Segunda, Quarta e Sexta - 10:00 Ã s 19:00",
    description: "Especialista em comportamento e clÃ­nica mÃ©dica de felinos domÃ©sticos. Atendimento especializado baseado na filosofia low-stress, sem estresse para gatos."
  }
];

const initialSchedules = [
  {
    id: "sched-1",
    clientName: "Ana de Oliveira",
    phone: "(12) 99107-1043",
    petName: "Floquinho",
    service: "Banho e Tosa",
    date: "2026-05-22",
    time: "10:30",
    status: "Pendente",
    createdAt: new Date().toISOString()
  },
  {
    id: "sched-2",
    clientName: "JoÃ£o Pedro Mendes",
    phone: "(12) 99122-3344",
    petName: "Thor",
    service: "VeterinÃ¡rio",
    date: "2026-05-23",
    time: "14:00",
    status: "Confirmado",
    createdAt: new Date().toISOString()
  }
];

const initialMessages = [
  {
    id: "msg-1",
    name: "Beatriz Mello",
    email: "beatriz@gmail.com",
    subject: "Parceria Comercial",
    message: "OlÃ¡! Gostaria de saber se vocÃªs tÃªm interesse em revender as nossas coleiras artesanais sustentÃ¡veis produzidas na regiÃ£o.",
    date: new Date().toISOString(),
    status: "NÃ£o lido"
  }
];

// InicializaÃ§Ã£o do LocalStorage
function initializeDB() {
  const needsReset = !localStorage.getItem("upet_initialized") || 
                     localStorage.getItem("upet_services")?.includes("unsplash.com");
  
  if (needsReset) {
    localStorage.setItem("upet_services", JSON.stringify(initialServices));
    localStorage.setItem("upet_products", JSON.stringify(initialProducts));
    localStorage.setItem("upet_vets", JSON.stringify(initialVets));
    localStorage.setItem("upet_schedules", JSON.stringify(initialSchedules));
    localStorage.setItem("upet_messages", JSON.stringify(initialMessages));
    localStorage.setItem("upet_initialized", "true");
    console.log("Banco de dados local UPET inicializado ou redefinido com novos assets reais.");
  }
}

// MÃ©todos de Acesso (Getters & Setters)

function getProducts() {
  initializeDB();
  return JSON.parse(localStorage.getItem("upet_products"));
}

function saveProduct(product) {
  const products = getProducts();
  if (product.id) {
    // EdiÃ§Ã£o
    const idx = products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...product };
    }
  } else {
    // Novo
    product.id = "prod-" + Date.now();
    products.push(product);
  }
  localStorage.setItem("upet_products", JSON.stringify(products));
  window.dispatchEvent(new Event("upet_products_updated"));
  return product;
}

function deleteProduct(productId) {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== productId);
  localStorage.setItem("upet_products", JSON.stringify(filtered));
  window.dispatchEvent(new Event("upet_products_updated"));
}

function getSchedules() {
  initializeDB();
  return JSON.parse(localStorage.getItem("upet_schedules"));
}

function saveSchedule(schedule) {
  const schedules = getSchedules();
  schedule.id = "sched-" + Date.now();
  schedule.status = schedule.status || "Pendente";
  schedule.createdAt = new Date().toISOString();
  schedules.push(schedule);
  localStorage.setItem("upet_schedules", JSON.stringify(schedules));
  window.dispatchEvent(new Event("upet_schedules_updated"));
  return schedule;
}

function updateScheduleStatus(scheduleId, status) {
  const schedules = getSchedules();
  const idx = schedules.findIndex(s => s.id === scheduleId);
  if (idx !== -1) {
    schedules[idx].status = status;
    localStorage.setItem("upet_schedules", JSON.stringify(schedules));
    window.dispatchEvent(new Event("upet_schedules_updated"));
    return schedules[idx];
  }
  return null;
}

function getMessages() {
  initializeDB();
  return JSON.parse(localStorage.getItem("upet_messages"));
}

function saveMessage(message) {
  const messages = getMessages();
  message.id = "msg-" + Date.now();
  message.date = new Date().toISOString();
  message.status = "NÃ£o lido";
  messages.push(message);
  localStorage.setItem("upet_messages", JSON.stringify(messages));
  window.dispatchEvent(new Event("upet_messages_updated"));
  return message;
}

function updateMessageStatus(messageId, status) {
  const messages = getMessages();
  const idx = messages.findIndex(m => m.id === messageId);
  if (idx !== -1) {
    messages[idx].status = status;
    localStorage.setItem("upet_messages", JSON.stringify(messages));
    window.dispatchEvent(new Event("upet_messages_updated"));
    return messages[idx];
  }
  return null;
}

function deleteMessage(messageId) {
  const messages = getMessages();
  const filtered = messages.filter(m => m.id !== messageId);
  localStorage.setItem("upet_messages", JSON.stringify(filtered));
  window.dispatchEvent(new Event("upet_messages_updated"));
}

function getVets() {
  initializeDB();
  return JSON.parse(localStorage.getItem("upet_vets"));
}

function getServices() {
  initializeDB();
  return JSON.parse(localStorage.getItem("upet_services"));
}

function saveService(service) {
  const services = getServices();
  const idx = services.findIndex(s => s.id === service.id);
  if (idx !== -1) {
    services[idx] = { ...services[idx], ...service };
    localStorage.setItem("upet_services", JSON.stringify(services));
    window.dispatchEvent(new Event("upet_services_updated"));
    return services[idx];
  }
  return null;
}

function resetAllData() {
  localStorage.removeItem("upet_services");
  localStorage.removeItem("upet_products");
  localStorage.removeItem("upet_vets");
  localStorage.removeItem("upet_schedules");
  localStorage.removeItem("upet_messages");
  localStorage.removeItem("upet_initialized");
  initializeDB();
  console.log("Banco de dados local UPET resetado para o estado inicial.");
  window.dispatchEvent(new Event("upet_data_reseted"));
}

// ExpÃµe no escopo global do window para acesso de outros scripts
window.UPET_DB = {
  initializeDB,
  getProducts,
  saveProduct,
  deleteProduct,
  getSchedules,
  saveSchedule,
  updateScheduleStatus,
  getMessages,
  saveMessage,
  updateMessageStatus,
  deleteMessage,
  getVets,
  getServices,
  saveService,
  resetAllData
};
