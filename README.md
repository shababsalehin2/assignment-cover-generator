# 📄 Assignment Cover Page Generator

> Generate professional academic assignment cover pages in seconds. Download as PDF or Word.

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?logo=github)](https://pages.github.com)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

- 🏫 **25+ Pre-loaded Institutions** — Dhaka University, BUET, Rajshahi University, NSU, BRAC University, and more
- 🎨 **4 Cover Templates** — Classic Academic, Modern Minimal, Bordered Formal, Split Header
- 🌈 **6 Color Themes** — Classic Blue, Forest Green, Royal Crimson, Midnight, Royal Purple, Teal
- 🔤 **4 Font Styles** — Serif, Playfair, Sans, Times
- 📄 **PDF Export** — High-quality A4 PDF via html2canvas + jsPDF
- 📝 **Word Export** — Editable .docx via docx.js + FileSaver.js
- 🖨️ **Print Support** — Native browser print
- 💾 **Auto-save** — Form data saved to localStorage
- 🌙 **Dark Mode** — Full dark/light theme support
- 📱 **Responsive** — Works on mobile, tablet, and desktop
- ♿ **Accessible** — Keyboard navigation, proper ARIA labels, color contrast
- 🔍 **Searchable** — Searchable institution dropdown
- 🖼️ **Custom Logo** — Upload your own institution logo

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/assignment-cover-generator.git
cd assignment-cover-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173/assignment-cover-generator/](http://localhost:5173/assignment-cover-generator/)

---

## 📦 Build & Deploy

### Local Build

```bash
npm run build
npm run preview
```

### Deploy to GitHub Pages

1. **Fork** this repository

2. **Update** `vite.config.js` — change the `base` to your repo name:
   ```js
   base: '/your-repo-name/'
   ```

3. **Update** `package.json` — ensure deploy script is correct:
   ```json
   "deploy": "gh-pages -d dist"
   ```

4. **Enable GitHub Pages** in your repo Settings → Pages → Source: `gh-pages` branch

5. **Deploy:**
   ```bash
   npm run deploy
   ```

Your site will be live at: `https://yourusername.github.io/your-repo-name/`

---

## 🛠️ Technologies Used

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite 5** | Build tool & dev server |
| **Tailwind CSS 3** | Styling & responsive layout |
| **React Hook Form** | Form state management & validation |
| **html2canvas** | Renders preview to canvas for PDF |
| **jsPDF** | Generates A4 PDF from canvas |
| **docx** | Generates Word (.docx) documents |
| **FileSaver.js** | Triggers file downloads |
| **Lucide React** | Icon library |
| **react-hot-toast** | Toast notifications |
| **clsx** | Conditional class utilities |

---

## 📄 How PDF Generation Works

1. User fills the form — a live A4 preview is rendered as real HTML/CSS
2. On "Download PDF" click, `html2canvas` captures the `#cover-preview` DOM element at 2x resolution (high DPI)
3. The canvas is converted to a JPEG data URL
4. `jsPDF` creates an A4 PDF and embeds the image at correct dimensions
5. The PDF is downloaded via the browser

**Note:** The preview element is temporarily de-scaled to its natural 794×1123px size during capture to ensure crisp output.

---

## 📝 How Word (.docx) Generation Works

1. The `docx` library creates a structured Word document programmatically
2. Institution name, assignment title, student/teacher info are added as styled `Paragraph` and `TextRun` elements
3. The active color theme's primary color is applied to headings
4. A4 page size (12240 × 15840 twips) with proper margins is set
5. `Packer.toBlob()` converts the document to a `Blob`
6. `FileSaver.js` triggers the download

---

## 📁 Project Structure

```
src/
├── components/
│   ├── InstitutionSelector.jsx   # Searchable institution dropdown + logo
│   ├── CoverPreview.jsx          # 4 A4 cover page templates (inline styles)
│   ├── TemplateSelector.jsx      # Template, color theme, font picker
│   ├── ExportButtons.jsx         # PDF, Word, Print buttons
│   └── ThemeSwitcher.jsx         # Dark/light mode toggle
│
├── data/
│   ├── institutions.js           # 25 pre-loaded institutions
│   └── themes.js                 # Color themes, templates, fonts
│
├── hooks/
│   └── useLocalStorage.js        # localStorage + dark mode hooks
│
├── utils/
│   ├── exportPDF.js              # html2canvas + jsPDF export logic
│   └── exportDOCX.js            # docx + FileSaver export logic
│
├── styles/
│   └── index.css                 # Tailwind + custom component styles
│
├── App.jsx                       # Main layout: form + preview + controls
└── main.jsx                      # React entry point
```

---

## 🎨 Adding Custom Institutions

Edit `src/data/institutions.js` to add your institution:

```js
{
  id: 26,
  name: "Your Institution Name",
  shortName: "YIN",
  address: "Your Address, City, Country",
  type: "University",  // College | School | Medical College | etc.
  logoText: "YIN",
  logoColor: "#1a3a5c",
  logoBg: "#e8f0fa"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📜 License

MIT License — free to use, modify, and distribute.

---

## 💡 Screenshots

> Add screenshots of your deployed app here

| Form Panel | Preview Panel |
|-----------|--------------|
| _(screenshot)_ | _(screenshot)_ |

---

Made with ❤️ for students across Bangladesh and beyond.
