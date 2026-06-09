// Endpoints da API Flask (backend local)
const config = {
  tourismApiUrl: "http://localhost:5000/api/places",
  tourismApiMethod: "GET",
  tourismQueryParam: "q",
  tourismDateParam: "date",
  formApiUrl: "http://localhost:5000/api/contact",
  formApiMethod: "POST",
  newsletterApiUrl: "http://localhost:5000/api/newsletter"
};

let showAllPlaces = false;

function normalizeText(text) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const translations = {
  pt: {
    htmlLang: "pt-PT",
    pageTitle: "Visitar Guimarães",
    langToggleLabel: "PT | EN",
    langToggleTitle: "Mudar idioma para English",
    menuToggleLabel: "Abrir menu",
    tourismStatus: {
      fallback: "API não configurada — dados de exemplo.",
      error: "Não foi possível carregar os resultados. A mostrar sugestões locais."
    },
    newsletterStatus: {
      apiMissing: "API não configurada.",
      success: "Subscrição confirmada!",
      duplicate: "Este email já está subscrito.",
      error: "Não foi possível concluir a subscrição."
    },
    contactStatus: {
      emailjsMissing: "EmailJS não carregado.",
      sending: "A enviar...",
      success: "Mensagem enviada!",
      error: "Erro ao enviar."
    },
    text: {
      ".hero-label": "Bem-vindo a",
      "h1[data-i18n='hero_title']": "Guimarães",
      ".hero-subtitle": "Onde Portugal nasceu. Uma cidade de história, cultura e tradição viva.",
      ".hero-more span": "Descobrir mais",
      "#tourismSearchForm label[for='tourismQuery']": "O QUE PROCURA?",
      "#tourismSearchForm label[for='tourismDate']": "QUANDO?",
      "#tourismSearchForm .search-button": "🔍 Pesquisar",
      "#mainNav a:not(.nav-lang)": [
        "Descobrir",
        "História",
        "Atividades",
        "Gastronomia",
        "Galeria",
        "Eventos",
        "Alojamento",
        "Links",
        "Contacto"
      ],
      ".section-pill": [
        "Origens",
        "Pontos de Interesse",
        "Experiências",
        "Sabores Locais",
        "Fotografias",
        "Agenda",
        "Onde Ficar",
        "Recursos Úteis",
        "Fale Connosco",
        "Localização"
      ],
      ".section-title": [
        "História de Guimarães",
        "Descobrir Guimarães",
        "O que fazer em Guimarães",
        "Gastronomia Vimaranense",
        "Galeria de Imagens",
        "Eventos em Destaque",
        "Alojamento em Guimarães",
        "Ligações Externas",
        "Formulário de Contacto",
        "Como Chegar a Guimarães"
      ],
      ".section-description": [
        "A cidade onde Portugal nasceu, com mais de mil anos de história que moldaram uma nação.",
        "Explore os monumentos, paisagens e lugares únicos que fazem de Guimarães uma das cidades mais fascinantes de Portugal.",
        "De passeios históricos a aventuras na natureza, Guimarães oferece experiências únicas para todos os gostos.",
        "A cozinha de Guimarães é tão rica quanto a sua história. Descubra os sabores autênticos do Minho.",
        "Descubra Guimarães através das suas imagens mais icónicas — monumentos, ruas medievais e paisagens únicas.",
        "Guimarães tem uma agenda cultural vibrante ao longo de todo o ano.",
        "Do charme das casas históricas ao conforto dos hotéis modernos, encontre o alojamento ideal para a sua estadia.",
        "Aceda a informação oficial e recursos úteis para planear a sua visita a Guimarães.",
        "Tem dúvidas ou sugestões? Envie-nos uma mensagem e responderemos o mais brevemente possível."
      ],
      ".stat-box span": [
        "Anos de história",
        "Habitantes",
        "Património Mundial",
        "Capital Europeia da Cultura"
      ],
      ".timeline-date": ["Séc. X", "1128", "Séc. XV", "2001", "2012"],
      ".timeline-body h3": [
        "Fundação do Condado",
        "Batalha de São Mamede",
        "Paço dos Duques de Bragança",
        "Património Mundial UNESCO",
        "Capital Europeia da Cultura"
      ],
      ".timeline-body p": [
        "Guimarães surge como núcleo de poder do Condado Portucalense, com a construção do Castelo por Mumadona Dias para defesa contra as invasões mourisca e normanda.",
        "D. Afonso Henriques vence a batalha decisiva nas imediações de Guimarães, afirmando a independência do Condado Portucalense e tornando-se o primeiro rei de Portugal.",
        "D. Afonso, 1.º Duque de Bragança, manda construir o imponente palácio gótico que ainda hoje domina a colina do castelo e serve de residência oficial ao Presidente da República.",
        "O Centro Histórico de Guimarães é inscrito na Lista do Património Mundial da UNESCO, reconhecendo o seu valor universal excecional como exemplo bem preservado de cidade medieval.",
        "Guimarães acolhe o título de Capital Europeia da Cultura, consolidando a sua posição como referência cultural a nível europeu e atraindo milhares de visitantes de todo o mundo."
      ],
      "#descobrir .button-outline-wide": "Ver todos os pontos de interesse",
      ".activity-card h3": [
        "Turismo Histórico",
        "Teleférico da Penha",
        "Trilhos na Natureza",
        "Arte & Cultura",
        "Artesanato Local",
        "Desporto"
      ],
      ".activity-card p": [
        "Percursos guiados pelo centro histórico e monumentos medievais.",
        "Vistas deslumbrantes da cidade a bordo do teleférico.",
        "Caminhadas pela Serra da Penha e parques naturais.",
        "Museus, galerias e espectáculos ao longo de todo o ano.",
        "Loiça de barro, filigrana e têxteis tradicionais de Guimarães.",
        "Apoie o Vitória SC num dos estádios mais bonitos do país."
      ],
      ".banner-cta h2": "\"Aqui nasceu Portugal\"",
      ".banner-cta p": "Venha descobrir a cidade que deu origem a uma nação. Uma experiência que ficará para sempre na memória.",
      ".banner-button": "Planear a minha visita",
      ".food-card h3": [
        "Pão-de-Ló de Margaride",
        "Bacalhau à Vimaranense",
        "Vinho Verde"
      ],
      ".food-card p": [
        "Húmido por dentro, dourado por fora — quem prova uma vez raramente fica por um só pedaço.",
        "Grão-de-bico, ovo cozido, bastante azeite e a alma da cozinha minhota. Cada tasca tem a sua versão — e todas merecem ser provadas.",
        "Fresco, levemente efervescente e produzido aqui ao lado — o vinho verde local combina com tudo, mas especialmente com o peixe e o marisco do Minho."
      ],
      ".badge-food": ["Doçaria", "Prato Principal", "Vinhos"],
      ".gallery-caption": [
        "Castelo de Guimarães",
        "Largo da Oliveira",
        "Paço dos Duques",
        "Praça de Santiago",
        "Igreja da Oliveira"
      ],
      ".event-date-box span": ["Jun", "Jul", "Ago", "Set"],
      ".event-category": [
        "Festas Religiosas",
        "Música",
        "Gastronomia",
        "Desporto"
      ],
      ".event-main h3": [
        "Festas Gualterianas",
        "GNRation Festival",
        "Feira Medieval de Guimarães",
        "Meia Maratona de Guimarães"
      ],
      ".event-main p": [
        "📍 Centro Histórico   🕐 Todo o dia",
        "📍 GNRation   🕐 21h00",
        "📍 Largo da Oliveira   🕐 15h00–24h00",
        "📍 Cidade de Guimarães   🕐 09h00"
      ],
      "#eventos .button-outline-small": [
        "Ver detalhes",
        "Ver detalhes",
        "Ver detalhes",
        "Ver detalhes"
      ],
      "#eventos .button-outline-wide": "Ver agenda completa",
      ".stay-card h3": [
        "Hotel da Oliveira",
        "Pousada do Castelo",
        "HI Guimarães Pousada de Juventude"
      ],
      ".stay-location": [
        "📍 Centro Histórico",
        "📍 Colina do Castelo",
        "📍 Centro da Cidade"
      ],
      ".stay-desc": [
        "Hotel de charme no coração medieval de Guimarães, com vista para a Colegiada.",
        "Pousada histórica junto ao Castelo de Guimarães, com vistas únicas sobre a cidade.",
        "Alojamento moderno e acolhedor, perfeito para viajantes independentes e mochileiros."
      ],
      ".stay-price": [
        "A partir de 95€/noite",
        "A partir de 120€/noite",
        "A partir de 28€/noite"
      ],
      ".stay-action .button-primary-small": ["Reservar", "Reservar", "Reservar"],
      ".link-text h3": [
        "Câmara Municipal de Guimarães",
        "Guimarães Turismo",
        "UNESCO Património Mundial",
        "Turismo de Portugal",
        "Vitória Sport Clube",
        "CP Comboios de Portugal"
      ],
      ".link-text p": [
        "Portal oficial do município com serviços, notícias e informações locais.",
        "Portal oficial de turismo com guias, roteiros e agenda de eventos.",
        "Página oficial da UNESCO sobre o Centro Histórico de Guimarães.",
        "Informação turística oficial de Portugal sobre Guimarães e a região Norte.",
        "Site oficial do clube de futebol da cidade, um dos mais emblemáticos de Portugal.",
        "Horários e bilhetes de comboio para chegar a Guimarães a partir de todo o país."
      ],
      ".link-url": [
        "cm-guimaraes.pt →",
        "guimaraesturismo.com →",
        "whc.unesco.org →",
        "visitportugal.com →",
        "vitoriasc.pt →",
        "cp.pt →"
      ],
      "#contactForm label[for='contactName']": "Nome completo *",
      "#contactForm label[for='contactEmail']": "Endereço de e-mail *",
      "#contactForm label[for='contactSubject']": "Assunto *",
      "#contactForm label[for='contactMessage']": "Mensagem *",
      ".form-note": "* Campos obrigatórios",
      "#contactForm button[type='submit']": "Enviar Mensagem",
      ".newsletter-copy h2": "Fique a par das novidades",
      ".newsletter-copy p": "Subscreva o nosso boletim informativo e receba as melhores sugestões de Guimarães na sua caixa de correio.",
      ".newsletter-form .button-secondary": "Subscrever",
      ".travel-card h3": [
        "✈️ De Avião",
        "🚂 De Comboio",
        "🚗 De Carro",
        "📞 Turismo de Guimarães"
      ],
      ".footer-brand p": "O portal oficial de turismo da cidade de Guimarães, Património Mundial da UNESCO e Berço de Portugal.",
      ".footer-column h3": ["Descobrir", "Planear", "Informações"],
      ".footer-column:nth-child(2) a": [
        "Castelo de Guimarães",
        "Paço dos Duques",
        "Serra da Penha",
        "Centro Histórico",
        "Museus"
      ],
      ".footer-column:nth-child(3) a": [
        "Alojamento",
        "Restaurantes",
        "Como Chegar",
        "Transportes",
        "Guias Turísticos"
      ],
      ".footer-column:nth-child(4) a": [
        "Sobre Guimarães",
        "Formulário",
        "Recursos uteis",
        "Agenda",
        "Contactos"
      ],
      ".footer-bottom p": [
        "© 2026 Visitar Guimarães — Câmara Municipal de Guimarães. Todos os direitos reservados.",
        "Desenvolvido com ❤️ para promover o turismo vimaranense."
      ],
      "#chatBox > div:first-child span": "Guia IA de Guimarães 🤖",
      "#chatMessages > div:first-child": "Olá! Sou o guia turístico com Inteligência Artificial de Guimarães. Pergunte-me qualquer coisa sobre a cidade!"
    },
    html: {
      ".brand-line": [
        "Visitar <strong>Guimarães</strong>",
        "Visitar <strong>Guimarães</strong>"
      ],
      ".brand-subline": [
        "Berço de Portugal",
        "Berço de Portugal"
      ],
      ".form-check label": "Aceito a <a href=\"#\">Política de Privacidade</a> e autorizo o tratamento dos meus dados pessoais. *",
      ".travel-card p": [
        "Aeroporto Francisco Sá Carneiro (Porto) — a 50 km. Ligação por autocarro ou táxi.",
        "Linha do Minho com ligação directa à cidade. Estação no centro urbano.",
        "Via A3 (Porto–Braga) + A11 ou Via A7. Parques de estacionamento no centro.",
        "Praça de Santiago, Centro Histórico<br>Tel: +351 253 421 221<br>turismo@cm-guimaraes.pt"
      ]
    },
    placeholders: {
      "#tourismQuery": "Monumentos, eventos, restaurantes...",
      "#contactName": "O seu nome",
      "#contactEmail": "exemplo@email.com",
      "#contactMessage": "Escreva a sua mensagem...",
      "#email": "O seu endereço de correio eletrónico",
      "#chatInput": "Pergunte algo sobre Guimarães..."
    },
    selectOptions: {
      "#contactSubject option": [
        "Selecione um assunto...",
        "Pedido de informação",
        "Alojamento",
        "Eventos",
        "Sugestão",
        "Outro"
      ]
    },
    tourismPlaces: [
  {
    category: "Palácios",
    title: "Paço dos Duques de Bragança",
    imageClass: "image-paco-duques",
    badge: "Imperdível",
    description: "Construído no século XV pelo 1.º Duque de Bragança, é um dos palácios medievais mais marcantes de Portugal."
  },
  {
    category: "Monumentos",
    title: "Castelo de Guimarães",
    imageClass: "image-castelo-guimaraes",
    description: "Símbolo da fundação de Portugal e um dos monumentos mais icónicos da cidade."
  },
  {
    category: "Centro Histórico",
    title: "Centro Histórico",
    imageClass: "image-centro-historico",
    badge: "UNESCO",
    description: "Ruas medievais, praças animadas e um ambiente único que convida a explorar a pé."
  },
  {
    category: "Igrejas",
    title: "Igreja da Oliveira",
    imageClass: "image-igreja-oliveira",
    description: "Um dos marcos religiosos e históricos mais importantes do coração da cidade."
  },
  {
    category: "Museus",
    title: "Museu Martins Sarmento",
    imageClass: "image-museu-martins",
    description: "Coleção arqueológica de referência para conhecer melhor a herança castreja e romana da região."
  },
  {
    category: "Natureza",
    title: "Serra da Penha",
    imageClass: "image-serra-penha",
    description: "Suba de teleférico ou a pé e descubra uma das melhores vistas panorâmicas sobre Guimarães."
  },
  {
    category: "Museus",
    title: "Museu Alberto Sampaio",
    imageClass: "image-museu-alberto",
    description: "Instalado no antigo convento da Colegiada, alberga peças de ourivesaria, escultura e têxteis medievais."
  },
  {
    category: "Palácios",
    title: "Sala de Armas do Paço dos Duques",
    imageClass: "image-paco-armas",
    description: "Uma das salas mais imponentes do Paço, com uma vasta coleção de armaduras e armas históricas."
  },
  {
    category: "Monumentos",
    title: "Muralhas Medievais",
    imageClass: "image-muralhas",
    description: "Troços das antigas muralhas que cercavam a cidade medieval, testemunhas silenciosas de séculos de história."
  },
  {
    category: "Igrejas",
    title: "Igreja de São Francisco",
    imageClass: "image-sao-francisco",
    description: "Igreja do século XV com belos azulejos barrocos e um claustro sereno no coração da cidade."
  },
  {
    category: "Cultura",
    title: "Plataforma das Artes e da Cultura",
    imageClass: "image-plataforma-artes",
    description: "Espaço cultural contemporâneo com exposições, workshops e uma programação vibrante ao longo do ano."
  },
  {
    category: "Natureza",
    title: "Parque da Cidade",
    imageClass: "image-parque-cidade",
    description: "Um pulmão verde no coração de Guimarães, ideal para caminhadas, piqueniques e momentos de lazer."
  }
],
    readMoreLabel: "Saber mais →",
    defaultPlaceCategory: "Local",
    defaultPlaceTitle: "Ponto turístico"
  },
  en: {
    htmlLang: "en",
    pageTitle: "Visit Guimaraes",
    langToggleLabel: "EN | PT",
    langToggleTitle: "Switch language to Português",
    menuToggleLabel: "Open menu",
    tourismStatus: {
      fallback: "API not configured — showing sample data.",
      error: "Could not load the results. Showing local suggestions instead."
    },
    newsletterStatus: {
      apiMissing: "API not configured.",
      success: "Subscription confirmed!",
      duplicate: "This email is already subscribed.",
      error: "Could not complete the subscription."
    },
    contactStatus: {
      emailjsMissing: "EmailJS not loaded.",
      sending: "Sending...",
      success: "Message sent!",
      error: "Error sending the message."
    },
    text: {
      ".hero-label": "Welcome to",
      "h1[data-i18n='hero_title']": "Guimarães",
      ".hero-subtitle": "Where Portugal was born. A city of history, culture and living tradition.",
      ".hero-more span": "Discover more",
      "#tourismSearchForm label[for='tourismQuery']": "WHAT ARE YOU LOOKING FOR?",
      "#tourismSearchForm label[for='tourismDate']": "WHEN?",
      "#tourismSearchForm .search-button": "🔍 Search",
      "#mainNav a:not(.nav-lang)": [
        "Discover",
        "History",
        "Activities",
        "Gastronomy",
        "Gallery",
        "Events",
        "Accommodation",
        "Links",
        "Contact"
      ],
      ".section-pill": [
        "Origins",
        "Highlights",
        "Experiences",
        "Local Flavours",
        "Photos",
        "Agenda",
        "Where to Stay",
        "Useful Resources",
        "Talk to Us",
        "Location"
      ],
      ".section-title": [
        "History of Guimarães",
        "Discover Guimarães",
        "What to Do in Guimarães",
        "Guimarães Gastronomy",
        "Image Gallery",
        "Featured Events",
        "Where to Stay in Guimarães",
        "External Links",
        "Contact Form",
        "How to Get to Guimarães"
      ],
      ".section-description": [
        "The city where Portugal was born, with more than a thousand years of history that helped shape a nation.",
        "Explore the monuments, landscapes and unique places that make Guimarães one of the most fascinating cities in Portugal.",
        "From historical walks to nature adventures, Guimarães offers unique experiences for every taste.",
        "The cuisine of Guimarães is as rich as its history. Discover the authentic flavours of Minho.",
        "Discover Guimarães through its most iconic images — monuments, medieval streets and unique landscapes.",
        "Guimarães has a vibrant cultural calendar all year round.",
        "From the charm of historic houses to the comfort of modern hotels, find the ideal stay for your trip.",
        "Access official information and useful resources to plan your visit to Guimarães.",
        "Do you have any questions or suggestions? Send us a message and we will reply as soon as possible."
      ],
      ".stat-box span": [
        "Years of history",
        "Residents",
        "World Heritage",
        "European Capital of Culture"
      ],
      ".timeline-date": ["10th c.", "1128", "15th c.", "2001", "2012"],
      ".timeline-body h3": [
        "Foundation of the County",
        "Battle of São Mamede",
        "Palace of the Dukes of Braganza",
        "UNESCO World Heritage",
        "European Capital of Culture"
      ],
      ".timeline-body p": [
        "Guimarães emerged as a centre of power in the County of Portugal, with the castle built by Mumadona Dias to defend the region from Moorish and Norman invasions.",
        "Afonso Henriques won the decisive battle near Guimarães, asserting the independence of the County of Portugal and becoming the first king of Portugal.",
        "Afonso, the 1st Duke of Braganza, commissioned the imposing Gothic palace that still dominates the castle hill and serves as an official residence of the Portuguese President.",
        "The Historic Centre of Guimarães was added to UNESCO's World Heritage List, recognising its exceptional universal value as a well-preserved medieval city.",
        "Guimarães held the title of European Capital of Culture, strengthening its position as a cultural reference in Europe and attracting thousands of visitors from around the world."
      ],
      "#descobrir .button-outline-wide": "See all places of interest",
      ".activity-card h3": [
        "Historical Tourism",
        "Penha Cable Car",
        "Nature Trails",
        "Art & Culture",
        "Local Crafts",
        "Sport"
      ],
      ".activity-card p": [
        "Guided routes through the historic centre and medieval monuments.",
        "Breathtaking city views aboard the cable car.",
        "Walks through Penha Mountain and nearby natural parks.",
        "Museums, galleries and live performances throughout the year.",
        "Pottery, filigree and traditional textiles from Guimarães.",
        "Support Vitória SC in one of the most beautiful stadiums in the country."
      ],
      ".banner-cta h2": "\"Portugal Was Born Here\"",
      ".banner-cta p": "Come and discover the city that gave birth to a nation. An experience you will never forget.",
      ".banner-button": "Plan my visit",
      ".food-card h3": [
        "Pão-de-Ló de Margaride",
        "Bacalhau à Vimaranense",
        "Vinho Verde"
      ],
      ".food-card p": [
        "Moist on the inside, golden on the outside — once you taste it, one slice is never enough.",
        "Chickpeas, boiled egg, plenty of olive oil and the soul of Minho cuisine. Every traditional restaurant has its own version — and they are all worth trying.",
        "Fresh, lightly sparkling and produced nearby — local Vinho Verde pairs with almost everything, especially fish and seafood from Minho."
      ],
      ".badge-food": ["Desserts", "Main Course", "Wines"],
      ".gallery-caption": [
        "Guimarães Castle",
        "Oliveira Square",
        "Dukes' Palace",
        "Santiago Square",
        "Oliveira Church"
      ],
      ".event-date-box span": ["Jun", "Jul", "Aug", "Sep"],
      ".event-category": [
        "Religious Festivities",
        "Music",
        "Gastronomy",
        "Sport"
      ],
      ".event-main h3": [
        "Gualterianas Festivities",
        "GNRation Festival",
        "Guimarães Medieval Fair",
        "Guimarães Half Marathon"
      ],
      ".event-main p": [
        "📍 Historic Centre   🕐 All day",
        "📍 GNRation   🕐 9:00 PM",
        "📍 Oliveira Square   🕐 3:00 PM–12:00 AM",
        "📍 Guimarães   🕐 9:00 AM"
      ],
      "#eventos .button-outline-small": [
        "View details",
        "View details",
        "View details",
        "View details"
      ],
      "#eventos .button-outline-wide": "See full agenda",
      ".stay-card h3": [
        "Hotel da Oliveira",
        "Pousada do Castelo",
        "HI Guimarães Youth Hostel"
      ],
      ".stay-location": [
        "📍 Historic Centre",
        "📍 Castle Hill",
        "📍 City Centre"
      ],
      ".stay-desc": [
        "Charming hotel in the medieval heart of Guimarães, overlooking the Collegiate Church.",
        "Historic hotel next to Guimarães Castle, with unique views over the city.",
        "Modern and welcoming accommodation, perfect for independent travellers and backpackers."
      ],
      ".stay-price": [
        "From €95/night",
        "From €120/night",
        "From €28/night"
      ],
      ".stay-action .button-primary-small": ["Book", "Book", "Book"],
      ".link-text h3": [
        "Guimarães City Council",
        "Guimarães Tourism",
        "UNESCO World Heritage",
        "Tourism of Portugal",
        "Vitória Sport Clube",
        "CP Portuguese Railways"
      ],
      ".link-text p": [
        "Official municipality portal with services, news and local information.",
        "Official tourism portal with guides, itineraries and the events calendar.",
        "UNESCO's official page about the Historic Centre of Guimarães.",
        "Official tourism information about Guimarães and Northern Portugal.",
        "Official website of the city's football club, one of the most iconic in Portugal.",
        "Train schedules and tickets to reach Guimarães from all over the country."
      ],
      ".link-url": [
        "cm-guimaraes.pt →",
        "guimaraesturismo.com →",
        "whc.unesco.org →",
        "visitportugal.com →",
        "vitoriasc.pt →",
        "cp.pt →"
      ],
      "#contactForm label[for='contactName']": "Full name *",
      "#contactForm label[for='contactEmail']": "Email address *",
      "#contactForm label[for='contactSubject']": "Subject *",
      "#contactForm label[for='contactMessage']": "Message *",
      ".form-note": "* Required fields",
      "#contactForm button[type='submit']": "Send Message",
      ".newsletter-copy h2": "Stay up to date",
      ".newsletter-copy p": "Subscribe to our newsletter and receive the best suggestions from Guimarães in your inbox.",
      ".newsletter-form .button-secondary": "Subscribe",
      ".travel-card h3": [
        "✈️ By Plane",
        "🚂 By Train",
        "🚗 By Car",
        "📞 Guimarães Tourism"
      ],
      ".footer-brand p": "The official tourism portal for the city of Guimarães, a UNESCO World Heritage site and the birthplace of Portugal.",
      ".footer-column h3": ["Discover", "Plan", "Information"],
      ".footer-column:nth-child(2) a": [
        "Guimarães Castle",
        "Dukes' Palace",
        "Penha Mountain",
        "Historic Centre",
        "Museums"
      ],
      ".footer-column:nth-child(3) a": [
        "Accommodation",
        "Restaurants",
        "How to Get Here",
        "Transport",
        "Tour Guides"
      ],
      ".footer-column:nth-child(4) a": [
        "About Guimarães",
        "Accessible Tourism",
        "Press",
        "Privacy Policy",
        "Contacts"
      ],
      ".footer-bottom p": [
        "© 2026 Visit Guimaraes — Guimarães City Council. All rights reserved.",
        "Developed with ❤️ to promote tourism in Guimarães."
      ],
      "#chatBox > div:first-child span": "Guimarães AI Guide 🤖",
      "#chatMessages > div:first-child": "Hello! I am Guimarães' AI tourist guide. Ask me anything about the city!"
    },
    html: {
      ".brand-line": [
        "Visit <strong>Guimarães</strong>",
        "Visit <strong>Guimarães</strong>"
      ],
      ".brand-subline": [
        "Birthplace of Portugal",
        "Birthplace of Portugal"
      ],
      ".form-check label": "I accept the <a href=\"#\">Privacy Policy</a> and authorize the processing of my personal data. *",
      ".travel-card p": [
        "Francisco Sá Carneiro Airport (Porto) — 50 km away. Bus and taxi connections available.",
        "Minho railway line with a direct connection to the city. Station in the urban centre.",
        "Take the A3 motorway (Porto–Braga) plus the A11 or A7. Parking is available in the centre.",
        "Praça de Santiago, Historic Centre<br>Tel: +351 253 421 221<br>turismo@cm-guimaraes.pt"
      ]
    },
    placeholders: {
      "#tourismQuery": "Monuments, events, restaurants...",
      "#contactName": "Your name",
      "#contactEmail": "example@email.com",
      "#contactMessage": "Write your message...",
      "#email": "Your email address",
      "#chatInput": "Ask something about Guimarães..."
    },
    selectOptions: {
      "#contactSubject option": [
        "Select a subject...",
        "Information request",
        "Accommodation",
        "Events",
        "Suggestion",
        "Other"
      ]
    },
   tourismPlaces: [
  {
    category: "Palaces",
    title: "Palace of the Dukes of Braganza",
    imageClass: "image-paco-duques",
    badge: "Must-see",
    description: "Built in the 15th century by the 1st Duke of Braganza, it is one of Portugal's most striking medieval palaces."
  },
  {
    category: "Monuments",
    title: "Guimarães Castle",
    imageClass: "image-castelo-guimaraes",
    description: "A symbol of Portugal's foundation and one of the city's most iconic monuments."
  },
  {
    category: "Historic Centre",
    title: "Historic Centre",
    imageClass: "image-centro-historico",
    badge: "UNESCO",
    description: "Medieval streets, lively squares and a unique atmosphere that invites you to explore on foot."
  },
  {
    category: "Churches",
    title: "Oliveira Church",
    imageClass: "image-igreja-oliveira",
    description: "One of the most important religious and historical landmarks in the heart of the city."
  },
  {
    category: "Museums",
    title: "Martins Sarmento Museum",
    imageClass: "image-museu-martins",
    description: "A landmark archaeological collection to better understand the region's Celtic and Roman heritage."
  },
  {
    category: "Nature",
    title: "Penha Mountain",
    imageClass: "image-serra-penha",
    description: "Go up by cable car or on foot and enjoy one of the best panoramic views over Guimarães."
  },
  {
    category: "Museums",
    title: "Alberto Sampaio Museum",
    imageClass: "image-museu-alberto",
    description: "Housed in the former collegiate convent, it holds outstanding medieval goldwork, sculpture and textiles."
  },
  {
    category: "Palaces",
    title: "Dukes' Palace — Armoury",
    imageClass: "image-paco-armas",
    description: "One of the palace's most impressive rooms, featuring a remarkable collection of armour and historic weapons."
  },
  {
    category: "Monuments",
    title: "Medieval Walls",
    imageClass: "image-muralhas",
    description: "Remaining sections of the walls that once enclosed the medieval city, silent witnesses to centuries of history."
  },
  {
    category: "Churches",
    title: "São Francisco Church",
    imageClass: "image-sao-francisco",
    description: "A 15th-century church with beautiful baroque azulejos and a serene cloister in the heart of the city."
  },
  {
    category: "Culture",
    title: "Platform for Arts and Culture",
    imageClass: "image-plataforma-artes",
    description: "A contemporary cultural space with exhibitions, workshops and a vibrant programme throughout the year."
  },
  {
    category: "Nature",
    title: "City Park",
    imageClass: "image-parque-cidade",
    description: "A green lung in the heart of Guimarães, perfect for walks, picnics and relaxing moments."
  }
],
    readMoreLabel: "Learn more →",
    defaultPlaceCategory: "Place",
    defaultPlaceTitle: "Tourist attraction"
  }
};

const newsletterPopupContent = {
  pt: {
    button: "Fechar",
    closeLabel: "Fechar popup",
    successTitle: "Subscrição confirmada",
    successMessage: (email) => `${email} foi adicionado à newsletter com sucesso.`,
    duplicateTitle: "Email já registado",
    duplicateMessage: (email) => `${email} já está subscrito na newsletter.`,
    errorTitle: "Algo correu mal",
    errorMessage: "Não foi possível concluir a subscrição. Tente novamente dentro de instantes."
  },
  en: {
    button: "Close",
    closeLabel: "Close popup",
    successTitle: "Subscription confirmed",
    successMessage: (email) => `${email} was added to the newsletter successfully.`,
    duplicateTitle: "Email already registered",
    duplicateMessage: (email) => `${email} is already subscribed to the newsletter.`,
    errorTitle: "Something went wrong",
    errorMessage: "The subscription could not be completed. Please try again in a moment."
  }
};

const NEWSLETTER_STORAGE_KEY = "guimaraesNewsletterSubscribers";

const dom = {};
const statusState = {
  tourism: "",
  newsletter: "",
  contact: ""
};

function readFromStorage(key, fallbackValue = null) {
  try {
    const value = window.localStorage.getItem(key);
    return value ?? fallbackValue;
  } catch (error) {
    console.warn(`Could not read "${key}" from localStorage.`, error);
    return fallbackValue;
  }
}

function writeToStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Could not write "${key}" to localStorage.`, error);
    return false;
  }
}

let currentLang = readFromStorage("lang", "pt") || "pt";
let tourismDataSource = "fallback";
let newsletterPopupState = null;
let newsletterPopupTrigger = null;

function setNodeContent(selector, value, mode = "text") {
  const nodes = document.querySelectorAll(selector);
  if (!nodes.length) return;

  const values = Array.isArray(value) ? value : Array(nodes.length).fill(value);

  nodes.forEach((node, index) => {
    const content = values[index];
    if (content === undefined) return;

    if (mode === "html") {
      node.innerHTML = content;
      return;
    }

    node.textContent = content;
  });
}

function setNodeAttribute(selector, attribute, value) {
  const nodes = document.querySelectorAll(selector);
  if (!nodes.length) return;

  const values = Array.isArray(value) ? value : Array(nodes.length).fill(value);

  nodes.forEach((node, index) => {
    const content = values[index];
    if (content === undefined) return;
    node.setAttribute(attribute, content);
  });
}

function setStatus(kind, key) {
  statusState[kind] = key;

  const elementMap = {
    tourism: dom.tourismStatus,
    newsletter: dom.formStatus,
    contact: dom.contactStatus
  };

  const groupMap = {
    tourism: "tourismStatus",
    newsletter: "newsletterStatus",
    contact: "contactStatus"
  };

  const element = elementMap[kind];
  const group = groupMap[kind];
  if (!element || !group) return;

  element.textContent = key ? translations[currentLang][group][key] || "" : "";
}

function clearStatus(kind) {
  setStatus(kind, "");
}

function getNewsletterPopupCopy() {
  return newsletterPopupContent[currentLang] || newsletterPopupContent.pt;
}

function getNewsletterPopupConfig(type, email = "") {
  const copy = getNewsletterPopupCopy();

  return {
    success: {
      icon: "âœ“",
      iconClass: "",
      title: copy.successTitle,
      message: copy.successMessage(email)
    },
    duplicate: {
      icon: "i",
      iconClass: "is-info",
      title: copy.duplicateTitle,
      message: copy.duplicateMessage(email)
    },
    error: {
      icon: "!",
      iconClass: "is-error",
      title: copy.errorTitle,
      message: copy.errorMessage
    }
  }[type] || null;
}

function showNewsletterAlert(type, email = "") {
  const popupConfig = getNewsletterPopupConfig(type, email);
  if (!popupConfig) return;

  window.alert(`${popupConfig.title}\n\n${popupConfig.message}`);
}

function saveNewsletterSubscription(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    return { duplicate: false, saved: false };
  }

  let subscribers = [];

  try {
    subscribers = JSON.parse(readFromStorage(NEWSLETTER_STORAGE_KEY, "[]") || "[]");
    if (!Array.isArray(subscribers)) {
      subscribers = [];
    }
  } catch {
    subscribers = [];
  }

  if (subscribers.includes(normalizedEmail)) {
    return { duplicate: true, saved: false };
  }

  subscribers.push(normalizedEmail);
  const saved = writeToStorage(NEWSLETTER_STORAGE_KEY, JSON.stringify(subscribers));

  return { duplicate: false, saved };
}

function renderNewsletterPopup() {
  if (
    !newsletterPopupState ||
    !dom.newsletterPopup ||
    !dom.newsletterPopupTitle ||
    !dom.newsletterPopupMessage ||
    !dom.newsletterPopupAction ||
    !dom.newsletterPopupClose ||
    !dom.newsletterPopupIcon
  ) {
    return;
  }

  const copy = getNewsletterPopupCopy();
  const popupConfig = {
    success: {
      icon: "✓",
      iconClass: "",
      title: copy.successTitle,
      message: copy.successMessage(newsletterPopupState.email)
    },
    duplicate: {
      icon: "i",
      iconClass: "is-info",
      title: copy.duplicateTitle,
      message: copy.duplicateMessage(newsletterPopupState.email)
    },
    error: {
      icon: "!",
      iconClass: "is-error",
      title: copy.errorTitle,
      message: copy.errorMessage
    }
  }[newsletterPopupState.type];

  if (!popupConfig) return;

  dom.newsletterPopupIcon.className = `newsletter-popup-icon ${popupConfig.iconClass}`.trim();
  dom.newsletterPopupIcon.textContent = popupConfig.icon;
  dom.newsletterPopupTitle.textContent = popupConfig.title;
  dom.newsletterPopupMessage.textContent = popupConfig.message;
  dom.newsletterPopupAction.textContent = copy.button;
  dom.newsletterPopupClose.setAttribute("aria-label", copy.closeLabel);
}

function openNewsletterPopup(type, email = "") {
  if (!dom.newsletterPopup) {
    showNewsletterAlert(type, email);
    return;
  }

  newsletterPopupTrigger = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;
  newsletterPopupState = { type, email };
  renderNewsletterPopup();

  dom.newsletterPopup.classList.add("is-visible");
  dom.newsletterPopup.setAttribute("aria-hidden", "false");
  document.body.classList.add("newsletter-popup-open");

  requestAnimationFrame(() => {
    (dom.newsletterPopupAction || dom.newsletterPopupClose)?.focus();
  });
}

function closeNewsletterPopup() {
  if (!dom.newsletterPopup) return;

  dom.newsletterPopup.classList.remove("is-visible");
  dom.newsletterPopup.setAttribute("aria-hidden", "true");
  document.body.classList.remove("newsletter-popup-open");
  newsletterPopupState = null;

  const fallbackField = dom.newsletterForm?.querySelector('input[name="email"]');
  const focusTarget = newsletterPopupTrigger || fallbackField;

  newsletterPopupTrigger = null;
  focusTarget?.focus?.();
}

function getFallbackTourismPlaces(lang = currentLang) {
  return translations[lang].tourismPlaces;
}

function createTourismCard(place) {
  const article = document.createElement("article");
  article.className = "place-card place-card-small";

  const imageClass = place.imageClass || "image-centro";
  const badge = place.badge
    ? `<span class="badge badge-soft">${place.badge}</span>`
    : "";

  article.innerHTML = `
    <div class="place-image ${imageClass}">${badge}</div>
    <span class="card-tag">${place.category || translations[currentLang].defaultPlaceCategory}</span>
    <h3>${place.title || translations[currentLang].defaultPlaceTitle}</h3>
    <p class="card-description">${place.description || ""}</p>
    <a class="inline-link" href="#">${translations[currentLang].readMoreLabel}</a>
  `;

  return article;
}

function renderTourismPlaces(places) {
  if (!dom.tourismResults) return;

  dom.tourismResults.innerHTML = "";

  const visiblePlaces = showAllPlaces ? places : places.slice(0, 6);

  visiblePlaces.forEach((place) => {
    dom.tourismResults.appendChild(createTourismCard(place));
  });
}
function renderFallbackTourismPlaces() {
  tourismDataSource = "fallback";
  renderTourismPlaces(getFallbackTourismPlaces());
}

function normalizeTourismData(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;
  return getFallbackTourismPlaces();
}










function getAllTourismData() {
  return translations[currentLang].tourismPlaces;
}


function normalizeCategory(text) {
  return normalizeText(text)
    .replace(/s$/, ""); // remove plural simples (palacios -> palacio)
}

function filterTourismPlaces(query, date) {
  const all = getAllTourismData();

  const q = normalizeText(query);
  const qCat = normalizeCategory(query);

  let results = [...all];

  if (q) {
    results = results.filter(place => {
      const title = normalizeText(place.title);
      const desc = normalizeText(place.description);
      const category = normalizeCategory(place.category);

      return (
        title.includes(q) ||
        desc.includes(q) ||
        category.includes(q) ||      // palácio, igreja, etc
        category.includes(qCat)       // versão normalizada
      );
    });
  }

  if (date) {
    results.sort((a, b) => {
      const aIsEvent = (a.category || "").toLowerCase().includes("event");
      const bIsEvent = (b.category || "").toLowerCase().includes("event");
      return (bIsEvent === aIsEvent) ? 0 : (bIsEvent ? 1 : -1);
    });
  }

  return results;
}











function applyLanguage(lang) {
  currentLang = translations[lang] ? lang : "pt";
  const content = translations[currentLang];

  document.documentElement.lang = content.htmlLang;
  document.title = content.pageTitle;

  Object.entries(content.text).forEach(([selector, value]) => {
    setNodeContent(selector, value, "text");
  });

  Object.entries(content.html).forEach(([selector, value]) => {
    setNodeContent(selector, value, "html");
  });

  Object.entries(content.placeholders).forEach(([selector, value]) => {
    setNodeAttribute(selector, "placeholder", value);
  });

  Object.entries(content.selectOptions).forEach(([selector, value]) => {
    setNodeContent(selector, value, "text");
  });

  if (dom.menuToggle) {
    dom.menuToggle.setAttribute("aria-label", content.menuToggleLabel);
  }

  if (dom.langToggle) {
    dom.langToggle.textContent = content.langToggleLabel;
    dom.langToggle.setAttribute("title", content.langToggleTitle);
    dom.langToggle.setAttribute("aria-label", content.langToggleTitle);
  }

  // Re-consulta a API com o novo idioma (ou usa fallback se offline)
  fetchTourismPlaces("", "");

  if (statusState.tourism) setStatus("tourism", statusState.tourism);
  if (statusState.newsletter) setStatus("newsletter", statusState.newsletter);
  if (statusState.contact) setStatus("contact", statusState.contact);
  if (newsletterPopupState) renderNewsletterPopup();

  writeToStorage("lang", currentLang);
}

async function fetchTourismPlaces(query, date) {
  if (!config.tourismApiUrl) {
    setStatus("tourism", "fallback");
    renderFallbackTourismPlaces();
    return;
  }

  try {
    const url = new URL(config.tourismApiUrl);
    if (query) url.searchParams.set(config.tourismQueryParam, query);
    if (date)  url.searchParams.set(config.tourismDateParam, date);
    url.searchParams.set("lang", currentLang);

    const response = await fetch(url.toString(), { method: config.tourismApiMethod });

    if (!response.ok) throw new Error("API respondeu com " + response.status);

    const data = await response.json();
    tourismDataSource = "api";
    clearStatus("tourism");
    renderTourismPlaces(normalizeTourismData(data));
  } catch (error) {
    console.error("[API places]", error);
    setStatus("tourism", "error");
    renderFallbackTourismPlaces();
  }
}


document.addEventListener("DOMContentLoaded", () => {


const showAllPlacesBtn = document.getElementById("showAllPlaces");

if (showAllPlacesBtn) {
  showAllPlacesBtn.addEventListener("click", function (e) {
    e.preventDefault();

    showAllPlaces = !showAllPlaces;

    const allPlaces = getAllTourismData();

    if (showAllPlaces) {
      renderTourismPlaces(allPlaces);
      this.textContent = "Ver menos pontos de interesse";
    } else {
      renderTourismPlaces(allPlaces.slice(0, 6));
      this.textContent = "Ver todos os pontos de interesse";
    }
  });
}


  dom.tourismResults = document.getElementById("tourismResults");
  dom.tourismStatus = document.getElementById("tourismStatus");
  dom.tourismSearchForm = document.getElementById("tourismSearchForm");
  dom.newsletterForm = document.getElementById("newsletterForm");
  dom.formStatus = document.getElementById("formStatus");
  dom.newsletterPopup = document.getElementById("newsletterPopup");
  dom.newsletterPopupClose = document.getElementById("newsletterPopupClose");
  dom.newsletterPopupIcon = document.getElementById("newsletterPopupIcon");
  dom.newsletterPopupTitle = document.getElementById("newsletterPopupTitle");
  dom.newsletterPopupMessage = document.getElementById("newsletterPopupMessage");
  dom.newsletterPopupAction = document.getElementById("newsletterPopupAction");
  dom.menuToggle = document.getElementById("menuToggle");
  dom.mainNav = document.getElementById("mainNav");
  dom.langToggle = document.querySelector(".nav-lang");
  dom.contactForm = document.getElementById("contactForm");
  dom.contactStatus = document.getElementById("contactStatus");
  dom.chatToggle = document.getElementById("chatToggle");
  dom.chatBox = document.getElementById("chatBox");
  dom.closeChat = document.getElementById("closeChat");
  dom.chatMessages = document.getElementById("chatMessages");
  dom.chatInput = document.getElementById("chatInput");
  dom.chatSendBtn = document.getElementById("chatSendBtn");

  if (dom.langToggle) {
    dom.langToggle.addEventListener("click", (event) => {
      event.preventDefault();
      applyLanguage(currentLang === "pt" ? "en" : "pt");
    });
  }

  if (dom.newsletterPopupClose) {
    dom.newsletterPopupClose.addEventListener("click", closeNewsletterPopup);
  }

  if (dom.newsletterPopupAction) {
    dom.newsletterPopupAction.addEventListener("click", closeNewsletterPopup);
  }

  if (dom.newsletterPopup) {
    dom.newsletterPopup.addEventListener("click", (event) => {
      if (event.target === dom.newsletterPopup) {
        closeNewsletterPopup();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dom.newsletterPopup?.classList.contains("is-visible")) {
      closeNewsletterPopup();
    }
  });


const suggestions = document.querySelectorAll(".chat-suggestion");

suggestions.forEach(btn => {
  btn.addEventListener("click", () => {
    const text = btn.textContent;

    // mostra mensagem do utilizador
    dom.chatMessages.innerHTML += `<div class="user-msg">${text}</div>`;

    // resposta automática simples (podes melhorar depois)
    let reply = "";

    if (text.includes("comer")) {
      reply = "Em Guimarães tens ótimos restaurantes como Cozinha Regional e Histórico by Papaboa.";
    } 
    else if (text.includes("Castelo")) {
      reply = "O Castelo de Guimarães é do século X e é considerado o berço de Portugal.";
    } 
    else {
      reply = "Posso ajudar-te com informações sobre turismo, história e locais a visitar em Guimarães.";
    }

    setTimeout(() => {
      dom.chatMessages.innerHTML += `<div class="bot-msg">${reply}</div>`;
      dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
    }, 500);
  });
});



if (dom.tourismSearchForm) {
  dom.tourismSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(dom.tourismSearchForm);
    const query = formData.get("query") || "";
    const date = formData.get("date") || "";

    const results = filterTourismPlaces(query, date);

    tourismDataSource = "filtered";
    renderTourismPlaces(results);

    // feedback UX
    if (results.length === 0) {
      setStatus("tourism", "error");
    } else {
      clearStatus("tourism");
    }

    // scroll automático para resultados
    dom.tourismResults?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
}










  if (dom.newsletterForm) {
    dom.newsletterForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!dom.newsletterForm.reportValidity()) return;

      const email = String(new FormData(dom.newsletterForm).get("email") || "").trim();
      const submitButton = dom.newsletterForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      // URL da API de newsletter (endpoint dedicado no Flask)
      const newsletterUrl = config.newsletterApiUrl || "";

      try {
        if (!newsletterUrl) {
          // Fallback: guarda só no localStorage se o servidor não estiver disponível
          const { duplicate } = saveNewsletterSubscription(email);
          setStatus("newsletter", duplicate ? "duplicate" : "success");
          openNewsletterPopup(duplicate ? "duplicate" : "success", email);
          dom.newsletterForm.reset();
          return;
        }

        const response = await fetch(newsletterUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (result.ok) {
          saveNewsletterSubscription(email); // guarda também localmente
          setStatus("newsletter", result.duplicate ? "duplicate" : "success");
          openNewsletterPopup(result.duplicate ? "duplicate" : "success", email);
          dom.newsletterForm.reset();
        } else {
          throw new Error(result.message || "Erro desconhecido");
        }
      } catch (error) {
        console.error("[API newsletter]", error);
        // Fallback localStorage se o servidor falhar
        const { duplicate } = saveNewsletterSubscription(email);
        setStatus("newsletter", duplicate ? "duplicate" : "success");
        openNewsletterPopup(duplicate ? "duplicate" : "success", email);
        dom.newsletterForm.reset();
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  if (dom.menuToggle && dom.mainNav) {
    dom.menuToggle.addEventListener("click", () => {
      dom.mainNav.classList.toggle("open");
    });
  }

  if (dom.contactForm) {
    dom.contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const submitButton = this.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      setStatus("contact", "sending");

      const formData = new FormData(dom.contactForm);
      const payload = {
        name:    formData.get("name")    || "",
        email:   formData.get("email")   || "",
        subject: formData.get("subject") || "",
        message: formData.get("message") || ""
      };

      // Se a API Flask não estiver configurada, cai no EmailJS como fallback
      if (!config.formApiUrl) {
        if (!window.emailjs) { setStatus("contact", "emailjsMissing"); if (submitButton) submitButton.disabled = false; return; }
        emailjs.sendForm("service_pilw1bq", "template_bonpigp", this)
          .then(() => { setStatus("contact", "success"); dom.contactForm.reset(); })
          .catch(() => setStatus("contact", "error"))
          .finally(() => { if (submitButton) submitButton.disabled = false; });
        return;
      }

      try {
        const response = await fetch(config.formApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.ok) {
          // Mostra a classificação da IA junto à mensagem de sucesso
          const classification = result.classification || "";
          const extra = classification === "suspeita"
            ? " (em análise)"
            : "";
          dom.contactStatus.textContent = (result.message || translations[currentLang].contactStatus.success) + extra;
          dom.contactStatus.style.color = "#2d6a4f";
          dom.contactForm.reset();

          // Fallback EmailJS para também enviar o email real (opcional)
          if (window.emailjs) {
            emailjs.send("service_pilw1bq", "template_bonpigp", payload).catch(() => {});
          }
        } else {
          dom.contactStatus.textContent = result.message || translations[currentLang].contactStatus.error;
          dom.contactStatus.style.color = "#c0392b";
        }
      } catch (error) {
        console.error("[API contact]", error);
        // Fallback EmailJS se o servidor Flask não estiver acessível
        if (window.emailjs) {
          emailjs.sendForm("service_pilw1bq", "template_bonpigp", dom.contactForm)
            .then(() => { setStatus("contact", "success"); dom.contactForm.reset(); })
            .catch(() => setStatus("contact", "error"));
        } else {
          setStatus("contact", "error");
        }
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  if (dom.chatToggle && dom.chatBox) {
    dom.chatToggle.addEventListener("click", () => {
      dom.chatBox.style.display = dom.chatBox.style.display === "none" ? "flex" : "none";
    });
  }

  if (dom.closeChat && dom.chatBox) {
    dom.closeChat.addEventListener("click", () => {
      dom.chatBox.style.display = "none";
    });
  }

  async function sendChatMessage() {
    if (!dom.chatInput || !dom.chatMessages) return;
    if (!dom.chatInput.value.trim()) return;

    const message = dom.chatInput.value.trim();
    dom.chatInput.value = "";
    dom.chatMessages.innerHTML += `<div>${message}</div>`;
  }

  if (dom.chatSendBtn) {
    dom.chatSendBtn.addEventListener("click", sendChatMessage);
  }

  if (dom.chatInput) {
    dom.chatInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        sendChatMessage();
      }
    });
  }

  // Carrega pontos de interesse da API (com fallback automático se offline)
  fetchTourismPlaces("", "");
  applyLanguage(currentLang);
});

