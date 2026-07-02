// Painel Administrativo - Lógica e Operações - UPET Petshop

// Função para exibir notificações (Toast) no admin
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
  
  // Animar entrada
  setTimeout(() => toast.classList.add('show'), 50);

  // Auto-remover
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// Inicia as operações do Admin
function initAdminPanel() {
  const db = window.UPET_DB;
  if (!db) {
    console.error("Banco de dados UPET_DB não encontrado no escopo global.");
    return;
  }

  const loginOverlay = document.getElementById('admin-login-overlay');
  const adminWrapper = document.getElementById('admin-wrapper');
  
  const loginForm = document.getElementById('admin-login-form');
  const usernameInput = document.getElementById('admin-username');
  const passwordInput = document.getElementById('admin-password');
  
  const logoutBtn = document.getElementById('admin-logout-btn');
  const resetBtn = document.getElementById('admin-reset-btn');

  // Verificação de Sessão Existente
  if (sessionStorage.getItem('upet_admin_logged') === 'true') {
    loginOverlay.style.display = 'none';
    adminWrapper.style.display = 'grid';
    renderDashboard();
  } else {
    loginOverlay.style.display = 'flex';
    adminWrapper.style.display = 'none';
  }

  // Ação de Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = usernameInput.value.trim();
      const pass = passwordInput.value.trim();

      if (user === 'admin' && pass === 'admin') {
        sessionStorage.setItem('upet_admin_logged', 'true');
        loginOverlay.style.display = 'none';
        adminWrapper.style.display = 'grid';
        usernameInput.value = '';
        passwordInput.value = '';
        showToast('Login realizado com sucesso! Bem-vindo.', 'success');
        renderDashboard();
      } else {
        showToast('Usuário ou senha incorretos.', 'error');
      }
    });
  }

  // Ação de Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('upet_admin_logged');
      loginOverlay.style.display = 'flex';
      adminWrapper.style.display = 'none';
      showToast('Sessão encerrada com sucesso.', 'info');
    });
  }

  // Resetar Banco de Dados
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Atenção: Isso redefinirá todos os produtos, agendamentos e mensagens para o estado inicial padrão de fábrica. Continuar?')) {
        db.resetAllData();
        showToast('Todos os dados foram restaurados para o padrão.', 'info');
        renderDashboard();
        // Redireciona para o painel de dashboard para atualizar tudo
        switchSubView('admin-sub-dashboard');
      }
    });
  }

  // Navegação Interna do Admin (Sub-Views)
  const menuItems = document.querySelectorAll('.admin-menu-item[data-sub-target]');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const targetId = item.getAttribute('data-sub-target');
      switchSubView(targetId);
    });
  });

  // Listener para eventos de atualização de dados globais
  window.addEventListener('upet_products_updated', () => {
    if (sessionStorage.getItem('upet_admin_logged') === 'true') {
      renderProductsList();
    }
  });

  window.addEventListener('upet_schedules_updated', () => {
    if (sessionStorage.getItem('upet_admin_logged') === 'true') {
      renderSchedulesList();
    }
  });

  window.addEventListener('upet_messages_updated', () => {
    if (sessionStorage.getItem('upet_admin_logged') === 'true') {
      renderMessagesList();
    }
  });

  // Configuração das ações do formulário de produto
  const productForm = document.getElementById('admin-product-form');
  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const id = document.getElementById('admin-prod-id').value;
      const name = document.getElementById('admin-prod-name').value.trim();
      const category = document.getElementById('admin-prod-category').value;
      const price = parseFloat(document.getElementById('admin-prod-price').value);
      const image = document.getElementById('admin-prod-image').value.trim() || 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop';
      const description = document.getElementById('admin-prod-description').value.trim();
      const featuresRaw = document.getElementById('admin-prod-features').value.trim();
      
      const features = featuresRaw ? featuresRaw.split(',').map(f => f.trim()) : [];

      if (!name || isNaN(price) || price <= 0) {
        showToast('Por favor, preencha os campos obrigatórios com valores válidos.', 'error');
        return;
      }

      db.saveProduct({
        id: id || undefined,
        name,
        category,
        price,
        image,
        description,
        features
      });

      showToast(id ? 'Produto atualizado com sucesso!' : 'Novo produto adicionado ao catálogo!', 'success');
      clearProductForm();
      renderDashboard(); // Atualiza estatísticas rápidas
    });
  }

  // Cancelamento do form do produto
  const cancelProdBtn = document.getElementById('admin-cancel-product-btn');
  if (cancelProdBtn) {
    cancelProdBtn.addEventListener('click', clearProductForm);
  }
}

// Alternar entre Sub-Vistas do Painel Admin
function switchSubView(viewId) {
  const subViews = document.querySelectorAll('.admin-sub-view');
  subViews.forEach(v => v.classList.remove('active'));
  
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active');
    
    // Dispara carregamentos de acordo com a vista
    if (viewId === 'admin-sub-dashboard') {
      renderDashboard();
    } else if (viewId === 'admin-sub-agendamentos') {
      renderSchedulesList();
    } else if (viewId === 'admin-sub-produtos') {
      renderProductsList();
      clearProductForm();
    } else if (viewId === 'admin-sub-mensagens') {
      renderMessagesList();
    }
  }
}

// 1. Renderiza o Dashboard (Estatísticas e Gráficos rápidos)
function renderDashboard() {
  const db = window.UPET_DB;
  const schedules = db.getSchedules();
  const products = db.getProducts();
  const messages = db.getMessages();

  // Calcular estatísticas rápidas
  const totalAgendamentos = schedules.length;
  const totalProdutos = products.length;
  
  const novosContatos = messages.filter(m => m.status === 'Não lido').length;

  // Faturamento estimado baseados em agendamentos concluidos/confirmados
  let faturamentoEstimado = 0;
  schedules.forEach(s => {
    if (s.status === 'Confirmado' || s.status === 'Concluído') {
      if (s.service === 'Banho e Tosa') {
        faturamentoEstimado += 89.90; // preço médio
      } else {
        faturamentoEstimado += 130.00; // preço consulta vet
      }
    }
  });

  // Atualizar valores do HTML
  const statAgendamentos = document.getElementById('admin-stat-agendamentos');
  const statFaturamento = document.getElementById('admin-stat-faturamento');
  const statProdutos = document.getElementById('admin-stat-produtos');
  const statMensagens = document.getElementById('admin-stat-mensagens');

  if (statAgendamentos) statAgendamentos.innerText = totalAgendamentos;
  if (statFaturamento) statFaturamento.innerText = `R$ ${faturamentoEstimado.toFixed(2)}`;
  if (statProdutos) statProdutos.innerText = totalProdutos;
  if (statMensagens) statMensagens.innerText = novosContatos;

  // Renderizar tabelas resumidas de atividades recentes
  renderRecentSchedulesTable(schedules.slice(-5).reverse());
  renderRecentMessagesTable(messages.slice(-5).reverse());
}

// 2. Tabela de Agendamentos Recentes no Dashboard
function renderRecentSchedulesTable(recentSchedules) {
  const tbody = document.getElementById('admin-recent-schedules-tbody');
  if (!tbody) return;

  if (recentSchedules.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center" style="color: var(--text-muted)">Nenhum agendamento recente cadastrado.</td></tr>`;
    return;
  }

  tbody.innerHTML = recentSchedules.map(s => {
    let badgeClass = 'badge-yellow';
    if (s.status === 'Confirmado') badgeClass = 'badge-blue';
    if (s.status === 'Concluído') badgeClass = 'badge-green';
    if (s.status === 'Cancelado') badgeClass = 'badge-red';

    const formattedDate = s.date.split('-').reverse().join('/');

    return `
      <tr>
        <td><strong>${s.petName}</strong> <span style="font-size:0.8rem; color:var(--text-muted)">(${s.clientName})</span></td>
        <td>${s.service}</td>
        <td>${formattedDate} às ${s.time}</td>
        <td><span class="badge ${badgeClass}">${s.status}</span></td>
        <td>
          <a href="https://api.whatsapp.com/send?phone=55${s.phone.replace(/\D/g, '')}" target="_blank" class="btn-action btn-action-green" title="WhatsApp do Tutor">
            <i class="fab fa-whatsapp"></i>
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

// 3. Tabela de Contatos Recentes no Dashboard
function renderRecentMessagesTable(recentMessages) {
  const db = window.UPET_DB;
  const tbody = document.getElementById('admin-recent-messages-tbody');
  if (!tbody) return;

  if (recentMessages.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center" style="color: var(--text-muted)">Nenhuma mensagem recente.</td></tr>`;
    return;
  }

  tbody.innerHTML = recentMessages.map(m => {
    let badgeClass = m.status === 'Não lido' ? 'badge-yellow' : 'badge-green';
    
    return `
      <tr>
        <td><strong>${m.name}</strong></td>
        <td>${m.subject}</td>
        <td><span class="badge ${badgeClass}">${m.status}</span></td>
        <td>
          <button class="btn-action btn-action-blue view-msg-dash-btn" data-id="${m.id}" title="Ver Mensagem">
            <i class="far fa-eye"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Atribui clicks aos visualizadores rápidos do dashboard
  tbody.querySelectorAll('.view-msg-dash-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      db.updateMessageStatus(id, 'Lido');
      switchSubView('admin-sub-mensagens');
    });
  });
}

// 4. Renderiza Página Completa de Agendamentos
function renderSchedulesList() {
  const db = window.UPET_DB;
  const tbody = document.getElementById('admin-schedules-tbody');
  if (!tbody) return;

  const schedules = db.getSchedules().reverse(); // Mais novos primeiro

  if (schedules.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center" style="color: var(--text-muted)">Nenhum agendamento registrado até o momento.</td></tr>`;
    return;
  }

  tbody.innerHTML = schedules.map(s => {
    let badgeClass = 'badge-yellow';
    if (s.status === 'Confirmado') badgeClass = 'badge-blue';
    if (s.status === 'Concluído') badgeClass = 'badge-green';
    if (s.status === 'Cancelado') badgeClass = 'badge-red';

    const formattedDate = s.date.split('-').reverse().join('/');

    return `
      <tr>
        <td><strong>${s.petName}</strong></td>
        <td>
          <strong>${s.clientName}</strong><br>
          <span style="font-size:0.85rem; color:var(--text-muted)">${s.phone}</span>
        </td>
        <td>${s.service}</td>
        <td>${formattedDate} às ${s.time}</td>
        <td><span class="badge ${badgeClass}">${s.status}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-action btn-action-blue change-status-btn" data-id="${s.id}" data-status="Confirmado" title="Confirmar Agendamento">
              <i class="fas fa-check"></i>
            </button>
            <button class="btn-action btn-action-green change-status-btn" data-id="${s.id}" data-status="Concluído" title="Marcar como Concluído">
              <i class="fas fa-check-double"></i>
            </button>
            <button class="btn-action btn-action-red change-status-btn" data-id="${s.id}" data-status="Cancelado" title="Cancelar Agendamento">
              <i class="fas fa-times"></i>
            </button>
            <a href="https://api.whatsapp.com/send?phone=55${s.phone.replace(/\D/g, '')}&text=Ol%C3%A1%20${encodeURIComponent(s.clientName)}!%20Aqui%20%C3%A9%20da%20UPET%20Petshop.%20Referente%20ao%20agendamento%20de%20${encodeURIComponent(s.petName)}%20para%20${encodeURIComponent(s.service)}..." target="_blank" class="btn-action btn-action-green" title="Enviar WhatsApp">
              <i class="fab fa-whatsapp"></i>
            </a>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Adiciona os ouvintes de troca de status dos agendamentos
  tbody.querySelectorAll('.change-status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const status = btn.getAttribute('data-status');
      db.updateScheduleStatus(id, status);
      showToast(`Status do agendamento atualizado para '${status}'!`, 'success');
      renderDashboard(); // Atualiza também os números do dashboard
    });
  });
}

// 5. Renderiza Página Completa de Produtos
function renderProductsList() {
  const db = window.UPET_DB;
  const listContainer = document.getElementById('admin-products-list-container');
  if (!listContainer) return;

  const products = db.getProducts();

  if (products.length === 0) {
    listContainer.innerHTML = `<div class="text-center" style="padding: 2rem 0; color: var(--text-muted)">Nenhum produto cadastrado no momento. Adicione um novo à direita.</div>`;
    return;
  }

  listContainer.innerHTML = products.map(p => {
    return `
      <div class="admin-item-row" data-id="${p.id}">
        <div class="admin-item-row-left">
          <img src="${p.image}" class="admin-item-row-thumb" alt="${p.name}">
          <div class="admin-item-row-info">
            <h4>${p.name}</h4>
            <span>R$ ${p.price.toFixed(2)}</span>
            <p style="font-size:0.75rem; color:var(--text-muted); margin:0">${p.category}</p>
          </div>
        </div>
        <div class="table-actions">
          <button class="btn-action btn-action-blue edit-prod-btn" data-id="${p.id}" title="Editar Produto">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-action btn-action-red delete-prod-btn" data-id="${p.id}" title="Excluir Produto">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Ação de Editar Produto (Preenche Formulário)
  listContainer.querySelectorAll('.edit-prod-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const product = products.find(p => p.id === id);
      if (product) {
        document.getElementById('admin-prod-form-title').innerText = 'Editar Produto';
        document.getElementById('admin-prod-id').value = product.id;
        document.getElementById('admin-prod-name').value = product.name;
        document.getElementById('admin-prod-category').value = product.category;
        document.getElementById('admin-prod-price').value = product.price;
        document.getElementById('admin-prod-image').value = product.image;
        document.getElementById('admin-prod-description').value = product.description;
        document.getElementById('admin-prod-features').value = product.features ? product.features.join(', ') : '';
        
        // Destacar o card selecionado
        listContainer.querySelectorAll('.admin-item-row').forEach(row => row.classList.remove('active'));
        btn.closest('.admin-item-row').classList.add('active');
        
        document.getElementById('admin-prod-name').focus();
        showToast('Dados do produto carregados no formulário.', 'info');
      }
    });
  });

  // Ação de Deletar Produto
  listContainer.querySelectorAll('.delete-prod-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (confirm('Tem certeza de que deseja remover permanentemente este produto do catálogo?')) {
        db.deleteProduct(id);
        showToast('Produto removido com sucesso!', 'success');
        clearProductForm();
        renderDashboard(); // Atualiza contadores
      }
    });
  });
}

// Limpa o Formulário de Produtos
function clearProductForm() {
  const form = document.getElementById('admin-product-form');
  if (form) form.reset();
  
  const title = document.getElementById('admin-prod-form-title');
  if (title) title.innerText = 'Adicionar Novo Produto';
  
  const idInput = document.getElementById('admin-prod-id');
  if (idInput) idInput.value = '';

  const activeRows = document.querySelectorAll('#admin-products-list-container .admin-item-row');
  activeRows.forEach(row => row.classList.remove('active'));
}

// 6. Renderiza Página Completa de Mensagens de Contato
function renderMessagesList() {
  const db = window.UPET_DB;
  const container = document.getElementById('admin-messages-container');
  if (!container) return;

  const messages = db.getMessages().reverse(); // Mais novos primeiro

  if (messages.length === 0) {
    container.innerHTML = `<div class="text-center" style="padding: 3rem 0; color: var(--text-muted)">Nenhuma mensagem de contato recebida.</div>`;
    return;
  }

  container.innerHTML = messages.map(m => {
    let badgeClass = m.status === 'Não lido' ? 'badge-yellow' : 'badge-green';
    const formattedDate = new Date(m.date).toLocaleString('pt-BR');

    return `
      <div class="glass-card" style="padding: 2rem; margin-bottom: 1.5rem; position: relative;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; margin-bottom: 1rem;">
          <div>
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 2px;">${m.subject}</h3>
            <span style="font-size: 0.85rem; color: var(--text-muted)">
              De: <strong>${m.name}</strong> (${m.email}) em ${formattedDate}
            </span>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <span class="badge ${badgeClass}">${m.status}</span>
            <button class="btn-action btn-action-red delete-msg-btn" data-id="${m.id}" title="Excluir Mensagem">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
        
        <p style="color: var(--text-main); font-size: 1rem; border-top: 1px solid var(--glass-border); padding-top: 1rem; margin-bottom: 1.2rem; background: rgba(0,0,0,0.1); padding: 1rem; border-radius: 8px; font-style: italic;">
          "${m.message}"
        </p>

        <div style="display: flex; gap: 12px;">
          ${m.status === 'Não lido' ? `
            <button class="btn btn-primary mark-read-btn" data-id="${m.id}" style="padding: 0.5rem 1.2rem; font-size: 0.85rem;">
              <i class="fas fa-check-circle"></i> Marcar como Lida
            </button>
          ` : ''}
          <a href="mailto:${m.email}?subject=Resposta:%20${encodeURIComponent(m.subject)}%20-%20UPET" class="btn btn-secondary" style="padding: 0.5rem 1.2rem; font-size: 0.85rem;">
            <i class="fas fa-reply"></i> Responder por E-mail
          </a>
        </div>
      </div>
    `;
  }).join('');

  // Ação de Marcar como Lida
  container.querySelectorAll('.mark-read-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      db.updateMessageStatus(id, 'Lido');
      showToast('Mensagem marcada como lida.', 'success');
      renderDashboard(); // Atualiza dashboard counters
    });
  });

  // Ação de Deletar Mensagem
  container.querySelectorAll('.delete-msg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Tem certeza de que deseja remover esta mensagem permanentemente?')) {
        db.deleteMessage(id);
        showToast('Mensagem excluída com sucesso.', 'success');
        renderDashboard(); // Atualiza contadores
      }
    });
  });
}

// Expõe no escopo global
window.UPET_Admin = {
  initAdminPanel,
  renderDashboard,
  renderSchedulesList,
  renderProductsList,
  renderMessagesList
};
