// ==========================================
// 1. Lógica do Modo Escuro (Dark Mode)
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Verifica se o usuário já tinha uma preferência salva no navegador
const currentTheme = localStorage.getItem('theme');

// Se a preferência for escuro, aplica a classe e muda o ícone
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggleBtn.textContent = '☀️';
}

// Evento de clique no botão
themeToggleBtn.addEventListener('click', () => {
    // Adiciona ou remove a classe do body
    body.classList.toggle('dark-mode');
    
    // Atualiza o ícone e salva a preferência
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = '🌙';
    }
});

// ==========================================
// 2. Scroll suave para links internos
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if(targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// 3. Efeito de fade-in ao rolar a página
// ==========================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Aplica estilo inicial e observa as seções
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
});