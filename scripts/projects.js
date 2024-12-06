window.addEventListener("DOMContentLoaded", () => {
  const projectsContentContainer = document.querySelector("#projects-section");

  fetch("./data/projects.json")
    .then((response) => response.json())
    .then((projectsData) => {
      projectsContentContainer.innerHTML = ""; // Clear the loader

      // Create and add section title
      const sectionTitle = document.createElement("h2");
      sectionTitle.textContent = "Projects";
      sectionTitle.classList.add("section-title");
      projectsContentContainer.appendChild(sectionTitle);

      // Iterate over each project
      projectsData.projects.forEach((project) => {
        const projectArticle = document.createElement("article");
        projectArticle.classList.add("content-card");

        const projectTitle = document.createElement("h3");
        projectTitle.classList.add("card-title");
        projectTitle.textContent = project.title;

        const projectDuration = document.createElement("p");
        projectDuration.classList.add("card-subtitle");
        projectDuration.innerHTML = `<strong>${project.duration}</strong>`;

        const projectDetailsList = document.createElement("ul");
        projectDetailsList.classList.add("detail-list");

        project.details.forEach((detail) => {
          const detailListItem = document.createElement("li");
          detailListItem.classList.add("detail-item");
          detailListItem.textContent = detail;
          projectDetailsList.appendChild(detailListItem);
        });

        projectArticle.appendChild(projectTitle);
        projectArticle.appendChild(projectDuration);
        projectArticle.appendChild(projectDetailsList);

        projectsContentContainer.appendChild(projectArticle);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      projectsContentContainer.innerHTML = `
                <div class="error-message">
                    <h2>Oops! Something went wrong.</h2>
                    <p>Unable to load project content. Please try again later.</p>
                </div>
            `;
    });
});
