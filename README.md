# Lauren Gorman — Flautist website

A clean, responsive, **multi-page** website (works on laptop and mobile) for a
flautist / performer / flute teacher, in a dark *charcoal & gold* theme. Plain
HTML, CSS and JavaScript — no build step — so it hosts directly on **GitHub
Pages** and any custom domain.

## File structure

```
index.html              ← Home (full-screen image hero)
about.html              ← About / journey + flute lessons
music.html              ← Music (SoundCloud players)
events.html             ← Upcoming events
gallery.html            ← Photo gallery (click to enlarge)
contact.html            ← Contact details, form & newsletter subscribe
assets/
  css/style.css         ← all styling / colours / fonts (theme at the top)
  js/main.js            ← menu, scroll animations, gallery lightbox
  img/lauren-12.jpg     ← your photos go here
.nojekyll               ← tells GitHub Pages to serve files as-is
```

Each page is its own file. The top menu and footer are repeated in every file,
so if you change a menu link, change it in all of them. Search any page for
`TODO:` to find spots that need your real content.

---

## 1. Run it locally

No tools needed — just open `index.html` in your browser. For the forms and
SoundCloud players to behave exactly like the live site, serve it over a local
web server instead:

```bash
# from inside this folder
python3 -m http.server 8000
```

Then visit **http://localhost:8000**.

---

## 2. Replace the placeholder content

Update the items marked `TODO:` on each page:

| What | File |
|------|------|
| Your bio / journey | `about.html` |
| Lesson details | `about.html` ("Flute lessons") |
| Email, phone, city | `contact.html` |
| Social links (Instagram, Facebook, SoundCloud) | `href="#"` in `contact.html` |
| Event dates & details | `events.html` |
| Home hero tagline | `index.html` |

### Photos (Home hero + Gallery)

**Home hero image:** the big home image is set in `assets/css/style.css` — find
`.hero-bg` and change the `background-image` filename to your photo (a wide /
landscape performance shot works best). Adjust `background-position` to frame it.

**Gallery photos:**

1. Drop your image files into `assets/img/` (e.g. `gallery-2.jpg`).
2. In `gallery.html`, change a placeholder figure:
   ```html
   <figure class="gallery-item placeholder reveal"><span>Add a photo</span></figure>
   ```
   into a real one:
   ```html
   <figure class="gallery-item reveal" data-full="assets/img/gallery-2.jpg">
     <img src="assets/img/gallery-2.jpg" alt="Describe the photo" loading="lazy" />
   </figure>
   ```
   (`data-full` is the image shown when the photo is clicked / zoomed.)

### SoundCloud players (Music section)

1. On SoundCloud, open a track or playlist → **Share → Embed**.
2. Copy the `<iframe …>` code it gives you.
3. Paste it over the existing `<iframe>` inside a `.music-item` in `music.html`.

---

## 3. Make the forms work (Formspree)

The Subscribe and Contact forms post to **[Formspree](https://formspree.io)** (free tier).

1. Sign up at formspree.io and create **two forms** (one for "Contact", one for
   "Subscribe") — or one form reused for both.
2. Each form gives you an ID that looks like `xayzwabc`.
3. In `contact.html`, replace:
   - `YOUR_CONTACT_FORM_ID` → your contact form ID
   - `YOUR_SUBSCRIBE_FORM_ID` → your subscribe form ID

Submissions will then be emailed to you. (Until you do this, the forms display
but won't deliver.)

---

## 4. Deploy to GitHub Pages

Once your changes are pushed to the `main` branch of this repo:

1. On GitHub, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: **`main`**, folder: **`/ (root)`** → **Save**.
4. After a minute your site is live at:
   `https://abedkkhan.github.io/Laurne_website/`

---

## 5. Custom domain (later)

1. Buy a domain (e.g. from Namecheap, Google Domains, etc.).
2. In **Settings → Pages → Custom domain**, enter your domain and Save
   (this adds a `CNAME` file to the repo).
3. At your domain registrar, add DNS records pointing to GitHub Pages:
   - Four `A` records → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - (and/or) a `CNAME` record for `www` → `abedkkhan.github.io`
4. Tick **Enforce HTTPS** once the certificate is issued.

---

## Changing the look

Colours and fonts live at the top of `assets/css/style.css` in the `:root`
block — change `--accent`, `--bg`, etc. to retheme the whole site at once.
