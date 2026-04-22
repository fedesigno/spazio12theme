document.addEventListener('DOMContentLoaded', () => {
    
// --- ELEMENTI COMUNI ---
    const header = document.querySelector('.main-header');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelectorAll('.menu-links a');
    const logoLink = document.querySelector('.logo-area');
    const sections = document.querySelectorAll('section[id]');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const projectContainer = document.getElementById('project-list');
    const moreBtnContainer = document.getElementById('more-btn-container');

    // --- DATABASE PROGETTI ---
    const projects = [
        { 
            category: "PA", 
            title: "PALAZZO COMUNALE", 
            location: "San Pietro Val Lemina (TO)", 
            year: "2023", 
            amount: "50.000 €", 
            end: "In corso", 
            tag: "LEGGE 160/2019", 
            desc: "Sostituzione illuminazione, impianto fotovoltaico 6 kW e isolamento solaio con manutenzione copertura.", 
            images: ["img/biblioteca.png", "img/baudi.png"] 
        },
        { 
            category: "PA", 
            title: "TEATRO BAUDI DI SELVE", 
            location: "Vigone (TO)", 
            year: "2023", 
            amount: "250.000 €", 
            end: "29 Sett. 2023", 
            tag: "PNRR", 
            desc: "Riqualificazione energetica e restauro conservativo...", 
            images: ["img/baudi.png", "img/baudi.png"] 
        },
        { 
            category: "PRIVATI", 
            title: "INTERVENTO RESIDENZIALE", 
            location: "Pinerolo (TO)", 
            year: "2022", 
            amount: "120.000 €", 
            end: "2022", 
            tag: "PRIVATO", 
            desc: "Riqualificazione energetica villa unifamiliare.", 
            images: ["img/scuola_materna.png", "img/baudi.png"] 
        }
    ];

    let currentCategory = null;

// 1. INIZIALIZZAZIONE CATEGORIE (Conteggio e Sfondo Animato)
// Funzione per inizializzare tutto ciò che riguarda i progetti
function setupProjectSystem() {
    console.log("Inizializzazione sistema progetti... Progetti trovati:", projects.length);
    
    // Se per qualche motivo l'array è vuoto, fermati e segnalalo
    if (projects.length === 0) {
        console.error("ERRORE: L'array 'projects' è vuoto. Controlla il database.");
        return;
    }

    initCategories();
}

function initCategories() {
    const cats = ['PA', 'PRIVATI'];
    
    cats.forEach(cat => {
        const filtered = projects.filter(p => p.category === cat);
        const label = document.querySelector(`.cat-elite-card[onclick*="${cat}"] .cat-count`);
        const slider = document.getElementById(`bg-slider-${cat.toLowerCase()}`);

        console.log(`Categoria ${cat}: ${filtered.length} progetti trovati.`);

        // 1. Forza il conteggio (anche se è 0 deve scriverlo, ma qui deve essere > 0)
        if(label) {
            label.textContent = `/ ${filtered.length.toString().padStart(2, '0')}`;
        }

        // 2. Caricamento Immagini
        if(slider) {
            // Pulizia totale
            if(window[`timer_${cat}`]) clearInterval(window[`timer_${cat}`]);
            slider.innerHTML = ''; 

            if (filtered.length > 0) {
                const allPhotos = filtered.flatMap(p => p.images).map(src => src.replace('iimg/', 'img/'));
                
                allPhotos.forEach((src, i) => {
                    const img = document.createElement('img');
                    img.src = src;
                    img.style.position = 'absolute';
                    img.style.inset = '0';
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    img.style.transition = 'opacity 1.5s ease-in-out';
                    
                    if(i === 0) {
                        img.classList.add('active');
                        img.style.opacity = '1';
                        img.style.zIndex = '1';
                    } else {
                        img.style.opacity = '0';
                        img.style.zIndex = '0';
                    }
                    slider.appendChild(img);
                });

                // 3. Timer Scorrimento
                if(allPhotos.length > 1) {
                    window[`timer_${cat}`] = setInterval(() => {
                        const imgs = slider.querySelectorAll('img');
                        let activeIdx = Array.from(imgs).findIndex(img => img.classList.contains('active'));
                        if (activeIdx === -1) activeIdx = 0;

                        imgs[activeIdx].classList.remove('active');
                        imgs[activeIdx].style.opacity = '0';
                        imgs[activeIdx].style.zIndex = '0';
                        
                        let nextIdx = (activeIdx + 1) % imgs.length;
                        imgs[nextIdx].classList.add('active');
                        imgs[nextIdx].style.opacity = '1';
                        imgs[nextIdx].style.zIndex = '1';
                    }, 4000);
                }
            }
        }
    });
}

// Chiamata all'avvio: assicurati che sia l'ULTIMA cosa nel tuo file script.js
// o mettila dentro il window.onload per essere certi che i dati siano pronti
window.onload = () => {
    setupProjectSystem();
};

window.closeCategories = function() {
    const projectsDisplay = document.getElementById('projects-display');
    const categorySelection = document.getElementById('category-selection');
    const cards = categorySelection.querySelectorAll('.cat-elite-card');

    // 1. FASE DI USCITA: Nascondi i progetti con dissolvenza
    projectsDisplay.classList.add('fade-out-down');

    // 2. CAMBIO STATO: Aspettiamo che la dissolvenza finisca
    setTimeout(() => {
        projectsDisplay.style.display = 'none';
        projectsDisplay.classList.remove('fade-out-down');
        
        // Prepariamo le card settori: le mettiamo invisibili prima di mostrarle
        cards.forEach(card => {
            card.style.opacity = '0';
            card.classList.remove('fade-in-up');
        });

        categorySelection.style.display = 'grid';

        // 3. FASE DI ENTRATA: Forza il browser a far ripartire l'animazione
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                cards.forEach(card => {
                    card.classList.add('fade-in-up');
                });
                
                // Facciamo ripartire slider e conteggi
                initCategories();
            });
        });

        // 4. SCROLL: Torna su dolcemente
        const section = document.getElementById('progetti');
        if (section) {
            window.scrollTo({
                top: section.offsetTop - 50,
                behavior: 'smooth'
            });
        }

    }, 400); // Questo deve essere leggermente meno o uguale al tempo del CSS (0.4s)
};

// 3. AVVIO AL CARICAMENTO
// Usiamo un piccolo trucco (timeout di 100ms) per essere sicuri che il browser abbia renderizzato i div
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCategories, 100);
});

    // 2. NAVIGAZIONE
    window.openCategory = function(cat) {
        currentCategory = cat;
        document.getElementById('category-selection').style.display = 'none';
        document.getElementById('projects-display').style.display = 'block';
        
        const years = [...new Set(projects.filter(p => p.category === cat).map(p => p.year))].sort().reverse();
        let filterHtml = `<button class="filter-btn active" onclick="setYearFilter('all', this)">TUTTI</button>`;
        years.forEach(y => filterHtml += `<button class="filter-btn" onclick="setYearFilter('${y}', this)">${y}</button>`);
        document.getElementById('year-filters').innerHTML = filterHtml;

        renderProjects('all');
        window.scrollTo({ top: document.getElementById('progetti').offsetTop - 80, behavior: 'smooth' });
    };


    window.setYearFilter = function(year, btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects(year);
    };

    // 3. RENDERING PROGETTI
    window.renderProjects = function(yearFilter = 'all', stretch = false) {
        const container = document.getElementById('project-list');
        if(!container) return;
        
        container.style.opacity = '0';
        
        setTimeout(() => {
            container.innerHTML = '';
            let filtered = projects.filter(p => p.category === currentCategory);
            if(yearFilter !== 'all') filtered = filtered.filter(p => p.year === yearFilter);

            const toDisplay = stretch ? filtered : filtered.slice(0, 4);

            toDisplay.forEach((p, pIndex) => {
                const card = document.createElement('div');
                card.className = 'project-card animate-in';
                let imgsHtml = p.images.map((img, i) => `<img src="${img}" class="${i === 0 ? 'active' : ''}" style="opacity: ${i === 0 ? '1' : '0'}">`).join('');
                
                card.innerHTML = `
                    <div class="p-image" id="slider-${pIndex}">
                        ${imgsHtml}
                        ${p.images.length > 1 ? `
                            <div class="slider-nav">
                                <button class="nav-arrow nav-prev" onclick="prevImg(${pIndex})">‹</button>
                                <button class="nav-arrow nav-next" onclick="nextImg(${pIndex})">›</button>
                            </div>` : ''}
                    </div>
                    <div class="p-content">
                        <div class="p-meta"><span class="p-year">${p.year}</span><span class="p-funding">${p.tag}</span></div>
                        <h3 class="p-title">${p.title}</h3>
                        <p class="p-location">📍 ${p.location}</p>
                        <p class="p-desc">${p.desc}</p>
                        <div class="p-spec-grid">
                            <div class="spec-item"><span>IMPORTO</span><strong>${p.amount}</strong></div>
                            <div class="spec-item"><span>FINE</span><strong>${p.end}</strong></div>
                        </div>
                    </div>`;
                container.appendChild(card);
            });

            const moreContainer = document.getElementById('more-btn-container');
            if (moreContainer) {
                moreContainer.innerHTML = (filtered.length > 2 && !stretch) 
                    ? `<button class="discover-more-btn" onclick="renderProjects('${yearFilter}', true)">MOSTRA DI PIÙ +</button>` : '';
            }
            container.style.opacity = '1';
        }, 300);
    };

    // 4. LOGICA SLIDER SINGOLI PROGETTI
    window.nextImg = function(pIdx) {
        const slider = document.getElementById(`slider-${pIdx}`);
        const imgs = slider.querySelectorAll('img');
        let idx = Array.from(imgs).findIndex(img => img.classList.contains('active'));
        
        imgs[idx].classList.remove('active');
        imgs[idx].style.opacity = '0';
        
        let nextIdx = (idx + 1) % imgs.length;
        imgs[nextIdx].classList.add('active');
        imgs[nextIdx].style.opacity = '1';
    };

    window.prevImg = function(pIdx) {
        const slider = document.getElementById(`slider-${pIdx}`);
        const imgs = slider.querySelectorAll('img');
        let idx = Array.from(imgs).findIndex(img => img.classList.contains('active'));
        
        imgs[idx].classList.remove('active');
        imgs[idx].style.opacity = '0';
        
        let prevIdx = (idx - 1 + imgs.length) % imgs.length;
        imgs[prevIdx].classList.add('active');
        imgs[prevIdx].style.opacity = '1';
    };

    // INIZIO
    document.addEventListener('DOMContentLoaded', () => {
        initCategories();
    });


    // --- GESTIONE NAVIGAZIONE & MENU ---
    const closeMenu = () => {
        header.classList.remove('menu-open');
        menuBtn.classList.remove('open');
        document.body.style.overflow = ''; 
    };

    // Toggle Menu Mobile
    menuBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = header.classList.toggle('menu-open');
        menuBtn.classList.toggle('open');
        // Se vuoi bloccare lo scroll quando il menu è aperto, decommenta la riga sotto
        // document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Logo Click (Torna su)
    logoLink?.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMenu();
    });

    // Smooth Scroll Link e chiusura menu automatica
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                closeMenu();
            }
        });
    });

    // --- SCROLL EFFECTS (Header, Indicator, ScrollSpy) ---
    const handleScroll = () => {
        const scrollPos = window.scrollY;
        
        // Header & Indicator
        header.classList.toggle('scrolled', scrollPos > 80);
        if (scrollIndicator) scrollIndicator.style.opacity = scrollPos > 100 ? '0' : '0.6';

        // ScrollSpy
        let currentSection = "";
        sections.forEach(section => {
            if (scrollPos >= (section.offsetTop - 350)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').includes(currentSection) && currentSection !== "");
        });
    };

    // --- FILTRI PROGETTI ---
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter, false);
        });
    });

    // --- AVVIO ---
    window.addEventListener('scroll', handleScroll);
    renderProjects('all', false);
    handleScroll();
});



document.addEventListener('DOMContentLoaded', () => {
    const boldEl = document.getElementById('hero-bold');
    const thinEl = document.getElementById('hero-thin');
    const morphEl = document.querySelector('.morph-word');
    const lineEl = document.querySelector('.hero-line');
    const subtitleEl = document.querySelector('.hero-subtitle');

    function triggerReveal(el, text, delay) {
        el.innerHTML = `<span class="reveal-item">${text}</span>`;
        setTimeout(() => {
            const span = el.querySelector('.reveal-item');
            if(span) span.classList.add('visible');
        }, delay);
    }

    // --- SEQUENZA VERTICALE ---
    setTimeout(() => {
        // 1. Appare SPAZIO (Sopra)
        triggerReveal(boldEl, "SPAZIO", 200);

        // 2. Dopo 600ms appare DODICI (Sotto)
        setTimeout(() => {
            triggerReveal(thinEl, "DODICI", 200);

            // 3. Quando il logo a due righe è completo, appare la linea
            setTimeout(() => {
                lineEl.style.width = "80px"; // Linea pulita ed essenziale

                // 4. Infine il Payoff
                setTimeout(() => {
                    subtitleEl.style.opacity = "1";
                    triggerReveal(morphEl, "COLLETTIVO di PROGETTAZIONE", 200);
                }, 800);

            }, 800);

        }, 600); 

    }, 600);

    // --- 2. SISTEMA "COLORA IMMAGINI AL PASSAGGIO" (RECUPERATO) ---
    const scrollImages = document.querySelectorAll('.vision-image, .member-photo, .map-wrapper, .team-member-row');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.70 // L'effetto parte quando il 70% dell'immagine è visibile
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Quando l'immagine entra, aggiunge la classe che toglie il bianco e nero
                entry.target.classList.add('is-visible');
            } else {
                // Quando esce, torna in bianco e nero (se lo desideri, altrimenti togli questo else)
                entry.target.classList.remove('is-visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    scrollImages.forEach(image => {
        observer.observe(image);
    });
});