async function fetchGitHubStats() {
  console.log("Initializing GitHub stats fetch...");
  const statsSection = document.getElementById("github-stats");

  if (!statsSection) {
    console.error("Stats section not found");
    return;
  }

  try {
    console.log("Attempting to fetch stats...");
    const [frameworkStats, languageStats] = await Promise.all([
      fetch("/data/framework-stats.json").then((r) => r.json()),
      fetch("/data/language-stats.json").then((r) => r.json()),
    ]);

    const webKB = (frameworkStats.total / 1024).toFixed(1);
    const systemsKB = (languageStats.systems.total / 1024).toFixed(1);
    const backendKB = (languageStats.backend.total / 1024).toFixed(1);

    const systemsLanguages = languageStats.systems.languages.map((lang) => ({
      ...lang,
      size: (
        (languageStats.systems.total * lang.percentage) /
        100 /
        1024
      ).toFixed(1),
    }));

    const backendLanguages = languageStats.backend.languages.map((lang) => ({
      ...lang,
      size: (
        (languageStats.backend.total * lang.percentage) /
        100 /
        1024
      ).toFixed(1),
    }));

    const statsHTML = `
      <div class="stats-container">
        <div class="stack-section">
          <h3>Web Development (${webKB} KB)</h3>
          <div class="stat-items">
            <div class="framework-group">
              <h4>Frontend Frameworks</h4>
              ${frameworkStats.frameworks.frontend
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
              ${frameworkStats.frameworks.mobile
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
              ${frameworkStats.frameworks.backend
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
            <div class="framework-group">
              <h4>Systems Languages (${systemsKB} KB)</h4>
              ${systemsLanguages
                .map(
                  (lang) => `
                  <div class="stat-item">
                    <span class="stat-label">${lang.name}</span>
                    <div class="progress-bar">
                      <div class="progress" style="width: ${
                        lang.percentage
                      }%"></div>
                    </div>
                    <span class="stat-value">${
                      lang.size
                    } KB (${lang.percentage.toFixed(1)}%)</span>
                  </div>
                `
                )
                .join("")}
            </div>

            <div class="framework-group">
              <h4>Backend Languages (${backendKB} KB)</h4>
              ${backendLanguages
                .map(
                  (lang) => `
                  <div class="stat-item">
                    <span class="stat-label">${lang.name}</span>
                    <div class="progress-bar">
                      <div class="progress" style="width: ${
                        lang.percentage
                      }%"></div>
                    </div>
                    <span class="stat-value">${
                      lang.size
                    } KB (${lang.percentage.toFixed(1)}%)</span>
                  </div>
                `
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    statsSection.innerHTML = `
      <h2>GitHub Analytics</h2>
      <p class="stats-description">Based on code analysis across all owned repositories</p>
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
