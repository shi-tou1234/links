/* ==========================================================================
   data.js — links 数组 + TAG_LABELS + inferSize + 去重 + 配色
   全部挂到 window 全局，供后续脚本使用（不使用 ES module）
   ========================================================================== */
const links = [
  // ── 社区/博客/资讯 ──
  { name: "GitHub", url: "https://github.com/", tags: ["community", "tools"], icon: "GH", description: "搜开源项目、看工程结构、学习作品和找 idea。" },
  { name: "Gitee", url: "https://gitee.com/", tags: ["community", "tools"], icon: "G", description: "托管课程项目、脚本、小工具和国内开源工程。" },
  { name: "CSDN", url: "https://www.csdn.net/", tags: ["community", "learn"], icon: "CS", description: "查 bug、找代码片段、看嵌入式/C++/通信类文章和实战笔记。" },
  { name: "掘金", url: "https://juejin.cn/", tags: ["community", "learn"], icon: "掘", description: "看工程化、前端、工具链、产品化实现和新人练手思路。" },
  { name: "知乎", url: "https://www.zhihu.com/", tags: ["community", "learn"], icon: "知", description: "搜专业问题、竞赛经验、择业和入门路径讨论。" },
  { name: "Stack Overflow", url: "https://stackoverflow.com/", tags: ["community", "learn"], icon: "S", description: "适合查编程问题、报错和工程实现细节。" },
  { name: "Bilibili", url: "https://www.bilibili.com/", tags: ["learn"], icon: "B", description: "看公开课、竞赛经验、仪器拆解、EDA 实操和项目演示。" },

  // ── Datasheet/型号 ──
  { name: "小芯半导体", url: "https://www.xchip.cn/", tags: ["datasheet", "components"], icon: "芯", description: "查芯片资料、中文 datasheet、替代料和选型信息。" },
  { name: "贸泽电子", url: "https://www.mouser.cn/", tags: ["components", "datasheet"], icon: "M", description: "查原厂芯片、参考设计和器件选型说明。" },
  { name: "ST 意法半导体", url: "https://www.st.com/", tags: ["datasheet", "competition"], icon: "ST", description: "查 STM32 官方手册、参考设计、工具和例程首选。" },
  { name: "NXP 官方", url: "https://www.nxp.com/", tags: ["datasheet", "competition"], icon: "NX", description: "查 i.MX、Kinetis、射频和汽车电子资料。" },
  { name: "英飞凌", url: "https://www.infineon.com/", tags: ["datasheet", "competition"], icon: "IF", description: "查功率器件、驱动和电源管理方案。" },
  { name: "瑞萨电子", url: "https://www.renesas.cn/", tags: ["datasheet", "competition"], icon: "瑞", description: "看 MCU、汽车电子和工业控制方案资料。" },

  // ── 买件/常用商城 ──
  { name: "立创商城", url: "https://www.szlcsc.com/", tags: ["components", "pcb"], icon: "立", description: "买元器件、模块、开发板，以及 PCB 打样/SMT 常用。" },
  { name: "华秋电子", url: "https://www.hqew.com/", tags: ["components", "pcb"], icon: "华", description: "元器件商城和 PCB 服务较全，方便从原理图到板子。" },

  // ── 原理图/PCB/开源硬件 ──
  { name: "嘉立创", url: "https://www.jlc.com/", tags: ["pcb", "components"], icon: "嘉", description: "PCB 打样、SMT、PCBA、3D 打印，课设和小批量都常用。" },
  { name: "立创EDA", url: "https://lceda.cn/", tags: ["pcb", "tools"], icon: "EDA", description: "在线原理图和 PCB 工具，适合快速出课程设计板。" },
  { name: "KiCad", url: "https://www.kicad.org/", tags: ["pcb", "tools"], icon: "K", description: "开源 PCB 工具，适合从原理图到 PCB 全流程练习。" },

  // ── EDA/仿真/软件工具 ──
  { name: "VS Code", url: "https://code.visualstudio.com/", tags: ["tools"], icon: "VS", description: "适合写代码、做文档、运行脚本和开发小工具。" },
  { name: "Git for Windows", url: "https://gitforwindows.org/", tags: ["tools"], icon: "G", description: "适合本地版本控制、脚本管理和工程协作习惯养成。" },
  { name: "Keil MDK", url: "https://www.keil.com/", tags: ["tools", "competition"], icon: "K", description: "适合 STM32 开发和单片机课程实验使用。" },
  { name: "IAR EW", url: "https://www.iar.com/", tags: ["tools", "competition"], icon: "I", description: "适合嵌入式编译、调试和工程稳定性练习。" },
  { name: "Multisim", url: "https://www.ni.com/multisim", tags: ["tools"], icon: "M", description: "适合电路仿真、模电/数电实验验证和教学演示。" },
  { name: "Proteus", url: "https://www.labcenter.com/", tags: ["tools"], icon: "P", description: "适合单片机仿真、简单电路验证和入门实验。" },
  { name: "MATLAB", url: "https://www.mathworks.com/products/matlab.html", tags: ["tools"], icon: "MA", description: "适合信号处理、控制系统和算法仿真练习。" },

  // ── 学习/课程/视频 ──
  { name: "正点原子", url: "https://www.alientek.com/", tags: ["learn", "competition"], icon: "正", description: "STM32 和 Linux 嵌入式学习资料、例程和板卡参考。" },
  { name: "野火电子", url: "https://www.firebbs.cn/", tags: ["learn", "community"], icon: "野", description: "嵌入式入门、RTOS、Linux 和项目实战经验集中。" },
  { name: "韦东山嵌入式", url: "https://www.100ask.net/", tags: ["learn", "competition"], icon: "韦", description: "嵌入式 Linux、驱动和项目实战课程较系统。" },
  { name: "中国大学 MOOC", url: "https://www.icourse163.org/", tags: ["learn"], icon: "M", description: "适合补电路、信号、嵌入式、Python 和通信类基础。" },
  { name: "学堂在线", url: "https://www.xuetangx.com/", tags: ["learn"], icon: "学", description: "适合看高校公开课和电子相关专业基础课。" },
  { name: "菜鸟教程", url: "https://www.runoob.com/", tags: ["learn", "tools"], icon: "菜", description: "适合快速入门语言、工具和基础概念。" },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org/", tags: ["learn", "tools"], icon: "M", description: "适合查前端、网络和 Web 开发权威资料。" },
  { name: "泰克科技", url: "https://www.tek.com.cn/", tags: ["learn", "competition"], icon: "泰", description: "看示波器、探头和测试测量资料。" },
  { name: "是德科技", url: "https://www.keysight.com.cn/", tags: ["learn", "competition"], icon: "是", description: "看射频、仪器和测试测量资料。" },
  { name: "普源精电", url: "https://www.rigol.com.cn/", tags: ["learn", "competition"], icon: "普", description: "看示波器、信号源和国产仪器资料。" },

  // ── 竞赛/实验室/作品 ──
  { name: "全国大学生电子设计竞赛", url: "http://www.nuedc-training.com.cn/", tags: ["competition"], icon: "电赛", description: "电子信息核心竞赛，适合查资讯、培训和作品参考。" },
  { name: "全国大学生智能汽车竞赛", url: "https://zhuoqing.blog.csdn.net/", tags: ["competition"], icon: "智能车", description: "卓晴老师博客，智能汽车竞赛规则、技术文档与经验。" },
  { name: "ACM/ICPC", url: "https://icpc.global/", tags: ["competition"], icon: "ACM", description: "适合看程序设计竞赛规则、区域赛和训练资源。" },
  { name: "RoboMaster 机甲大师赛", url: "https://www.robomaster.com/", tags: ["competition"], icon: "RM", description: "适合看机器人、视觉、嵌入式和工程踩坑经验。" },
  { name: "全国大学生机器人大赛", url: "http://www.robotcontest.cn/", tags: ["competition"], icon: "机器", description: "适合看机器人相关竞赛和项目实战经验。" },
  { name: "蓝桥杯", url: "https://dasai.lanqiao.cn/", tags: ["competition"], icon: "蓝", description: "适合看嵌入式、软件类竞赛和训练内容。" },
  { name: "赛氪", url: "https://www.saikr.com/", tags: ["competition"], icon: "赛", description: "适合找大学生竞赛、科创比赛和项目实践机会。" },

  // ── 考研/求职/技能 ──
  { name: "知网", url: "https://www.cnki.net/", tags: ["learn", "job"], icon: "知", description: "适合查论文、写毕设和整理文献综述。" },
  { name: "LeetCode", url: "https://leetcode.cn/", tags: ["learn", "job"], icon: "L", description: "适合打基础、补算法和准备笔试面试。" },
  { name: "牛客网", url: "https://www.nowcoder.com/", tags: ["learn", "job"], icon: "牛", description: "适合看校招、笔试、面试和求职经验。" },
  { name: "极客时间", url: "https://time.geekbang.org/", tags: ["learn", "job"], icon: "极", description: "适合看系统化专栏和工程进阶课程。" },
];

const TAG_LABELS = {
  components: "买件/商城",
  datasheet: "Datasheet",
  pcb: "原理图/PCB",
  learn: "学习课程",
  tools: "工具",
  community: "社区资讯",
  competition: "竞赛",
  job: "考研求职",
};

const uniqueLinks = [];
const seen = new Set();
for (const item of links) {
  if (!seen.has(item.url)) {
    seen.add(item.url);
    uniqueLinks.push(item);
  }
}

/* 卡片尺寸推断：可被 item.size 显式覆盖 */
function inferSize(item) {
  if (item.size) return item.size; // 显式覆盖
  const len = (item.description || "").length;
  if (len <= 18) return "compact";
  if (len > 40) return "wide";
  return "standard";
}

/* 主卡节奏：每 7 张插入 1 张 featured，形成视觉锚点 */
function isFeatured(index) {
  return index % 7 === 3;
}

/* 卡片渐变色板 — Aurora 多彩体系 */
const gradients = [
  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
  "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
  "linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)",
  "linear-gradient(135deg, #64748b 0%, #4f46e5 100%)",
];

function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return gradients[(Math.abs(h) + 7) % gradients.length];
}

/* 收藏存储键 */
const FAV_KEY = "ee-guide-favorites";

function getFavorites() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function setFavorites(list) {
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
}

/* 暴露到全局（按规范使用大写 LINKS，同时保留小写 links 兼容） */
window.links = links;
window.LINKS = links;
window.TAG_LABELS = TAG_LABELS;
window.uniqueLinks = uniqueLinks;
window.inferSize = inferSize;
window.isFeatured = isFeatured;
window.gradients = gradients;
window.hashColor = hashColor;
window.FAV_KEY = FAV_KEY;
window.getFavorites = getFavorites;
window.setFavorites = setFavorites;
