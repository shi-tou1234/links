/* ==========================================================================
   effects.js — 粒子（性能优化版）+ typeWriter + initPostCardReveal（去 blur）
              + backToTop（rAF 节流）+ visibilitychange 暂停
   ========================================================================== */
const backToTop = document.getElementById("backToTop");

/* ===== 粒子背景（稀疏淡雅，性能优化版） ===== */
let particlesRAF = null;
let particlesRunning = false;

function initParticles() {
  const canvas = document.getElementById("pageParticles");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }
  const ctx = canvas.getContext("2d");
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  // 粒子数从 26 降至 18
  const particles = Array.from({ length: 18 }).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.22,
    speedY: (Math.random() - 0.5) * 0.22,
    opacity: Math.random() * 0.16 + 0.06,
  }));

  const draw = () => {
    if (!particlesRunning) {
      particlesRAF = null;
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = "196, 199, 255";
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = canvas.height + 20;
      if (p.y > canvas.height + 20) p.y = -20;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    particlesRAF = requestAnimationFrame(draw);
  };

  particlesRunning = true;
  draw();

  // 标签页隐藏时暂停 RAF，可见时恢复
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      particlesRunning = false;
      if (particlesRAF) {
        cancelAnimationFrame(particlesRAF);
        particlesRAF = null;
      }
    } else if (!particlesRunning) {
      particlesRunning = true;
      if (!particlesRAF) {
        particlesRAF = requestAnimationFrame(draw);
      }
    }
  });
}

/* ===== 打字机 ===== */
const typewriterTexts = [
  "当前共整理多个常用站点，按分类整理，可直接跳转使用",
  "适合查芯片、EDA、课程、竞赛、求职和日常学习资料",
  "建议配合课设、实验、竞赛和求职阶段分批收藏",
];
const typewriterTarget = document.getElementById("typewriterTarget");
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
  const current = typewriterTexts[phraseIndex % typewriterTexts.length];
  if (!isDeleting) {
    typewriterTarget.textContent = current.slice(0, charIndex + 1);
    charIndex += 1;
    if (charIndex === current.length) {
      setTimeout(() => { isDeleting = true; typeWriter(); }, 1400);
      return;
    }
  } else {
    typewriterTarget.textContent = current.slice(0, charIndex - 1);
    charIndex -= 1;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex += 1;
    }
  }
  setTimeout(typeWriter, isDeleting ? 30 : 65);
}

/* ===== Scroll-triggered card reveal（去 blur，仅 opacity + transform） ===== */
function initPostCardReveal() {
  const cards = Array.from(document.querySelectorAll("[data-card-reveal]"));
  if (cards.length === 0) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    cards.forEach(card => {
      card.classList.remove("post-card-reveal");
      card.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { root: null, rootMargin: "0px 0px -4% 0px", threshold: 0.01 },
  );

  cards.forEach(card => observer.observe(card));

  // 兜底：content-visibility: auto 可能导致 IntersectionObserver 不触发，
  // 800ms 后对仍未可见的卡片强制 add is-visible
  setTimeout(() => {
    cards.forEach(card => {
      if (!card.classList.contains("is-visible")) {
        card.classList.add("is-visible");
      }
    });
  }, 800);
}

/* ===== 回到顶部（rAF 节流） ===== */
let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    backToTop.classList.toggle("is-visible", window.scrollY > 380);
    scrollTicking = false;
  });
}, { passive: true });

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ===== 鼠标光晕跟随 ===== */
const cursorGlow = document.getElementById("cursorGlow");
if (cursorGlow) {
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;
  let targetX = glowX;
  let targetY = glowY;

  document.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    cursorGlow.style.opacity = "1";
  });
  document.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
  });

  function animateGlow() {
    glowX += (targetX - glowX) * 0.1;
    glowY += (targetY - glowY) * 0.1;
    cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  if ("ontouchstart" in window) cursorGlow.style.display = "none";
}

/* ===== 滚动进度条 + 导航栏状态 ===== */
const scrollProgress = document.getElementById("scrollProgress");
const topBar = document.getElementById("topBar");
function onScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollProgress) {
    scrollProgress.style.width = Math.min(100, (scrollTop / Math.max(1, docHeight)) * 100) + "%";
  }
  if (topBar) {
    topBar.classList.toggle("scrolled", scrollTop > 40);
  }
}
window.addEventListener("scroll", onScrollProgress, { passive: true });
onScrollProgress();

/* 暴露到全局 */
window.initParticles = initParticles;
window.typeWriter = typeWriter;
window.initPostCardReveal = initPostCardReveal;
