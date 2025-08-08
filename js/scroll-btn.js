
const scrollBtn = document.querySelector('.js-scroll-up');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        scrollBtn.classList.add('up--visible');
    } else {
        scrollBtn.classList.remove('up--visible');
    }
});

scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});