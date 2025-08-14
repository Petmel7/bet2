(function () {
    const toggleBtn = document.querySelector(".js-dropdown-toggle");
    if (!toggleBtn) return; // захист

    const dropdown = toggleBtn.closest(".header__dropdown");

    toggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        dropdown.classList.toggle("open");
        toggleBtn.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("open");
            toggleBtn.classList.remove("active");
        }
    });
})();


