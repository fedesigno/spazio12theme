// Stato globale dell'applicazione
window.projects = []; 
window.currentCategory = null;
window.DATOCMS_TOKEN = '4ea8a3d22b80f9d6695d17bd78eaf7';

// Creiamo l'oggetto, ma lo popoliamo dentro setupUI() per sicurezza
window.ui = {};

// Elementi DOM ricorrenti (Cache)
window.ui = {
    header: document.querySelector('.main-header'),
    menuBtn: document.querySelector('.mobile-menu-btn'),
    navLinks: document.querySelectorAll('.menu-links a'),
    logoLink: document.querySelector('.logo-area'),
    sections: document.querySelectorAll('section[id]'),
    scrollIndicator: document.querySelector('.scroll-indicator')
};

/**
 * MOTORE PROGETTI
 * Gestisce fetch, categorie e rendering
 */

async function fetchProjectsFromCMS() {
    const query = `{
      allProjects12s {
        title
        category
        location
        year
        tag
        desc
        start
        end
        images { url }
      }
    }`;

    try {
        const response = await fetch('https://graphql.datocms.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.DATOCMS_TOKEN}`,
            },
            body: JSON.stringify({ query }),
        });
        const json = await response.json();
        
        if (json.data && json.data.allProjects12s) {
            window.projects = json.data.allProjects12s.map(p => ({
                ...p,
                start: p.start || "", 
                images: p.images ? p.images.map(img => img.url) : []
            }));
            initCategories();
        }
    } catch (e) { console.error("Errore CMS:", e); }
}

function initCategories() {
    const cats = ['PA', 'PRIVATI'];
    cats.forEach(cat => {
        const filtered = window.projects.filter(p => p.category === cat);
        const label = document.querySelector(`.cat-elite-card[onclick*="${cat}"] .cat-count`);
        const slider = document.getElementById(`bg-slider-${cat.toLowerCase()}`);

        if(label) label.textContent = `/ ${filtered.length.toString().padStart(2, '0')}`;
        if(slider) {
            if(window[`timer_${cat}`]) clearInterval(window[`timer_${cat}`]);
            slider.innerHTML = ''; 
            const allPhotos = filtered.flatMap(p => p.images);
            allPhotos.forEach((src, i) => {
                const img = document.createElement('img');
                img.src = src;
                img.style.cssText = `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity 1.5s;opacity:${i===0?1:0};z-index:${i===0?1:0};`;
                if(i === 0) img.classList.add('active');
                slider.appendChild(img);
            });
            if(allPhotos.length > 1) {
                window[`timer_${cat}`] = setInterval(() => {
                    const imgs = slider.querySelectorAll('img');
                    let activeIdx = Array.from(imgs).findIndex(img => img.classList.contains('active'));
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
    });
}

window.openCategory = function(cat) {
    window.currentCategory = cat;
    document.getElementById('category-selection').style.display = 'none';
    document.getElementById('projects-display').style.display = 'block';
    const years = [...new Set(window.projects.filter(p => p.category === cat).map(p => p.year))].sort().reverse();
    let filterHtml = `<button class="filter-btn active" onclick="setYearFilter('all', this)">TUTTI</button>`;
    years.forEach(y => filterHtml += `<button class="filter-btn" onclick="setYearFilter('${y}', this)">${y}</button>`);
    document.getElementById('year-filters').innerHTML = filterHtml;
    renderProjects('all');
    window.scrollTo({ top: document.getElementById('progetti').offsetTop - 80, behavior: 'smooth' });
};

window.renderProjects = function(yearFilter = 'all', stretch = false) {
    const container = document.getElementById('project-list');
    if(!container) return;
    container.style.opacity = '0';
    setTimeout(() => {
        container.innerHTML = '';
        let filtered = window.projects.filter(p => p.category === window.currentCategory);
        if(yearFilter !== 'all') filtered = filtered.filter(p => p.year === yearFilter);
        const toDisplay = stretch ? filtered : filtered.slice(0, 4);
        toDisplay.forEach((p, pIndex) => {
            const card = document.createElement('div');
            card.className = 'project-card animate-in';
            card.innerHTML = `
                <div class="p-image" id="slider-${pIndex}">
                    ${p.images.map((img, i) => `<img src="${img}" class="${i===0?'active':''}" style="opacity:${i===0?1:0}">`).join('')}
                    ${p.images.length > 1 ? `<div class="slider-nav"><button class="nav-arrow" onclick="prevImg(${pIndex})">‹</button><button class="nav-arrow" onclick="nextImg(${pIndex})">›</button></div>` : ''}
                </div>
                <div class="p-content">
                    <div class="p-meta"><span class="p-year">${p.year}</span><span class="p-funding">${p.tag}</span></div>
                    <h3 class="p-title">${p.title}</h3>
                    <p class="p-location">📍 ${p.location}</p>
                    <p class="p-desc">${p.desc}</p>
                    <div class="p-spec-grid">
                        <div class="spec-item"><span>INIZIO</span><strong>${p.start}</strong></div>
                        <div class="spec-item"><span>FINE</span><strong>${p.end}</strong></div>
                    </div>
                </div>`;
            container.appendChild(card);
        });
        const moreContainer = document.getElementById('more-btn-container');
        if (moreContainer) moreContainer.innerHTML = (filtered.length > 4 && !stretch) ? `<button class="discover-more-btn" onclick="renderProjects('${yearFilter}', true)">MOSTRA DI PIÙ +</button>` : '';
        container.style.opacity = '1';
    }, 300);
};

window.nextImg = (pIdx) => moveSlider(pIdx, 1);
window.prevImg = (pIdx) => moveSlider(pIdx, -1);
function moveSlider(pIdx, dir) {
    const slider = document.getElementById(`slider-${pIdx}`);
    const imgs = slider.querySelectorAll('img');
    let idx = Array.from(imgs).findIndex(img => img.classList.contains('active'));
    imgs[idx].classList.remove('active'); imgs[idx].style.opacity = '0';
    let nextIdx = (idx + dir + imgs.length) % imgs.length;
    imgs[nextIdx].classList.add('active'); imgs[nextIdx].style.opacity = '1';
}

window.closeCategories = function() {
    const projectsDisplay = document.getElementById('projects-display');
    const categorySelection = document.getElementById('category-selection');
    projectsDisplay.classList.add('fade-out-down');
    setTimeout(() => {
        projectsDisplay.style.display = 'none';
        projectsDisplay.classList.remove('fade-out-down');
        categorySelection.style.display = 'grid';
        initCategories();
        window.scrollTo({ top: document.getElementById('progetti').offsetTop - 50, behavior: 'smooth' });
    }, 400);
};

window.setYearFilter = function(year, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(year);
};