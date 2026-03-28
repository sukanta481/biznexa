# Design System Specification: Editorial Cyber-Glass

## 1. Overview & Creative North Star: "The Digital Architect"
This design system moves away from the "neon-strip" aesthetic of early cyberpunk and toward a sophisticated, high-end digital architecture. Our North Star is **"The Digital Architect"**—a persona that values structural depth, mathematical precision, and atmospheric lighting over flat, garish decoration. 

We break the "template" look by rejecting rigid, outlined grids. Instead, we use intentional asymmetry, overlapping frosted surfaces, and high-contrast typography scales. The layout should feel like a living blueprint: breathable, authoritative, and premium. By utilizing `Space Grotesk` for technical precision and `Manrope` for human readability, we create a balance between "tech" and "luxury."

---

## 2. Colors: Cyber Cyan & Electric Indigo
Our palette transitions from "loud neon" to "emitted light." We use light as a functional material, not just a decoration.

### The Palette (Material Design Tokens)
*   **Background / Surface Dim:** `#060e20` (The deep-space foundation)
*   **Primary (Cyber Cyan):** `#8ff5ff`
*   **Secondary (Electric Indigo):** `#9093ff`
*   **Tertiary:** `#9bffce`
*   **Surface Containers:** Range from `Lowest (#000000)` to `Highest (#192540)`

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. High-end UI is defined by tonal shifts. 
*   **The Execution:** Use a `surface-container-low` section sitting directly on a `surface` background. The boundary is perceived by the eye through the subtle shift in value, creating a cleaner, more editorial look.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass.
*   **Nesting:** Place a `surface-container-high` card inside a `surface-container` section. This creates a natural "lift" that mimics physical depth without the clutter of lines.

### Signature Textures & The Glass Rule
To achieve "professional glow," use Glassmorphism for floating elements (modals, dropdowns, navigation rails).
*   **Glass Specs:** Use semi-transparent surface colors (e.g., `surface_variant` at 60% opacity) with a `backdrop-blur` of 12px–20px. 
*   **The Linear Glow:** Apply subtle linear gradients (e.g., `primary` to `primary_container`) only on main CTAs or hero indicators to provide a "soul" that flat hex codes cannot achieve.

---

## 3. Typography: Precision vs. Performance
We utilize two distinct typefaces to create an editorial rhythm.

*   **Display & Headline (Space Grotesk):** Our "Tech" voice. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero moments. This font represents the "Cyber" aspect of the brand—raw, geometric, and modern.
*   **Body & Title (Manrope):** Our "Human" voice. Manrope provides superior legibility at smaller scales. Use `body-md` (0.875rem) for all long-form content to ensure the interface remains professional and accessible.
*   **Labels (Space Grotesk):** All micro-copy, like `label-sm` (0.6875rem), should be in Space Grotesk, Uppercase, with +0.05em tracking to maintain the technical "instrument panel" feel.

---

## 4. Elevation & Depth: Tonal Layering
In this system, depth is a result of light and shadow, not lines.

*   **The Layering Principle:** Stack `surface-container` tiers. A `surface-container-lowest` element on a `surface-container-low` background creates a "recessed" effect, perfect for input fields or code blocks.
*   **Ambient Shadows:** For floating elements, use extra-diffused shadows.
    *   *Shadow Color:* Use a tinted version of `on_surface` at 4-8% opacity.
    *   *Blur:* 30px to 60px.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at **15% opacity**. Never use 100% opaque high-contrast borders.

---

## 5. Components: Functional Minimalism

### Buttons
*   **Primary:** A gradient fill from `primary` to `primary_dim`. Text is `on_primary_fixed` (Deep Teal). No border. Roundedness: `md` (0.375rem).
*   **Secondary:** Glass background (`surface_variant` at 40% + blur) with a `Ghost Border`.
*   **Tertiary:** Text-only in `primary`, using `Space Grotesk` uppercase.

### Input Fields
*   **Structure:** No bottom line or full outline. Use a `surface-container-highest` background fill with a `sm` (0.125rem) rounded corner.
*   **State:** On focus, use a subtle 1px glow using the `primary` color at 30% opacity.

### Cards & Lists
*   **No Dividers:** Forbid the use of divider lines. Separate list items using the spacing scale (e.g., `spacing-4` or 1rem) or by alternating subtle background shifts between `surface-container-low` and `surface-container-lowest`.

### Data Visualization (The Cyber Accent)
*   **Glow Traces:** Use `secondary` (Electric Indigo) for data lines, but apply a `drop-shadow` to the line itself using the same color to create a "light-trace" effect.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins. A wider left-hand margin creates an editorial, high-end feel.
*   **Do** overlap elements. Let a glass card partially obscure a decorative background gradient to create depth.
*   **Do** use `primary` (Cyber Cyan) sparingly for high-intent actions only.

### Don’t:
*   **Don’t** use pure white (#FFFFFF). Use `on_surface` (#dee5ff) for text to maintain the atmospheric dark-mode immersion.
*   **Don’t** use heavy shadows. If the background shift defines the container, the shadow is redundant.
*   **Don’t** use default "System" fonts. The interplay between Space Grotesk and Manrope is non-negotiable for the brand's identity.