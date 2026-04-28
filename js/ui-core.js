/**
 * INTERFACCIA UTENTE
 * Menu, Scroll ed Eventi Navigazione
 */

function setupUI() {

    // Funzione per chiudere il menu mobile
    const closeMenu = () => {
        window.ui.header.classList.remove('menu-open');
        window.ui.menuBtn.classList.remove('open');
        document.body.style.overflow = ''; 
    };

    const handleScroll = () => {
        const scrollPos = window.scrollY;
        window.ui.header?.classList.toggle('scrolled', scrollPos > 80);
        if (window.ui.scrollIndicator) window.ui.scrollIndicator.style.opacity = scrollPos > 100 ? '0' : '0.6';

        let currentSect = "";
        window.ui.sections.forEach(s => { 
            if (scrollPos >= (s.offsetTop - 350)) currentSect = s.getAttribute('id'); 
        });
        window.ui.navLinks.forEach(link => { 
            link.classList.toggle('active', link.getAttribute('href').includes(currentSect) && currentSect !== ""); 
        });
    };

    // LOGO: Torna su tutto (Hero)
    window.ui.logoLink?.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMenu(); // Se era aperto il menu mobile, lo chiude
    });

    // MENU MOBILE TOGGLE
    window.ui.menuBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        window.ui.header.classList.toggle('menu-open');
        window.ui.menuBtn.classList.toggle('open');
        document.body.style.overflow = window.ui.header.classList.contains('menu-open') ? 'hidden' : '';
    });
    
    // SMOOTH SCROLL PER I LINK
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === "#") return; // Evita errori su link vuoti
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                closeMenu();
            }
        });
    });

    window.addEventListener('scroll', handleScroll);
    handleScroll();
}