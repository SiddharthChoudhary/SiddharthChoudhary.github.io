# Copilot Instructions - Siddharth Choudhary Portfolio

## Project Overview
This is a static GitHub Pages portfolio website. It's **already built and compiled** — the `static/` directory contains production-ready React/build artifacts. The repository is a deployed site, not a development project with a build process.

**Key insight**: Changes should be made to the **source HTML/CSS/JS**, not the `static/` folder, as they will be overwritten during any future builds.

## Architecture

### Core Structure
- **index.html**: Single-page application (SPA) with embedded inline scripts and links to external resources
- **css/style.css**: Custom stylesheet for portfolio sections (1402 lines) — overrides vendor defaults
- **js/main.js**: Vanilla JavaScript (249 lines) with utility functions for interactive features
- **vendor/**: Bootstrap, Swiper, GLightbox, Isotope, and other dependencies pre-minified

### Technology Stack
- **Framework**: Bootstrap 5 (CSS grid, utilities)
- **Styling**: Custom CSS + Bootstrap, no preprocessor (CSS or SCSS)
- **Interactivity**: Vanilla JavaScript + third-party libraries:
  - **Swiper**: Carousel/slider functionality (testimonials, portfolio details)
  - **Isotope**: Portfolio grid filtering (filter by "All", "Websites", "Professional", "Blogs")
  - **GLightbox**: Lightbox gallery for portfolio items
  - **Waypoints**: Scroll-triggered animations (skills progress bars)
  - **PureCounter**: Animated number counters (projects, years of experience)

### Data Sections
Portfolio items are defined directly in HTML as `.portfolio-item` elements with `data-filter` attributes (e.g., `filter-blog`, `filter-web`, `filter-professional`). There is **no database or API** — all content is hardcoded.

## Critical Developer Workflows

### Making Content Updates
1. Edit `index.html` directly for text, links, or section content
2. For new portfolio items, add `.col-lg-4.col-md-6.portfolio-item` divs with proper `data-filter` classes
3. Images referenced in `img/` directory — manually add new images if needed

### Styling Updates
- Modify `css/style.css` for custom styles (do not edit vendor CSS)
- Maintain color scheme: primary accent `#ffb727` (gold), text `#444444`
- Bootstrap utilities are available in HTML (`d-flex`, `justify-content-center`, etc.)

### Adding Interactive Features
- Vanilla JS patterns in `js/main.js` provide utilities: `select()`, `on()`, `onscroll()`
- Initialize third-party libraries in `js/main.js` (Swiper, Isotope, GLightbox, etc.)
- Example: Portfolio filtering uses Isotope — modifying filters requires changes to `data-filter` values in HTML AND corresponding Isotope initialization in `js/main.js`

### Form Handling
- Contact form submits to **Formspree** (`https://formspree.io/f/mgebevoy`)
- Form validation is client-side only via `required` attributes; Formspree handles backend

### Deployment
- Deployed on **GitHub Pages** at `SiddharthChoudhary.github.io`
- Push changes to the main branch to auto-deploy
- Google Analytics tracking enabled (`G-R6PRREDX4J`)

## Project-Specific Patterns

### Scroll-Based Navigation
- Navbar links are `.scrollto` with `href` set to section IDs (`#hero`, `#about`, `#portfolio`, etc.)
- `navbarlinksActive()` highlights active link based on scroll position
- Smooth scroll behavior with dynamic header offset

### Lazy-Loaded Skills Animation
- Progress bars animate when viewport reaches `.skills-content` (80% threshold)
- Uses Waypoints to trigger `aria-valuenow` width update — **do not modify without testing scroll behavior**

### Portfolio Grid System
- 3 columns on large screens (`col-lg-4`), 2 on medium (`col-md-6`)
- Isotope listens to `#portfolio-flters li` clicks and filters by `data-filter` attribute
- Active filter UI state: `filter-active` class

## File Organization
```
index.html           # Single entry point, all HTML structure
css/style.css        # Custom styling (1400+ lines)
js/main.js           # Vanilla JS initialization (249 lines)
vendor/              # Pre-minified third-party libraries
static/              # Generated build artifacts (DO NOT EDIT)
img/                 # Images for portfolio, testimonials, favicons
```

## Integration Points & External Dependencies

| Dependency | Use Case | Version | Config |
|---|---|---|---|
| Bootstrap | Grid, spacing, utilities | 5.x | CDN via `vendor/bootstrap/css/bootstrap.min.css` |
| Swiper | Carousel sliders | Latest | Initialized in `js/main.js` for testimonials |
| Isotope | Portfolio grid filtering | Latest | Initialized on window load |
| GLightbox | Portfolio lightbox gallery | Latest | Simple config in `js/main.js` |
| Waypoints | Scroll-triggered animations | Latest | Triggers skills progress bar animation |
| PureCounter | Animated counters | Latest | Single line initialization |
| Google Analytics | Tracking | GA4 ID: `G-R6PRREDX4J` | Inline script in `<head>` |
| Formspree | Contact form backend | v3 | Form `action` attribute |

## Common Modification Checklist

- [ ] Updating resume content? Edit relevant section in `#resume`
- [ ] Adding portfolio item? Add `.portfolio-item` div with `data-filter` and matching Isotope filter
- [ ] Changing accent color? Replace all `#ffb727` instances in `css/style.css`
- [ ] Fixing responsive layout? Check Bootstrap grid classes (`col-lg-*`, `col-md-*`)
- [ ] Disabling animations? Comment out Waypoints, Swiper, or Isotope initialization in `js/main.js`
- [ ] Testing locally? Open `index.html` in browser (works offline except Formspree)
