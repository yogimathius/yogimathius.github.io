window.addEventListener("DOMContentLoaded", () => {
  const aboutContentContainer = document.querySelector("#about-me");
  fetch("./data/about.json")
    .then((response) => response.json())
    .then((aboutContent) => {
      aboutContentContainer.innerHTML = ""; // Clear the loader
      aboutContentContainer.classList.remove("loading");
      aboutContent.mainContent.forEach((content) => {
        const contentDiv = document.createElement("article");
        contentDiv.classList.add("content-section");

        // Create title element with proper classes
        const title = document.createElement("h2");
        title.textContent = content.title;
        title.classList.add("section-title");

        // Create paragraph with proper classes
        const paragraph = document.createElement("p");
        paragraph.textContent = content.body;
        paragraph.classList.add("section-text");

        // Append elements to the content div
        contentDiv.appendChild(title);
        contentDiv.appendChild(paragraph);

        aboutContentContainer.appendChild(contentDiv);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      aboutContentContainer.innerHTML = `
                <div class="error-message">
                    <h2>Oops! Something went wrong.</h2>
                    <p>Unable to load content. Please try again later.</p>
                </div>
            `;
    });
});
