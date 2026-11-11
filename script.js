// Cấu hình: điền các giá trị dưới đây rồi lưu file.
const CONFIG = {
  apk: "https://github.com/mynameisno123/so-thu-chi-web/releases/latest/download/app-release.apk",   // Liên kết tải APK, ví dụ: https://github.com/<tên-người-dùng>/<tên-repo>/releases/latest/download/app-release.apk
  web: "app/",   // Địa chỉ bản web của app, ví dụ: app/ (nếu đặt cùng repo) hoặc https://ten-du-an.web.app
  email: "testemailhotro@gmail.com"  // Email liên hệ (để trống thì dòng liên hệ ở chân trang sẽ ẩn)
};

const toast = document.getElementById("toast");
let toastTimer;
function say(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// Nút Tải APK và Dùng trên web: có liên kết thì mở thẳng, chưa có thì báo nhẹ nhàng.
const NOT_READY = { apk: "Liên kết tải sẽ được cập nhật sớm.", web: "Bản web sẽ sớm có." };
document.querySelectorAll("[data-link]").forEach((a) => {
  const key = a.dataset.link;
  if (CONFIG[key]) {
    a.href = CONFIG[key];
    a.rel = "noopener";
  } else {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      say(NOT_READY[key]);
    });
  }
});

// Email liên hệ ở chân trang.
if (CONFIG.email) {
  const wrap = document.getElementById("contact");
  const link = document.getElementById("contact-a");
  if (wrap && link) {
    wrap.hidden = false;
    link.href = "mailto:" + CONFIG.email;
    link.textContent = CONFIG.email;
  }
}

// Giao diện sáng/tối: mặc định theo hệ thống, bấm nút để đổi và nhớ lựa chọn.
(function () {
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
  const MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
  const current = () => root.dataset.theme || (media.matches ? "dark" : "light");
  function paint() {
    const dark = current() === "dark";
    btn.innerHTML = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (dark ? SUN : MOON) + "</svg>";
    const label = dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối";
    btn.setAttribute("aria-label", label);
    btn.title = label;
  }
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let animTimer;
  btn.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    if (!reduceMotion) {
      // Bật hiệu ứng chuyển màu trong lúc đổi theme, rồi tắt đi để không ảnh hưởng thao tác khác.
      root.classList.add("theme-anim");
      void root.offsetWidth;
      clearTimeout(animTimer);
      animTimer = setTimeout(() => root.classList.remove("theme-anim"), 500);
    }
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    paint();
    if (!reduceMotion) {
      btn.classList.remove("spin");
      void btn.offsetWidth;
      btn.classList.add("spin");
    }
  });
  btn.addEventListener("animationend", () => btn.classList.remove("spin"));
  media.addEventListener("change", paint);
  paint();
})();
