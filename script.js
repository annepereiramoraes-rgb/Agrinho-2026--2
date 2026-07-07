// Initialize AOS Animation
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Progress Bar
window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";

    // Header scroll effect
    const header = document.getElementById('header');
    if (winScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (winScroll > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile Menu Toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Animated Counters
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 50;
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.innerText = Math.ceil(current * 10) / 10;
                setTimeout(updateCounter, 30);
            } else {
                counter.innerText = target;
            }
        };

        updateCounter();
    });
};

// Trigger counters when stats section is visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
});

observer.observe(document.querySelector('.stats'));

// Chart.js - Production Chart
const ctx = document.getElementById('productionChart').getContext('2d');
const productionChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['2000', '2005', '2010', '2015', '2020', '2025', '2026'],
        datasets: [{
            label: 'Produção de Grãos (milhões de toneladas)',
            data: [85, 115, 150, 190, 250, 310, 320],
            borderColor: '#2D5016',
            backgroundColor: 'rgba(45, 80, 22, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 50
            }
        }
    }
});

// Gallery Filter
let currentImageIndex = 0;
const galleryItems = document.querySelectorAll('.gallery-item');

function filterGallery(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    galleryItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 10);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Lightbox
function openLightbox(index) {
    const visibleItems = Array.from(galleryItems).filter(item => 
        item.style.display !== 'none'
    );
    currentImageIndex = index;
    const item = visibleItems[currentImageIndex];
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    
    lightboxImg.src = item.dataset.img;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function changeImage(direction) {
    const visibleItems = Array.from(galleryItems).filter(item => 
        item.style.display !== 'none'
    );
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) currentImageIndex = visibleItems.length - 1;
    if (currentImageIndex >= visibleItems.length) currentImageIndex = 0;
    
    const item = visibleItems[currentImageIndex];
    document.getElementById('lightboxImg').src = item.dataset.img;
}

// Add click events to gallery items
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
});

// Close lightbox with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeImage(-1);
    if (e.key === 'ArrowRight') changeImage(1);
});

// Leaflet Map
const map = L.map('map').setView([-14.235, -51.925], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const statesData = {
    MT: {
        name: 'Mato Grosso',
        lat: -12.64,
        lng: -56.09,
        soja: { area: '10.2M ha', producao: '34.5M ton' },
        milho: { area: '3.1M ha', producao: '25.8M ton' },
        preservada: '59.4%'
    },
    GO: {
        name: 'Goiás',
        lat: -15.83,
        lng: -49.86,
        soja: { area: '4.3M ha', producao: '14.2M ton' },
        milho: { area: '1.8M ha', producao: '8.5M ton' },
        preservada: '52.1%'
    },
    MS: {
        name: 'Mato Grosso do Sul',
        lat: -20.51,
        lng: -54.54,
        soja: { area: '3.2M ha', producao: '10.8M ton' },
        milho: { area: '1.5M ha', producao: '7.2M ton' },
        preservada: '61.3%'
    },
    PR: {
        name: 'Paraná',
        lat: -25.25,
        lng: -52.02,
        soja: { area: '5.5M ha', producao: '20.1M ton' },
        milho: { area: '2.2M ha', producao: '12.3M ton' },
        preservada: '48.7%'
    },
    SP: {
        name: 'São Paulo',
        lat: -22.19,
        lng: -48.78,
        cana: { area: '4.8M ha', producao: '340M ton' },
        cafe: { area: '0.2M ha', producao: '0.3M ton' },
        preservada: '34.2%'
    },
    MG: {
        name: 'Minas Gerais',
        lat: -18.51,
        lng: -44.55,
        cafe: { area: '1.1M ha', producao: '2.1M ton' },
        soja: { area: '1.2M ha', producao: '3.8M ton' },
        preservada: '42.5%'
    }
};

let markers = [];

function addMarkers(filterCulture = 'all', filterState = 'all') {
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    Object.keys(statesData).forEach(code => {
        if (filterState !== 'all' && code !== filterState) return;

        const state = statesData[code];
        let popupContent = `<h3>${state.name}</h3>`;
        
        if (filterCulture === 'all' || filterCulture === 'soja') {
            if (state.soja) {
                popupContent += `<p><strong>Soja:</strong><br>Área: ${state.soja.area}<br>Produção: ${state.soja.producao}</p>`;
            }
        }
        
        if (filterCulture === 'all' || filterCulture === 'milho') {
            if (state.milho) {
                popupContent += `<p><strong>Milho:</strong><br>Área: ${state.milho.area}<br>Produção: ${state.milho.producao}</p>`;
            }
        }
        
        if (filterCulture === 'cana' && state.cana) {
            popupContent += `<p><strong>Cana-de-açúcar:</strong><br>Área: ${state.cana.area}<br>Produção: ${state.cana.producao}</p>`;
        }
        
        if (filterCulture === 'cafe' && state.cafe) {
            popupContent += `<p><strong>Café:</strong><br>Área: ${state.cafe.area}<br>Produção: ${state.cafe.producao}</p>`;
        }

        popupContent += `<p><strong>Área Preservada:</strong> ${state.preservada}</p>`;

        const marker = L.marker([state.lat, state.lng])
            .addTo(map)
            .bindPopup(popupContent);
        
        markers.push(marker);
    });
}

function filterMap() {
    const culture = document.getElementById('cultureFilter').value;
    const state = document.getElementById('stateFilter').value;
    addMarkers(culture, state);
}

// Initialize map markers
addMarkers();

// Calculator
function calculateImpact() {
    const carne = parseFloat(document.getElementById('carneConsumo').value) || 0;
    const desperdicio = parseFloat(document.getElementById('desperdicio').value) || 0;
    const distancia = document.getElementById('distancia').value;
    
    // Coefficients
    const CO2_CARNE = 27; // kg CO2/kg carne
    const CO2_DESPERDICIO = 0.5; // kg CO2/kg
    const CO2_TRANSPORTE = {
        local: 0.1,
        nacional: 0.5,
        internacional: 2.3
    };

    // Weekly calculations
    const weeklyCarne = carne * CO2_CARNE;
    const weeklyDesperdicio = desperdicio * CO2_DESPERDICIO;
    const weeklyTransporte = (carne + desperdicio) * CO2_TRANSPORTE[distancia];
    
    // Annual
    const annualCO2 = (weeklyCarne + weeklyDesperdicio + weeklyTransporte) * 52;
    const trees = Math.ceil(annualCO2 / 22); // 1 tree absorbs ~22kg CO2/year
    
    // Display results
    document.getElementById('resultCO2').textContent = `${Math.round(annualCO2).toLocaleString()} kg CO₂`;
    document.getElementById('resultTrees').textContent = trees;
    
    // Comparison
    const mediaNacional = 2500;
    const diff = annualCO2 - mediaNacional;
    const comparisonText = document.getElementById('comparisonText');
    
    if (diff > 0) {
        comparisonText.innerHTML = `<span style="color: var(--laranja);">
            Você está ${Math.round(diff).toLocaleString()} kg acima da média nacional.
        </span>`;
    } else if (diff < 0) {
        comparisonText.innerHTML = `<span style="color: var(--verde-primario);">
            Parabéns! Você está ${Math.abs(Math.round(diff)).toLocaleString()} kg abaixo da média nacional.
        </span>`;
    } else {
        comparisonText.innerHTML = `Você está na média nacional.`;
    }

    // Tips
    const tipsList = document.getElementById('tipsList');
    tipsList.innerHTML = '';
    
    const tips = [];
    if (carne > 1) {
        tips.push('Reduza o consumo de carne bovina. Substitua por frango, peixe ou proteínas vegetais.');
    }
    if (desperdicio > 0.5) {
        tips.push('Planeje melhor suas compras e refeições para reduzir o desperdício.');
    }
    if (distancia === 'internacional') {
        tips.push('Prefira alimentos produzidos localmente para reduzir emissões de transporte.');
    }
    if (tips.length === 0) {
        tips.push('Continue com suas práticas sustentáveis!');
    }
    
    tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsList.appendChild(li);
    });

    // Show result
    document.getElementById('calcResult').classList.add('show');
    document.getElementById('calcResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Quiz
const quizData = {
    iniciante: [
        {
            question: "O que é Agricultura de Precisão?",
            options: [
                "Uso de tecnologias como GPS e drones para otimizar a produção",
                "Plantar apenas em áreas precisas e delimitadas",
                "Agricultura orgânica certificada",
                "Uso exclusivo de máquinas automáticas"
            ],
            correct: 0,
            explanation: "A Agricultura de Precisão utiliza tecnologias avançadas como GPS, drones, sensores e análise de dados para otimizar o uso de insumos e aumentar a produtividade de forma sustentável."
        },
        {
            question: "Qual sistema integra lavoura, pecuária e floresta?",
            options: [
                "Sistema Agroflorestal",
                "ILPF (Integração Lavoura-Pecuária-Floresta)",
                "Plantio Direto",
                "Rotação de Culturas"
            ],
            correct: 1,
            explanation: "O ILPF é um sistema que combina diferentes atividades agrícolas na mesma área, promovendo sustentabilidade, recuperação de pastagens e sequestro de carbono."
        },
        {
            question: "Quantos litros de água são necessários para produzir 1kg de carne bovina?",
            options: [
                "1.500 litros",
                "5.000 litros",
                "15.000 litros",
                "50.000 litros"
            ],
            correct: 2,
            explanation: "São necessários aproximadamente 15.000 litros de água para produzir 1kg de carne bovina, considerando toda a cadeia produtiva."
        },
        {
            question: "O que são bioinsumos?",
            options: [
                "Fertilizantes químicos importados",
                "Produtos biológicos que substituem ou reduzem agroquímicos",
                "Sementes geneticamente modificadas",
                "Máquinas agrícolas automáticas"
            ],
            correct: 1,
            explanation: "Bioinsumos são produtos de origem biológica (microrganismos, extratos vegetais, etc.) usados para controlar pragas, doenças e melhorar a fertilidade do solo de forma natural."
        },
        {
            question: "Qual a meta do Plano ABC+ para 2030?",
            options: [
                "Reduzir em 10% a produção agrícola",
                "Expandir para 72 milhões de hectares com tecnologias sustentáveis",
                "Acabar com o uso de máquinas agrícolas",
                "Proibir o uso de agrotóxicos"
            ],
            correct: 1,
            explanation: "O Plano ABC+ tem como meta expandir o uso de tecnologias de baixa emissão de carbono para 72 milhões de hectares até 2030."
        }
    ],
    intermediario: [
        {
            question: "O que é sequestro de carbono no solo?",
            options: [
                "Remoção de CO2 da atmosfera e armazenamento no solo",
                "Queima de resíduos agrícolas",
                "Aplicação de calcário no solo",
                "Uso de fertilizantes nitrogenados"
            ],
            correct: 0,
            explanation: "O sequestro de carbono no solo é o processo de capturar CO2 da atmosfera e armazená-lo na matéria orgânica do solo, ajudando a mitigar as mudanças climáticas."
        },
        {
            question: "Qual a principal vantagem do Plantio Direto?",
            options: [
                "Aumentar o uso de maquinário",
                "Manter a palhada sobre o solo, evitando erosão",
                "Reduzir a produtividade",
                "Aumentar o consumo de água"
            ],
            correct: 1,
            explanation: "O Plantio Direto mantém a cobertura do solo com palhada, reduzindo a erosão em até 90%, melhorando a retenção de água e aumentando a matéria orgânica."
        },
        {
            question: "O que é o Código Florestal Brasileiro?",
            options: [
                "Lei que proíbe toda atividade agrícola",
                "Legislação que define áreas de preservação em propriedades rurais",
                "Norma apenas para florestas públicas",
                "Regulamento sobre exportação de madeira"
            ],
            correct: 1,
            explanation: "O Código Florestal estabelece que propriedades rurais devem manter áreas de Reserva Legal e Áreas de Preservação Permanente (APPs) para conservação ambiental."
        },
        {
            question: "Qual tecnologia permite monitoramento em tempo real das lavouras?",
            options: [
                "Tratores convencionais",
                "Drones e sensores IoT",
                "Calendário lunar",
                "Observação visual manual"
            ],
            correct: 1,
            explanation: "Drones equipados com câmeras multiespectrais e sensores IoT permitem monitorar saúde das plantas, umidade do solo e detectar pragas em tempo real."
        },
        {
            question: "O que é Agricultura Regenerativa?",
            options: [
                "Agricultura que apenas mantém o solo como está",
                "Sistema que vai além da sustentabilidade, regenerando o solo e aumentando biodiversidade",
                "Cultivo apenas de plantas nativas",
                "Abandono total de tecnologias"
            ],
            correct: 1,
            explanation: "A Agricultura Regenerativa busca não apenas preservar, mas regenerar o solo, aumentar a biodiversidade e sequestrar carbono, indo além da sustentabilidade tradicional."
        }
    ],
    avancado: [
        {
            question: "Qual o percentual do PIB brasileiro representado pelo agronegócio em 2024?",
            options: [
                "10,5%",
                "15,8%",
                "23,2%",
                "35,7%"
            ],
            correct: 2,
            explanation: "O agronegócio representou 23,2% do PIB brasileiro em 2024, demonstrando sua importância para a economia nacional."
        },
        {
            question: "Quantos milhões de hectares o Plano ABC+ prevê recuperar de pastagens degradadas até 2030?",
            options: [
                "10 milhões",
                "20 milhões",
                "30 milhões",
                "50 milhões"
            ],
            correct: 2,
            explanation: "O Plano ABC+ estabelece a meta de recuperar 30 milhões de hectares de pastagens degradadas até 2030."
        },
        {
            question: "Qual a taxa de crescimento do PIB da agropecuária em 2025?",
            options: [
                "2,3%",
                "5,7%",
                "11,7%",
                "18,2%"
            ],
            correct: 2,
            explanation: "O PIB da agropecuária cresceu 11,7% em 2025, somando R$ 775,3 bilhões, impulsionando o crescimento econômico do país."
        },
        {
            question: "O que é blockchain no contexto do agronegócio?",
            options: [
                "Tipo de fertilizante orgânico",
                "Tecnologia de rastreabilidade que garante transparência na cadeia produtiva",
                "Máquina de colheita automática",
                "Sistema de irrigação por gotejamento"
            ],
            correct: 1,
            explanation: "Blockchain permite rastreabilidade completa dos produtos, garantindo transparência, autenticidade e certificação de práticas sustentáveis em toda a cadeia."
        },
        {
            question: "Qual o valor das exportações do agronegócio brasileiro?",
            options: [
                "US$ 53 bilhões",
                "US$ 103 bilhões",
                "US$ 153 bilhões",
                "US$ 253 bilhões"
            ],
            correct: 2,
            explanation: "As exportações do agronegócio brasileiro ultrapassaram US$ 153 bilhões, sendo fundamentais para o equilíbrio da balança comercial do país."
        }
    ]
};

let currentQuiz = [];
let currentQuestion = 0;
let score = 0;
let currentLevel = 'iniciante';

function startQuiz(level) {
    currentLevel = level;
    currentQuiz = [...quizData[level]].sort(() => Math.random() - 0.5);
    currentQuestion = 0;
    score = 0;

    // Update buttons
    document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Show quiz
    document.getElementById('quizLevels').style.display = 'none';
    document.getElementById('quizProgress').style.display = 'block';
    document.getElementById('quizResult').classList.remove('show');
    
    showQuestion();
}

function showQuestion() {
    const container = document.getElementById('quizQuestions');
    const q = currentQuiz[currentQuestion];
    
    // Update progress
    const progress = ((currentQuestion) / currentQuiz.length) * 100;
    document.getElementById('progressBarQuiz').style.width = progress + '%';

    let html = `
        <div class="quiz-question active">
            <div class="question-text">${currentQuestion + 1}. ${q.question}</div>
            <div class="quiz-options">
    `;

    q.options.forEach((opt, idx) => {
        html += `<div class="quiz-option" onclick="checkAnswer(${idx})">${opt}</div>`;
    });

    html += `</div></div>`;
    container.innerHTML = html;
}

function checkAnswer(selected) {
    const q = currentQuiz[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    
    options.forEach((opt, idx) => {
        opt.style.pointerEvents = 'none';
        if (idx === q.correct) {
            opt.classList.add('correct');
        } else if (idx === selected && idx !== q.correct) {
            opt.classList.add('incorrect');
        }
    });

    // Show explanation
    const explanation = document.createElement('div');
    explanation.style.cssText = 'margin-top: 1rem; padding: 1rem; background: #e8f5e9; border-radius: 8px;';
    explanation.innerHTML = `<strong>${selected === q.correct ? '✓ Correto!' : '✗ Incorreto'}</strong><br>${q.explanation}`;
    document.querySelector('.quiz-question.active').appendChild(explanation);

    if (selected === q.correct) score++;

    // Next question
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < currentQuiz.length) {
            showQuestion();
        } else {
            showResult();
        }
    }, 3000);
}

function showResult() {
    document.getElementById('quizQuestions').innerHTML = '';
    document.getElementById('quizProgress').style.display = 'none';
    
    const percentage = (score / currentQuiz.length) * 100;
    let badge, title, message;

    if (percentage === 100) {
        badge = '🌳';
        title = 'Mestre da Sustentabilidade!';
        message = 'Parabéns! Você demonstra conhecimento excepcional sobre sustentabilidade no agronegócio!';
    } else if (percentage >= 70) {
        badge = '🌿';
        title = 'Guardião da Natureza!';
        message = 'Excelente! Você tem ótimo conhecimento sobre práticas sustentáveis no campo.';
    } else {
        badge = '🌱';
        title = 'Iniciante Verde!';
        message = 'Bom começo! Continue estudando para se tornar um especialista em sustentabilidade.';
    }

    document.getElementById('quizBadge').textContent = badge;
    document.getElementById('quizTitle').textContent = title;
    document.getElementById('quizScore').textContent = 
        `Você acertou ${score} de ${currentQuiz.length} questões (${Math.round(percentage)}%)`;
    document.getElementById('quizMessage').textContent = message;
    document.getElementById('quizResult').classList.add('show');
}

function restartQuiz() {
    document.getElementById('quizLevels').style.display = 'flex';
    document.getElementById('quizResult').classList.remove('show');
    document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.level-btn').classList.add('active');
}

// Contact Form
function handleSubmit(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const assunto = document.getElementById('assunto').value;
    const mensagem = document.getElementById('mensagem').value;
    
    // Validation
    if (nome.length < 3) {
        showMessage('Por favor, insira um nome válido (mínimo 3 caracteres).', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Por favor, insira um e-mail válido.', 'error');
        return;
    }
    
    if (mensagem.length < 10) {
        showMessage('A mensagem deve ter pelo menos 10 caracteres.', 'error');
        return;
    }

    // Simulate form submission
    showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    document.getElementById('contactForm').reset();
}

function showMessage(text, type) {
    const msgDiv = document.getElementById('formMessage');
    msgDiv.textContent = text;
    msgDiv.className = 'form-message ' + type;
    
    setTimeout(() => {
        msgDiv.className = 'form-message';
    }, 5000);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
