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

  /* ---- Contact form (no backend: builds mailto + WhatsApp) ---- */
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
      consent: form.querySelector("#f-consent"),
    };

    const setError = (input, on) => {
      const wrap = input.closest(".field, .consent");
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
      if (!fields.consent.checked) {
        setError(fields.consent, true);
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

      // whatsapp (Andre default contact)
      const wa =
        "https://wa.me/27827272851?text=" + encodeURIComponent(body);

      showStatus(
        "Thank you, " +
          v("name").split(" ")[0] +
          ". Your email client is opening — or send this enquiry straight to us on WhatsApp.",
        "ok"
      );

      // inject quick WhatsApp action under status
      let waBtn = form.querySelector(".form__wa");
      if (!waBtn) {
        waBtn = document.createElement("a");
        waBtn.className = "btn btn--solid form__wa";
        waBtn.style.marginTop = "0.9rem";
        waBtn.innerHTML =
          'Send via WhatsApp <svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z"/></svg>';
        status.after(waBtn);
      }
      waBtn.href = wa;
      waBtn.target = "_blank";
      waBtn.rel = "noopener";

      window.location.href = mailto;
    });
  }

  /* ---- Footer year ---- */
  const yr = document.querySelector("#year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
