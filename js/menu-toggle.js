{
    const toggleButton = document.querySelector('.js-header-toggle');
    const menu = document.querySelector('.js-header-menu');
    const menuList = menu.querySelector('.header__menu-list');

    toggleButton.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');

        if (isOpen) {
            menuList.style.height = menuList.scrollHeight + 'px';
            toggleButton.classList.add('is-open');
        } else {
            menuList.style.height = '0px';
            toggleButton.classList.remove('is-open');
        }
    });
}