window.addEventListener('DOMContentLoaded', () => {
    const aboutContentContainer = document.querySelector('#about-me');
    fetch('./data/about.json')
        .then(response => response.json())
        .then(aboutContent => {
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