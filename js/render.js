/* ==========================================================================
   render.js — buildCard（含变体与收藏按钮）+ renderCards + renderSkeletons + renderStats + toggleFavorite
   卡片视觉融合 31604c 的 banner+body+footer 结构与当前瀑布流/收藏/尺寸变体
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
  // 若当前处于收藏筛选模式，实时刷新列表（取消收藏后移除卡片）
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
  card.className = featured
    ? `nav-card nav-card--featured nav-card--${size} post-card-reveal`
    : `nav-card nav-card--${size} post-card-reveal`;
  card.setAttribute("data-card-reveal", "");
  card.style.setProperty("--card-reveal-delay", `${Math.min(index, 12) * 50}ms`);

  // will-change 仅在 hover 时临时启用，避免常驻开销
  card.addEventListener("mouseenter", () => { card.style.willChange = "transform, box-shadow"; });
  card.addEventListener("mouseleave", () => { card.style.willChange = ""; });

  // 收藏按钮（固定显示）
  const favBtn = createFavButton(isFav);
  favBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item.url, favBtn);
  });
  card.appendChild(favBtn);

  if (featured) {
    /* Featured 卡：整卡渐变（截图中 MDN 样式） */
    card.style.background = gradient;

    const sheen = document.createElement("span");
    sheen.className = "nav-card__sheen";
    card.appendChild(sheen);

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

    const name = document.createElement("div");
    name.className = "nav-card__name";
    name.textContent = item.name;
    card.appendChild(name);

    const desc = document.createElement("p");
    desc.className = "nav-card__desc";
    desc.textContent = item.description;
    card.appendChild(desc);

    const tagRow = document.createElement("div");
    tagRow.className = "nav-card__tags";
    item.tags.forEach(tag => {
      const span = document.createElement("span");
      span.className = "nav-card__tag";
      span.textContent = TAG_LABELS[tag] || tag;
      tagRow.appendChild(span);
    });
    card.appendChild(tagRow);
  } else {
    /* 普通卡：31604c 的 banner+body+footer 结构 + 当前尺寸变体 */
    const banner = document.createElement("div");
    banner.className = "nav-card__banner";
    banner.style.background = gradient;

    const sheen = document.createElement("span");
    sheen.className = "nav-card__sheen";
    banner.appendChild(sheen);

    const icon = document.createElement("span");
    icon.className = "nav-card__icon";
    icon.textContent = item.icon || item.name.slice(0, 2);
    banner.appendChild(icon);
    card.appendChild(banner);

    const body = document.createElement("div");
    body.className = "nav-card__body";

    const name = document.createElement("div");
    name.className = "nav-card__name";
    name.textContent = item.name;
    body.appendChild(name);

    const desc = document.createElement("p");
    desc.className = "nav-card__desc";
    desc.textContent = item.description;
    body.appendChild(desc);

    const footer = document.createElement("div");
    footer.className = "nav-card__footer";

    const tagRow = document.createElement("div");
    tagRow.className = "nav-card__tags";
    item.tags.forEach(tag => {
      const span = document.createElement("span");
      span.className = "nav-card__tag";
      span.textContent = TAG_LABELS[tag] || tag;
      tagRow.appendChild(span);
    });
    footer.appendChild(tagRow);

    const arrow = document.createElement("span");
    arrow.className = "nav-card__arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
    footer.appendChild(arrow);

    body.appendChild(footer);
    card.appendChild(body);
  }

  return card;
}

function renderCards(items) {
  cardGrid.innerHTML = "";
  items.forEach((item, index) => cardGrid.appendChild(buildCard(item, index)));
  emptyHint.style.display = items.length ? "none" : "block";
}

/* ===== 骨架屏：banner + body 结构 ===== */
function renderSkeletons() {
  cardGrid.innerHTML = Array.from({ length: 6 }).map(() => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton-card__banner"></div>
      <div class="skeleton-card__body">
        <div class="skeleton-card__line skeleton-card__line--title"></div>
        <div class="skeleton-card__line"></div>
        <div class="skeleton-card__line skeleton-card__line--short"></div>
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
