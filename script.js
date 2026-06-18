// ==========================================================================
// CONFIGURAÇÃO DA CALCULADORA DE IMPACTO AMBIENTAL
// ==========================================================================
function calcularImpacto() {
    const hectares = parseFloat(document.getElementById('hectares').value);
    const cultura = document.getElementById('cultura').value;
    const resultadoBox = document.getElementById('resultado-calculo');

    if (isNaN(hectares) || hectares <= 0) {
        alert('Por favor, insira um número válido de hectares.');
        return;
    }

    let multiplicadorAgua = cultura === 'graos' ? 450000 : 600000; 
    let multiplicadorCarbono = cultura === 'graos' ? 220 : 310;
    let multiplicadorCusto = cultura === 'graos' ? 1200 : 1800;

    // Cálculos matemáticos simulação
    const aguaEconomizada = hectares * multiplicadorAgua;
    const carbonoEvitado = hectares * multiplicadorCarbono;
    const custoReduzido = hectares * multiplicadorCusto;

    // Injeta os dados formatados no HTML
    document.getElementById('res-agua').innerText = aguaEconomizada.toLocaleString('pt-BR');
    document.getElementById('res-carbono').innerText = carbonoEvitado.toLocaleString('pt-BR');
    document.getElementById('res-custo').innerText = custoReduzido.toLocaleString('pt-BR');

    // Revela a caixa com os resultados removendo a classe 'hidden'
    resultadoBox.classList.remove('hidden');
}

// ==========================================================================
// CONFIGURAÇÃO DO QUIZ INTERATIVO
// ==========================================================================
const bancoPerguntas = [
    {
        pergunta: "Qual dessas técnicas evita a aragem mecânica e reduz as emissões de CO2 no solo?",
        opcoes: ["Irrigação por Pivô", "Plantio Direto", "Monocultura intensiva", "Desmatamento planejado"],
        correta: 1
    },
    {
        pergunta: "O que significa a sigla ILPF no agronegócio moderno?",
        opcoes: ["Irrigação de Lavoura por Pressão Fixa", "Índice de Lucro de Pastagem Forte", "Integração Lavoura-Pecuária-Floresta", "Indústria de Logística Produtiva de Frutas"],
        correta: 2
    },
    {
        pergunta: "Qual gás de efeito estufa altamente poluente é evitado controlando os fertilizantes nitrogenados?",
        opcoes: ["Óxido Nitroso (N₂O)", "Oxigênio (O₂)", "Hélio (He)", "Metano residual puro"],
        correta: 0
    }
];

let indiceAtual = 0;
let pontuacao = 0;

function carregarPergunta() {
    const perguntaAtual = bancoPerguntas[indiceAtual];
    const perguntaTexto = document.getElementById('quiz-pergunta');
    const opcoesContainer = document.getElementById('quiz-opcoes');

    perguntaTexto.innerText = perguntaAtual.pergunta;
    opcoesContainer.innerHTML = '';

    perguntaAtual.opcoes.forEach((opcao, id) => {
        const botao = document.createElement('button');
        botao.innerText = opcao;
        botao.classList.add('btn-opcao');
        botao.onclick = () => verificarResposta(id);
        opcoesContainer.appendChild(botao);
    });
}

function verificarResposta(opcaoSelecionada) {
    if (opcaoSelecionada === bancoPerguntas[indiceAtual].correta) {
        pontuacao++;
    }

    indiceAtual++;

    if (indiceAtual < bancoPerguntas.length) {
        carregarPergunta();
    } else {
        mostrarResultadoQuiz();
    }
}

function mostrarResultadoQuiz() {
    document.getElementById('pergunta-bloco').classList.add('hidden');
    const resultadoBox = document.getElementById('quiz-resultado');
    resultadoBox.classList.remove('hidden');
    document.getElementById('quiz-placar').innerText = `Você acertou ${pontuacao} de ${bancoPerguntas.length} perguntas.`;
}

function reiniciarQuiz() {
    indiceAtual = 0;
    pontuacao = 0;
    document.getElementById('quiz-resultado').classList.add('hidden');
    document.getElementById('pergunta-bloco').classList.remove('hidden');
    carregarPergunta();
}

// ==========================================================================
// CAPTURA DO FORMULÁRIO DE CONTATO
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    carregarPergunta(); // Inicializa o quiz ao carregar o site

    const formulario = document.getElementById('formAgro');
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        alert(`Excelente, ${nome}! Dados processados com sucesso. Obrigado por apoiar o desenvolvimento do agronegócio sustentável.`);
        this.reset();
    });
});
