// Admin Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    
    // ---- Navigation ----
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(item.dataset.target).classList.add('active');
            
            if (item.dataset.target === 'properties-view') loadPropertiesTable();
            if (item.dataset.target === 'contracts-view') loadContractsTable();
        });
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('fabelle_admin_auth');
        window.location.href = 'admin.html';
    });

    // ==========================================
    // PROPERTIES MODULE
    // ==========================================
    
    const propTable = document.querySelector('#prop-table tbody');
    const propModalOverlay = document.getElementById('prop-modal-overlay');
    const propForm = document.getElementById('prop-form');
    let currentImagesB64 = []; // Store multiple images

    const renderGalleryPreview = () => {
        const gallery = document.getElementById('p_image_preview_gallery');
        if (currentImagesB64.length === 0) {
            gallery.innerHTML = '<div style="color: var(--color-text-muted); padding: 20px;">Nenhuma imagem selecionada</div>';
            return;
        }
        gallery.innerHTML = '';
        currentImagesB64.forEach((b64, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'gallery-thumb';
            thumb.style.backgroundImage = `url(${b64})`;
            thumb.setAttribute('draggable', 'true');
            thumb.dataset.index = index;

            // Drag and Drop Logic
            thumb.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
                thumb.style.opacity = '0.5';
            });

            thumb.addEventListener('dragend', () => {
                thumb.style.opacity = '1';
            });

            thumb.addEventListener('dragover', (e) => {
                e.preventDefault(); // Necessary to allow dropping
            });

            thumb.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const targetIndex = index;
                
                if (draggedIndex !== targetIndex) {
                    // Reorder array
                    const item = currentImagesB64.splice(draggedIndex, 1)[0];
                    currentImagesB64.splice(targetIndex, 0, item);
                    renderGalleryPreview(); // re-render
                }
            });

            // Delete Button
            const delBtn = document.createElement('div');
            delBtn.innerHTML = '&times;';
            delBtn.style.cssText = 'position: absolute; top: -5px; right: -5px; background: red; color: white; width: 20px; height: 20px; border-radius: 50%; text-align: center; line-height: 20px; cursor: pointer; font-size: 14px; font-weight: bold;';
            delBtn.title = "Remover imagem";
            delBtn.onclick = (e) => {
                e.stopPropagation();
                currentImagesB64.splice(index, 1);
                renderGalleryPreview();
            };

            thumb.appendChild(delBtn);
            gallery.appendChild(thumb);
        });
    };
    
    document.getElementById('btn-new-prop').addEventListener('click', () => {
        propForm.reset();
        document.getElementById('p_id').value = '';
        currentImagesB64 = [];
        renderGalleryPreview();
        document.getElementById('prop-form-title').innerText = 'Cadastrar Novo Imóvel';
        propModalOverlay.classList.add('active');
    });

    document.getElementById('btn-cancel-prop').addEventListener('click', () => {
        propModalOverlay.classList.remove('active');
    });
    
    document.getElementById('btn-close-prop').addEventListener('click', () => {
        propModalOverlay.classList.remove('active');
    });

    // Image Upload Logic (Multiple)
    const imageInput = document.getElementById('p_image_file');

    imageInput.addEventListener('change', function() {
        const files = Array.from(this.files);
        if (files.length > 0) {
            let loadedCount = 0;
            // Append or replace? Let's replace for simplicity, or append. Let's replace.
            currentImagesB64 = [];
            
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    currentImagesB64.push(e.target.result);
                    loadedCount++;
                    if (loadedCount === files.length) {
                        renderGalleryPreview();
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    });

    function loadPropertiesTable() {
        propTable.innerHTML = '';
        const properties = getProperties();
        
        properties.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.title}</td>
                <td>${p.location}</td>
                <td><span style="text-transform: capitalize;">${p.type}</span></td>
                <td>${p.price}</td>
                <td><span style="text-transform: capitalize;">${p.status}</span></td>
                <td>
                    <button class="action-btn edit-btn" onclick="editProperty('${p.id}')">Editar</button>
                    <button class="action-btn delete-btn" onclick="removeProperty('${p.id}')">Excluir</button>
                </td>
            `;
            propTable.appendChild(tr);
        });

        // Also update select in contracts form
        const propSelect = document.getElementById('c_propId');
        if (propSelect) {
            propSelect.innerHTML = properties.map(p => `<option value="${p.id}">${p.title} (${p.id})</option>`).join('');
        }
    }

    propForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const diffsStr = document.getElementById('p_diffs').value;
        const diffsArray = diffsStr ? diffsStr.split(',').map(s => s.trim()).filter(s => s) : [];

        const propertyData = {
            id: document.getElementById('p_id').value || undefined,
            title: document.getElementById('p_title').value,
            location: document.getElementById('p_location').value,
            price: document.getElementById('p_price').value,
            type: document.getElementById('p_type').value,
            area: parseInt(document.getElementById('p_area').value) || 0,
            landArea: parseInt(document.getElementById('p_landArea').value) || undefined,
            bedrooms: parseInt(document.getElementById('p_beds').value) || 0,
            suites: parseInt(document.getElementById('p_suites').value) || undefined,
            bathrooms: parseInt(document.getElementById('p_baths').value) || 0,
            garages: parseInt(document.getElementById('p_garages').value) || 0,
            coveredGarages: parseInt(document.getElementById('p_coveredGarages').value) || undefined,
            iptu: document.getElementById('p_iptu').value,
            condo: document.getElementById('p_condo').value,
            status: document.getElementById('p_status').value,
            image: currentImagesB64.length > 0 ? currentImagesB64[0] : '', // fallback for main image
            images: currentImagesB64, // new array of images
            description: document.getElementById('p_desc').value,
            diferenciais: diffsArray
        };

        saveProperty(propertyData);
        propModalOverlay.classList.remove('active');
        loadPropertiesTable();
        alert('Imóvel salvo com sucesso!');
    });

    window.editProperty = function(id) {
        const prop = getPropertyById(id);
        if (prop) {
            document.getElementById('p_id').value = prop.id;
            document.getElementById('p_title').value = prop.title;
            document.getElementById('p_location').value = prop.location;
            document.getElementById('p_price').value = prop.price;
            document.getElementById('p_type').value = prop.type;
            document.getElementById('p_area').value = prop.area || '';
            document.getElementById('p_landArea').value = prop.landArea || '';
            document.getElementById('p_beds').value = prop.bedrooms || '';
            document.getElementById('p_suites').value = prop.suites || '';
            document.getElementById('p_baths').value = prop.bathrooms || '';
            document.getElementById('p_garages').value = prop.garages || '';
            document.getElementById('p_coveredGarages').value = prop.coveredGarages || '';
            document.getElementById('p_iptu').value = prop.iptu || '';
            document.getElementById('p_condo').value = prop.condo || '';
            document.getElementById('p_status').value = prop.status || 'disponivel';
            
            // Handle multiple images preview
            currentImagesB64 = prop.images && prop.images.length > 0 ? prop.images : (prop.image ? [prop.image] : []);
            renderGalleryPreview();

            document.getElementById('p_desc').value = prop.description;
            document.getElementById('p_diffs').value = (prop.diferenciais || []).join(', ');
            
            document.getElementById('prop-form-title').innerText = 'Editar Imóvel';
            propModalOverlay.classList.add('active');
        }
    };

    window.removeProperty = function(id) {
        if (confirm('Tem certeza que deseja excluir este imóvel? A ação não pode ser desfeita.')) {
            deleteProperty(id);
            loadPropertiesTable();
        }
    };

    // ==========================================
    // CONTRACTS MODULE
    // ==========================================

    const contractTable = document.querySelector('#contract-table tbody');
    const contractModalOverlay = document.getElementById('contract-modal-overlay');
    const contractForm = document.getElementById('contract-form');

    document.getElementById('btn-new-contract').addEventListener('click', () => {
        contractForm.reset();
        document.getElementById('c_id').value = '';
        contractModalOverlay.classList.add('active');
    });

    document.getElementById('btn-cancel-contract').addEventListener('click', () => {
        contractModalOverlay.classList.remove('active');
    });
    
    document.getElementById('btn-close-contract').addEventListener('click', () => {
        contractModalOverlay.classList.remove('active');
    });

    function loadContractsTable() {
        contractTable.innerHTML = '';
        const contracts = getContracts();
        const properties = getProperties();
        
        contracts.forEach(c => {
            const prop = properties.find(p => p.id === c.propertyId);
            const propName = prop ? prop.title : 'Imóvel Excluído / Desconhecido';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${propName}</td>
                <td>${c.clientName}</td>
                <td><span style="text-transform: capitalize;">${c.type}</span></td>
                <td>${c.date}</td>
                <td>R$ ${c.value}</td>
                <td>
                    <button class="action-btn delete-btn" onclick="removeContract('${c.id}')">Excluir</button>
                </td>
            `;
            contractTable.appendChild(tr);
        });
    }

    contractForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const contractData = {
            id: document.getElementById('c_id').value || undefined,
            propertyId: document.getElementById('c_propId').value,
            clientName: document.getElementById('c_client').value,
            type: document.getElementById('c_type').value,
            value: document.getElementById('c_value').value,
            date: document.getElementById('c_date').value
        };

        saveContract(contractData);
        contractModalOverlay.classList.remove('active');
        loadContractsTable();
        alert('Contrato salvo com sucesso!');
    });

    window.removeContract = function(id) {
        if (confirm('Tem certeza que deseja excluir este contrato?')) {
            deleteContract(id);
            loadContractsTable();
        }
    };

    // Initialize
    loadPropertiesTable();
    loadContractsTable();
});
