
const toggle = document.querySelector('.js-sidebar-toggle');
const menu = document.querySelector('.sidebar__links-list');

function setMenuState() {
    const isDesktop = window.innerWidth > 1024;

    if (isDesktop) {
        toggle.classList.add('is-open');
        menu.style.height = 'auto';
    } else {
        toggle.classList.remove('is-open');
        menu.style.height = '0px';
    }
}

// Run once on load
window.addEventListener('DOMContentLoaded', setMenuState);
// Re-run on resize
window.addEventListener('resize', setMenuState);

// Toggle interaction
toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('is-open');

    if (isOpen) {
        menu.style.height = menu.scrollHeight + 'px';
    } else {
        menu.style.height = menu.scrollHeight + 'px';
        requestAnimationFrame(() => {
            menu.style.height = '0px';
        });
    }
});

menu.addEventListener('transitionend', () => {
    if (toggle.classList.contains('is-open')) {
        menu.style.height = 'auto';
    }
});
