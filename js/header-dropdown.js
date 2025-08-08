
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.querySelector(".js-dropdown-toggle");
    const dropdown = toggleBtn.closest(".header__dropdown");

    toggleBtn.addEventListener("click", () => {
        dropdown.classList.toggle("open");
        toggleBtn.classList.toggle("active");
    });

    // Закрити при кліку поза елементом
    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("open");
            toggleBtn.classList.remove("active");
        }
    });
});

