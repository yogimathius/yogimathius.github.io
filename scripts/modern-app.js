// Modern Portfolio JavaScript Application

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initChartDefaults();
  initNavigation();
  initTypedText();
  initSmoothScroll();
  initParticles();
  initObservers();
  loadDynamicContent();
});

// Set Chart.js defaults for dark theme
function initChartDefaults() {
  if (typeof Chart !== "undefined") {
    Chart.defaults.color = "#8892b0";
    Chart.defaults.borderColor = "rgba(136, 146, 176, 0.1)";
    Chart.defaults.font.family =
      "Inter, -apple-system, BlinkMacSystemFont, sans-serif";
  }
}

// Navigation functionality
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelectorAll(".nav-link");

  // Scroll behavior
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Hide/show on scroll
    if (currentScroll > lastScroll && currentScroll > 500) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  // Close mobile menu on link click
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });

  // Active section highlighting
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 200;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document
          .querySelector('.nav-link[href="#' + sectionId + '"]')
          ?.classList.add("active");
      } else {
        document
          .querySelector('.nav-link[href="#' + sectionId + '"]')
          ?.classList.remove("active");
      }
    });
  });
}

// Typed.js initialization
function initTypedText() {
  new Typed("#typed", {
    strings: ["web.", "cloud.", "future.", "AI era."],
    typeSpeed: 80,
    backSpeed: 60,
    backDelay: 1000,
    loop: true,
    smartBackspace: true,
  });
}

// Smooth scrolling
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Particle background
function initParticles() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const particlesContainer = document.getElementById("particles");

  if (!particlesContainer) return;

  particlesContainer.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 50;

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
      if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 255, 218, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach((p2) => {
        const distance = Math.sqrt(
          Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
        );

        if (distance < 150) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(100, 255, 218, ${
            0.1 * (1 - distance / 150)
          })`;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Resize handler
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Intersection Observer for animations
function initObservers() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe all sections and cards
  document
    .querySelectorAll(".section, .skill-category, .project-card")
    .forEach((el) => {
      observer.observe(el);
    });
}

// Load dynamic content
async function loadDynamicContent() {
  try {
    // Load projects
    await loadProjects();

    // Load experience
    await loadExperience();

    // Load GitHub stats
    await loadGitHubStats();
  } catch (error) {
    console.error("Error loading dynamic content:", error);
  }
}

// Load projects from data
async function loadProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return;

  try {
    // Show loading state
    container.innerHTML = '<div class="loader"></div>';

    // Fetch repositories from GitHub
    const username = "yogimathius";
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }

    const repos = await response.json();

    // Define high-value repo names and their metadata
    const projectMetadata = {
      rust_redis_server: {
        icon: "fa-database",
        description:
          "Full Redis protocol implementation in Rust with support for all major commands and data structures.",
        tech: ["Rust", "TCP/IP", "Protocol Design", "Systems Programming"],
      },
      "symbolic-ontology-mcp": {
        icon: "fa-brain",
        description:
          "Model Context Protocol server for symbolic reasoning, enabling AI integration with knowledge graphs.",
        tech: ["Rust", "MCP", "AI Integration", "PostgreSQL"],
      },
      "praxis-forge": {
        icon: "fa-hammer",
        description:
          "Sophisticated task and habit management system built with Rust and Elixir, transforming intentions into mastery.",
        tech: ["Rust", "Elixir", "Phoenix", "WebAssembly"],
      },
      "core-war": {
        icon: "fa-microchip",
        description:
          "Implementation of the classic Core War programming game with virtual machine and assembler.",
        tech: ["C", "Assembly", "VM Design", "Compiler"],
      },
      event_streaming: {
        icon: "fa-stream",
        description:
          "High-performance event streaming system built in Rust for real-time data processing.",
        tech: ["Rust", "Async/Await", "Tokio", "Streaming"],
      },
      "llm-spiritual-insights-api": {
        icon: "fa-robot",
        description:
          "API for AI-powered spiritual guidance with multiple personality roles and conversation flows.",
        tech: ["Python", "Django", "OpenAI", "PostgreSQL"],
      },
    };

    // Get the featured repos with their GitHub data
    const featuredProjects = [];

    for (const [repoName, metadata] of Object.entries(projectMetadata)) {
      const repo = repos.find((r) => r.name === repoName);
      if (repo) {
        featuredProjects.push({
          title: repoName
            .split(/[-_]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          description:
            metadata.description ||
            repo.description ||
            "No description available",
          tech: metadata.tech,
          github: repo.html_url,
          demo: repo.homepage || null,
          icon: metadata.icon,
          stars: repo.stargazers_count,
          language: repo.language,
          updated: new Date(repo.updated_at).toLocaleDateString(),
        });
      }
    }

    // Render the projects
    container.innerHTML = featuredProjects
      .map(
        (project) => `
            <div class="project-card">
                <div class="project-header">
                    <div class="project-icon">
                        <i class="fas ${project.icon}"></i>
                    </div>
                    <div class="project-links">
                        ${
                          project.github
                            ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository"><i class="fab fa-github"></i></a>`
                            : ""
                        }
                        ${
                          project.demo
                            ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer" aria-label="Live Demo"><i class="fas fa-external-link-alt"></i></a>`
                            : ""
                        }
                    </div>
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map((t) => `<span>${t}</span>`).join("")}
                </div>
            </div>
        `
      )
      .join("");

    // Add observer for animation
    document.querySelectorAll(".project-card").forEach((card) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-in");
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(card);
    });
  } catch (error) {
    console.error("Error loading projects:", error);

    // Fallback to basic project list
    container.innerHTML = `
      <div class="error-message">
        <p>Unable to load projects dynamically. Here are my featured repositories:</p>
        <ul>
          <li><a href="https://github.com/yogimathius/rust_redis_server" target="_blank">Rust Redis Server</a></li>
          <li><a href="https://github.com/yogimathius/symbolic-ontology-mcp" target="_blank">Symbolic Ontology MCP</a></li>
          <li><a href="https://github.com/yogimathius/praxis-forge" target="_blank">Praxis Forge</a></li>
          <li><a href="https://github.com/yogimathius/core-war" target="_blank">Core War VM</a></li>
          <li><a href="https://github.com/yogimathius/event_streaming" target="_blank">Event Streaming Engine</a></li>
          <li><a href="https://github.com/yogimathius/llm-spiritual-insights-api" target="_blank">LLM Spiritual Insights API</a></li>
        </ul>
      </div>
    `;
  }
}

// Load experience data
async function loadExperience() {
  try {
    const response = await fetch("data/experience.json");
    const experiences = await response.json();

    const tabsContainer = document.getElementById("experience-tabs");
    const contentContainer = document.getElementById("experience-content");

    if (!tabsContainer || !contentContainer) return;

    // Create tabs and panels
    experiences.employment.forEach((job, index) => {
      // Create tab
      const tab = document.createElement("button");
      tab.className = `tab-button ${index === 0 ? "active" : ""}`;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-selected", index === 0);
      tab.setAttribute("aria-controls", `panel-${index}`);
      tab.textContent = job.company;
      tab.addEventListener("click", () => switchTab(index));
      tabsContainer.appendChild(tab);

      // Create panel
      const panel = document.createElement("div");
      panel.className = `experience-panel ${index === 0 ? "active" : ""}`;
      panel.id = `panel-${index}`;
      panel.setAttribute("role", "tabpanel");
      panel.innerHTML = `
                <h3 class="experience-title">
                    ${job.position}
                    <span class="experience-company">@ ${job.company}</span>
                </h3>
                <p class="experience-date">${job.duration || job.dates}</p>
                <ul class="experience-details">
                    ${job.responsibilities
                      .map((resp) => `<li>${resp}</li>`)
                      .join("")}
                </ul>
            `;
      contentContainer.appendChild(panel);
    });

    // Tab switching function
    window.switchTab = function (index) {
      // Update tabs
      document.querySelectorAll(".tab-button").forEach((tab, i) => {
        tab.classList.toggle("active", i === index);
        tab.setAttribute("aria-selected", i === index);
      });

      // Update panels
      document.querySelectorAll(".experience-panel").forEach((panel, i) => {
        panel.classList.toggle("active", i === index);
      });
    };
  } catch (error) {
    console.error("Error loading experience:", error);
  }
}

// Load GitHub stats
async function loadGitHubStats() {
  const container = document.getElementById("github-stats-container");
  if (!container) return;

  try {
    // Check for cached stats first
    const cachedStats = localStorage.getItem("github-stats");
    const cacheTime = localStorage.getItem("github-stats-time");
    const oneDay = 24 * 60 * 60 * 1000;

    if (cachedStats && cacheTime && Date.now() - parseInt(cacheTime) < oneDay) {
      const stats = JSON.parse(cachedStats);
      // Check if cached data has all required fields
      if (stats.techStack && stats.languageBytes && stats.reposByLanguage) {
        displayGitHubStats(stats);
        return;
      }
    }

    // Show loading state
    container.innerHTML = '<div class="loader"></div>';

    // Fetch fresh stats
    const username = "yogimathius";
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
      ),
    ]);

    const userData = await userResponse.json();
    const repos = await reposResponse.json();

    // Enhanced language analysis
    const languages = {};
    const reposByLanguage = {};
    const languageBytes = {};
    let totalStars = 0;
    let totalForks = 0;

    // Analyze repos
    for (const repo of repos) {
      if (repo.fork || repo.archived) continue;

      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;

      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;

        if (!reposByLanguage[repo.language]) {
          reposByLanguage[repo.language] = [];
        }
        reposByLanguage[repo.language].push(repo);

        // Estimate bytes (repo size gives rough idea)
        languageBytes[repo.language] =
          (languageBytes[repo.language] || 0) + (repo.size || 0);
      }
    }

    // Calculate framework/tech stack from repo names and descriptions
    const techStack = analyzeTechStack(repos);

    // Get contribution data
    const currentYear = new Date().getFullYear();
    const contributionData = await fetchContributionData(username, currentYear);

    const stats = {
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      totalStars,
      totalForks,
      languages,
      languageBytes,
      reposByLanguage,
      techStack,
      contributionData,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
    };

    // Cache the stats
    localStorage.setItem("github-stats", JSON.stringify(stats));
    localStorage.setItem("github-stats-time", Date.now().toString());

    displayGitHubStats(stats);
  } catch (error) {
    console.error("Error loading GitHub stats:", error);
    container.innerHTML = `
            <p style="color: var(--secondary-color); text-align: center;">
                Unable to load GitHub stats at the moment.
            </p>
        `;
  }
}

// Analyze tech stack from repo data
function analyzeTechStack(repos) {
  const techPatterns = {
    React: /react|jsx/i,
    Vue: /vue/i,
    "Node.js": /node|express|koa/i,
    TypeScript: /typescript|\.ts/i,
    GraphQL: /graphql|apollo/i,
    Docker: /docker|container/i,
    Rust: /rust|cargo/i,
    Python: /python|django|flask/i,
    Ruby: /ruby|rails/i,
    PostgreSQL: /postgres|postgresql/i,
    Redis: /redis/i,
    AWS: /aws|amazon/i,
  };

  const techCount = {};

  repos.forEach((repo) => {
    if (repo.fork || repo.archived) return;

    const searchText = `${repo.name} ${repo.description || ""}`;

    Object.entries(techPatterns).forEach(([tech, pattern]) => {
      if (pattern.test(searchText)) {
        techCount[tech] = (techCount[tech] || 0) + 1;
      }
    });
  });

  return techCount;
}

// Fetch contribution data (simplified - would need GraphQL for full data)
async function fetchContributionData(username, year) {
  // This is a simplified version - GitHub's contribution graph requires GraphQL
  // For now, we'll estimate based on recent activity
  try {
    const events = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`
    );
    const data = await events.json();

    const contributionsByDay = {};
    data.forEach((event) => {
      const date = new Date(event.created_at).toDateString();
      contributionsByDay[date] = (contributionsByDay[date] || 0) + 1;
    });

    return contributionsByDay;
  } catch (error) {
    return {};
  }
}

// Display GitHub stats
function displayGitHubStats(stats) {
  const container = document.getElementById("github-stats-container");

  // Create chart containers
  container.innerHTML = `
    <div class="stats-overview">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">${stats.publicRepos}</div>
          <div class="stat-label">Public Repos</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.followers}</div>
          <div class="stat-label">Followers</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.totalStars}</div>
          <div class="stat-label">Total Stars</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.totalForks}</div>
          <div class="stat-label">Total Forks</div>
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-container">
        <h4>Language Distribution</h4>
        <div class="chart-wrapper">
          <canvas id="languageDonutChart"></canvas>
        </div>
      </div>

      <div class="chart-container">
        <h4>Tech Stack Proficiency</h4>
        <div class="chart-wrapper">
          <canvas id="techRadarChart"></canvas>
        </div>
      </div>

      <div class="chart-container full-width">
        <h4>Repository Languages</h4>
        <div class="chart-wrapper">
          <canvas id="languageBubbleChart"></canvas>
        </div>
      </div>
    </div>

    <div class="activity-section">
      <h4>Recent Activity</h4>
      <div id="activityHeatmap" class="activity-heatmap"></div>
    </div>
  `;

  // Initialize all charts
  setTimeout(() => {
    createDonutChart(stats.languages);
    createRadarChart(stats.techStack, stats.languages);
    createBubbleChart(stats.reposByLanguage);
    createActivityHeatmap(stats.contributionData);
  }, 100);

  // Add refresh button functionality
  const refreshBtn = document.createElement("button");
  refreshBtn.className = "btn btn-outline btn-small";
  refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Stats';
  refreshBtn.style.marginTop = "20px";
  refreshBtn.onclick = () => {
    localStorage.removeItem("github-stats");
    localStorage.removeItem("github-stats-time");
    loadGitHubStats();
  };
  container.appendChild(refreshBtn);
}

// Create donut chart for language distribution
function createDonutChart(languages) {
  const canvas = document.getElementById("languageDonutChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const sortedLangs = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: sortedLangs.map(([lang]) => lang),
      datasets: [
        {
          data: sortedLangs.map(([, count]) => count),
          backgroundColor: [
            "#64ffda",
            "#8892b0",
            "#ccd6f6",
            "#e6f1ff",
            "#233554",
            "#112240",
            "#0a192f",
            "#495670",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: "#8892b0",
            font: {
              family: "var(--font-mono)",
              size: 12,
            },
            padding: 10,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${context.parsed} repos (${percentage}%)`;
            },
          },
        },
      },
    },
  });
}

// Create balanced radar chart
function createRadarChart(techStack, languages) {
  const canvas = document.getElementById("techRadarChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Ensure we have data
  techStack = techStack || {};
  languages = languages || {};

  // Combine and normalize data for balanced view
  const skills = {
    Rust: (languages["Rust"] || 0) + (techStack["Rust"] || 0) * 2,
    JavaScript: Math.min((languages["JavaScript"] || 0) / 2, 10),
    TypeScript: (languages["TypeScript"] || 0) + (techStack["TypeScript"] || 0),
    Python: (languages["Python"] || 0) + (techStack["Python"] || 0),
    React: techStack["React"] || 0,
    "Node.js": techStack["Node.js"] || 0,
    GraphQL: techStack["GraphQL"] || 0,
    Docker: techStack["Docker"] || 0,
  };

  // Normalize values to 0-10 scale
  const maxValue = Math.max(...Object.values(skills));
  Object.keys(skills).forEach((key) => {
    skills[key] = (skills[key] / maxValue) * 10;
  });

  new Chart(ctx, {
    type: "radar",
    data: {
      labels: Object.keys(skills),
      datasets: [
        {
          label: "Skill Level",
          data: Object.values(skills),
          backgroundColor: "rgba(100, 255, 218, 0.2)",
          borderColor: "#64ffda",
          borderWidth: 2,
          pointBackgroundColor: "#64ffda",
          pointBorderColor: "#64ffda",
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
          ticks: {
            stepSize: 2,
            color: "#8892b0",
            backdropColor: "transparent",
          },
          grid: {
            color: "rgba(136, 146, 176, 0.1)",
          },
          pointLabels: {
            color: "#8892b0",
            font: {
              family: "var(--font-mono)",
              size: 12,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

// Create bubble chart for repos by language
function createBubbleChart(reposByLanguage) {
  const canvas = document.getElementById("languageBubbleChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Ensure we have data
  if (!reposByLanguage || Object.keys(reposByLanguage).length === 0) {
    return;
  }

  // Prepare bubble data
  const bubbleData = [];
  const colors = ["#64ffda", "#8892b0", "#ccd6f6", "#e6f1ff", "#233554"];
  let colorIndex = 0;

  Object.entries(reposByLanguage).forEach(([language, repos], langIndex) => {
    repos.slice(0, 5).forEach((repo, repoIndex) => {
      bubbleData.push({
        x: langIndex * 10 + repoIndex * 2,
        y: repo.stargazers_count || 0,
        r: Math.sqrt(repo.size || 100) / 10,
        label: repo.name,
        language: language,
      });
    });
  });

  new Chart(ctx, {
    type: "bubble",
    data: {
      datasets: [
        {
          label: "Repositories",
          data: bubbleData,
          backgroundColor: bubbleData.map(
            () => colors[colorIndex++ % colors.length] + "80"
          ),
          borderColor: bubbleData.map(
            () => colors[colorIndex++ % colors.length]
          ),
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Languages",
            color: "#8892b0",
          },
          grid: {
            color: "rgba(136, 146, 176, 0.1)",
          },
          ticks: {
            color: "#8892b0",
          },
        },
        y: {
          title: {
            display: true,
            text: "Stars",
            color: "#8892b0",
          },
          grid: {
            color: "rgba(136, 146, 176, 0.1)",
          },
          ticks: {
            color: "#8892b0",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const point = context.raw;
              return [
                `Repo: ${point.label}`,
                `Language: ${point.language}`,
                `Stars: ${point.y}`,
                `Size: ${Math.round(point.r * point.r * 100)}KB`,
              ];
            },
          },
        },
      },
    },
  });
}

// Create activity heatmap
function createActivityHeatmap(contributionData) {
  const container = document.getElementById("activityHeatmap");
  if (!container) return;

  // Ensure we have data
  if (!contributionData || Object.keys(contributionData).length === 0) {
    container.innerHTML =
      '<p class="heatmap-label">No recent activity data available</p>';
    return;
  }

  // Simple heatmap visualization
  const days = Object.entries(contributionData).slice(0, 30);

  container.innerHTML = `
    <div class="heatmap-grid">
      ${days
        .map(([date, count]) => {
          const intensity = Math.min(count / 5, 1);
          const color = `rgba(100, 255, 218, ${intensity})`;
          return `
          <div class="heatmap-cell"
               style="background-color: ${color}"
               title="${date}: ${count} contributions">
          </div>
        `;
        })
        .join("")}
    </div>
    <p class="heatmap-label">Last 30 days of activity</p>
  `;
}
