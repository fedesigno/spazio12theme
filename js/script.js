document.addEventListener('DOMContentLoaded', () => {
    
    // --- DATABASE PROGETTI ---
    const projects = [
        {
            title: "PALAZZO COMUNALE",
            location: "San Pietro Val Lemina (TO)",
            year: "2023",
            status: "IN ATTIVO",
            amount: "50.000 €",
            end: "In corso",
            tag: "LEGGE 160/2019",
            desc: "Sostituzione illuminazione, impianto fotovoltaico 6 kW e isolamento solaio con manutenzione copertura.",
            img: "img/comune_sanpietro.png"
        },
        {
            title: "TEATRO BAUDI DI SELVE",
            location: "Vigone (TO)",
            year: "2023",
            status: "CONCLUSO",
            amount: "250.000 €",
            end: "29 Sett. 2023",
            tag: "PNRR",
            desc: "Riqualificazione energetica e restauro conservativo della pavimentazione lignea di metà '800 con ausilio della Soprintendenza.",
            img: "img/baudi.png"
        },
        {
            title: "SCUOLA MATERNA",
            location: "San Pietro Val Lemina (TO)",
            year: "2023",
            status: "CONCLUSO",
            amount: "215.000 €",
            end: "30 Agosto 2023",
            tag: "C.S.E. 2022",
            desc: "Efficientamento energetico del complesso scolastico tramite la sostituzione di tutti i serramenti esterni.",
            img: "img/scuola_materna.png"
        },
        {
            title: "SCUOLA ELEMENTARE",
            location: "Macello (TO)",
            year: "2023",
            status: "CONCLUSO",
            amount: "100.000 €",
            end: "31 Agosto 2023",
            tag: "C.S.E. 2022",
            desc: "Illuminazione LED, serramenti e installazione impianto fotovoltaico con relativa batteria di accumulo.",
            img: "img/scuola_elementare.png"
        },
        {
            title: "PALAZZO COMUNALE",
            location: "Macello (TO)",
            year: "2023",
            status: "CONCLUSO",
            amount: "60.000 €",
            end: "11 Sett. 2023",
            tag: "C.S.E. 2022",
            desc: "Efficientamento impianto di illuminazione e riqualificazione centrale termica con sostituzione caldaia.",
            img: "img/comune_macello.png"
        },
        {
            title: "BIBLIOTECA COMUNALE",
            location: "San Pietro Val Lemina (TO)",
            year: "2022",
            status: "CONCLUSO",
            amount: "140.000 €",
            end: "12 Aprile 2022",
            tag: "CONTO TERMICO 2.0",
            desc: "Rifacimento completo dei sistemi di generazione, distribuzione ed emissione calore e nuovi serramenti.",
            img: "img/biblioteca.png"
        }
    ];

    const projectContainer = document.getElementById('project-list');
    const moreBtnContainer = document.getElementById('more-btn-container');

    // --- FUNZIONE DI RENDERING PROGETTI ---
    window.renderProjects = function(filter = 'all', stretch = false) {
        if(!projectContainer) return;

        projectContainer.style.opacity = '0';
        
        setTimeout(() => {
            projectContainer.innerHTML = '';
            const filtered = filter === 'all' ? projects : projects.filter(p => p.year === filter);
            const projectsToDisplay = (filtered.length <= 2 || stretch) ? filtered : filtered.slice(0, 2);

            projectsToDisplay.forEach((p, index) => {
                const card = document.createElement('div');
                card.className = 'project-card animate-in';
                card.style.animationDelay = `${index * 0.1}s`;
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
                if (filtered.length > 2 && !stretch) {
                    moreBtnContainer.innerHTML = `
                        <button class="discover-more-btn animate-in" onclick="renderProjects('${filter}', true)">
                            <span>MOSTRA DI PIÙ</span><span class="plus-icon">+</span>
                        </button>`;
                } else {
                    moreBtnContainer.innerHTML = '';
                }
            }
            projectContainer.style.opacity = '1';
        }, 600);
    };

    // --- GESTIONE FILTRI ---
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter, false);
        });
    });

// --- LOGICA MOBILE MENU (MORPHING) ---
const menuBtn = document.querySelector('.mobile-menu-btn');
const header = document.querySelector('.main-header');
const navLinks = document.querySelectorAll('.menu-links a');

if (menuBtn && header) {
    menuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        menuBtn.classList.toggle('open');
        header.classList.toggle('menu-open');
        
        // CANCELLA O COMMENTA QUESTA RIGA:
        // document.body.style.overflow = header.classList.contains('menu-open') ? 'hidden' : '';
        
        // LASCIALA COSÌ (VUOTA O RIMOSSA) PER PERMETTERE LO SCROLL:
        document.body.style.overflow = ''; 
    });

    // Chiudi il menu cliccando sui link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('open');
            header.classList.remove('menu-open');
            document.body.style.overflow = ''; // Assicurati che torni normale
        });
    });
}

    // --- SCROLL EFFECTS (Pillola & ScrollSpy) ---
    const sections = document.querySelectorAll('section[id]');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    function handleScrollEffects() {
        const scrollPos = window.scrollY;
        
        // 1. Header (Effetto Pillola)
        if (scrollPos > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            // Chiudi il menu se l'utente torna in cima (opzionale)
            header.classList.remove('menu-open');
            menuBtn.classList.remove('open');
        }

        // 2. Nascondi indicatore mouse
        if (scrollIndicator) {
            scrollIndicator.style.opacity = scrollPos > 100 ? '0' : '0.6';
        }

        // 3. ScrollSpy (Pallino Attivo)
        let currentSection = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollPos >= (sectionTop - 350)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection) && currentSection !== "") {
                link.classList.add('active');
            }
        });
    }

    // --- AVVIO ---
    window.addEventListener('scroll', handleScrollEffects);
    renderProjects('all', false);
    handleScrollEffects();
});