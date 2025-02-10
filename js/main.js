document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById("menu--button");
    const navDropdown = document.getElementById("nav--dropdown")
    menuButton.addEventListener('click', () => {
        navDropdown.classList.toggle('active');
    });
});