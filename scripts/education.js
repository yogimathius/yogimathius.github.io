window.addEventListener("DOMContentLoaded", () => {
  const educationContentContainer =
    document.querySelector("#education-section");
  fetch("./data/education.json")
    .then((response) => response.json())
    .then((educationContent) => {
      educationContentContainer.innerHTML = ""; // Clear the loader
      educationContentContainer.classList.remove("loading");

      const sectionTitle = document.createElement("h2");
      sectionTitle.textContent = "Education";
      sectionTitle.classList.add("section-title");
      educationContentContainer.appendChild(sectionTitle);

      educationContent.education.forEach((content) => {
        const article = document.createElement("article");
        article.classList.add("content-card");

        const h3 = document.createElement("h3");
        h3.classList.add("card-title");
        h3.textContent = content.school;

        const pDegree = document.createElement("p");
        pDegree.classList.add("card-subtitle");
        pDegree.innerHTML = `<strong>${content.degree}</strong> ${content.year}`;

        const ulDetails = document.createElement("ul");
        ulDetails.classList.add("detail-list");

        content.details.forEach((detail) => {
          const li = document.createElement("li");
          li.classList.add("detail-item");
          li.textContent = detail;
          ulDetails.appendChild(li);
        });

        article.appendChild(h3);
        article.appendChild(pDegree);
        article.appendChild(ulDetails);

        educationContentContainer.appendChild(article);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      educationContentContainer.innerHTML = `
                <div class="error-message">
                    <h2>Oops! Something went wrong.</h2>
                    <p>Unable to load education content. Please try again later.</p>
                </div>
            `;
    });
});
