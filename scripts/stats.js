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

    // Define all frameworks with their percentages
    const webFrameworks = {
      frontend: [
        { name: "React/Next.js", percentage: "30" },
        { name: "Remix", percentage: "25" },
        { name: "Angular", percentage: "15" },
        { name: "Vue", percentage: "10" },
        { name: "Svelte", percentage: "5" },
      ],
      mobile: [
        { name: "React Native", percentage: "20" },
        { name: "Ionic", percentage: "5" },
        { name: "Expo", percentage: "5" },
      ],
      backend: [
        { name: "NestJS", percentage: "25" },
        { name: "Express", percentage: "20" },
        { name: "Fastify", percentage: "10" },
        { name: "Koa", percentage: "5" },
      ],
      tools: [
        { name: "TypeScript", percentage: "40" },
        { name: "GraphQL", percentage: "25" },
        { name: "Redux", percentage: "20" },
        { name: "TailwindCSS", percentage: "15" },
      ],
    };

    const statsHTML = `
            <div class="stats-container">
                <div class="stack-section">
                    <h3>Web Development ${stats.web.total} lines</h3>
                    <div class="stat-items">
                        <div class="framework-group">
                            <h4>Frontend Frameworks</h4>
                            ${webFrameworks.frontend
                              .map(
                                (f) => `
                                <div class="stat-item">
                                    <span class="stat-label">${f.name}</span>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: ${f.percentage}%"></div>
                                    </div>
                                    <span class="stat-value">${f.percentage}%</span>
                                </div>
                            `
                              )
                              .join("")}
                        </div>

                        <div class="framework-group">
                            <h4>Mobile Development</h4>
                            ${webFrameworks.mobile
                              .map(
                                (f) => `
                                <div class="stat-item">
                                    <span class="stat-label">${f.name}</span>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: ${f.percentage}%"></div>
                                    </div>
                                    <span class="stat-value">${f.percentage}%</span>
                                </div>
                            `
                              )
                              .join("")}
                        </div>

                        <div class="framework-group">
                            <h4>Backend Frameworks</h4>
                            ${webFrameworks.backend
                              .map(
                                (f) => `
                                <div class="stat-item">
                                    <span class="stat-label">${f.name}</span>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: ${f.percentage}%"></div>
                                    </div>
                                    <span class="stat-value">${f.percentage}%</span>
                                </div>
                            `
                              )
                              .join("")}
                        </div>

                        <div class="framework-group">
                            <h4>Tools & Libraries</h4>
                            ${webFrameworks.tools
                              .map(
                                (f) => `
                                <div class="stat-item">
                                    <span class="stat-label">${f.name}</span>
                                    <div class="progress-bar">
                                        <div class="progress" style="width: ${f.percentage}%"></div>
                                    </div>
                                    <span class="stat-value">${f.percentage}%</span>
                                </div>
                            `
                              )
                              .join("")}
                        </div>
                    </div>
                </div>

                <div class="stack-section">
                    <h3>Systems & Backend ${
                      parseInt(stats.systems.total) +
                      parseInt(stats.backend.total)
                    } lines</h3>
                    <div class="stat-items">
                        ${[
                          ...stats.systems.languages,
                          ...stats.backend.languages,
                        ]
                          .map(
                            (lang) => `
                            <div class="stat-item">
                                <span class="stat-label">${lang.name}</span>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${lang.percentage}%"></div>
                                </div>
                                <span class="stat-value">${lang.percentage}%</span>
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
