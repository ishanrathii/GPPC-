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
    testimonials: get("testimonials", D.testimonials)
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
  data.gurus.forEach(g => gg.appendChild(el(`
    <article class="guru-card reveal">
      <div class="guru-photo">${g.photo ? `<img src="${g.photo}" alt="${g.name}">` : (g.initial || g.name[0])}</div>
      <div class="guru-body">
        <h3>${g.name}</h3>
        <div class="guru-role">${g.role}</div>
        <p>${g.bio}</p>
        <p class="guru-teaching">${g.teaching}</p>
      </div>
    </article>`)));

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
          <div class="event-meta">🕑 ${e.time || ""} &nbsp;•&nbsp; 📍 ${e.location}</div>
          <p>${e.desc}</p>
          <div class="event-actions">
            <a class="btn btn-primary btn-small" href="${maps}" target="_blank" rel="noopener">Register</a>
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

  /* ---- testimonials ---- */
  const ttg = $("#testiGrid");
  data.testimonials.forEach(t => ttg.appendChild(el(`
    <article class="testi-card reveal">
      <p>${t.text}</p>
      <div class="testi-who">
        <div class="testi-avatar">${(t.name || "•")[0]}</div>
        <div><strong>${t.name}</strong><span>${t.place || ""}</span></div>
      </div>
    </article>`)));

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

  /* ---- year ---- */
  $("#year").textContent = new Date().getFullYear();

  /* ---- reveal on scroll ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(r => io.observe(r));
})();
