function initAnimations() {
    // Funzione interna per iniettare lo span con la classe reveal
    function triggerReveal(id, text, delay) {
        const el = document.getElementById(id) || document.querySelector(id);
        if(!el) return;
        
        // Prepariamo l'HTML (invisibile all'inizio)
        el.innerHTML = `<span class="reveal-item">${text}</span>`;
        
        // Attiviamo l'animazione dopo il delay
        setTimeout(() => {
            const span = el.querySelector('.reveal-item');
            if(span) span.classList.add('visible');
        }, delay);
    }

    // --- SEQUENZA CINEMATOGRAFICA ---
    // Ritardo iniziale per caricamento pagina
    setTimeout(() => {
        // 1. Appare SPAZIO (Sopra)
        triggerReveal('hero-bold', "SPAZIO", 100);

        // 2. Dopo 600ms appare DODICI (Sotto)
        setTimeout(() => {
            triggerReveal('hero-thin', "DODICI", 100);

            // 3. Quando il logo è completo, si espande la linea
            setTimeout(() => {
                const line = document.querySelector('.hero-line');
                if(line) line.style.width = "80px"; 

                // 4. Infine appare il payoff (Collettivo...)
                setTimeout(() => {
                    const subtitle = document.querySelector('.hero-subtitle');
                    if(subtitle) subtitle.style.opacity = "1";
                    triggerReveal('.morph-word', "COLLETTIVO di PROGETTAZIONE", 100);
                }, 800);

            }, 800);
        }, 600); 
    }, 600);

    // Observer per le immagini (Bianco e Nero -> Colore)
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.2 });
    
    document.querySelectorAll('.vision-image, .member-photo, .map-wrapper, .team-member-row').forEach(img => imgObserver.observe(img));
}



function toggleBio(el) {
    // Trova il contenitore principale partendo dal bottone cliccato
    const parent = el.closest('.team-item');
    const overlay = parent.querySelector('.bio-overlay');
    overlay.classList.toggle('is-active');
}