# BLUEPRINT — Interactive 3D Portfolio

A ready-to-edit, responsive portfolio featuring a **dark blue + light blue** palette, an interactive JavaScript 3D sculpture, selectable project filters, animated project previews, About/Skills sections, and a working email-app contact flow.

## How to open it

1. Download and extract the ZIP.
2. Open the extracted folder in **Visual Studio Code**.
3. Open `index.html` in your browser, or use the VS Code **Live Server** extension: right-click `index.html` → **Open with Live Server**.
4. Scroll, move your cursor over the blue sculpture, and select a project to view its details.

You do **not** need PHP, Laravel, Node.js, a database, or any installation to preview this frontend portfolio.

## Personalize it (important)

**Edit `portfolio-data.js`** — this one file controls most of the website's text. Update:

- `name`, `initials`, `role`, `location`, and `availability`
- `heroDescription`, `aboutOne`, and `aboutTwo`
- `email` — **replace `yourname@example.com`** so the contact form works
- `socials` — add your real GitHub/LinkedIn URLs, etc.
- `projects` — change the starter project descriptions, add screenshots/links when available, or remove items you don't want. For a real screenshot, save an image in `assets/` and fill in that project's `image` field.
- `skills` — add and remove technologies as needed
- `photo` — save a photo at `assets/my-photo.jpg`, then set `photo: "assets/my-photo.jpg"`
- `resumeUrl` — optionally add a PDF or online résumé URL

Project data example:

```js
{
  title: "My Website",
  number: "05",
  category: "Web Apps",
  preview: "dashboard", // Used if image is blank
  image: "assets/my-website-screenshot.png", // Optional
  label: "PERSONAL PROJECT",
  description: "A short description of my project.",
  highlights: ["Feature one", "Feature two"],
  tags: ["HTML", "CSS", "JavaScript"],
  liveUrl: "https://my-project.example",
  githubUrl: "https://github.com/myname/my-project"
}
```

Tip: The sample projects and preview graphics are **illustrative placeholders**, not proof that the named project is deployed. Replace them with the exact details of your finished work.

## How the animation works

- The default canvas is animated with local **JavaScript 3D math** and runs with **no downloads**.
- When connected to the internet and supported by your browser, the page automatically upgrades to a real **Three.js/WebGL** scene, using a public CDN.
- If the CDN is unavailable, you still get the locally rendered animated 3D wireframe.
- Visitors requesting reduced motion are shown a stable, static 3D frame.

Only the optional Three.js upgrade and Google Fonts request internet access.

## Publishing

**GitHub Pages:** Push all folder contents to a GitHub repository, then enable GitHub Pages in repository Settings → Pages (deploy from main / root). A public URL will be generated.

**Netlify:** Drag the entire extracted folder into Netlify's manual deploy page.

**Vercel:** Import the repository; it is a static HTML/CSS/JS site with no build command.

## Files

- `index.html`: Sections and content layout
- `styles.css`: All colors, typography, animation, and responsive breakpoints
- `script.js`: Three.js and fallback animations, filters, modal, form, and scroll behavior
- `portfolio-data.js`: Your text, projects, profile, skills, social links
- `assets/favicon.svg`: Website tab icon

Built as a single-page frontend with no API keys and no backend. Contact form opens the visitor's email application rather than storing submissions.
