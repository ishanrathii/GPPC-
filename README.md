# Gurunisa Prabha Prakash Chaitanya

A modern, premium spiritual organization website — *Illuminating Lives Through Wisdom, Service & Spiritual Awareness.*

Built as a fast, mobile-responsive, SEO-friendly static site with an easy-to-use admin dashboard. No build step required.

## ✨ Features

- **Hero** — full-screen divine background with golden glow, animated logo, and call-to-action buttons.
- **About Us** — four spiritual guides with photos, biographies, teachings and mission.
- **Upcoming Schedule** — auto-filtered events for the next two months, with date, location, description, registration + Google Maps integration.
- **Teachings & Wisdom** — filterable articles & videos (Life, God, Spirituality, Manners, Personality, Youth, Meditation, Positive Living).
- **Daily Wisdom** — one inspirational quote rotated automatically each day.
- **Event Gallery** — masonry photo/video grid.
- **Testimonials** — community voices.
- **Contact** — WhatsApp, YouTube, Instagram, Facebook, email + inquiry form.
- **Admin Dashboard** (`/admin.html`) — add/edit/delete events, teachings, gurus, quotes, gallery, testimonials, and read inquiries. Export content as JSON.
- Saffron / gold / ivory / cream palette, lotus + light-ray + sacred-geometry backgrounds, smooth scroll-reveal animations.

## 🗂 Structure

```
index.html        Homepage
admin.html        Admin dashboard
css/style.css     Styles
js/data.js        Default content (shared by site + admin)
js/main.js        Site logic
assets/logo.svg   Emblem / logo
```

## 🚀 Preview

Open `index.html` directly, or serve locally:

```bash
python3 -m http.server 8080
# visit http://localhost:8080
```

### Live preview (GitHub Pages)
A workflow in `.github/workflows/deploy.yml` publishes the site to GitHub Pages on every push.
Once enabled (repo **Settings → Pages → Source: GitHub Actions**), the live URL will be:

```
https://<your-username>.github.io/<repo-name>/
```

## ✏️ Editing content

Go to `/admin.html`, edit any section, and click **Save**. Changes are stored in the browser and reflected on the site instantly. Use **Export JSON** to back up, or update `js/data.js` to change the published defaults for everyone.
