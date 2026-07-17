/* =========================================================
   O-VER-KiLL BEGINNER GUIDE
   SCRIPT.JS
========================================================= */

"use strict";


/* =========================================================
   1. UTILITIES
========================================================= */

const body = document.body;

const getFocusableElements = (container) => {
  if (!container) return [];

  return [
    ...container.querySelectorAll(
      `
      a[href],
      button:not([disabled]),
      input:not([disabled]),
      textarea:not([disabled]),
      select:not([disabled]),
      details,
      [tabindex]:not([tabindex="-1"])
      `
    )
  ];
};

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;


/* =========================================================
   2. PAGE LOADER
========================================================= */

const pageLoader = document.getElementById("pageLoader");

const hidePageLoader = () => {
  if (!pageLoader) return;

  window.setTimeout(() => {
    pageLoader.classList.add("is-hidden");
  }, prefersReducedMotion ? 50 : 500);

  window.setTimeout(() => {
    pageLoader.remove();
  }, prefersReducedMotion ? 100 : 1400);
};

if (document.readyState === "complete") {
  hidePageLoader();
} else {
  window.addEventListener("load", hidePageLoader, {
    once: true
  });

  window.setTimeout(hidePageLoader, 3500);
}


/* =========================================================
   3. FIXED HEADER
========================================================= */

const siteHeader = document.getElementById("siteHeader");

let previousScrollY = window.scrollY;
let ticking = false;

const updateHeader = () => {
  if (!siteHeader) return;

  const currentScrollY = window.scrollY;

  siteHeader.classList.toggle(
    "is-scrolled",
    currentScrollY > 20
  );

  const isScrollingDown =
    currentScrollY > previousScrollY &&
    currentScrollY > 180;

  const menuIsOpen =
    body.classList.contains("is-menu-open");

  const modalIsOpen =
    body.classList.contains("is-modal-open");

  siteHeader.classList.toggle(
    "is-hidden",
    isScrollingDown && !menuIsOpen && !modalIsOpen
  );

  if (
    currentScrollY < previousScrollY ||
    currentScrollY < 180
  ) {
    siteHeader.classList.remove("is-hidden");
  }

  previousScrollY = currentScrollY;
  ticking = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  },
  {
    passive: true
  }
);

updateHeader();


/* =========================================================
   4. MOBILE MENU
========================================================= */

const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuLinks = mobileMenu
  ? mobileMenu.querySelectorAll("a, button")
  : [];

let menuPreviouslyFocusedElement = null;

const openMobileMenu = () => {
  if (!menuButton || !mobileMenu) return;

  menuPreviouslyFocusedElement =
    document.activeElement;

  body.classList.add("is-menu-open");
  menuButton.classList.add("is-active");
  mobileMenu.classList.add("is-active");

  menuButton.setAttribute(
    "aria-expanded",
    "true"
  );

  menuButton.setAttribute(
    "aria-label",
    "メニューを閉じる"
  );

  mobileMenu.setAttribute(
    "aria-hidden",
    "false"
  );

  const focusable =
    getFocusableElements(mobileMenu);

  if (focusable.length > 0) {
    window.setTimeout(() => {
      focusable[0].focus();
    }, 50);
  }
};

const closeMobileMenu = () => {
  if (!menuButton || !mobileMenu) return;

  body.classList.remove("is-menu-open");
  menuButton.classList.remove("is-active");
  mobileMenu.classList.remove("is-active");

  menuButton.setAttribute(
    "aria-expanded",
    "false"
  );

  menuButton.setAttribute(
    "aria-label",
    "メニューを開く"
  );

  mobileMenu.setAttribute(
    "aria-hidden",
    "true"
  );

  if (
    menuPreviouslyFocusedElement &&
    typeof menuPreviouslyFocusedElement.focus ===
      "function"
  ) {
    menuPreviouslyFocusedElement.focus();
  }
};

const toggleMobileMenu = () => {
  const isOpen =
    mobileMenu?.classList.contains("is-active");

  if (isOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
};

menuButton?.addEventListener(
  "click",
  toggleMobileMenu
);

mobileMenuLinks.forEach((element) => {
  element.addEventListener("click", () => {
    closeMobileMenu();
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1100) {
    closeMobileMenu();
  }
});


/* =========================================================
   5. SMOOTH ANCHOR SCROLL
========================================================= */

const anchorLinks = document.querySelectorAll(
  'a[href^="#"]:not([href="#"])'
);

anchorLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetSelector =
      link.getAttribute("href");

    if (!targetSelector) return;

    const target =
      document.querySelector(targetSelector);

    if (!target) return;

    event.preventDefault();

    const headerHeight =
      siteHeader?.offsetHeight || 0;

    const targetTop =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      12;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: prefersReducedMotion
        ? "auto"
        : "smooth"
    });

    history.replaceState(
      null,
      "",
      targetSelector
    );
  });
});


/* =========================================================
   6. SCROLL REVEAL
========================================================= */

const revealElements =
  document.querySelectorAll("[data-reveal]");

revealElements.forEach((element) => {
  const delay =
    Number(element.dataset.revealDelay) || 0;

  element.style.transitionDelay =
    `${delay}ms`;
});

if (
  prefersReducedMotion ||
  !("IntersectionObserver" in window)
) {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
} else {
  const revealObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(
            "is-visible"
          );

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      }
    );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}


/* =========================================================
   7. TYPE SELECTOR
========================================================= */

const typeCards =
  document.querySelectorAll("[data-type-card]");

const typeResult =
  document.getElementById("typeResult");

const typeData = {
  rock: {
    icon: "🎸",
    title: "ロックが好きなあなたへ",
    text:
      "まずはおすすめ楽曲とライブ映像へ。音の重さ、歌声、会場の熱量からO-VER-KiLLを知るのがおすすめです。",
    linkText: "おすすめ楽曲を見る",
    target: "#music"
  },

  matsukuma: {
    icon: "⚡",
    title:
      "BiSHや松隈サウンドが好きなあなたへ",
    text:
      "全曲サウンドプロデュースの魅力を、まずは楽曲から。曲ごとの違いと3人の歌声に注目してください。",
    linkText: "楽曲紹介を見る",
    target: "#music"
  },

  beginner: {
    icon: "✨",
    title: "アイドル初心者のあなたへ",
    text:
      "コールや特典会を知らなくても大丈夫。ライブの楽しみ方と、初参加で不安になりやすいポイントを先に確認できます。",
    linkText: "初めての方へ進む",
    target: "#faq"
  },

  member: {
    icon: "📱",
    title: "人やキャラクターから知りたいあなたへ",
    text:
      "SARiNA、MiYU、KiLUA。それぞれの雰囲気や個性を、写真や短い動画から見てみてください。",
    linkText: "メンバーを見る",
    target: "#members"
  }
};

const renderTypeResult = (typeKey) => {
  if (!typeResult) return;

  const data = typeData[typeKey];

  if (!data) return;

  typeCards.forEach((card) => {
    const isActive =
      card.dataset.typeCard === typeKey;

    card.classList.toggle(
      "is-active",
      isActive
    );

    card.setAttribute(
      "aria-pressed",
      String(isActive)
    );
  });

  typeResult.innerHTML = `
    <div class="type-result__content">
      <div
        class="type-result__icon"
        aria-hidden="true"
      >
        ${data.icon}
      </div>

      <div class="type-result__text">
        <strong>${data.title}</strong>
        <p>${data.text}</p>
      </div>

      <a
        class="type-result__link"
        href="${data.target}"
      >
        ${data.linkText}
        <span aria-hidden="true">→</span>
      </a>
    </div>
  `;

  const resultLink =
    typeResult.querySelector(
      ".type-result__link"
    );

  resultLink?.addEventListener(
    "click",
    (event) => {
      const target =
        document.querySelector(
          data.target
        );

      if (!target) return;

      event.preventDefault();

      const headerHeight =
        siteHeader?.offsetHeight || 0;

      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        12;

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: prefersReducedMotion
          ? "auto"
          : "smooth"
      });
    }
  );
};

typeCards.forEach((card) => {
  card.setAttribute(
    "aria-pressed",
    "false"
  );

  card.addEventListener("click", () => {
    renderTypeResult(
      card.dataset.typeCard
    );
  });
});


/* =========================================================
   8. FAQ ACCORDION
========================================================= */

const faqItems =
  document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;

    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.removeAttribute("open");
      }
    });
  });
});


/* =========================================================
   9. VIDEO MODAL
========================================================= */

const videoModal =
  document.getElementById("videoModal");

const videoModalDialog =
  videoModal?.querySelector(
    ".video-modal__dialog"
  );

const modalOpenButtons =
  document.querySelectorAll(
    "[data-video-modal-open]"
  );

const modalCloseButtons =
  document.querySelectorAll(
    "[data-video-modal-close]"
  );

const introVideo =
  document.getElementById("introVideo");

const introVideoIframe =
  document.getElementById(
    "introVideoIframe"
  );

let modalPreviouslyFocusedElement = null;

const playIntroVideo = () => {
  if (introVideo) {
    introVideo.currentTime = 0;

    const playPromise =
      introVideo.play();

    if (
      playPromise &&
      typeof playPromise.catch ===
        "function"
    ) {
      playPromise.catch(() => {});
    }
  }

  if (introVideoIframe) {
    const source =
      introVideoIframe.getAttribute(
        "data-src"
      );

    if (source) {
      introVideoIframe.src = source;
    }
  }
};

const stopIntroVideo = () => {
  if (introVideo) {
    introVideo.pause();
    introVideo.currentTime = 0;
  }

  if (introVideoIframe) {
    const currentSource =
      introVideoIframe.getAttribute("src");

    if (currentSource) {
      introVideoIframe.setAttribute(
        "data-src",
        currentSource
      );

      introVideoIframe.removeAttribute("src");
    }
  }
};

const openVideoModal = ({
  rememberVisit = true
} = {}) => {
  if (!videoModal) return;

  closeMobileMenu();

  modalPreviouslyFocusedElement =
    document.activeElement;

  body.classList.add("is-modal-open");

  videoModal.classList.add("is-active");

  videoModal.setAttribute(
    "aria-hidden",
    "false"
  );

  if (rememberVisit) {
    try {
      sessionStorage.setItem(
        "overkillIntroSeen",
        "true"
      );
    } catch (error) {
      console.warn(
        "sessionStorageを利用できませんでした。",
        error
      );
    }
  }

  const focusable =
    getFocusableElements(videoModal);

  window.setTimeout(() => {
    focusable[0]?.focus();
    playIntroVideo();
  }, 80);
};

const closeVideoModal = () => {
  if (!videoModal) return;

  body.classList.remove("is-modal-open");

  videoModal.classList.remove("is-active");

  videoModal.setAttribute(
    "aria-hidden",
    "true"
  );

  stopIntroVideo();

  if (
    modalPreviouslyFocusedElement &&
    typeof modalPreviouslyFocusedElement
      .focus === "function"
  ) {
    modalPreviouslyFocusedElement.focus();
  }
};

modalOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openVideoModal();
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeVideoModal();
  });
});

videoModal?.addEventListener(
  "click",
  (event) => {
    if (event.target === videoModal) {
      closeVideoModal();
    }
  }
);

videoModalDialog?.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();
  }
);


/* =========================================================
   10. KEYBOARD CONTROL
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      if (
        videoModal?.classList.contains(
          "is-active"
        )
      ) {
        closeVideoModal();
        return;
      }

      if (
        mobileMenu?.classList.contains(
          "is-active"
        )
      ) {
        closeMobileMenu();
      }
    }

    if (
      event.key === "Tab" &&
      videoModal?.classList.contains(
        "is-active"
      )
    ) {
      const focusable =
        getFocusableElements(videoModal);

      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement =
        focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
);


/* =========================================================
   11. FIRST VISIT INTRO MODAL
========================================================= */

const shouldAutoOpenIntro = () => {
  try {
    return (
      sessionStorage.getItem(
        "overkillIntroSeen"
      ) !== "true"
    );
  } catch (error) {
    return true;
  }
};

const autoOpenIntro = () => {
  if (!videoModal) return;

  if (!shouldAutoOpenIntro()) return;

  window.setTimeout(() => {
    openVideoModal({
      rememberVisit: true
    });
  }, prefersReducedMotion ? 400 : 1300);
};

window.addEventListener(
  "load",
  autoOpenIntro,
  {
    once: true
  }
);


/* =========================================================
   12. ACTIVE NAVIGATION
========================================================= */

const navigationLinks =
  document.querySelectorAll(
    '.desktop-nav a[href^="#"], .mobile-menu__nav a[href^="#"]'
  );

const sectionIds = [
  "about",
  "music",
  "members",
  "live",
  "benefits",
  "faq"
];

const sections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const updateActiveNavigation = () => {
  const scrollPosition =
    window.scrollY +
    window.innerHeight * 0.34;

  let currentSectionId = "";

  sections.forEach((section) => {
    if (
      scrollPosition >=
      section.offsetTop
    ) {
      currentSectionId = section.id;
    }
  });

  navigationLinks.forEach((link) => {
    const href =
      link.getAttribute("href");

    link.classList.toggle(
      "is-active",
      href === `#${currentSectionId}`
    );
  });
};

window.addEventListener(
  "scroll",
  updateActiveNavigation,
  {
    passive: true
  }
);

window.addEventListener(
  "resize",
  updateActiveNavigation
);

updateActiveNavigation();


/* =========================================================
   13. EXTERNAL PLACEHOLDER LINKS
========================================================= */

const placeholderLinks =
  document.querySelectorAll(
    `
    a[href^="TICKET_URL"],
    a[href^="OFFICIAL_"],
    a[href^="SARINA_"],
    a[href^="MIYU_"],
    a[href^="KILUA_"],
    a[href^="YOUTUBE_URL"],
    a[href^="SPOTIFY_URL"]
    `
  );

placeholderLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href =
      link.getAttribute("href") || "";

    const isPlaceholder =
      href.includes("_URL") ||
      href.includes("_HERE");

    if (!isPlaceholder) return;

    event.preventDefault();

    window.alert(
      "このリンクは、あとで実際のURLへ差し替えます。"
    );
  });
});


/* =========================================================
   14. INITIAL STATE
========================================================= */

document.documentElement.classList.add(
  "js-enabled"
);

console.info(
  "O-VER-KiLL Beginner Guide loaded."
);
