window.addEventListener('DOMContentLoaded', () => {
    const educationContentContainer = document.querySelector('#education-section');
    fetch('./data/education.json')
        .then(response => response.json())
        .then(educationContent => {
            educationContent.education.forEach(content => {
                const article = document.createElement('article');
                const h3 = document.createElement('h3');
                const pDegree = document.createElement('p');
                const pYear = document.createElement('p');
                const ulDetails = document.createElement('ul');
                
                h3.textContent = content.school;
                pDegree.innerHTML = `<strong>${content.degree}</strong> ${content.year}`;
                
                content.details.forEach(detail => {
                    const li = document.createElement('li');
                    li.textContent = detail;
                    ulDetails.appendChild(li);
                });
                
                article.appendChild(h3);
                article.appendChild(pDegree);
                article.appendChild(ulDetails);
                
                educationContentContainer.appendChild(article);
            })
        })
        .catch(error => {
            console.error('Error:', error);
        })
});
