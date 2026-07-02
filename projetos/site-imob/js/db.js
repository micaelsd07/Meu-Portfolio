// Database Module using LocalStorage

const DB_KEY_PROPERTIES = 'fabelle_properties';
const DB_KEY_CONTRACTS = 'fabelle_contracts';

const defaultProperties = [
    {
        id: 'prop_001',
        title: 'Mansão Contemporânea',
        location: 'Alphaville, São Paulo',
        price: 'R$ 15.000.000',
        type: 'venda', // venda ou aluguel
        area: 1200,
        landArea: 2500,
        bedrooms: 5,
        suites: 5,
        bathrooms: 7,
        garages: 6,
        coveredGarages: 4,
        iptu: 'R$ 1.500 / mês',
        condo: 'R$ 3.200 / mês',
        description: 'Uma obra-prima arquitetônica com vista deslumbrante, acabamentos em mármore importado, automação completa e área de lazer cinematográfica com piscina borda infinita.',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        diferenciais: ['Piscina Borda Infinita', 'Automação', 'Home Theater', 'Adega'],
        status: 'disponivel' // disponivel, vendido, alugado
    },
    {
        id: 'prop_002',
        title: 'Cobertura Duplex Luxuosa',
        location: 'Itaim Bibi, São Paulo',
        price: 'R$ 45.000 / mês',
        type: 'aluguel',
        area: 450,
        bedrooms: 4,
        suites: 3,
        bathrooms: 5,
        garages: 4,
        coveredGarages: 4,
        iptu: 'R$ 800 / mês',
        condo: 'R$ 4.500 / mês',
        description: 'Cobertura totalmente mobiliada e decorada por arquiteto renomado. Living com pé direito duplo, terraço com vista 360º para a cidade, spa privativo e segurança 24h.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        diferenciais: ['Mobiliado', 'Spa Privativo', 'Pé Direito Duplo', 'Vista 360'],
        status: 'disponivel'
    },
    {
        id: 'prop_003',
        title: 'Casa de Campo Exclusiva',
        location: 'Fazenda Boa Vista, Porto Feliz',
        price: 'R$ 22.000.000',
        type: 'venda',
        area: 2500,
        landArea: 5000,
        bedrooms: 6,
        suites: 4,
        bathrooms: 8,
        garages: 10,
        coveredGarages: 6,
        iptu: 'R$ 2.100 / mês',
        condo: 'R$ 2.800 / mês',
        description: 'Privacidade e integração com a natureza. Terreno de 5000m², projeto paisagístico deslumbrante, quadra de tênis privativa e lago.',
        image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        diferenciais: ['Quadra de Tênis', 'Lago', 'Natureza', 'Heliponto'],
        status: 'disponivel'
    },
    {
        id: 'prop_004',
        title: 'Apartamento Neo-Clássico',
        location: 'Jardins, São Paulo',
        price: 'R$ 30.000 / mês',
        type: 'aluguel',
        area: 320,
        bedrooms: 3,
        suites: 3,
        bathrooms: 4,
        garages: 3,
        coveredGarages: 3,
        iptu: 'R$ 600 / mês',
        condo: 'R$ 2.500 / mês',
        description: 'Elegância e sofisticação no bairro mais nobre de São Paulo. Ambientes amplos, iluminação natural, piso em madeira nobre e ar-condicionado central.',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        diferenciais: ['Localização Premium', 'Segurança', 'Clássico'],
        status: 'disponivel'
    }
];

// Initialize DB
function initDB() {
    if (!localStorage.getItem(DB_KEY_PROPERTIES)) {
        localStorage.setItem(DB_KEY_PROPERTIES, JSON.stringify(defaultProperties));
    }
    if (!localStorage.getItem(DB_KEY_CONTRACTS)) {
        localStorage.setItem(DB_KEY_CONTRACTS, JSON.stringify([]));
    }
}

// ---- Properties API ----

function getProperties() {
    const data = localStorage.getItem(DB_KEY_PROPERTIES);
    return data ? JSON.parse(data) : [];
}

function getPropertyById(id) {
    const properties = getProperties();
    return properties.find(p => p.id === id);
}

function saveProperty(property) {
    const properties = getProperties();
    const index = properties.findIndex(p => p.id === property.id);
    if (index >= 0) {
        properties[index] = property;
    } else {
        property.id = 'prop_' + Date.now();
        properties.push(property);
    }
    localStorage.setItem(DB_KEY_PROPERTIES, JSON.stringify(properties));
}

function deleteProperty(id) {
    let properties = getProperties();
    properties = properties.filter(p => p.id !== id);
    localStorage.setItem(DB_KEY_PROPERTIES, JSON.stringify(properties));
}

// ---- Contracts API ----

function getContracts() {
    const data = localStorage.getItem(DB_KEY_CONTRACTS);
    return data ? JSON.parse(data) : [];
}

function saveContract(contract) {
    const contracts = getContracts();
    if (contract.id) {
        const index = contracts.findIndex(c => c.id === contract.id);
        contracts[index] = contract;
    } else {
        contract.id = 'cont_' + Date.now();
        contracts.push(contract);
    }
    localStorage.setItem(DB_KEY_CONTRACTS, JSON.stringify(contracts));
}

function deleteContract(id) {
    let contracts = getContracts();
    contracts = contracts.filter(c => c.id !== id);
    localStorage.setItem(DB_KEY_CONTRACTS, JSON.stringify(contracts));
}

function getContractsByPropertyId(propertyId) {
    return getContracts().filter(c => c.propertyId === propertyId);
}

// Auto-initialize on script load
initDB();
