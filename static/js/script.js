// ===== APPLICATION STATE =====
const AppState = {
  currentTheme: "light",
  analyzing: false,
  history: [],
};

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  loadHistory();
  setupEventListeners();
  updateWordCount();

  // Check if we need to save a new prediction
  if (window.predictionData && window.predictionData.text) {
    saveToHistory(
      window.predictionData.text,
      window.predictionData.result,
      window.predictionData.confidence,
    );
  }
});

function initializeApp() {
  // Load saved theme
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  // Animate stats
  animateStats();

  // Keep the nav usable on small screens
  setupMobileNav();
}

// ===== THEME MANAGEMENT =====
function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  AppState.currentTheme = theme;

  // Update theme toggle buttons
  const themeIcons = document.querySelectorAll(
    ".theme-toggle-nav i, .theme-toggle i",
  );
  themeIcons.forEach((icon) => {
    icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
  });

  // Update toggle text
  const themeTexts = document.querySelectorAll(".theme-text");
  themeTexts.forEach((text) => {
    text.textContent = theme === "light" ? "Dark Mode" : "Light Mode";
  });

  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const newTheme = AppState.currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
}

// ===== WORD COUNT =====
function updateWordCount() {
  const textarea = document.getElementById("news");
  const wordCount = document.getElementById("wordCount");

  if (textarea && wordCount) {
    const text = textarea.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    wordCount.innerHTML = `${words} words | ${chars} characters`;
  }
}

// ===== SAMPLE NEWS =====
function fillSample(type) {
  const textarea = document.getElementById("news");
  if (!textarea) return;

  const samples = {
    real: `WASHINGTON (Reuters) - The number of Americans filing new applications for unemployment benefits unexpectedly fell last week, pointing to sustained labor market strength that could help to underpin the economy. Initial claims for state unemployment benefits dropped 2,000 to a seasonally adjusted 216,000 for the week ended Feb. 23, the Labor Department said on Thursday. Data for the prior week was unrevised. Claims fell to 210,000 during the week ended Feb. 16, which was the lowest level since early December. Economists polled by Reuters had forecast claims rising to 221,000 in the latest week. The Labor Department said claims for Maine and Colorado were estimated last week. It also said claims data for the Virgin Islands was estimated.`,

    fake: `BREAKING: President Announces Free College for All Americans! In a stunning announcement today, the President declared that starting next year, all public colleges and universities will be completely free for every American citizen. "We have the money, it's time to invest in our youth," he said. The plan is already approved by Congress and will be funded by a new tax on billionaires. This is the biggest education reform in history! Share this news before they delete it!`,
  };

  textarea.value = samples[type];
  updateWordCount();

  // Animate the textarea
  textarea.style.borderColor = type === "real" ? "#4cc9f0" : "#f72585";
  textarea.style.transform = "scale(1.02)";

  setTimeout(() => {
    textarea.style.borderColor = "";
    textarea.style.transform = "scale(1)";
  }, 300);

  showToast(`${type === "real" ? "Real" : "Fake"} news sample loaded!`, "info");
}

// ===== FORM SUBMISSION =====
function submitForm() {
  const form = document.getElementById("newsForm");
  const textarea = document.getElementById("news");
  const predictBtn = document.getElementById("predictBtn");
  const spinner = document.getElementById("spinner");
  const btnText = document.getElementById("btnText");

  if (!textarea.value.trim()) {
    showToast("Please enter some news text to analyze!", "error");
    return false;
  }

  // Show loading state
  spinner.style.display = "inline-block";
  btnText.innerHTML = "Analyzing...";
  predictBtn.disabled = true;

  // Add analyzing class to button
  predictBtn.classList.add("analyzing");

  return true;
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = "info") {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  // Create toast
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    info: "fa-info-circle",
  };

  toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <div class="toast-content">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

  toastContainer.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 5000);
}

// ===== HISTORY MANAGEMENT =====
function saveToHistory(text, result, confidence) {
  try {
    let history = JSON.parse(localStorage.getItem("newsHistory")) || [];

    // Create snippet (first 60 chars)
    const snippet = text.length > 60 ? text.substring(0, 60) + "..." : text;

    // Create history entry
    const entry = {
      id: Date.now(),
      snippet: snippet,
      result: result,
      confidence: confidence,
      timestamp: new Date().toLocaleString(),
      icon:
        result === "Likely Real News"
          ? "fa-check-circle"
          : "fa-exclamation-triangle",
    };

    // Add to beginning
    history.unshift(entry);

    // Keep only last 10
    if (history.length > 10) {
      history = history.slice(0, 10);
    }

    localStorage.setItem("newsHistory", JSON.stringify(history));
    loadHistory();

    showToast("Result saved to history!", "success");
  } catch (e) {
    console.error("Error saving to history:", e);
  }
}

function loadHistory() {
  const historyGrid = document.getElementById("historyGrid");
  if (!historyGrid) return;

  try {
    const history = JSON.parse(localStorage.getItem("newsHistory")) || [];

    if (history.length === 0) {
      historyGrid.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-history"></i>
                    <h3>No Recent Checks</h3>
                    <p>Start analyzing news articles to see your history here!</p>
                </div>
            `;
      return;
    }

    let html = "";
    history.forEach((item) => {
      const resultClass = item.result === "Likely Real News" ? "real" : "fake";
      const badgeClass = item.result === "Likely Real News" ? "real" : "fake";

      html += `
                <div class="history-card ${resultClass}" onclick="loadHistoryItem('${escapeHtml(item.snippet)}')">
                    <div class="history-card-header">
                        <span class="history-badge ${badgeClass}">
                            <i class="fas ${item.icon}"></i> ${item.result}
                        </span>
                        <button class="history-delete" onclick="deleteHistoryItem(${item.id}); event.stopPropagation();">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div class="history-snippet">${escapeHtml(item.snippet)}</div>
                    <div class="history-meta">
                        <span><i class="fas fa-clock"></i> ${escapeHtml(item.timestamp)}</span>
                        <span><i class="fas fa-chart-line"></i> ${item.confidence.toFixed(1)}%</span>
                    </div>
                </div>
            `;
    });

    historyGrid.innerHTML = html;
  } catch (e) {
    console.error("Error loading history:", e);
    historyGrid.innerHTML =
      '<div class="empty-history">Error loading history</div>';
  }
}

function loadHistoryItem(snippet) {
  const textarea = document.getElementById("news");
  if (textarea) {
    // Remove the "..." from snippet if present
    const fullText = snippet.replace("...", "");
    textarea.value = fullText;
    updateWordCount();
    showToast("History item loaded!", "info");
  }
}

function deleteHistoryItem(id) {
  try {
    let history = JSON.parse(localStorage.getItem("newsHistory")) || [];
    history = history.filter((item) => item.id !== id);
    localStorage.setItem("newsHistory", JSON.stringify(history));
    loadHistory();
    showToast("Item removed from history", "info");

    // Stop event propagation
    event.stopPropagation();
  } catch (e) {
    console.error("Error deleting history item:", e);
  }
}

function clearHistory() {
  if (confirm("Are you sure you want to clear all history?")) {
    localStorage.removeItem("newsHistory");
    loadHistory();
    showToast("History cleared!", "success");
  }
}

// ===== SHARE FUNCTIONS =====
function shareOnTwitter(result, confidence) {
  const text = `I just analyzed a news article with AI Fake News Detector! Result: ${result} with ${confidence.toFixed(1)}% confidence. Check it out! 🛡️`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
  window.open(url, "_blank", "width=600,height=400");
  showToast("Opening Twitter...", "info");
}

function shareOnFacebook(result, confidence) {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(`I just analyzed a news article: ${result} (${confidence.toFixed(1)}% confidence)`)}`;
  window.open(url, "_blank", "width=600,height=400");
  showToast("Opening Facebook...", "info");
}

function shareOnLinkedIn(result, confidence) {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
  window.open(url, "_blank", "width=600,height=400");
  showToast("Opening LinkedIn...", "info");
}

// ===== STATS ANIMATION =====
function animateStats() {
  const stats = [
    { element: document.getElementById("articlesAnalyzed"), target: 15420 },
    { element: document.getElementById("accuracyRate"), target: 98.5 },
    { element: document.getElementById("dailyUsers"), target: 1250 },
  ];

  stats.forEach((stat) => {
    if (stat.element) {
      let current = 0;
      const increment = stat.target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          stat.element.textContent =
            stat.target.toLocaleString() + (stat.target === 98.5 ? "%" : "");
          clearInterval(timer);
        } else {
          stat.element.textContent =
            Math.floor(current).toLocaleString() +
            (stat.target === 98.5 ? "%" : "");
        }
      }, 20);
    }
  });
}

// ===== HELPER FUNCTIONS =====
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function setupEventListeners() {
  // Word count on textarea input
  const textarea = document.getElementById("news");
  if (textarea) {
    textarea.addEventListener("input", updateWordCount);
  }

  // Form submission
  const form = document.getElementById("newsForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      if (!submitForm()) {
        e.preventDefault();
      }
    });
  }

  // Theme toggle buttons
  document
    .querySelectorAll(".theme-toggle-nav, .theme-toggle")
    .forEach((btn) => {
      btn.addEventListener("click", toggleTheme);
    });
}

function setupMobileNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.getElementById("navLinks");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.classList.remove("is-open");
    });
  });
}

// Make functions globally available
window.fillSample = fillSample;
window.shareOnTwitter = shareOnTwitter;
window.shareOnFacebook = shareOnFacebook;
window.shareOnLinkedIn = shareOnLinkedIn;
window.clearHistory = clearHistory;
window.deleteHistoryItem = deleteHistoryItem;
window.loadHistoryItem = loadHistoryItem;
window.toggleTheme = toggleTheme;
