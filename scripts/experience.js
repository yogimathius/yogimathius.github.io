window.addEventListener('DOMContentLoaded', () => {
    const employmentContentContainer = document.querySelector('#employment-section');
    fetch('./data/experience.json')
        .then(response => response.json())
        .then(employmentData => {
            employmentContentContainer.innerHTML = ''; // Clear the loader
            employmentContentContainer.classList.remove('loading');
            employmentContentContainer.innerHTML = `<h2>Employment<h2>`;

            employmentData.employment.forEach(job => {
                const article = document.createElement('article');
                const h3 = document.createElement('h3');
                const pPosition = document.createElement('p');
                const pDuration = document.createElement('p');
                const ulResponsibilities = document.createElement('ul');
                
                h3.textContent = job.company;
                pPosition.innerHTML = `<strong>${job.position}</strong> · ${job.duration}`;
                
                job.responsibilities.forEach(responsibility => {
                    const li = document.createElement('li');
                    li.textContent = responsibility;
                    ulResponsibilities.appendChild(li);
                });
                
                article.appendChild(h3);
                article.appendChild(pPosition);
                article.appendChild(ulResponsibilities);
                
                employmentContentContainer.appendChild(article);
            })
        })
        .catch(error => {
            console.error('Error:', error);
        })
});
