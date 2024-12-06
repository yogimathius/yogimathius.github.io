async function fetchGitHubStats() {
  console.log("Initializing GitHub stats fetch...");
  const statsSection = document.getElementById("github-stats");

  if (!statsSection) {
    console.error("Stats section not found");
    return;
  }

  try {
    console.log("Attempting to fetch stats...");
    const response = await fetch("/data/github-stats.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const stats = await response.json();
    const webKB = (stats.web.total / 1024).toFixed(1);
    const systemsKB = (stats.systems.total / 1024).toFixed(1);
    const backendKB = (stats.backend.total / 1024).toFixed(1);

    const statsHTML = `
      <div class="stats-container">
        <div class="stack-section">
          <h3>Web Development (${webKB} KB)</h3>
          <div class="stat-items">
            <div class="framework-group">
              <h4>Languages</h4>
              ${stats.web.languages
                .map(
                  (lang) => `
                  <div class="stat-item">
                    <span class="stat-label">${lang.name}</span>
                    <div class="progress-bar">
                      <div class="progress" style="width: ${
                        lang.percentage
                      }%"></div>
                    </div>
                    <span class="stat-value">${lang.percentage.toFixed(
                      1
                    )}%</span>
                  </div>
                `
                )
                .join("")}
            </div>

            <div class="framework-group">
              <h4>Frontend Frameworks</h4>
              ${stats.web.frameworks.frontend
                .map(
                  (fw) => `
                  <div class="stat-item">
                    <span class="stat-label">${fw.name}</span>
                    <div class="progress-bar">
                      <div class="progress" style="width: ${
                        fw.percentage
                      }%"></div>
                    </div>
                    <span class="stat-value">${fw.percentage.toFixed(1)}%</span>
                  </div>
                `
                )
                .join("")}
            </div>

            <div class="framework-group">
              <h4>Mobile Development</h4>
              ${stats.web.frameworks.mobile
                .map(
                  (fw) => `
                  <div class="stat-item">
                    <span class="stat-label">${fw.name}</span>
                    <div class="progress-bar">
                      <div class="progress" style="width: ${
                        fw.percentage
                      }%"></div>
                    </div>
                    <span class="stat-value">${fw.percentage.toFixed(1)}%</span>
                  </div>
                `
                )
                .join("")}
            </div>

            <div class="framework-group">
              <h4>Backend Frameworks</h4>
              ${stats.web.frameworks.backend
                .map(
                  (fw) => `
                  <div class="stat-item">
                    <span class="stat-label">${fw.name}</span>
                    <div class="progress-bar">
                      <div class="progress" style="width: ${
                        fw.percentage
                      }%"></div>
                    </div>
                    <span class="stat-value">${fw.percentage.toFixed(1)}%</span>
                  </div>
                `
                )
                .join("")}
            </div>
          </div>
        </div>

        <div class="stack-section">
          <h3>Systems & Backend (${(
            parseFloat(systemsKB) + parseFloat(backendKB)
          ).toFixed(1)} KB)</h3>
          <div class="stat-items">
            ${[...stats.systems.languages, ...stats.backend.languages]
              .map(
                (lang) => `
                <div class="stat-item">
                  <span class="stat-label">${lang.name}</span>
                  <div class="progress-bar">
                    <div class="progress" style="width: ${
                      lang.percentage
                    }%"></div>
                  </div>
                  <span class="stat-value">${lang.percentage.toFixed(1)}%</span>
                </div>
              `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;

    statsSection.innerHTML = `
      <h2>GitHub Analytics</h2>
      <p class="stats-description">Based on code analysis across all public repositories</p>
      ${statsHTML}
    `;
  } catch (error) {
    console.error("Error loading GitHub stats:", error);
    statsSection.innerHTML = `
      <h2>GitHub Analytics</h2>
      <p class="error-message">Unable to load GitHub statistics: ${error.message}</p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", fetchGitHubStats);
