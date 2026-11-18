const toggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("site-menu");
const sectionLinks = [...(menu?.querySelectorAll("a") ?? [])]
  .map(link => ({ link, section: document.getElementById(link.hash.slice(1)) }))
  .filter(item => item.section);

if (sectionLinks.length) {
  function selectLink(selected) {
    for (const { link } of sectionLinks) {
      if (link === selected) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }

  function selectVisibleSection() {
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
    const current = sectionLinks.find(({ section }) => {
      // Use the same inset as native anchor navigation, allowing for pixel rounding.
      const inset = padding + parseFloat(getComputedStyle(section).scrollMarginTop) + 1;
      const { top, bottom } = section.getBoundingClientRect();
      return top <= inset && inset < bottom;
    });
    selectLink(current?.link);
  }

  menu.addEventListener("click", event => {
    const link = event.target.closest("a");
    if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) selectLink(link);
  });
  // Let a smooth anchor scroll settle before selecting from the viewport.
  let scrollTimer;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(selectVisibleSection, 80);
  }, { passive: true });
  window.addEventListener("resize", selectVisibleSection);
  window.addEventListener("pageshow", selectVisibleSection);
  selectVisibleSection();
}

function setMenu(open) {
  toggle?.setAttribute("aria-expanded", String(open));
  menu?.classList.toggle("is-open", open);
}
toggle?.addEventListener("click", () =>
  setMenu(toggle.getAttribute("aria-expanded") !== "true"),
);
menu?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    toggle?.getAttribute("aria-expanded") === "true"
  ) {
    setMenu(false);
    toggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) setMenu(false);
});
// Native exclusive details groups work without JavaScript. This also covers older browsers.
document.querySelectorAll("details[name]").forEach((details) => {
  details.addEventListener("toggle", () => {
    if (!details.open) return;
    document.querySelectorAll("details[name]").forEach((other) => {
      if (other !== details && other.name === details.name) other.open = false;
    });
  });
});
// Collapse the fallback navigation only after its controller is ready.
if (toggle && menu) {
  const bookingLink = toggle.parentElement.querySelector(".nav-book");
  const mobile = matchMedia("(max-width: 900px)");
  function syncHeader() {
    setMenu(false);
    // Match keyboard order to the row, with menu links following their toggle.
    if (mobile.matches) toggle.before(bookingLink);
    else menu.after(bookingLink);
  }
  syncHeader();
  mobile.addEventListener("change", syncHeader);
  document.documentElement.classList.add("nav-ready");
}
