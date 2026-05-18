---
name: Iberian Hearth
colors:
  surface: '#fefae0'
  surface-dim: '#dedbc2'
  surface-bright: '#fefae0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f4db'
  surface-container: '#f2efd5'
  surface-container-high: '#ede9cf'
  surface-container-highest: '#e7e3ca'
  on-surface: '#1d1c0d'
  on-surface-variant: '#544438'
  inverse-surface: '#323120'
  inverse-on-surface: '#f5f1d8'
  outline: '#877366'
  outline-variant: '#d9c2b3'
  surface-tint: '#924c00'
  primary: '#8f4a00'
  on-primary: '#ffffff'
  primary-container: '#ae611a'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb781'
  secondary: '#835418'
  on-secondary: '#ffffff'
  secondary-container: '#fdbd77'
  on-secondary-container: '#784a0d'
  tertiary: '#755717'
  on-tertiary: '#ffffff'
  tertiary-container: '#90702e'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc4'
  primary-fixed-dim: '#ffb781'
  on-primary-fixed: '#2f1400'
  on-primary-fixed-variant: '#6f3800'
  secondary-fixed: '#ffdcbb'
  secondary-fixed-dim: '#faba75'
  on-secondary-fixed: '#2b1700'
  on-secondary-fixed-variant: '#673d00'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#e9c176'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4201'
  background: '#fefae0'
  on-background: '#1d1c0d'
  surface-variant: '#e7e3ca'
  moss-dark: '#283618'
  parchment-deep: '#F2EBC7'
  terracotta-rich: '#8E4A16'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  headline-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  max-width: 1200px
---

## Brand & Style

The design system is centered on the concept of "Rustic Modernity"—a bridge between the heritage of a traditional Spanish *Mesón* and the refined expectations of contemporary dining. The target audience includes local gourmands and travelers seeking an authentic yet polished culinary experience.

The visual style is **Tactile & Minimalist**. It avoids the clutter of many traditional restaurant sites in favor of heavy whitespace, high-contrast food photography, and subtle physical metaphors like parchment textures and letterpress-inspired typography. The goal is to evoke a sense of warmth, durability, and the artisanal quality of hand-prepared food.

**Key Visual Principles:**
- **Atmospheric Depth:** Use of textured backgrounds to prevent the UI from feeling "flat" or purely digital.
- **Organic Precision:** A balance between rigid, structured layouts and the soft, natural forms of ingredients and ceramics.
- **Editorial Pace:** Content is spaced to allow high-quality photography to "breathe," treating the digital interface like a premium lifestyle magazine.

## Colors

The palette is derived from the natural materials of the Iberian landscape: sun-baked clay, aged cork, and olive groves.

- **Primary (Terracotta):** Used for navigation highlights, primary icons, and active states.
- **Secondary (Ochre):** Used for supporting elements and soft backgrounds in UI components like cards.
- **Tertiary (Gold):** Reserved exclusively for "High-Impact" CTAs (e.g., "Book a Table") and premium accents.
- **Neutral (Parchment):** The primary background color. It is warmer than pure white to reduce digital eye strain and reinforce the "aged paper" aesthetic.
- **Moss Dark:** Used for high-contrast text and footer backgrounds to ground the lighter earth tones.

Implement a very subtle "grain" texture overlay (2-3% opacity) on all `#FEFAE0` surfaces to mimic the texture of heavy-weight paper.

## Typography

Typography in this design system balances the authoritative elegance of a serif with the modern clarity of a geometric sans-serif.

- **Headlines:** Set in **Playfair Display**. Use for all titles and section headers. High-contrast strokes evoke high-end menu design.
- **Body:** Set in **Montserrat**. Its open character widths ensure legibility at all sizes, providing a clean counterpoint to the decorative headlines.
- **Labels:** Small caps with generous letter spacing should be used for categories, prices, and status indicators to add a touch of formal structure.

**Formatting Note:**
Use "Oldstyle Figures" for prices if the font supports it, or ensure prices are clearly set in Montserrat Bold for readability against textured backgrounds.

## Layout & Spacing

The layout utilizes a **Fixed Grid** system centered on the screen to maintain an editorial, "book-like" feel. 

- **Desktop:** A 12-column grid with a maximum container width of 1200px.
- **Tablet:** 8-column grid with 40px side margins.
- **Mobile:** 4-column fluid grid with 20px side margins.

Spacing follows an 8px base unit. Use generous vertical padding between sections (80px - 120px) to maintain the "polished" and relaxed atmosphere. Photography should often break the grid or bleed to the edge of the screen to create a sense of immersion.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Subtle Materiality** rather than traditional drop shadows.

- **Surface Levels:** 
    - *Base:* Parchment (`#FEFAE0`).
    - *Elevated:* Deep Parchment (`#F2EBC7`) used for cards or inset sections.
- **Shadows:** Use very soft, diffused shadows with a tint of the Primary color (e.g., `rgba(142, 74, 22, 0.08)`) to avoid a "grey/dirty" look on the warm background.
- **Depth Cues:** Use thin, 1px borders in `#DDA15E` at 30% opacity to define boundaries without adding visual weight.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding takes the "edge" off the digital UI, making it feel more approachable and organic, similar to the softened edges of hand-carved wood or aged ceramics.

- **Buttons:** 4px radius for a structured, professional look.
- **Cards:** 8px radius (`rounded-lg`) to differentiate content blocks.
- **Images:** Use a mix of sharp 0px corners for full-bleed hero images and 8px corners for smaller gallery items.

## Components

### Buttons
- **Primary:** Terracotta background with white text. No shadow, slight darkening on hover.
- **CTA (Reservation):** Gold background with Moss Dark text. This is the only element allowed to have a subtle "glow" shadow to attract attention.
- **Ghost:** 1px Terracotta border with Montserrat Bold text.

### Cards
- Cards should have a background of `parchment-deep` and a very subtle 1px border.
- In menu lists, use a "dot leader" (e.g., Item ........ $25) to connect titles and prices, reinforcing the traditional Mesón aesthetic.

### Input Fields
- Underlined style or subtle light-filled boxes using `secondary_color` at 10% opacity. 
- Use Montserrat for all user input for clarity.

### Imagery & Textures
- **Food Photography:** High contrast, warm lighting, macro shots. Focus on texture (the crunch of bread, the glisten of olive oil).
- **Overlays:** Use a subtle "Spanish Tile" pattern as a background element for footers or section dividers, rendered in a low-contrast tint of the background color.