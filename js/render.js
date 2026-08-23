/* ==========================================================================
   render.js — buildCard + renderCards + renderSkeletons + renderStats + toggleFavorite
   所有卡片统一为整卡渐变（featured 风格），保留尺寸变体与收藏功能
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
  if (typeof window.updateFavoritesCount === "function") {
    window.updateFavoritesCount();
  }
  if (typeof window.getCurrentFilter === "function" && window.getCurrentFilter() === "favorites") {
    window.setActiveFilter("favorites");
  }
}

/* ===== 通用：收藏按钮 ===== */
function createFavButton(isFav) {
  const favBtn = document.createElement("button");
  favBtn.type = "button";
  favBtn.className = "nav-card__fav" + (isFav ? " is-favorite" : "");
  favBtn.setAttribute("aria-label", isFav ? "取消收藏" : "收藏");
  favBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
  return favBtn;
}

/* ===== 单卡构建：div 卡片 + 整卡拉伸链接 + 独立收藏按钮（合法 HTML 嵌套） ===== */
function buildCard(item, index) {
  const size = inferSize(item);
  const isFav = getFavorites().includes(item.url);

  const card = document.createElement("div");
  card.className = `nav-card nav-card--${size} post-card-reveal`;
  card.setAttribute("data-card-reveal", "");
  card.style.setProperty("--card-reveal-delay", `${Math.min(index, 12) * 50}ms`);
  // will-change 仅在 hover 时临时启用
  card.addEventListener("mouseenter", () => { card.style.willChange = "transform, box-shadow"; });
  card.addEventListener("mouseleave", () => { card.style.willChange = ""; });

  // 拉伸链接：绝对定位覆盖整卡，键盘/读屏用户可单独聚焦
  const link = document.createElement("a");
  link.className = "nav-card__link";
  link.href = item.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `访问 ${item.name}（新标签页打开）`);
  card.appendChild(link);

  // 收藏按钮：与链接平级，不再嵌套在 <a> 内
  const favBtn = createFavButton(isFav);
  favBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item.url, favBtn);
  });
  card.appendChild(favBtn);

  // 光泽扫过
  const sheen = document.createElement("span");
  sheen.className = "nav-card__sheen";
  card.appendChild(sheen);

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
  arrow.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
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

/* ===== 骨架屏：整卡渐变风格 ===== */
function renderSkeletons() {
  cardGrid.innerHTML = Array.from({ length: 6 }).map(() => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-card__head">
        <div class="skeleton-card__icon"></div>
        <div class="skeleton-card__arrow"></div>
      </div>
      <div class="skeleton-card__line skeleton-card__line--title"></div>
      <div class="skeleton-card__line"></div>
      <div class="skeleton-card__line skeleton-card__line--short"></div>
      <div class="skeleton-card__tags">
        <div class="skeleton-card__tag"></div>
        <div class="skeleton-card__tag"></div>
      </div>
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
