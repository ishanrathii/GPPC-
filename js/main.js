/* ============ Gurunisa Prabha Prakash Chaitanya — main.js ============ */
(function () {
  const D = window.GPPC_DEFAULTS;
  const get = (key, fallback) => {
    try { const v = localStorage.getItem("GPPC_" + key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  };
  const data = {
    gurus: get("gurus", D.gurus),
    events: get("events", D.events),
    teachings: get("teachings", D.teachings),
    quotes: get("quotes", D.quotes),
    gallery: get("gallery", D.gallery),
    social: get("social", D.social)
  };

  const $ = (s) => document.querySelector(s);
  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; };

  /* ---- header scroll ---- */
  const header = $("#header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll); onScroll();

  /* ---- mobile nav ---- */
  const nav = $("#nav"), toggle = $("#navToggle");
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  /* ---- gurus ---- */
  const gg = $("#guruGrid");
  data.gurus.forEach((g, i) => {
    const url = "guru.html?id=" + i;
    gg.appendChild(el(`
    <article class="guru-card reveal">
      <a class="guru-photo" href="${url}" aria-label="View ${g.name}">${g.photo ? `<img src="${g.photo}" alt="${g.name}" onerror="this.parentNode.textContent='${g.initial || g.name[0]}'">` : (g.initial || g.name[0])}</a>
      <div class="guru-body">
        <h3><a class="guru-name-link" href="${url}">${g.name}</a></h3>
        <div class="guru-role">${g.role}</div>
        <p>${g.bio}</p>
        <p class="guru-teaching">${g.teaching}</p>
        <a class="guru-more" href="${url}">View Profile &amp; Journey →</a>
      </div>
    </article>`));
  });

  /* ---- events (next two months, sorted) ---- */
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const eg = $("#eventGrid");
  const today = new Date(); today.setHours(0,0,0,0);
  const limit = new Date(today); limit.setMonth(limit.getMonth() + 2);
  const upcoming = data.events
    .map(e => ({ ...e, d: new Date(e.date + "T00:00:00") }))
    .filter(e => !isNaN(e.d))
    .sort((a, b) => a.d - b.d);
  const shown = upcoming.filter(e => e.d >= today && e.d <= limit);
  const list = shown.length ? shown : upcoming.slice(0, 4);
  if (!list.length) eg.appendChild(el(`<p class="lead">New events will be announced soon. 🙏</p>`));
  list.forEach(e => {
    const maps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(e.maps || e.location);
    eg.appendChild(el(`
      <article class="event-card reveal">
        <div class="event-top">
          <div class="event-date"><span class="d">${e.d.getDate()}</span><span class="m">${months[e.d.getMonth()]}</span></div>
          <h3>${e.title}</h3>
        </div>
        <div class="event-body">
          <div class="event-meta">📅 ${e.dateText || e.time || ""} &nbsp;•&nbsp; 📍 ${e.location}</div>
          <p>${e.desc}</p>
          <div class="event-actions">
            <button class="btn btn-primary btn-small reg-btn" data-event="${e.title}" data-date="${e.dateText || ''}" data-loc="${e.location}">Register</button>
            <a class="btn btn-ghost btn-small" href="${maps}" target="_blank" rel="noopener">View Map</a>
          </div>
        </div>
      </article>`));
  });

  /* ---- teachings + filter ---- */
  const tg = $("#teachingGrid"), chips = $("#topicChips");
  const topics = ["All", ...new Set(data.teachings.map(t => t.topic))];
  const renderTeachings = (topic) => {
    tg.innerHTML = "";
    data.teachings.filter(t => topic === "All" || t.topic === topic).forEach(t => {
      tg.appendChild(el(`
        <article class="teaching-card reveal in">
          <div class="teaching-thumb">${t.image ? `<img src="${t.image}" alt="${t.title}" style="width:100%;height:100%;object-fit:cover">` : (t.icon || "📖")}<span class="tag">${t.type}</span></div>
          <div class="tb">
            <h3>${t.title}</h3>
            <p>${t.excerpt}</p>
            <a class="read" href="${t.link || "#"}" ${t.link ? 'target="_blank" rel="noopener"' : ""}>${t.type === "Video" ? "Watch ▶" : "Read more →"}</a>
          </div>
        </article>`));
    });
  };
  topics.forEach((tp, i) => {
    const b = el(`<button class="${i === 0 ? "active" : ""}">${tp}</button>`);
    b.addEventListener("click", () => {
      chips.querySelectorAll("button").forEach(x => x.classList.remove("active"));
      b.classList.add("active"); renderTeachings(tp);
    });
    chips.appendChild(b);
  });
  renderTeachings("All");

  /* ---- daily wisdom (deterministic per day) ---- */
  const q = data.quotes.length ? data.quotes : D.quotes;
  const dayIndex = Math.floor(Date.now() / 86400000) % q.length;
  const todayQuote = q[dayIndex];
  $("#quoteText").textContent = "“" + todayQuote.text + "”";
  $("#quoteAuthor").textContent = "— " + todayQuote.author;
  $("#quoteDate").textContent = new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  /* ---- gallery ---- */
  const galg = $("#galleryGrid");
  data.gallery.forEach(item => {
    const inner = item.image
      ? `<img src="${item.image}" alt="${item.cap}">`
      : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;background:linear-gradient(135deg,var(--gold-light),var(--saffron))">${item.icon || "🌸"}</div>`;
    galg.appendChild(el(`
      <div class="gallery-item ${item.tall ? "tall" : ""} reveal in">
        ${inner}
        ${item.video ? '<div class="play">▶</div>' : ""}
        <div class="cap">${item.cap || ""}</div>
      </div>`));
  });

  /* ---- contact links + social brand icons ---- */
  const ICONS = {
    youtube: '<svg viewBox="0 0 24 24"><path fill="#FF0000" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8Z"/><path fill="#fff" d="M9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><defs><radialGradient id="ig" cx="30%" cy="105%" r="130%"><stop offset="0%" stop-color="#fdf497"/><stop offset="5%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig)"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="17" cy="7" r="1.3" fill="#fff"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path fill="#25D366" d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.5A10 10 0 1 0 12 2Z"/><path fill="#fff" d="M16.8 14.3c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1a7.3 7.3 0 0 1-3.6-3.2c-.3-.5.3-.5.7-1.5.1-.2 0-.4 0-.5l-.9-2c-.2-.5-.4-.5-.6-.5h-.5a1 1 0 0 0-.7.3c-.2.3-.9.9-.9 2.2s.9 2.6 1.1 2.8c.1.2 1.9 2.9 4.6 4 .6.3 1.1.5 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3Z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24"><path fill="#1877F2" d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-2.9h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5v1.8h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12Z"/></svg>',
    email: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3" fill="#b8860b"/><path fill="none" stroke="#fff" stroke-width="1.8" d="m3 6 9 6 9-6"/></svg>'
  };
  const S = data.social || {};
  const cl = $("#contactLinks");
  const addLink = (href, key, label) => { if (href) cl.appendChild(el(`<li><a href="${href}" ${href.startsWith("mailto") ? "" : 'target="_blank" rel="noopener"'}><span class="ci">${ICONS[key]}</span>${label}</a></li>`)); };
  addLink(S.whatsapp, "whatsapp", "WhatsApp");
  addLink(S.youtube, "youtube", "YouTube");
  addLink(S.instagram, "instagram", "Instagram");
  addLink(S.facebook, "facebook", "Facebook");
  if (S.email) addLink("mailto:" + S.email, "email", S.email);

  const socialDefs = [
    ["youtube", S.youtube], ["instagram", S.instagram], ["whatsapp", S.whatsapp],
    ["facebook", S.facebook], ["email", S.email ? "mailto:" + S.email : ""]
  ];
  const renderSocial = (container) => {
    if (!container) return;
    socialDefs.forEach(([k, href]) => {
      if (!href) return;
      container.appendChild(el(`<a class="social-icon" href="${href}" ${href.startsWith("mailto") ? "" : 'target="_blank" rel="noopener"'} aria-label="${k}" title="${k}">${ICONS[k]}</a>`));
    });
  };
  renderSocial($("#socialRow"));
  renderSocial($("#footerSocial"));

  /* ---- contact form ---- */
  const form = $("#contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msgs = get("inquiries", []);
    const fd = new FormData(form);
    msgs.push({ name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone"), message: fd.get("message"), at: new Date().toISOString() });
    localStorage.setItem("GPPC_inquiries", JSON.stringify(msgs));
    form.reset();
    $("#formNote").hidden = false;
    setTimeout(() => { $("#formNote").hidden = true; }, 5000);
  });

  /* ---- registration modal ---- */
  const regModal = $("#regModal");
  const regForm = $("#regForm");
  const waNumber = (S.whatsapp || "").replace(/[^0-9]/g, "") || "919423028177";
  const openReg = (title, date, loc) => {
    $("#regEventName").textContent = title + (date ? " · " + date : "") + (loc ? " · " + loc : "");
    regForm.elements.event.value = title;
    $("#regNote").hidden = true;
    regModal.classList.add("open");
    regModal.setAttribute("aria-hidden", "false");
  };
  const closeReg = () => { regModal.classList.remove("open"); regModal.setAttribute("aria-hidden", "true"); };
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest(".reg-btn");
    if (b) { openReg(b.dataset.event, b.dataset.date, b.dataset.loc); }
    if (ev.target.hasAttribute("data-close")) closeReg();
  });
  // build the WhatsApp prefilled message live
  const buildWa = () => {
    const f = regForm;
    const msg = `🙏 Registration — ${f.elements.event.value}\nName: ${f.name.value}\nPhone: ${f.phone.value}\nCity: ${f.city.value}\nEmail: ${f.email.value}\nPeople: ${f.count.value}\nParticipation: ${f.mode.value}\nMessage: ${f.message.value}`;
    $("#regWhats").href = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(msg);
  };
  regForm.addEventListener("input", buildWa);
  regForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const regs = get("registrations", []);
    const f = regForm;
    regs.push({ event: f.event.value, name: f.name.value, phone: f.phone.value, city: f.city.value, email: f.email.value, count: f.count.value, mode: f.mode.value, message: f.message.value, at: new Date().toISOString() });
    localStorage.setItem("GPPC_registrations", JSON.stringify(regs));
    buildWa();
    $("#regNote").hidden = false;
    setTimeout(closeReg, 2200);
  });

  /* ---- image lightbox ---- */
  const lb = $("#lightbox"), lbImg = $("#lightboxImg");
  document.addEventListener("click", (ev) => {
    const img = ev.target.closest(".guru-photo img");
    if (img) { lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); }
    if (ev.target.hasAttribute("data-lbclose") || ev.target === lb) { lb.classList.remove("open"); }
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeReg(); lb.classList.remove("open"); } });

  /* ---- year ---- */
  $("#year").textContent = new Date().getFullYear();

  /* ---- reveal on scroll ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(r => io.observe(r));
})();
