# Kunal Shukla — Portfolio

Premium, responsive, static portfolio for **Kunal Shukla — Data Analyst | Aspiring Data Scientist**.

## Files

```text
index.html
style.css
script.js
README.md
assets/
├── profile.jpg
├── project-images/
│   ├── netflix.png
│   ├── zomato.png
│   └── anomaly.png
└── resume.pdf   # add your real PDF later
```

## Local use

No build step and no framework is required. Open `index.html` directly in a browser.

For a local server, from the project folder run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Resume

A real resume PDF was not supplied, so no fake PDF is included. The Resume button safely shows a note instead of opening a broken file. When your final resume is ready, place it at:

```text
assets/resume.pdf
```

Then change the Resume button in `index.html` from the current `<button>` to:

```html
<a class="btn btn-ghost" href="assets/resume.pdf" download>Resume <span>↓</span></a>
```

## Project links

- Netflix Content Analytics: https://github.com/shuklakunal9112006-da/Netflix-Content-Analytics
- Zomato SQL Data Analysis: https://github.com/shuklakunal9112006-da/Zomato-SQL-Data-Analysis
- Business Anomaly Detection & Alert System: no repository link is used because the project is still in development.

## Contact

- Email: shuklakunal.9112006@gmail.com
- LinkedIn: https://www.linkedin.com/in/kunal-shukla-data-analyst
- GitHub: https://github.com/shuklakunal9112006-da

## GitHub Pages

This project is prepared for the repository:

`shuklakunal9112006-da/shuklakunal9112006-da.github.io`

The repository root must contain `index.html` directly. In GitHub Pages, use **Deploy from a branch → main → /(root)**.
