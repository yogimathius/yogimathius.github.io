window.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const currentLocation = window.location.pathname;
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation  || `/${link.getAttribute('href')}` === currentLocation) {
            link.classList.add('active');
        }
    });
});