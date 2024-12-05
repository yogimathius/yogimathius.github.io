window.addEventListener("DOMContentLoaded", () => {
  const employmentContentContainer = document.querySelector(
    "#employment-section"
  );
  fetch("./data/experience.json")
    .then((response) => response.json())
    .then((employmentData) => {
      employmentContentContainer.innerHTML = ""; // Clear the loader
      employmentContentContainer.classList.remove("loading");

      const sectionTitle = document.createElement("h2");
      sectionTitle.textContent = "Employment";
      sectionTitle.classList.add("section-title");
      employmentContentContainer.appendChild(sectionTitle);

      employmentData.employment.forEach((job) => {
        const article = document.createElement("article");
        article.classList.add("content-card");

        const h3 = document.createElement("h3");
        h3.classList.add("card-title");
        h3.textContent = job.company;

        const pPosition = document.createElement("p");
        pPosition.classList.add("card-subtitle");
        pPosition.innerHTML = `<strong>${job.position}</strong> · ${job.duration}`;

        const ulResponsibilities = document.createElement("ul");
        ulResponsibilities.classList.add("detail-list");

        job.responsibilities.forEach((responsibility) => {
          const li = document.createElement("li");
          li.classList.add("detail-item");
          li.textContent = responsibility;
          ulResponsibilities.appendChild(li);
        });

        article.appendChild(h3);
        article.appendChild(pPosition);
        article.appendChild(ulResponsibilities);

        employmentContentContainer.appendChild(article);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      employmentContentContainer.innerHTML = `
                <div class="error-message">
                    <h2>Oops! Something went wrong.</h2>
                    <p>Unable to load employment content. Please try again later.</p>
                </div>
            `;
    });
});
