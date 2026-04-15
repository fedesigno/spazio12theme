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
        { title: "PALAZZO COMUNALE", location: "San Pietro Val Lemina (TO)", year: "2023", status: "IN ATTIVO", amount: "50.000 €", end: "In corso", tag: "LEGGE 160/2019", desc: "Sostituzione illuminazione, impianto fotovoltaico 6 kW e isolamento solaio con manutenzione copertura.", img: "img/comune_sanpietro.png" },
        { title: "TEATRO BAUDI DI SELVE", location: "Vigone (TO)", year: "2023", status: "CONCLUSO", amount: "250.000 €", end: "29 Sett. 2023", tag: "PNRR", desc: "Riqualificazione energetica e restauro conservativo della pavimentazione lignea di metà '800 con ausilio della Soprintendenza.", img: "img/baudi.png" },
        { title: "SCUOLA MATERNA", location: "San Pietro Val Lemina (TO)", year: "2023", status: "CONCLUSO", amount: "215.000 €", end: "30 Agosto 2023", tag: "C.S.E. 2022", desc: "Efficientamento energetico del complesso scolastico tramite la sostituzione di tutti i serramenti esterni.", img: "img/scuola_materna.png" },
        { title: "SCUOLA ELEMENTARE", location: "Macello (TO)", year: "2023", status: "CONCLUSO", amount: "100.000 €", end: "31 Agosto 2023", tag: "C.S.E. 2022", desc: "Illuminazione LED, serramenti e installazione impianto fotovoltaico con relativa batteria di accumulo.", img: "img/scuola_elementare.png" },
        { title: "PALAZZO COMUNALE", location: "Macello (TO)", year: "2023", status: "CONCLUSO", amount: "60.000 €", end: "11 Sett. 2023", tag: "C.S.E. 2022", desc: "Efficientamento impianto di illuminazione e riqualificazione centrale termica con sostituzione caldaia.", img: "img/comune_macello.png" },
        { title: "BIBLIOTECA COMUNALE", location: "San Pietro Val Lemina (TO)", year: "2022", status: "CONCLUSO", amount: "140.000 €", end: "12 Aprile 2022", tag: "CONTO TERMICO 2.0", desc: "Rifacimento completo dei sistemi di generazione, distribuzione ed emissione calore e nuovi serramenti.", img: "img/biblioteca.png" }
    ];

    // --- FUNZIONE RENDERING PROGETTI ---
    window.renderProjects = function(filter = 'all', stretch = false) {
        if(!projectContainer) return;

        projectContainer.style.opacity = '0';
        
        setTimeout(() => {
            projectContainer.innerHTML = '';
            const filtered = filter === 'all' ? projects : projects.filter(p => p.year === filter);
            const toDisplay = (filtered.length <= 2 || stretch) ? filtered : filtered.slice(0, 2);

            toDisplay.forEach((p, i) => {
                const card = document.createElement('div');
                card.className = 'project-card animate-in';
                card.style.animationDelay = `${i * 0.1}s`;
                card.innerHTML = `
                    <div class="p-image"><img src="${p.img}" alt="${p.title}"><div class="p-status">${p.status}</div></div>
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
                projectContainer.appendChild(card);
            });

            if (moreBtnContainer) {
                moreBtnContainer.innerHTML = (filtered.length > 2 && !stretch) 
                    ? `<button class="discover-more-btn animate-in" onclick="renderProjects('${filter}', true)"><span>MOSTRA DI PIÙ</span><span class="plus-icon">+</span></button>`
                    : '';
            }
            projectContainer.style.opacity = '1';
        }, 400);
    };

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
    const boldStr = "SPAZIO";
    const thinStr = "DODICI";
    const boldEl = document.getElementById('hero-bold');
    const thinEl = document.getElementById('hero-thin');
    const morphEl = document.querySelector('.morph-word');
    const lineEl = document.querySelector('.hero-line');
    const subtitleEl = document.querySelector('.hero-subtitle');
    const scrollImages = document.querySelectorAll('.vision-image, .member-photo, .map-wrapper');

    const observerOptions = {
        root: null, // usa il viewport del browser
        rootMargin: '0px', // nessun margine extra
        threshold: 0.30 // l'effetto parte quando il 20% dell'immagine è visibile
    };

    // Funzione che viene eseguita quando l'elemento entra/esce dal viewport
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Quando l'immagine ENTRA nel campo visivo
                entry.target.classList.add('is-visible');
            } else {
                // Quando l'immagine ESCE dal campo visivo (torna grigia)
                entry.target.classList.remove('is-visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: '0px',
        threshold: 0.9 // Regola questo per decidere quanto deve essere visibile prima di colorarsi
    });
    
    scrollImages.forEach(image => {
        observer.observe(image);
    });

    function typeEffect(element, text, speed, callback) {
        let i = 0;
        element.textContent = ""; 
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                if (callback) callback();
            }
        }, speed);
    }

    const words = ["Architettura", "Design", "Ingegneria"];
    let wordIndex = 0;

    async function typeAndErase() {
        let currentWord = words[wordIndex];
        // Scrittura
        for (let i = 0; i <= currentWord.length; i++) {
            morphEl.textContent = currentWord.substring(0, i);
            await new Promise(res => setTimeout(res, 150));
        }
        // Pausa
        await new Promise(res => setTimeout(res, 2000));
        // Cancellazione
        for (let i = currentWord.length; i >= 0; i--) {
            morphEl.textContent = currentWord.substring(0, i);
            await new Promise(res => setTimeout(res, 100));
        }
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeAndErase, 400); 
    }

    // SEQUENZA: Logo -> Linea -> Payoff
    setTimeout(() => {
        typeEffect(boldEl, boldStr, 200, () => {
            typeEffect(thinEl, thinStr, 200, () => {
                // Finito il testo, allunghiamo la linea
                lineEl.style.width = "70%";
                
                setTimeout(() => {
                    subtitleEl.style.opacity = "1";
                    typeAndErase();
                }, 800);
            });
        });
    }, 500);

});