// ENCYCLOPEDIA CHINA - MAIN JAVASCRIPT
// Interactive features and functionality
// ========================================

// === GLOBAL STATE ===
const state = {
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'ro',
    searchResults: []
};

// === THEME TOGGLE ===
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    // Apply saved theme
    html.setAttribute('data-theme', state.theme);
    updateThemeIcon();
    // Toggle event
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', state.theme);
            localStorage.setItem('theme', state.theme);
            updateThemeIcon();
            // Animate transition
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = state.theme === 'light' ? '🌙' : '☀️';
    }
}

// === LANGUAGE SELECTOR ===
function initLanguageSelector() {
    const langSelector = document.getElementById('langSelector');
    if (langSelector) {
        langSelector.value = state.language;
        langSelector.addEventListener('change', (e) => {
            state.language = e.target.value;
            localStorage.setItem('language', state.language);
            // In a real application, this would trigger page translation
            showNotification(`Limba schimbată în: ${e.target.options[e.target.selectedIndex].text}`);
        });
    }
}

// === SEARCH FUNCTIONALITY ===
const searchData = {
    'index.html': [
        { title: 'China - Pagina Principală', keywords: 'china, acasă, introducere, prezentare generală' },
        { title: 'Geografie scurtă', keywords: 'geografie, climă, relief' },
        { title: 'Economie scurtă', keywords: 'economie, PIB, export' },
        { title: 'Cultură scurtă', keywords: 'cultură, artă, tradiții' }
    ],
    'istorie.html': [
        { title: 'Istoria Chinei', keywords: 'istorie, dinastii, revoluții' },
        { title: 'Dinastia Qin', keywords: 'qin, primul împărat, marele zid' },
        { title: 'Dinastia Han', keywords: 'han, drumurile mătăsii, hârtie' },
        { title: 'Dinastia Tang', keywords: 'tang, vârful culturii, poezie' },
        { title: 'Revoluția Culturală', keywords: 'mao, revoluție culturală, gărzi roșii' }
    ],
    'cultura.html': [
        { title: 'Cultura Chineză', keywords: 'cultură, artă, muzică, teatru' },
        { title: 'Limbi și Dialecte', keywords: 'mandarin, cantonez, limbi' },
        { title: 'Religii', keywords: 'budism, taoism, confucianism' },
        { title: 'Sărbători', keywords: 'anul nou chinezesc, festivaluri' },
        { title: 'Opera Beijing', keywords: 'operă, teatru, muzică' }
    ],
    'geografie.html': [
        { title: 'Geografia Chinei', keywords: 'geografie, relief, climă' },
        { title: 'Munții Himalaya', keywords: 'himalaya, everest, munți' },
        { title: 'Fluviul Yangtze', keywords: 'yangtze, fluvii, râuri' },
        { title: 'Platoul Tibet', keywords: 'tibet, platou, altitudine' },
        { title: 'Biodiversitate', keywords: 'panda, animale, natură' }
    ],
    'economie.html': [
        { title: 'Economia Chinei', keywords: 'economie, PIB, comerț' },
        { title: 'Sectoare Economice', keywords: 'industrie, servicii, agricultură' },
        { title: 'Comerț Exterior', keywords: 'export, import, comerț' },
        { title: 'Companii Chineze', keywords: 'alibaba, tencent, huawei' },
        { title: 'Belt and Road', keywords: 'bri, infrastructură, investiții' }
    ],
    'gastronomie.html': [
        { title: 'Gastronomia Chineză', keywords: 'gastronomie, mâncare, bucătărie' },
        { title: 'Bucătăria Sichuan', keywords: 'sichuan, picant, mapo tofu' },
        { title: 'Bucătăria Cantonez', keywords: 'canton, dim sum, yum cha' },
        { title: 'Rață Peking', keywords: 'rață, beijing, peking' },
        { title: 'Hot Pot', keywords: 'hot pot, supă, fondue' }
    ]
};

function initSearch() {
    const searchInput = document.getElementById('globalSearch');
    const searchResults = document.getElementById('searchResults');
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) {
                searchResults.classList.remove('active');
                return;
            }
            // Search across all pages
            const results = [];
            for (const [page, pageData] of Object.entries(searchData)) {
                pageData.forEach(item => {
                    if (item.title.toLowerCase().includes(query) || 
                        item.keywords.toLowerCase().includes(query)) {
                        results.push({ ...item, page });
                    }
                });
            }
            displaySearchResults(results.slice(0, 8), searchResults);
        });
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    }
}

function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-muted);">Nu s-au găsit rezultate</div>';
        container.classList.add('active');
        return;
    }
    container.innerHTML = results.map(result => `
        <div class="search-result-item" onclick="window.location.href='${result.page}'">
            <div style="font-weight: 500; color: var(--text-primary);">${result.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${result.page}</div>
        </div>
    `).join('');
    container.classList.add('active');
}

// === TABLE OF CONTENTS AUTO-GENERATION ===
function initTableOfContents() {
    const tocList = document.getElementById('tocList');
    const contentMain = document.querySelector('.content-main');
    if (tocList && contentMain) {
        // Check if TOC is already manually created
        if (tocList.children.length > 0) {
            // Highlight active section on scroll
            initScrollSpy();
            return;
        }
        // Auto-generate TOC from h2 headings
        const headings = contentMain.querySelectorAll('h2[id]');
        if (headings.length === 0) return;
        tocList.innerHTML = '';
        headings.forEach(heading => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;
            li.appendChild(a);
            tocList.appendChild(li);
        });
        initScrollSpy();
    }
}

// === SCROLL SPY FOR TOC ===
function initScrollSpy() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    const sections = document.querySelectorAll('.content-section[id]');
    if (tocLinks.length === 0 || sections.length === 0) return;
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                tocLinks.forEach(link => {
                    link.style.fontWeight = link.getAttribute('href') === `#${entry.target.id}` ? '600' : '400';
                    link.style.color = link.getAttribute('href') === `#${entry.target.id}` ? 
                        'var(--primary-color)' : 'var(--text-secondary)';
                });
            }
        });
    }, observerOptions);
    sections.forEach(section => observer.observe(section));
}

// === QUICK LINKS FUNCTIONALITY ===
function initQuickLinks() {
    // Print Page
    const printButton = document.getElementById('printPage');
    if (printButton) {
        printButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.print();
        });
    }
    // Permalink
    const permalinkButton = document.getElementById('permalink');
    if (permalinkButton) {
        permalinkButton.addEventListener('click', (e) => {
            e.preventDefault();
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link copiat în clipboard!');
            });
        });
    }
    // Cite This Page
    const citeButton = document.getElementById('citeThis');
    if (citeButton) {
        citeButton.addEventListener('click', (e) => {
            e.preventDefault();
            showCitationModal();
        });
    }
    // Page History
    const historyButton = document.getElementById('pageHistory');
    if (historyButton) {
        historyButton.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Funcția de istoric va fi disponibilă în curând');
        });
    }
}

// === CITATION MODAL ===
function showCitationModal() {
    const pageTitle = document.querySelector('.page-title')?.textContent || 'Pagină';
    const today = new Date().toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const citation = `Encyclopedia China. "${pageTitle}". Accesat ${today}. ${window.location.href}`;
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s;
    `;
    modal.innerHTML = `
        <div style="
            background: var(--bg-primary);
            padding: 2rem;
            border-radius: 1rem;
            max-width: 600px;
            width: 90%;
            box-shadow: var(--shadow-xl);
        ">
            <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Citează această pagină</h3>
            <textarea readonly style="
                width: 100%;
                padding: 1rem;
                border: 1px solid var(--border-color);
                border-radius: 0.5rem;
                background: var(--bg-secondary);
                color: var(--text-primary);
                font-family: var(--font-mono);
                font-size: 0.9rem;
                resize: vertical;
                min-height: 100px;
            ">${citation}</textarea>
            <div style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: flex-end;">
                <button onclick="this.closest('[style*=fixed]').remove()" style="
                    padding: 0.75rem 1.5rem;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 0.5rem;
                    cursor: pointer;
                    color: var(--text-primary);
                ">Închide</button>
                <button onclick="
                    navigator.clipboard.writeText(this.previousElementSibling.previousElementSibling.value);
                    showNotification('Citare copiată!');
                    this.closest('[style*=fixed]').remove();
                " style="
                    padding: 0.75rem 1.5rem;
                    background: var(--primary-color);
                    border: none;
                    border-radius: 0.5rem;
                    color: white;
                    cursor: pointer;
                    font-weight: 600;
                ">Copiază</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// === NOTIFICATION SYSTEM ===
function showNotification(message, duration = 3000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: ${document.querySelector('.header-fixed').offsetHeight + 20}px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header-fixed').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// === REFERENCE TOOLTIP ===
function initReferences() {
    const references = document.querySelectorAll('.reference');
    references.forEach(ref => {
        ref.addEventListener('click', (e) => {
            e.preventDefault();
            const refNumber = ref.textContent.match(/\d+/)[0];
            const referencesList = document.querySelector('.references-list');
            if (referencesList) {
                const targetRef = referencesList.querySelector(`li:nth-child(${refNumber})`);
                if (targetRef) {
                    targetRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetRef.style.backgroundColor = 'var(--primary-light)';
                    targetRef.style.padding = '0.5rem';
                    targetRef.style.borderRadius = '0.25rem';
                    targetRef.style.transition = 'all 0.3s';
                    setTimeout(() => {
                        targetRef.style.backgroundColor = 'transparent';
                        targetRef.style.padding = '0';
                    }, 2000);
                }
            }
        });
    });
}

function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"], img.content-image');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Doar dacă imaginea NU este deja complet încărcată
                if (!img.complete) {
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.5s';
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                } else {
                    // Imagine deja încărcată → se arată imediat
                    img.style.opacity = '1';
                }

                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}

// === ANIMATE ON SCROLL ===
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0) translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        animationObserver.observe(el);
    });
}

// === MOBILE MENU TOGGLE ===
function initMobileMenu() {
    // Create mobile menu button if on mobile
    if (window.innerWidth <= 768) {
        const headerLeft = document.querySelector('.header-left');
        const mainNav = document.querySelector('.main-nav');
        if (headerLeft && mainNav) {
            const menuButton = document.createElement('button');
            menuButton.innerHTML = '☰';
            menuButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: var(--primary-color);
                color: white;
                border: none;
                font-size: 1.5rem;
                box-shadow: var(--shadow-lg);
                cursor: pointer;
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            menuButton.addEventListener('click', () => {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) {
                    if (sidebar.style.display === 'block') {
                        sidebar.style.display = 'none';
                        menuButton.innerHTML = '☰';
                    } else {
                        sidebar.style.display = 'block';
                        sidebar.style.position = 'fixed';
                        sidebar.style.top = 'var(--header-height)';
                        sidebar.style.left = '0';
                        sidebar.style.width = '80%';
                        sidebar.style.maxWidth = '320px';
                        sidebar.style.zIndex = '998';
                        sidebar.style.boxShadow = 'var(--shadow-xl)';
                        menuButton.innerHTML = '✕';
                    }
                }
            });
            document.body.appendChild(menuButton);
        }
    }
}

// === BACK TO TOP BUTTON ===
function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s;
        z-index: 999;
        box-shadow: var(--shadow-md);
    `;
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    document.body.appendChild(backToTop);
}

// === INITIALIZE ALL ===
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguageSelector();
    initSearch();
    initTableOfContents();
    initQuickLinks();
    initSmoothScroll();
    initReferences();
    initLazyLoading();
    initScrollAnimations();
    initMobileMenu();
    initBackToTop();
    console.log('🏛️ Encyclopedia China - Loaded successfully');
});

// === PERFORMANCE OPTIMIZATION ===
// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// === ACCESSIBILITY FEATURES ===
// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('[style*="position: fixed"]');
        modals.forEach(modal => modal.remove());
    }
});
