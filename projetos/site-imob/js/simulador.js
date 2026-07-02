// Financing Simulator Logic

document.addEventListener('DOMContentLoaded', () => {
    const inpImovel = document.getElementById('inp-imovel');
    const inpEntrada = document.getElementById('inp-entrada');
    const inpPrazo = document.getElementById('inp-prazo');
    const inpJuros = document.getElementById('inp-juros');

    const valImovel = document.getElementById('val-imovel');
    const valEntrada = document.getElementById('val-entrada');
    const valPrazo = document.getElementById('val-prazo');
    const valJuros = document.getElementById('val-juros');

    const resParcela = document.getElementById('res-parcela');
    const resFinanciado = document.getElementById('res-financiado');
    const resTotal = document.getElementById('res-total');

    // Format currency
    const formatBRL = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const parseFormattedNumber = (str) => {
        if (!str) return 0;
        const cleanStr = str.replace(/\D/g, '');
        return parseFloat(cleanStr) || 0;
    };

    const formatInputNumber = (e) => {
        const input = e.target;
        let clean = input.value.replace(/\D/g, '');
        if (!clean) {
            input.value = '';
            return;
        }
        clean = parseInt(clean, 10).toString();
        input.value = clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const calculate = () => {
        // Get values
        const imovelValue = parseFormattedNumber(inpImovel.value);
        let entradaValue = parseFormattedNumber(inpEntrada.value);
        const prazoAnos = parseInt(inpPrazo.value) || 0;
        const jurosAnual = parseFloat(inpJuros.value) || 0;

        if (entradaValue > imovelValue) {
            entradaValue = imovelValue;
        }

        // Update labels
        valImovel.textContent = formatBRL(imovelValue);
        const entradaPercent = imovelValue > 0 ? ((entradaValue / imovelValue) * 100).toFixed(1) : 0;
        valEntrada.textContent = `${formatBRL(entradaValue)} (${entradaPercent}%)`;
        valPrazo.textContent = `${prazoAnos} Anos`;
        valJuros.textContent = `${jurosAnual.toFixed(1)}%`;

        // Calculate Financing (Price Table)
        const valorFinanciado = imovelValue - entradaValue;
        
        // Monthly interest rate
        const jurosMensal = (jurosAnual / 100) / 12;
        // Total months
        const meses = prazoAnos * 12;

        let parcelaMensal = 0;
        if (meses > 0) {
            if (jurosMensal > 0) {
                const fator = Math.pow(1 + jurosMensal, meses);
                parcelaMensal = valorFinanciado * (jurosMensal * fator) / (fator - 1);
            } else {
                parcelaMensal = valorFinanciado / meses;
            }
        }

        if (isNaN(parcelaMensal) || !isFinite(parcelaMensal) || parcelaMensal < 0) {
            parcelaMensal = 0;
        }

        const totalFinal = parcelaMensal * meses;

        // Update Results UI
        resFinanciado.textContent = formatBRL(valorFinanciado);
        resParcela.textContent = formatBRL(parcelaMensal);
        resTotal.textContent = formatBRL(totalFinal);
    };

    // Attach listeners
    inpImovel.addEventListener('input', (e) => {
        formatInputNumber(e);
        calculate();
    });
    inpEntrada.addEventListener('input', (e) => {
        formatInputNumber(e);
        calculate();
    });
    inpPrazo.addEventListener('input', calculate);
    inpJuros.addEventListener('input', calculate);

    // Initial calculation
    calculate();
});
