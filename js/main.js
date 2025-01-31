document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById("menu-button");
    menuButton.addEventListener('click', () => {
        menuButton.classList.toggle('active');
    });
});