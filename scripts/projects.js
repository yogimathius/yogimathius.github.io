window.addEventListener('DOMContentLoaded', () => {
    const projectsContentContainer = document.querySelector('#projects-section');

    fetch('./data/projects.json')
        .then(response => response.json())
        .then(projectsData => {
            // Hide loading spinner
            projectsContentContainer.innerHTML = ''; // Clear the loader
            projectsContentContainer.classList.remove('loading');
            projectsContentContainer.innerHTML = `<h2>Projects<h2>`;

            // Iterate over each project and create HTML elements
            projectsData.projects.forEach(project => {
                const projectArticle = document.createElement('article');
                const projectTitle = document.createElement('h3');
                const projectDuration = document.createElement('p');
                const projectDetailsList = document.createElement('ul');

                projectTitle.textContent = project.title;
                projectDuration.innerHTML = `<strong>${project.duration}</strong>`;
                project.details.forEach(detail => {
                    const detailListItem = document.createElement('li');
                    detailListItem.textContent = detail;
                    projectDetailsList.appendChild(detailListItem);
                });

                projectArticle.appendChild(projectTitle);
                projectArticle.appendChild(projectDuration);
                projectArticle.appendChild(projectDetailsList);

                projectsContentContainer.appendChild(projectArticle);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Hide loading spinner and show error message
            loadingSpinner.style.display = 'none';
            projectsContentContainer.innerHTML = '<p>Error loading projects. Please try again later.</p>';
        });
});
