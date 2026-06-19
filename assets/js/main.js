/* MOKALENG — site interactions */
(function () {
  "use strict";

  /* ---- Header solid-on-scroll ---- */
  const header = document.querySelector(".header");
  const setHeader = () => {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add("is-solid");
    else header.classList.remove("is-solid");
  };
  // interior pages have non-hero first section → always solid
  if (header && header.dataset.solid === "true") header.classList.add("is-solid");
  else { setHeader(); window.addEventListener("scroll", setHeader, { passive: true }); }

  /* ---- Mobile menu ---- */
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".mobile-menu");
  const closeBtn = document.querySelector(".mobile-menu__close");
  const openMenu = () => {
    menu.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    const first = menu.querySelector("a, button");
    if (first) first.focus();
  };
  const closeMenu = () => {
    menu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
    burger.focus();
  };
  if (burger && menu) {
    burger.addEventListener("click", () =>
      menu.classList.contains("is-open") ? closeMenu() : openMenu()
    );
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
    });
  }

  /* ---- Scroll reveals + datum lines (IntersectionObserver) ---- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealEls = document.querySelectorAll(".reveal, .datum-line");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---- Contact form (no backend: builds a mailto enquiry) ---- */
  const form = document.querySelector("#enquiry-form");
  if (form) {
    const status = form.querySelector(".form__status");
    const fields = {
      name: form.querySelector("#f-name"),
      company: form.querySelector("#f-company"),
      email: form.querySelector("#f-email"),
      phone: form.querySelector("#f-phone"),
      service: form.querySelector("#f-service"),
      location: form.querySelector("#f-location"),
      message: form.querySelector("#f-message"),
    };

    const setError = (input, on) => {
      const wrap = input.closest(".field");
      if (!wrap) return;
      wrap.classList.toggle("field--error", on);
    };
    const emailOK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const validate = () => {
      let ok = true;
      const req = ["name", "email", "service", "message"];
      req.forEach((k) => {
        const empty = !fields[k].value.trim();
        setError(fields[k], empty);
        if (empty) ok = false;
      });
      if (fields.email.value.trim() && !emailOK(fields.email.value.trim())) {
        setError(fields.email, true);
        ok = false;
      }
      return ok;
    };

    // live clear
    Object.values(fields).forEach((el) => {
      const ev = el.type === "checkbox" ? "change" : "input";
      el.addEventListener(ev, () => setError(el, false));
    });

    const showStatus = (msg, type) => {
      status.textContent = msg;
      status.className = "form__status is-show form__status--" + type;
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) {
        showStatus("Please complete the required fields highlighted above.", "err");
        const firstErr = form.querySelector(".field--error input, .field--error select, .field--error textarea");
        if (firstErr) firstErr.focus();
        return;
      }
      const v = (k) => fields[k].value.trim();
      const lines = [
        "New enquiry via mokaleng.co.za",
        "",
        "Name: " + v("name"),
        "Company: " + (v("company") || "—"),
        "Email: " + v("email"),
        "Phone: " + (v("phone") || "—"),
        "Service required: " + v("service"),
        "Project location: " + (v("location") || "—"),
        "",
        "Message:",
        v("message"),
      ];
      const body = lines.join("\n");
      const subject = "Engineering enquiry — " + v("service") + " — " + v("name");

      // mailto
      const mailto =
        "mailto:Info@mokaleng.co.za?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      showStatus(
        "Thank you, " +
          v("name").split(" ")[0] +
          ". Your email client is opening with the enquiry ready to send.",
        "ok"
      );

      window.location.href = mailto;
    });
  }

  /* ---- Footer year ---- */
  const yr = document.querySelector("#year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
