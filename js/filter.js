/* ==========================================================================
   filter.js — applyFilter + initFilterCounts + setActiveFilter + 搜索 + 收藏筛选
   ========================================================================== */
const siteSearch = document.getElementById("siteSearch");
const searchBox = document.getElementById("searchBox");
const searchClear = document.getElementById("searchClear");
const resetFilter = document.getElementById("resetFilter");

let currentFilter = "all";
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));

function applyFilter(filter, keyword = "") {
  const kw = keyword.trim().toLowerCase();
  let filtered;

  if (filter === "favorites") {
    const favSet = new Set(getFavorites());
    filtered = uniqueLinks.filter(item => favSet.has(item.url));
  } else {
    filtered = uniqueLinks.filter(item => {
      const matchesFilter = filter === "all" || item.tags.includes(filter);
      const matchesKeyword = !kw || item.name.toLowerCase().includes(kw) || item.description.toLowerCase().includes(kw) || item.tags.some(tag => tag.includes(kw));
      return matchesFilter && matchesKeyword;
    });
  }

  // favorites 模式下同样应用关键词过滤
  if (filter === "favorites" && kw) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(kw) ||
      item.description.toLowerCase().includes(kw) ||
      item.tags.some(tag => tag.includes(kw))
    );
  }

  renderCards(filtered);
  if (typeof window.initPostCardReveal === "function") {
    window.initPostCardReveal();
  }
}

/* 每个分类的站点计数徽章；favorites chip 显示已收藏 url 数 */
function initFilterCounts() {
  filterButtons.forEach(button => {
    const key = button.dataset.filter;
    let count;
    if (key === "all") {
      count = uniqueLinks.length;
    } else if (key === "favorites") {
      count = getFavorites().length;
    } else {
      count = uniqueLinks.filter(item => item.tags.includes(key)).length;
    }
    // 移除旧徽章（如有），避免重复
    const oldBadge = button.querySelector(".filter-chip__count");
    if (oldBadge) oldBadge.remove();
    const badge = document.createElement("span");
    badge.className = "filter-chip__count";
    badge.textContent = count;
    button.appendChild(badge);
  });
}

/* 刷新 favorites chip 徽章（供 render.js toggleFavorite 调用） */
function updateFavoritesCount() {
  const favBtn = filterButtons.find(b => b.dataset.filter === "favorites");
  if (!favBtn) return;
  const badge = favBtn.querySelector(".filter-chip__count");
  if (badge) {
    badge.textContent = getFavorites().length;
  }
}

function setActiveFilter(key) {
  filterButtons.forEach(b => {
    const active = b.dataset.filter === key;
    b.classList.toggle("active", active);
    b.setAttribute("aria-pressed", String(active));
  });
  currentFilter = key;
  applyFilter(currentFilter, siteSearch.value);
}

/* ===== 事件绑定 ===== */
filterButtons.forEach(button => {
  button.addEventListener("click", () => setActiveFilter(button.dataset.filter));
});

/* 搜索防抖：停止输入 120ms 后再全量重渲染，避免每个按键都重建卡片 */
let searchDebounceTimer = null;
siteSearch.addEventListener("input", () => {
  searchBox.classList.toggle("has-value", siteSearch.value.length > 0);
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    applyFilter(currentFilter, siteSearch.value);
  }, 120);
});

searchClear.addEventListener("click", () => {
  clearTimeout(searchDebounceTimer);
  siteSearch.value = "";
  searchBox.classList.remove("has-value");
  applyFilter(currentFilter, "");
  siteSearch.focus();
});

resetFilter.addEventListener("click", () => {
  clearTimeout(searchDebounceTimer);
  siteSearch.value = "";
  searchBox.classList.remove("has-value");
  setActiveFilter("all");
});

/* 暴露到全局 */
window.applyFilter = applyFilter;
window.initFilterCounts = initFilterCounts;
window.setActiveFilter = setActiveFilter;
window.updateFavoritesCount = updateFavoritesCount;
window.getCurrentFilter = () => currentFilter;
window.filterButtons = filterButtons;
