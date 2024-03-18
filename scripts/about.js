window.addEventListener('DOMContentLoaded', () => {
    const aboutContentContainer = document.querySelector('#about-me');
    fetch('./data/about.json')
        .then(response => response.json())
        .then(aboutContent => {
            aboutContentContainer.innerHTML = ''; // Clear the loader
            aboutContentContainer.classList.remove('loading');
            aboutContentContainer.innerHTML = `<h2>About Me<h2>`;
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