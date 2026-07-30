/* ==========================================================================
   theme.js — applyTheme + toggle（带过渡）
   ========================================================================== */
const themeToggle = document.getElementById("themeToggle");

function applyTheme() {
  const saved = localStorage.getItem("ee-guide-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved ? saved : prefersDark ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
}

/* 切换前临时启用全局 transition（html.theme-transitioning），300ms 后移除
   避免初始化时 data-theme 触发整页颜色过渡闪烁 */
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.classList.add("theme-transitioning");
  localStorage.setItem("ee-guide-theme", next);
  document.documentElement.setAttribute("data-theme", next);
  setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning");
  }, 300);
}

themeToggle.addEventListener("click", toggleTheme);

/* 暴露到全局 */
window.applyTheme = applyTheme;
window.toggleTheme = toggleTheme;
