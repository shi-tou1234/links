/* ==========================================================================
   main.js — DOMContentLoaded 编排
   <script defer> 已按文档顺序执行并保证 DOM 就绪，这里再加 DOMContentLoaded 保险
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initParticles();
  renderStats();
  initFilterCounts();
  renderSkeletons();
  // 骨架短暂展示后替换为真实卡片，营造加载节奏
  setTimeout(() => {
    renderCards(uniqueLinks);
    initPostCardReveal();
  }, 220);
  setTimeout(typeWriter, 400);
  // Hero 卡片入场
  const heroReveal = document.querySelector(".hero-card.reveal");
  if (heroReveal) setTimeout(() => heroReveal.classList.add("in"), 100);
});
