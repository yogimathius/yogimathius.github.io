const PROJECTS = [
  {
    id: "symbolic-ontology-mcp",
    title: "Symbolic Ontology MCP",
    category: "ai",
    label: "AI & Agents",
    description:
      "MCP server for symbolic reasoning with ontology-backed context operations for agent workflows.",
    tags: ["Rust", "MCP", "PostgreSQL", "Ontology"],
    github: "https://github.com/yogimathius/symbolic-ontology-mcp",
    live: null,
    featured: true,
    repo: "symbolic-ontology-mcp",
  },
  {
    id: "core-war-rust",
    title: "Rust Core War",
    category: "systems",
    label: "Systems",
    description:
      "Core War battle engine with assembler, VM runtime, and terminal visualizer for real-time simulation.",
    tags: ["Rust", "TUI", "Compiler", "Game Engine"],
    github: "https://github.com/yogimathius/core-war",
    live: null,
    featured: true,
    repo: "core-war",
  },
  {
    id: "praxis-forge",
    title: "Praxis Forge",
    category: "fullstack",
    label: "Full Stack",
    description:
      "Goal and execution platform combining Rust services with Elixir/Phoenix workflows.",
    tags: ["Rust", "Elixir", "Phoenix", "Productivity"],
    github: "https://github.com/yogimathius/praxis-forge",
    live: null,
    featured: true,
    repo: "praxis-forge",
  },
  {
    id: "idea-collision-engine",
    title: "Idea Collision Engine",
    category: "ai",
    label: "AI & Agents",
    description:
      "Creative ideation backend that forces unusual cross-domain combinations to surface novel concepts.",
    tags: ["Go", "AI", "API"],
    github: "https://github.com/yogimathius/idea-collision-engine",
    live: null,
    featured: false,
    repo: "idea-collision-engine",
  },
  {
    id: "api-in-stress",
    title: "API in Stress",
    category: "backend",
    label: "Backend",
    description:
      "High-throughput API benchmark playground exploring load behavior and resilience patterns.",
    tags: ["Rust", "Axum", "Performance", "Observability"],
    github: "https://github.com/yogimathius/api-in-stress",
    live: null,
    featured: false,
    repo: "api-in-stress",
  },
  {
    id: "event-streaming",
    title: "Event Streaming Platform",
    category: "systems",
    label: "Systems",
    description:
      "Asynchronous streaming architecture for real-time ingestion and fan-out at sustained throughput.",
    tags: ["Rust", "Tokio", "Streaming", "Distributed Systems"],
    github: "https://github.com/yogimathius/event_streaming",
    live: null,
    featured: false,
    repo: "event_streaming",
  },
  {
    id: "llm-spiritual-insights-api",
    title: "LLM Prototyping Platform",
    category: "ai",
    label: "AI & Agents",
    description:
      "Prompt orchestration API for structured multi-role LLM conversations and iterative experiments.",
    tags: ["Python", "Django", "OpenAI", "PostgreSQL"],
    github: "https://github.com/yogimathius/llm-spiritual-insights-api",
    live: null,
    featured: false,
    repo: "llm-spiritual-insights-api",
  },
  {
    id: "yoga-progression",
    title: "Yoga Progression App",
    category: "fullstack",
    label: "Full Stack",
    description:
      "Progressive training app with personalized routines, historical tracking, and milestone feedback loops.",
    tags: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    github: "https://github.com/yogimathius/yoga-progression",
    live: null,
    featured: false,
    repo: "yoga-progression",
  },
  {
    id: "yoga-app-backend",
    title: "Yoga Tracker Backend",
    category: "backend",
    label: "Backend",
    description:
      "API surface for posture history, user progression metrics, and routine recommendation scoring.",
    tags: ["Node.js", "Express", "PostgreSQL", "Redis"],
    github: "https://github.com/yogimathius/yoga-app-backend",
    live: null,
    featured: false,
    repo: "yoga-app-backend",
  },
];

const FILTERS = [
  { id: "all", label: "All Work" },
  { id: "ai", label: "AI & Agents" },
  { id: "systems", label: "Systems" },
  { id: "fullstack", label: "Full Stack" },
  { id: "backend", label: "Backend" },
];

const state = {
  filter: "all",
  stars: {},
  starsLoaded: false,
};

document.addEventListener("DOMContentLoaded", () => {
  initHeaderBehavior();
  initMenuToggle();
  renderFeatured();
  renderFilters();
  renderProjects();
  renderExperience();
  initReveal();
  hydrateGitHubSignals();
  setFooterYear();
});

function initHeaderBehavior() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 16) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    updateActiveNav();
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
}

function initMenuToggle() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open", !expanded);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    });
  });
}

function updateActiveNav() {
  const sections = ["work", "about", "experience", "contact"];
  const fromTop = window.scrollY + 120;

  sections.forEach((id) => {
    const section = document.getElementById(id);
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!section || !link) return;

    const inSection =
      fromTop >= section.offsetTop && fromTop < section.offsetTop + section.offsetHeight;

    link.classList.toggle("active", inSection);
  });
}

function renderFeatured() {
  const container = document.getElementById("featured-grid");
  if (!container) return;

  const featured = PROJECTS.filter((project) => project.featured);

  container.innerHTML = featured
    .map((project) => {
      const stars = state.stars[project.repo];
      const starText =
        typeof stars === "number"
          ? `${stars} stars`
          : state.starsLoaded
            ? "stars n/a"
            : "syncing...";

      return `
        <article class="featured-card reveal" data-reveal="up">
          <div class="featured-top">
            <p class="featured-type">${project.label}</p>
            <p class="featured-stars">${starText}</p>
          </div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="tag-row">
            ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <div class="featured-links">
            <a class="featured-link" href="${project.github}" target="_blank" rel="noopener noreferrer">Source</a>
            ${
              project.live
                ? `<a class="featured-link" href="${project.live}" target="_blank" rel="noopener noreferrer">Live</a>`
                : ""
            }
          </div>
        </article>
      `;
    })
    .join("");
}

function renderFilters() {
  const container = document.getElementById("filter-group");
  if (!container) return;

  container.innerHTML = FILTERS.map((filter) => {
    const isActive = filter.id === state.filter;

    return `
      <button
        type="button"
        role="tab"
        class="filter-chip ${isActive ? "active" : ""}"
        data-filter="${filter.id}"
        aria-selected="${isActive}"
      >
        ${filter.label}
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextFilter = button.getAttribute("data-filter");
      if (!nextFilter || nextFilter === state.filter) return;

      state.filter = nextFilter;
      renderFilters();
      renderProjects();
      initReveal();
    });
  });
}

function renderProjects() {
  const container = document.getElementById("projects-grid");
  if (!container) return;

  const filtered =
    state.filter === "all"
      ? PROJECTS.filter((project) => !project.featured)
      : PROJECTS.filter(
          (project) => !project.featured && project.category === state.filter
        );

  if (filtered.length === 0) {
    container.innerHTML = `
      <article class="project-card reveal" data-reveal="up">
        <p class="project-category">No Results</p>
        <h3>No projects in this category yet.</h3>
        <p>Try another filter to browse the full portfolio.</p>
      </article>
    `;
    return;
  }

  container.innerHTML = filtered
    .map((project) => {
      return `
        <article class="project-card reveal" data-reveal="up">
          <p class="project-category">${project.label}</p>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="tag-row">
            ${project.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <div class="project-links">
            <a class="link-muted" href="${project.github}" target="_blank" rel="noopener noreferrer">Source</a>
            ${
              project.live
                ? `<a class="link-muted" href="${project.live}" target="_blank" rel="noopener noreferrer">Live</a>`
                : ""
            }
          </div>
        </article>
      `;
    })
    .join("");
}

async function renderExperience() {
  const container = document.getElementById("experience-list");
  if (!container) return;

  try {
    const response = await fetch("data/experience.json");
    if (!response.ok) {
      throw new Error("Failed to load experience data");
    }

    const data = await response.json();
    const items = Array.isArray(data.employment) ? data.employment : [];

    container.innerHTML = items
      .map(
        (item) => `
          <article class="experience-card reveal" data-reveal="up">
            <div class="experience-head">
              <h3>${item.company}</h3>
              <p>${item.duration}</p>
            </div>
            <p class="experience-role">${item.position}</p>
            <ul class="experience-points">
              ${item.responsibilities
                .map((responsibility) => `<li>${responsibility}</li>`)
                .join("")}
            </ul>
          </article>
        `
      )
      .join("");

    initReveal();
  } catch (error) {
    container.innerHTML = `
      <article class="experience-card reveal show" data-reveal="up">
        <h3>Experience unavailable</h3>
        <p class="experience-role">Unable to load timeline right now.</p>
      </article>
    `;
    console.error(error);
  }
}

function initReveal() {
  const items = document.querySelectorAll(".reveal:not(.show)");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const delay = Number(entry.target.getAttribute("data-delay") || 0);

        setTimeout(() => {
          entry.target.classList.add("show");
        }, delay);

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  items.forEach((item) => observer.observe(item));
}

async function hydrateGitHubSignals() {
  await Promise.all([updateProfileStats(), updateFeaturedStars()]);
}

async function updateProfileStats() {
  try {
    const response = await fetch("https://api.github.com/users/yogimathius");
    if (!response.ok) return;

    const profile = await response.json();

    const repoMetric = document.getElementById("metric-repos");
    const followerMetric = document.getElementById("metric-followers");

    if (repoMetric && typeof profile.public_repos === "number") {
      repoMetric.textContent = `${profile.public_repos}+`;
    }

    if (followerMetric && typeof profile.followers === "number") {
      followerMetric.textContent = `${profile.followers}`;
    }
  } catch (error) {
    console.warn("GitHub profile stats unavailable", error);
  }
}

async function updateFeaturedStars() {
  const featuredRepos = PROJECTS.filter((project) => project.featured)
    .map((project) => project.repo)
    .filter(Boolean);

  await Promise.all(
    featuredRepos.map(async (repoName) => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/yogimathius/${repoName}`
        );

        if (!response.ok) return;

        const repo = await response.json();
        if (typeof repo.stargazers_count === "number") {
          state.stars[repoName] = repo.stargazers_count;
        }
      } catch (error) {
        console.warn(`Unable to fetch stars for ${repoName}`, error);
      }
    })
  );

  state.starsLoaded = true;
  renderFeatured();
  initReveal();
}

function setFooterYear() {
  const yearNode = document.getElementById("footer-year");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
}
