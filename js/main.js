import { fetchProjects } from './projects-engine.js';
import { initAnimations } from './animations.js';
import { setupUI } from './ui-core.js';

document.addEventListener('DOMContentLoaded', () => {
    fetchProjects(); // Parte DatoCMS
    setupUI();       // Parte il menu
    initAnimations();// Partono le scritte
});