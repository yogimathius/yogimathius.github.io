async function fetchGitHubStats() {
  const aboutSection = document.getElementById("about-me");

  try {
    const response = await fetch("/data/github-stats.json");
    const stats = await response.json();

    const statsHTML = `
            <h2>Technology Stack</h2>
            <div class="stats-container">
                <div class="stack-section">
                    <h3>Web Development (${stats.web.total} lines)</h3>
                    
                    <div class="framework-groups">
                        <div class="framework-group">
                            <h4>Frontend Frameworks</h4>
                            ${stats.web.frameworks.frontend
                              .map(
                                (f) => `
                                <div class="stat-item">
                                    <span>${f.name}</span>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: ${f.percentage}%"></div>
                                    </div>
                                    <span>${f.percentage}%</span>
                                </div>
                            `
                              )
                              .join("")}
                        </div>

                        <div class="framework-group">
                            <h4>Mobile</h4>
                            ${stats.web.frameworks.mobile
                              .map(
                                (f) => `
                                <div class="stat-item">
                                    <span>${f.name}</span>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: ${f.percentage}%"></div>
                                    </div>
                                    <span>${f.percentage}%</span>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                </div>

                <div class="stack-section">
                    <h3>Systems Programming (${stats.systems.total} lines)</h3>
                    <div class="framework-group">
                        ${stats.systems.languages
                          .map(
                            (lang) => `
                            <div class="stat-item">
                                <span>${lang.name}</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${lang.percentage}%"></div>
                                </div>
                                <span>${lang.percentage}%</span>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>

                <div class="stack-section">
                    <h3>Backend Development (${stats.backend.total} lines)</h3>
                    <div class="framework-group">
                        ${stats.backend.languages
                          .map(
                            (lang) => `
                            <div class="stat-item">
                                <span>${lang.name}</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${lang.percentage}%"></div>
                                </div>
                                <span>${lang.percentage}%</span>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                </div>
            </div>
        `;

    aboutSection.innerHTML = statsHTML;
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    aboutSection.innerHTML = "<p>Error loading GitHub statistics.</p>";
  }
}
