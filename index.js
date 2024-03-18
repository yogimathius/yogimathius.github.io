window.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const currentLocation = window.location.pathname;
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation  || `/${link.getAttribute('href')}` === currentLocation) {
            link.classList.add('active');
        }
    });

    const aboutContentContainer = document.querySelector('#about-me');
    fetch('./index.json')
    .then(response => response.json())
    .then(aboutContent => {
        console.log(aboutContent);
        aboutContent.mainContent.forEach(content => {
            const contentDiv = document.createElement('article');
            contentDiv.classList.add('card');
            contentDiv.innerHTML = `<h2>${content.title}</h2><p>${content.body}</p>`;
            aboutContentContainer.appendChild(contentDiv);
        })
    })
    .catch(error => {
        console.error('Error:', error);
    })
});