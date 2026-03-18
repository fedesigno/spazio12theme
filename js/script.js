document.addEventListener('DOMContentLoaded', () => {
    const projects = [
        {
            title: "TEATRO BAUDI DI SELVE",
            location: "Vigone (TO)",
            year: "2022",
            desc: "Efficientamento energetico e restauro conservativo della pavimentazione lignea di metà '800 tramite PNRR.",
            tag: "PNRR",
            img: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=800"
        },
        {
            title: "SCUOLA ELEMENTARE",
            location: "Macello (TO)",
            year: "2023",
            desc: "Impianto fotovoltaico con accumulo e relamping LED completo per la pubblica amministrazione.",
            tag: "C.S.E. 2022",
            img: "https://images.unsplash.com/photo-1523050853051-be991f85a6ad?q=80&w=800"
        },
        {
            title: "BIBLIOTECA COMUNALE",
            location: "S. Pietro Val Lemina",
            year: "2022",
            desc: "Riqualificazione termica della centrale ed installazione serramenti a taglio termico.",
            tag: "CONTO TERMICO 2.0",
            img: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800"
        }
    ];

    const projectContainer = document.getElementById('project-list');

    function renderProjects(filter = 'all') {
        if(!projectContainer) return;
        projectContainer.innerHTML = '';
        
        projects.forEach(p => {
            if (filter === 'all' || p.year === filter) {
                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <div class="p-image"><img src="${p.img}" alt="${p.title}"></div>
                    <span class="team-role">${p.year} | ${p.tag}</span>
                    <h3 style="margin: 10px 0; font-size: 1.4rem; letter-spacing:1px;">${p.title}</h3>
                    <p style="color:#666; font-size:0.85rem; margin-bottom:15px;">${p.desc}</p>
                    <div style="font-weight:700; font-size:0.7rem; color: var(--accent);">📍 ${p.location}</div>
                `;
                projectContainer.appendChild(card);
            }
        });
    }

    renderProjects();

    // Filtri
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter);
        });
    });

    // Scroll Effects
    const header = document.querySelector('.main-header');
    const mouse = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        // Header
        if (window.scrollY > 80) header.classList.add('scrolled');
        else header.classList.remove('scrolled');

        // Mouse opacity
        if (window.scrollY > 100) {
            mouse.style.opacity = '0';
            mouse.style.visibility = 'hidden';
        } else {
            mouse.style.opacity = '0.6';
            mouse.style.visibility = 'visible';
        }
    });
});


window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.menu-links a');
    const header = document.querySelector('.main-header');

    function updateNav() {
        const scrollPos = window.scrollY;
        const windowHeight = window.innerHeight;
        const bodyHeight = document.body.offsetHeight;
        let currentSection = "";

        // 1. Gestione Header (Pillola)
        if (scrollPos > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 2. Logica Home: se sei in alto, pulisci tutto
        if (scrollPos < 300) {
            navLinks.forEach(link => link.classList.remove('active'));
            return;
        }

        // 3. LOGICA SPECIALE PER IL FONDO PAGINA (CONTATTI)
        // Se la distanza dal fondo è minima (es. 100px), siamo nei contatti
        if ((windowHeight + scrollPos) >= (bodyHeight - 150)) {
            navLinks.forEach(link => link.classList.remove('active'));
            // Se vuoi che si accenda il pallino su contatti (anche se è un bottone), 
            // decommenta la riga sotto:
            // document.querySelector('a[href="#contatti"]').classList.add('active');
            return; 
        }

        // 4. Individua la sezione attiva (classico)
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

    window.addEventListener('scroll', updateNav);
    updateNav(); // Esegui al caricamento
});

