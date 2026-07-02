// Global Main Script

document.addEventListener('DOMContentLoaded', () => {
    
    // ---- Navbar Scroll Effect ----
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ---- Mobile Menu Toggle ----
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // ---- Load Featured Properties (index.html) ----
    const featuredGrid = document.getElementById('featured-grid');
    if (featuredGrid) {
        // Get properties from local storage (provided by db.js)
        const allProperties = typeof getProperties === 'function' ? getProperties() : [];
        
        // Only show up to 3 available properties on home
        const featuredProperties = allProperties.filter(p => p.status === 'disponivel').slice(0, 3);
        
        if (featuredProperties.length === 0) {
            featuredGrid.innerHTML = '<p style="color: var(--color-text-muted); grid-column: 1 / -1;">Nenhum imóvel em destaque no momento.</p>';
        } else {
            featuredProperties.forEach(prop => {
                const card = document.createElement('a');
                card.href = `imovel.html?id=${prop.id}`;
                card.className = 'property-card';
                
                const typeLabel = prop.type === 'venda' ? 'Venda' : 'Aluguel';
                
                card.innerHTML = `
                    <div class="property-image-wrapper">
                        <img src="${prop.image}" alt="${prop.title}" class="property-image">
                        <div class="property-badge">${typeLabel}</div>
                    </div>
                    <div class="property-info">
                        <h3 class="property-title">${prop.title}</h3>
                        <p class="property-location">${prop.location}</p>
                        <p class="property-price">${prop.price}</p>
                        <div class="property-specs">
                            <span>${prop.area}m²</span>
                            <span>•</span>
                            <span>${prop.bedrooms} Quartos</span>
                            <span>•</span>
                            <span>${prop.bathrooms} Banhos</span>
                        </div>
                    </div>
                `;
                featuredGrid.appendChild(card);
            });
        }
    }
});
