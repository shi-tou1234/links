/* ==========================================================================
   render.js — buildCard（含变体与收藏按钮）+ renderCards + renderSkeletons + renderStats + toggleFavorite
   ========================================================================== */
const cardGrid = document.getElementById("cardGrid");
const coverStats = document.getElementById("coverStats");
const emptyHint = document.getElementById("emptyHint");

/* ===== 收藏切换 ===== */
function toggleFavorite(url, btn) {
  const list = getFavorites();
  const idx = list.indexOf(url);
  if (idx >= 0) {
    list.splice(idx, 1);
    btn.classList.remove("is-favorite");
    btn.setAttribute("aria-label", "收藏");
  } else {
    list.push(url);
    btn.classList.add("is-favorite");
    btn.setAttribute("aria-label", "取消收藏");
  }
  setFavorites(list);
  // 刷新 favorites chip 徽章
  if (typeof window.updateFavoritesCount === "function") {
    window.updateFavoritesCount();
  }
  // 修复：若当前处于收藏筛选模式，实时刷新列表（取消收藏后移除卡片，添加后保留）
  if (typeof window.getCurrentFilter === "function" && window.getCurrentFilter() === "favorites") {
    window.setActiveFilter("favorites");
  }
}

/* ===== 单卡构建（含尺寸变体与收藏按钮） ===== */
function buildCard(item, index) {
  const featured = isFeatured(index);
  const size = inferSize(item);
  const gradient = item.color || hashColor(item.url);
  const favorites = getFavorites();
  const isFav = favorites.includes(item.url);

  const card = document.createElement("a");
  card.href = item.url;
  card.target = "_blank";
  card.rel = "noopener noreferrer";

  // 类名：所有卡片统一为彩色渐变，featured 优先级最高保留特殊样式
  if (featured) {
    card.className = "nav-card nav-card--gradient nav-card--featured post-card-reveal";
  } else {
    card.className = `nav-card nav-card--gradient nav-card--${size} post-card-reveal`;
  }
  card.setAttribute("data-card-reveal", "");
  card.style.setProperty("--card-reveal-delay", `${Math.min(index, 12) * 50}ms`);
  card.style.background = gradient;

  // will-change 仅在 hover 时临时启用，避免常驻开销
  card.addEventListener("mouseenter", () => {
    card.style.willChange = "transform, box-shadow";
  });
  card.addEventListener("mouseleave", () => {
    card.style.willChange = "";
  });

  // 光泽扫过（仅主卡）
  if (featured) {
    const sheen = document.createElement("span");
    sheen.className = "nav-card__sheen";
    card.appendChild(sheen);
  }

  // 收藏按钮（星标）
  const favBtn = document.createElement("button");
  favBtn.type = "button";
  favBtn.className = "nav-card__fav" + (isFav ? " is-favorite" : "");
  favBtn.setAttribute("aria-label", isFav ? "取消收藏" : "收藏");
  favBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
  favBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item.url, favBtn);
  });
  card.appendChild(favBtn);

  // 头部：图标 + 箭头
  const head = document.createElement("div");
  head.className = "nav-card__head";

  const icon = document.createElement("span");
  icon.className = "nav-card__icon";
  icon.textContent = item.icon || item.name.slice(0, 2);
  head.appendChild(icon);

  const arrow = document.createElement("span");
  arrow.className = "nav-card__arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';
  head.appendChild(arrow);
  card.appendChild(head);

  // 名称
  const name = document.createElement("div");
  name.className = "nav-card__name";
  name.textContent = item.name;
  card.appendChild(name);

  // 描述
  const desc = document.createElement("p");
  desc.className = "nav-card__desc";
  desc.textContent = item.description;
  card.appendChild(desc);

  // 标签
  const tagRow = document.createElement("div");
  tagRow.className = "nav-card__tags";
  item.tags.forEach(tag => {
    const span = document.createElement("span");
    span.className = "nav-card__tag";
    span.textContent = TAG_LABELS[tag] || tag;
    tagRow.appendChild(span);
  });
  card.appendChild(tagRow);

  return card;
}

function renderCards(items) {
  cardGrid.innerHTML = "";
  items.forEach((item, index) => cardGrid.appendChild(buildCard(item, index)));
  emptyHint.style.display = items.length ? "none" : "block";
}

/* ===== 骨架屏：高低错落 ===== */
function renderSkeletons() {
  const heights = [
    ["52%", "100%", "68%"],
    ["45%", "100%", "100%", "58%"],
    ["60%", "100%", "72%"],
    ["48%", "100%", "100%", "64%"],
    ["55%", "100%", "70%"],
    ["42%", "100%", "100%", "60%"],
  ];
  cardGrid.innerHTML = heights.map(lines => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-card__dot"></div>
      <div class="skeleton-card__line skeleton-card__line--title" style="width:${lines[0]};"></div>
      ${lines.slice(1).map(w => `<div class="skeleton-card__line" style="width:${w};"></div>`).join("")}
    </div>
  `).join("");
}

/* ===== Hero 统计（categoryCount 不含 favorites chip） ===== */
function renderStats() {
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const categoryCount = filterButtons.filter(
    b => b.dataset.filter !== "all" && b.dataset.filter !== "favorites"
  ).length;
  coverStats.innerHTML = `
    <span class="cover-stat"><strong>${uniqueLinks.length}</strong> 个精选站点</span>
    <span class="cover-stat"><strong>${categoryCount}</strong> 个分类</span>
  `;
}

/* 暴露到全局 */
window.buildCard = buildCard;
window.renderCards = renderCards;
window.renderSkeletons = renderSkeletons;
window.renderStats = renderStats;
window.toggleFavorite = toggleFavorite;
