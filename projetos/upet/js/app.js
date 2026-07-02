// Core do Site & SPA Router - UPET Petshop / Banho e Tosa / Veterinário

// Função Toast Global
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-exclamation-circle';
  if (type === 'info') icon = 'fa-info-circle';

  toast.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// Estado da Galeria (para Navegação do Lightbox)
let activeGalleryImages = [];
let activeGalleryCaptions = [];
let currentLightboxIndex = 0;

// Estado Global de Busca de Produtos
let productSearchQuery = '';
let productSelectedCategory = 'Todos';

document.addEventListener('DOMContentLoaded', () => {
  const db = window.UPET_DB;
  const admin = window.UPET_Admin;

  if (!db || !admin) {
    console.error("Módulos UPET_DB ou UPET_Admin não carregados corretamente.");
    return;
  }

  // 1. Inicializa o Banco de Dados Local
  db.initializeDB();

  // 2. Pré-carregador elegante
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 800); // tempo de respiro para renderização fluida
  }

  // 3. Efeito do Header ao rolar a página
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 4. Menu Hamburguer Mobile
  const burgerMenu = document.getElementById('burger-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .btn-booking-nav');

  if (burgerMenu && navMenu) {
    burgerMenu.addEventListener('click', () => {
      burgerMenu.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Fecha ao clicar em um link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 5. Inicialização do Router SPA
  window.addEventListener('hashchange', router);
  router(); // Chama na carga inicial da página

  // 6. Configurações dos Ouvintes de Eventos Globais
  setupGlobalListeners();
  
  // 7. Inicializa o Painel Admin paralelo
  admin.initAdminPanel();
});

/* ==========================================
   SPA ROUTER (SISTEMA DE PÁGINAS/ABAS SEPARADAS)
   ========================================== */
function router() {
  const hash = window.location.hash || '#/';
  
  // Seções principais do HTML
  const publicLayout = document.getElementById('public-layout');
  const adminLayout = document.getElementById('admin-layout');
  
  // Trata layout Admin vs Público
  if (hash.startsWith('#/admin')) {
    publicLayout.style.display = 'none';
    adminLayout.style.display = 'block';
    
    // Altera Título e Meta SEO
    document.title = "Painel Administrativo | UPET";
    return;
  } else {
    publicLayout.style.display = 'block';
    adminLayout.style.display = 'none';
  }

  // Mapeamento de rotas/abas públicas
  const routes = {
    '#/': 'view-home',
    '#/home': 'view-home',
    '#/servicos': 'view-servicos',
    '#/banho-e-tosa': 'view-servico-detalhe',
    '#/veterinario': 'view-servico-detalhe',
    '#/vacinacao': 'view-servico-detalhe',
    '#/consultas': 'view-servico-detalhe',
    '#/loja-pet': 'view-servico-detalhe',
    '#/produtos': 'view-produtos',
    '#/galeria': 'view-galeria',
    '#/sobre': 'view-sobre',
    '#/contato': 'view-contato',
    '#/agendamento': 'view-agendamento'
  };

  const targetViewId = routes[hash] || 'view-home';
  
  // Atualiza exibição das views (Abas separadas)
  const views = document.querySelectorAll('.page-view');
  views.forEach(view => {
    view.classList.remove('active');
  });

  const activeView = document.getElementById(targetViewId);
  if (activeView) {
    activeView.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Atualizar marcação ativa no Menu do Header
  updateActiveMenuLink(hash);

  // Configurações específicas para cada página
  routeViewTrigger(hash);
}

// Atualiza o link ativo no Header
function updateActiveMenuLink(hash) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.classList.remove('active');
    
    const href = link.getAttribute('href');
    if (href === hash || (hash === '#/' && href === '#/home')) {
      link.classList.add('active');
    }
    
    // Tratativa para subpáginas de serviços
    if (['#/banho-e-tosa', '#/veterinario', '#/vacinacao', '#/consultas', '#/loja-pet'].includes(hash) && href === '#/servicos') {
      link.classList.add('active');
    }
  });
}

// Gatilho de renderização inteligente para cada rota
function routeViewTrigger(hash) {
  // Ajuste dinâmico de Título SEO
  const seoConfig = {
    '#/': { title: 'UPET | Petshop, Banho e Tosa e Veterinário em Taubaté', desc: 'Cuidado, saúde e carinho completo para o seu animal. Banho e tosa premium, consultas veterinárias e farmácia.' },
    '#/home': { title: 'UPET | Petshop, Banho e Tosa e Veterinário em Taubaté', desc: 'Cuidado, saúde e carinho completo para o seu animal. Banho e tosa premium, consultas veterinárias e farmácia.' },
    '#/servicos': { title: 'Serviços Estéticos e Médicos | UPET Petshop', desc: 'Conheça nossos serviços de banho, tosa higiênica, consultas médicas e vacinação importada.' },
    '#/produtos': { title: 'Catálogo de Produtos | UPET Petshop', desc: 'Compre rações super premium, brinquedos interativos, remédios e shampoo com entrega rápida em Taubaté.' },
    '#/galeria': { title: 'Galeria de Clientes Felizes | UPET Petshop', desc: 'Veja fotos reais dos pets que passaram pelo nosso banho, tosa e tratamentos de saúde.' },
    '#/sobre': { title: 'Sobre Nós e Nossa Missão | UPET Petshop', desc: 'Nossa história de amor aos animais, infraestrutura moderna e equipe de profissionais em Taubaté.' },
    '#/contato': { title: 'Fale Conosco | UPET Petshop', desc: 'Fale direto via WhatsApp, confira nosso telefone ou venha nos visitar no Jardim das Monções.' },
    '#/agendamento': { title: 'Agendamento Online de Consultas e Banhos | UPET', desc: 'Reserve o horário ideal para o banho, tosa ou consulta veterinária com confirmação direta.' }
  };

  const currentSEO = seoConfig[hash] || { title: 'UPET Petshop / Veterinário', desc: 'Cuidado especial para seu melhor amigo.' };
  
  // Trata subpáginas dinâmicas de serviço
  if (['#/banho-e-tosa', '#/veterinario', '#/vacinacao', '#/consultas', '#/loja-pet'].includes(hash)) {
    const serviceId = hash.replace('#/', '');
    renderServiceDetailsPage(serviceId);
  }

  // Executa renderizações específicas
  if (hash === '#/produtos') {
    renderProductsCatalog();
  } else if (hash === '#/galeria') {
    renderGallery();
  } else if (hash === '#/agendamento') {
    populateServicesDropdown();
  }

  document.title = currentSEO.title;
  
  // Atualiza meta tags de SEO
  let metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', currentSEO.desc);
  }
}

/* ==========================================
   RENDERIZAÇÃO DINÂMICA: PÁGINAS DE SERVIÇOS
   ========================================== */
function renderServiceDetailsPage(serviceId) {
  const db = window.UPET_DB;
  const services = db.getServices();
  const service = services.find(s => s.id === serviceId);
  const container = document.getElementById('view-servico-detalhe');

  if (!service || !container) {
    container.innerHTML = `<div class="container text-center" style="padding: 100px 0;"><h2>Serviço não encontrado.</h2><a href="#/servicos" class="btn btn-primary" style="margin-top:20px;">Voltar aos Serviços</a></div>`;
    return;
  }

  // Seleção de imagens para galeria interna do serviço baseada em assets reais
  let serviceGalleryImages = [];
  if (serviceId === 'banho-e-tosa') {
    serviceGalleryImages = [
      { src: 'img/cachorro1.jpg', caption: 'Estética Premium UPET' },
      { src: 'img/cachorro3.jpg', caption: 'Tosa Higiênica Delicada' },
      { src: 'img/unnamed (3).jpg', caption: 'Centro de Banho e Estética' }
    ];
  } else if (['veterinario', 'vacinacao', 'consultas'].includes(serviceId)) {
    serviceGalleryImages = [
      { src: 'img/unnamed (1).jpg', caption: 'Consultório Clínico Equipado' },
      { src: 'img/unnamed (5).jpg', caption: 'Espaço de Atendimento Médico' },
      { src: 'img/unnamed (6).jpg', caption: 'Área de Internação Segura' }
    ];
  } else if (serviceId === 'loja-pet') {
    serviceGalleryImages = [
      { src: 'img/unnamed (2).jpg', caption: 'Prateleira de Rações e Produtos' },
      { src: 'img/unnamed (7).jpg', caption: 'Farmácia Veterinária Integrada' },
      { src: 'img/unnamed (8).jpg', caption: 'Boutique e Recepção Confortável' }
    ];
  } else {
    serviceGalleryImages = [
      { src: service.image, caption: 'Cuidado Especializado' },
      { src: 'img/unnamed.jpg', caption: 'Ambiente Higienizado' },
      { src: 'img/logo.jpg', caption: 'Profissionais Certificados' }
    ];
  }

  // Altera Título SEO específico
  document.title = `${service.name} | Detalhes do Serviço | UPET`;

  container.innerHTML = `
    <div class="service-details-section">
      <div class="container">
        <!-- Banner Premium -->
        <div class="service-banner">
          <img src="${service.image}" class="service-banner-bg" alt="${service.name}">
          <div class="service-banner-content">
            <div class="service-banner-text">
              <span class="badge badge-green"><i class="fas ${service.icon}"></i> UPET Especialidades</span>
              <h2 style="margin-top:10px;">${service.name}</h2>
            </div>
            <a href="#/agendamento" class="btn btn-primary">Agendar ${service.name}</a>
          </div>
        </div>

        <!-- Conteúdo Detalhado -->
        <div class="service-detail-grid">
          <div class="detail-block">
            <h3>Descrição do Serviço</h3>
            <p>${service.description}</p>

            <h3 style="margin-top: 3rem; margin-bottom:1.5rem;">Benefícios Exclusivos da UPET</h3>
            <div class="benefits-list">
              ${service.benefits.map(b => `
                <div class="benefit-item">
                  <i class="fas fa-check-circle"></i>
                  <span>${b}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Tabela de Preços -->
          <div class="glass-card pricing-card">
            <div class="pricing-title">Tabela de Preços</div>
            <div style="margin-bottom: 2rem;">
              ${service.prices.map(p => `
                <div class="pricing-row">
                  <span class="price-item-name">${p.name}</span>
                  <span class="price-item-val">${p.value}</span>
                </div>
              `).join('')}
            </div>
            <a href="#/agendamento" class="btn btn-accent" style="width: 100%;">Reservar Horário</a>
          </div>
        </div>

        <!-- Galeria Interna do Serviço -->
        <h3 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">Estrutura & Cuidado</h3>
        <div class="gallery-grid" style="margin-bottom: 5rem;">
          ${serviceGalleryImages.map((img, idx) => `
            <div class="gallery-card" data-idx="${idx}">
              <img src="${img.src}" alt="${img.caption}">
              <div class="gallery-overlay">
                <i class="fas fa-search-plus"></i>
                <span>${img.caption}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Perguntas Frequentes (FAQ Accordion) -->
        <h3 style="font-size: 2rem; text-align: center; margin-bottom: 3rem;">Perguntas Frequentes</h3>
        <div style="max-width: 800px; margin: 0 auto;">
          ${service.faq.map((item, idx) => `
            <div class="accordion-item" data-index="${idx}">
              <div class="accordion-header">
                <span>${item.q}</span>
                <i class="fas fa-chevron-down accordion-icon"></i>
              </div>
              <div class="accordion-body">
                <p style="margin: 0; padding-top: 10px;">${item.a}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Ouvintes de Clique do Accordion FAQ
  const accordions = container.querySelectorAll('.accordion-item');
  accordions.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Fecha todos
      accordions.forEach(a => {
        a.classList.remove('active');
        a.querySelector('.accordion-body').style.maxHeight = null;
      });

      // Abre o clicado
      if (!isActive) {
        item.classList.add('active');
        const body = item.querySelector('.accordion-body');
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  // Vincula lightbox para as imagens da galeria interna do serviço
  const serviceImages = container.querySelectorAll('.gallery-card img');
  serviceImages.forEach((img, idx) => {
    img.closest('.gallery-card').addEventListener('click', () => {
      const urls = Array.from(serviceImages).map(i => i.src);
      const captions = Array.from(serviceImages).map(i => i.alt);
      openLightbox(urls, idx, captions);
    });
  });
}

/* ==========================================
   RENDERIZAÇÃO DINÂMICA: CATÁLOGO DE PRODUTOS
   ========================================== */
function renderProductsCatalog() {
  const db = window.UPET_DB;
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const products = db.getProducts();

  // Filtragem local baseada nas buscas e tabs
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) || 
                        p.description.toLowerCase().includes(productSearchQuery.toLowerCase());
    
    const matchCategory = productSelectedCategory === 'Todos' || p.category === productSelectedCategory;

    return matchSearch && matchCategory;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0;">
        <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1.5rem;"></i>
        <h3>Nenhum produto encontrado</h3>
        <p style="color: var(--text-muted)">Experimente mudar os filtros ou digitar outro termo na busca.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    return `
      <div class="glass-card product-card" data-product-id="${p.id}">
        <div class="product-img-box">
          <img src="${p.image}" class="product-img" alt="${p.name}">
          <span class="badge badge-green product-category">${p.category}</span>
        </div>
        <div class="product-details">
          <h3>${p.name}</h3>
          <div class="product-price-box">
            <span class="product-price">R$ ${p.price.toFixed(2)}</span>
            <button class="btn btn-primary view-product-detail-btn" data-id="${p.id}" style="padding: 0.5rem 1.2rem; font-size: 0.85rem;">
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Adiciona eventos aos botões de detalhes do produto
  grid.querySelectorAll('.view-product-detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      openProductModal(id);
    });
  });
}

function openProductModal(productId) {
  const db = window.UPET_DB;
  const products = db.getProducts();
  const product = products.find(p => p.id === productId);
  const modalOverlay = document.getElementById('product-detail-modal');
  const modalBody = document.getElementById('product-modal-body');

  if (!product || !modalOverlay || !modalBody) return;

  modalBody.innerHTML = `
    <div class="product-modal-grid">
      <img src="${product.image}" class="prod-modal-img" alt="${product.name}">
      <div class="prod-modal-info">
        <h2>${product.name}</h2>
        <div class="prod-modal-category">
          <span class="badge badge-green">${product.category}</span>
        </div>
        <div class="prod-modal-price">R$ ${product.price.toFixed(2)}</div>
        <p class="prod-modal-desc">${product.description}</p>
        
        ${product.features && product.features.length > 0 ? `
          <div class="prod-modal-features">
            <h4>Destaques do Produto:</h4>
            <ul>
              ${product.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <a href="https://api.whatsapp.com/send?phone=5512991071043&text=Ol%C3%A1%20UPET!%20Gostaria%20de%20comprar%20o%20produto:%20${encodeURIComponent(product.name)}%20(Valor:%20R$%20${product.price.toFixed(2)})" target="_blank" class="btn btn-accent" style="width:100%;">
          <i class="fab fa-whatsapp"></i> Comprar pelo WhatsApp
        </a>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
}

/* ==========================================
   RENDERIZAÇÃO DINÂMICA: GALERIA E LIGHTBOX
   ========================================== */
function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  const tabs = document.querySelectorAll('.gallery-tab');
  if (!grid) return;

  // Imagens da Galeria baseadas nos 17 assets reais do petshop
  const galleryData = [
    { src: 'img/Foto frente.jpg', category: 'Dia-a-Dia', caption: 'Fachada Principal UPET' },
    { src: 'img/frente2.jpg', category: 'Dia-a-Dia', caption: 'Entrada e Fachada Lateral' },
    { src: 'img/logo.jpg', category: 'Dia-a-Dia', caption: 'Logo Oficial UPET Taubaté' },
    { src: 'img/cachorro1.jpg', category: 'Banho', caption: 'Banho Relaxante e Hidratação Canina' },
    { src: 'img/cachorro2.jpg', category: 'Tosa', caption: 'Tosa Higiênica e Estilo' },
    { src: 'img/cachorro3.jpg', category: 'Tosa', caption: 'Corte Artístico na Tesoura' },
    { src: 'img/cachorro4.jpg', category: 'Banho', caption: 'Secagem Cuidadosa e Desembolo' },
    { src: 'img/cachorro5.jpg', category: 'Dia-a-Dia', caption: 'Nosso Hóspede Super Feliz' },
    { src: 'img/unnamed.jpg', category: 'Dia-a-Dia', caption: 'Recepção e Farmácia UPET' },
    { src: 'img/unnamed (1).jpg', category: 'Veterinario', caption: 'Consultório Veterinário Climatizado' },
    { src: 'img/unnamed (2).jpg', category: 'Dia-a-Dia', caption: 'Boutique de Rações e Produtos' },
    { src: 'img/unnamed (3).jpg', category: 'Banho', caption: 'Nosso Centro de Estética e Banhos' },
    { src: 'img/unnamed (4).jpg', category: 'Dia-a-Dia', caption: 'Sala de Espera Ampla e Acolhedora' },
    { src: 'img/unnamed (5).jpg', category: 'Veterinario', caption: 'Espaço para Atendimentos e Vacinas' },
    { src: 'img/unnamed (6).jpg', category: 'Veterinario', caption: 'Sala Hospitalar e Exames Clínicos' },
    { src: 'img/unnamed (7).jpg', category: 'Dia-a-Dia', caption: 'Medicamentos e Farmácia Veterinária' },
    { src: 'img/unnamed (8).jpg', category: 'Dia-a-Dia', caption: 'Detalhes Aconchegantes do Nosso Espaço' }
  ];

  let selectedCategory = 'Todos';

  // Encontra a aba ativa atual
  tabs.forEach(tab => {
    if (tab.classList.contains('active')) {
      selectedCategory = tab.getAttribute('data-category');
    }
  });

  const filtered = galleryData.filter(img => selectedCategory === 'Todos' || img.category === selectedCategory);

  grid.innerHTML = filtered.map((img, idx) => {
    return `
      <div class="gallery-card" data-idx="${idx}">
        <img src="${img.src}" alt="${img.caption}">
        <div class="gallery-overlay">
          <i class="fas fa-search-plus"></i>
          <span>${img.caption}</span>
        </div>
      </div>
    `;
  }).join('');

  // Atribui cliques para abrir Lightbox
  const cards = grid.querySelectorAll('.gallery-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-idx'));
      const urls = filtered.map(item => item.src);
      const captions = filtered.map(item => item.caption);
      openLightbox(urls, idx, captions);
    });
  });
}

function openLightbox(urls, index, captions) {
  activeGalleryImages = urls;
  activeGalleryCaptions = captions || [];
  currentLightboxIndex = index;
  
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  if (!lightbox || !lightboxImg) return;

  lightboxImg.src = urls[index];
  if (lightboxCaption && captions) {
    lightboxCaption.innerText = captions[index] || '';
  }

  lightbox.style.display = 'flex';
  setTimeout(() => lightbox.classList.add('active'), 50);
}

/* ==========================================
   CONFIGURAÇÃO DE EVENTOS E INTERAÇÕES GLOBAIS
   ========================================== */
function setupGlobalListeners() {
  const db = window.UPET_DB;
  
  // 1. Abas da Galeria
  const galleryTabs = document.querySelectorAll('.gallery-tab');
  galleryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      galleryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderGallery();
    });
  });

  // 2. Lightbox Fechamento e Navegação
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  if (lightbox) {
    const closeFunc = () => {
      lightbox.classList.remove('active');
      setTimeout(() => lightbox.style.display = 'none', 400);
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeFunc);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeFunc();
    });

    const navigate = (direction) => {
      currentLightboxIndex += direction;
      if (currentLightboxIndex < 0) currentLightboxIndex = activeGalleryImages.length - 1;
      if (currentLightboxIndex >= activeGalleryImages.length) currentLightboxIndex = 0;
      
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = activeGalleryImages[currentLightboxIndex];
        if (lightboxCaption) {
          lightboxCaption.innerText = activeGalleryCaptions[currentLightboxIndex] || 'Foto UPET ' + (currentLightboxIndex + 1);
        }
        lightboxImg.style.opacity = '1';
      }, 200);
    };

    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
    if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

    // Suporte a teclado
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeFunc();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  // 3. Modais de Produtos - Fechamento
  const prodModal = document.getElementById('product-detail-modal');
  const prodModalClose = document.getElementById('product-modal-close');
  
  if (prodModal) {
    const closeProdModal = () => prodModal.classList.remove('active');
    if (prodModalClose) prodModalClose.addEventListener('click', closeProdModal);
    prodModal.addEventListener('click', (e) => {
      if (e.target === prodModal) closeProdModal();
    });
  }

  // 4. Busca de Produtos em tempo real
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      productSearchQuery = e.target.value;
      renderProductsCatalog();
    });
  }

  // 5. Filtros de Categorias de Produtos
  const productFilterTabs = document.querySelectorAll('.product-filter-tab');
  productFilterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      productFilterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      productSelectedCategory = tab.getAttribute('data-category');
      renderProductsCatalog();
    });
  });

  // 6. Envio do Formulário de Agendamento
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const clientName = document.getElementById('book-name').value.trim();
      const phone = document.getElementById('book-phone').value.trim();
      const petName = document.getElementById('book-pet-name').value.trim();
      const petBreed = document.getElementById('book-pet-breed').value.trim();
      const service = document.getElementById('book-service').value;
      const date = document.getElementById('book-date').value;
      const time = document.getElementById('book-time').value;

      if (!clientName || !phone || !petName || !service || !date || !time) {
        showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
      }

      // Salva no banco de dados local
      db.saveSchedule({
        clientName,
        phone,
        petName,
        petBreed,
        service,
        date,
        time
      });

      // Cria formatação para mensagem WhatsApp
      const formattedDate = date.split('-').reverse().join('/');
      const msg = `Olá UPET! Gostaria de confirmar meu agendamento:\n\n*Cliente:* ${clientName}\n*Telefone:* ${phone}\n*Pet:* ${petName} (${petBreed || 'Porte Médio'})\n*Serviço:* ${service}\n*Data:* ${formattedDate}\n*Horário:* ${time}\n\nAgendado pelo site oficial!`;

      showToast('Agendamento cadastrado com sucesso!', 'success');
      bookingForm.reset();

      // Redireciona para o WhatsApp após 1.5s para dar tempo do feedback visual
      setTimeout(() => {
        const whatsappUrl = `https://api.whatsapp.com/send?phone=5512991071043&text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, '_blank');
      }, 1500);
    });

    // Bloquear datas passadas no seletor de agendamento
    const dateInput = document.getElementById('book-date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }
  }

  // 7. Envio do Formulário de Contato
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Por favor, preencha todos os campos do formulário.', 'error');
        return;
      }

      db.saveMessage({
        name,
        email,
        subject,
        message
      });

      showToast('Mensagem enviada com sucesso! Responderemos em breve.', 'success');
      contactForm.reset();
    });
  }

  // 8. Efeito de Parallax da Hero Section
  const parallaxBg = document.querySelector('.hero-parallax-bg');
  if (parallaxBg) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX - window.innerWidth / 2) / 40;
      const y = (e.clientY - window.innerHeight / 2) / 40;
      parallaxBg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    });
  }

  // 9. Delegador de Cliques do FAQ Accordion (Universal para Home e Subpáginas)
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.accordion-header');
    if (!header) return;
    
    const item = header.closest('.accordion-item');
    if (!item) return;

    const container = item.parentElement;
    const accordions = container.querySelectorAll('.accordion-item');
    const isActive = item.classList.contains('active');
    
    // Fecha todos no mesmo container
    accordions.forEach(a => {
      a.classList.remove('active');
      const body = a.querySelector('.accordion-body');
      if (body) body.style.maxHeight = null;
    });

    // Abre o clicado se não estava ativo
    if (!isActive) {
      item.classList.add('active');
      const body = item.querySelector('.accordion-body');
      if (body) {
        body.style.maxHeight = body.scrollHeight + "px";
      }
    }
  });
}

// Preenche o dropdown de serviços dinamicamente no formulário de agendamento
function populateServicesDropdown() {
  const db = window.UPET_DB;
  const select = document.getElementById('book-service');
  if (!select) return;

  // Limpa as opções e deixa apenas o padrão
  select.innerHTML = '<option value="" disabled selected>Selecione o serviço...</option>';

  const services = db.getServices();
  services.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.name;
    opt.innerText = s.name;
    select.appendChild(opt);
  });
}
