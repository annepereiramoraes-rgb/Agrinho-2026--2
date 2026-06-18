// ==========================================================================
// CÓDIGO JAVASCRIPT (LÓGICA DA CALCULADORA INTERATIVA)
// ==========================================================================

document.getElementById('form-calculadora').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede a página de recarregar

    // Coleta os valores do formulário
    const cultura = document.getElementById('cultura').value;
    const hectares = parseFloat(document.getElementById('hectares').value);
    
    const resultadoBox = document.getElementById('resultado');
    const txtResultado = document.getElementById('txt-resultado');

    if (!cultura || isNaN(hectares) || hectares <= 0) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }

    let recomendacaoAdubo = 0;
    let recomendacaoAgua = 0;

    // Lógica básica de cálculo baseada na cultura escolhida
    if (cultura === 'soja') {
        recomendacaoAdubo = hectares * 250; // Exemplo: 250kg por hectare
        recomendacaoAgua = hectares * 4500;  // Exemplo: 4500L por hectare
        txtResultado.innerHTML = `Para sua plantação de <strong>Soja</strong> em uma área de <strong>${hectares} ha</strong>, a estimativa recomendada é de <strong>${recomendacaoAdubo.toLocaleString('pt-BR')} kg</strong> de adubo NPK e um volume de irrigação monitorada de aproximadamente <strong>${recomendacaoAgua.toLocaleString('pt-BR')} Litros</strong> por ciclo.`;
    } else if (cultura === 'milho') {
        recomendacaoAdubo = hectares * 300; // Exemplo: 300kg por hectare
        recomendacaoAgua = hectares * 5500;  // Exemplo: 5500L por hectare
        txtResultado.innerHTML = `Para sua plantação de <strong>Milho</strong> em uma área de <strong>${hectares} ha</strong>, a estimativa recomendada é de <strong>${recomendacaoAdubo.toLocaleString('pt-BR')} kg</strong> de adubo NPK e um volume de irrigação monitorada de aproximadamente <strong>${recomendacaoAgua.toLocaleString('pt-BR')} Litros</strong> por ciclo.`;
    }

    // Exibe a caixa de resultado removendo a classe utilitária 'hidden'
    resultadoBox.classList.remove('hidden');
});
