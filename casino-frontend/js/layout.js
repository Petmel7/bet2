
async function loadLayout() {

    const headerHTML = await fetch('./header.html').then(res => res.text());
    document.getElementById('header').innerHTML = headerHTML;

    const footerHTML = await fetch('./footer.html').then(res => res.text());
    document.getElementById('footer').innerHTML = footerHTML;

    const layouScripts = [
        './js/menu-toggle.js',
        './js/header-dropdown.js',
        './js/observer.js',
        './js/scroll-btn.js'
    ];

    layouScripts.forEach(src => {
        const script = document.createElement('script');
        script.src = src;
        document.body.appendChild(script);
    });
}

document.addEventListener('DOMContentLoaded', loadLayout);
